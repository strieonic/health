/**
 * HealthID Watchdog — Background Server Monitor & Auto-Healer
 *
 * Features:
 *  - Starts both backend (Node/Express) and frontend (Vite) if not running
 *  - Checks server health every 30 minutes via HTTP ping
 *  - Auto-restarts any crashed/offline server
 *  - Detects and attempts fixes for common errors (port conflicts, missing node_modules, etc.)
 *  - Writes live status to watchdog-status.json (read by admin API endpoint)
 *  - Logs all events with timestamps to watchdog.log
 */

import { spawn, exec } from "child_process";
import { createWriteStream, writeFileSync, readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import http from "http";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/* ── Config ── */
const CONFIG = {
  CHECK_INTERVAL_MS: 30 * 60 * 1000,  // 30 minutes
  QUICK_CHECK_MS: 60 * 1000,          // 1 min (initial stabilization checks)
  RESTART_DELAY_MS: 4000,
  MAX_RESTART_ATTEMPTS: 5,
  STATUS_FILE: join(__dirname, "watchdog-status.json"),
  LOG_FILE: join(__dirname, "watchdog.log"),
  SERVERS: {
    backend: {
      name: "Backend (API)",
      cwd: join(__dirname, "server"),
      cmd: "node",
      args: ["index.js"],
      port: 8000,
      healthUrl: "http://localhost:8000/api/public/health",
      color: "\x1b[32m",
    },
    frontend: {
      name: "Frontend (Vite)",
      cwd: join(__dirname, "frontend"),
      cmd: "npx",
      args: ["vite", "--force"],
      port: 5173,
      healthUrl: "http://localhost:5173",
      color: "\x1b[36m",
    },
  },
};

/* ── State ── */
const state = {
  backend: {
    pid: null,
    process: null,
    status: "stopped",
    restarts: 0,
    lastError: null,
    lastCheck: null,
    uptime: null,
    startedAt: null,
    errorLog: [],
  },
  frontend: {
    pid: null,
    process: null,
    status: "stopped",
    restarts: 0,
    lastError: null,
    lastCheck: null,
    uptime: null,
    startedAt: null,
    errorLog: [],
  },
  watchdog: {
    startedAt: new Date().toISOString(),
    nextCheck: null,
    fixes: [],
    totalRestarts: 0,
  },
};

/* ── Logger ── */
const logStream = createWriteStream(CONFIG.LOG_FILE, { flags: "a" });
const log = (level, msg) => {
  const ts = new Date().toISOString();
  const line = `[${ts}] [${level.toUpperCase()}] ${msg}\n`;
  process.stdout.write(line);
  logStream.write(line);
};

/* ── Save status to JSON ── */
const saveStatus = () => {
  const status = {
    updatedAt: new Date().toISOString(),
    watchdog: {
      ...state.watchdog,
      status: "running",
    },
    servers: {
      backend: {
        pid: state.backend.pid,
        status: state.backend.status,
        restarts: state.backend.restarts,
        lastError: state.backend.lastError,
        lastCheck: state.backend.lastCheck,
        startedAt: state.backend.startedAt,
        errorLog: state.backend.errorLog.slice(-10),
      },
      frontend: {
        pid: state.frontend.pid,
        status: state.frontend.status,
        restarts: state.frontend.restarts,
        lastError: state.frontend.lastError,
        lastCheck: state.frontend.lastCheck,
        startedAt: state.frontend.startedAt,
        errorLog: state.frontend.errorLog.slice(-10),
      },
    },
  };
  try {
    writeFileSync(CONFIG.STATUS_FILE, JSON.stringify(status, null, 2));
  } catch (e) {
    log("error", `Failed to write status file: ${e.message}`);
  }
};

/* ── HTTP health check ── */
const checkHttp = (url) =>
  new Promise((resolve) => {
    const req = http.get(url, { timeout: 5000 }, (res) => {
      resolve(res.statusCode < 500);
    });
    req.on("error", () => resolve(false));
    req.on("timeout", () => { req.destroy(); resolve(false); });
  });

/* ── Kill process on port (fix port-in-use errors) ── */
const killPort = (port) =>
  new Promise((resolve) => {
    const cmd = process.platform === "win32"
      ? `for /f "tokens=5" %a in ('netstat -aon ^| findstr :${port}') do taskkill /F /PID %a`
      : `lsof -ti :${port} | xargs -r kill -9`;
    exec(cmd, () => resolve());
  });

/* ── Detect & fix common errors ── */
const detectAndFix = async (key, errorOutput) => {
  const fixes = [];

  // Port already in use
  if (/EADDRINUSE|address already in use/i.test(errorOutput)) {
    log("warn", `[${key}] Port conflict detected — freeing port...`);
    await killPort(CONFIG.SERVERS[key].port);
    fixes.push({ type: "PORT_FREED", port: CONFIG.SERVERS[key].port, at: new Date().toISOString() });
    state.watchdog.fixes.push(...fixes);
    recordFix(key, "Port conflict resolved — freed port " + CONFIG.SERVERS[key].port);
    return true;
  }

  // Missing node_modules
  if (/Cannot find module|MODULE_NOT_FOUND/i.test(errorOutput)) {
    log("warn", `[${key}] Missing module detected — running npm install...`);
    await runNpmInstall(CONFIG.SERVERS[key].cwd);
    fixes.push({ type: "NPM_INSTALL", at: new Date().toISOString() });
    state.watchdog.fixes.push(...fixes);
    recordFix(key, "Missing modules resolved — ran npm install");
    return true;
  }

  // Syntax/startup error — log only, can't auto-fix code
  if (/SyntaxError|TypeError|ReferenceError/i.test(errorOutput)) {
    log("error", `[${key}] Code error detected (manual fix needed): ${errorOutput.substring(0, 200)}`);
    recordFix(key, "Code error detected — manual fix required");
    return false;
  }

  return false;
};

const recordFix = (key, msg) => {
  state[key].errorLog.push({ at: new Date().toISOString(), msg });
  state.watchdog.fixes.push({ server: key, msg, at: new Date().toISOString() });
  saveStatus();
};

/* ── npm install ── */
const runNpmInstall = (cwd) =>
  new Promise((resolve) => {
    const proc = spawn("npm", ["install", "--legacy-peer-deps"], {
      cwd,
      shell: true,
      stdio: "inherit",
    });
    proc.on("close", resolve);
  });

/* ── Start a single server ── */
const startServer = (key) => {
  const cfg = CONFIG.SERVERS[key];
  const sv = state[key];

  if (sv.process) {
    try { sv.process.kill(); } catch (_) {}
    sv.process = null;
  }

  log("info", `${cfg.color}▶ Starting ${cfg.name}...\x1b[0m`);
  sv.status = "starting";
  saveStatus();

  let errorBuffer = "";
  const isWindows = process.platform === "win32";

  const child = spawn(
    isWindows ? "cmd" : cfg.cmd,
    isWindows
      ? ["/c", [cfg.cmd, ...cfg.args].join(" ")]
      : cfg.args,
    {
      cwd: cfg.cwd,
      env: { ...process.env, FORCE_COLOR: "true", NODE_ENV: "development" },
      shell: !isWindows,
    }
  );

  sv.process = child;
  sv.pid = child.pid;
  sv.startedAt = new Date().toISOString();

  child.stdout?.on("data", (data) => {
    const text = data.toString();
    process.stdout.write(`${cfg.color}[${cfg.name}]\x1b[0m ${text}`);
    if (/running|ready|listening|started|Local:/i.test(text)) {
      sv.status = "online";
      log("info", `✅ ${cfg.name} is online`);
      saveStatus();
    }
  });

  child.stderr?.on("data", (data) => {
    const text = data.toString();
    errorBuffer += text;
    process.stderr.write(`\x1b[31m[${cfg.name} ERR]\x1b[0m ${text}`);

    // Store recent errors
    if (text.trim()) {
      sv.lastError = text.trim().substring(0, 200);
      sv.errorLog.push({ at: new Date().toISOString(), msg: text.trim().substring(0, 200) });
      if (sv.errorLog.length > 50) sv.errorLog = sv.errorLog.slice(-50);
    }
  });

  child.on("exit", async (code, signal) => {
    if (signal === "SIGTERM") return; // intentional kill
    sv.status = "crashed";
    sv.process = null;
    sv.pid = null;
    log("warn", `⚠️  ${cfg.name} exited (code=${code}). Attempting recovery...`);
    saveStatus();

    if (sv.restarts >= CONFIG.MAX_RESTART_ATTEMPTS) {
      sv.status = "failed";
      log("error", `❌ ${cfg.name} max restart attempts reached. Manual intervention needed.`);
      saveStatus();
      return;
    }

    // Try to auto-fix based on error output
    const fixed = await detectAndFix(key, errorBuffer);
    errorBuffer = "";

    sv.restarts++;
    state.watchdog.totalRestarts++;
    log("info", `🔄 Restarting ${cfg.name} in ${CONFIG.RESTART_DELAY_MS / 1000}s... (attempt ${sv.restarts})`);
    saveStatus();
    setTimeout(() => startServer(key), CONFIG.RESTART_DELAY_MS);
  });

  child.on("error", (err) => {
    log("error", `${cfg.name} spawn error: ${err.message}`);
    sv.status = "error";
    sv.lastError = err.message;
    saveStatus();
  });

  saveStatus();
};

/* ── Health check for one server ── */
const checkServer = async (key) => {
  const cfg = CONFIG.SERVERS[key];
  const sv = state[key];
  const ts = new Date().toISOString();

  const alive = await checkHttp(cfg.healthUrl);
  sv.lastCheck = ts;

  if (alive) {
    if (sv.status !== "online") {
      sv.status = "online";
      sv.restarts = 0; // reset after stable
      log("info", `✅ ${cfg.name} health check PASSED`);
    }
  } else {
    log("warn", `⚠️  ${cfg.name} health check FAILED — restarting...`);
    sv.status = "offline";
    saveStatus();

    if (!sv.process || sv.status === "offline" || sv.status === "crashed") {
      startServer(key);
    }
  }

  saveStatus();
};

/* ── Periodic health checks ── */
const scheduleChecks = () => {
  const nextTs = new Date(Date.now() + CONFIG.CHECK_INTERVAL_MS).toISOString();
  state.watchdog.nextCheck = nextTs;
  saveStatus();

  log("info", `🕐 Next scheduled check at ${new Date(nextTs).toLocaleTimeString()}`);

  setTimeout(async () => {
    log("info", "🔍 Running scheduled health checks...");
    await checkServer("backend");
    await checkServer("frontend");
    scheduleChecks(); // reschedule
  }, CONFIG.CHECK_INTERVAL_MS);
};

/* ── Graceful shutdown ── */
const shutdown = (sig) => {
  log("info", `Watchdog received ${sig} — shutting down managed servers...`);
  for (const key of ["backend", "frontend"]) {
    if (state[key].process) {
      try { state[key].process.kill("SIGTERM"); } catch (_) {}
    }
    state[key].status = "stopped";
  }
  state.watchdog.status = "stopped";
  saveStatus();
  logStream.end(() => process.exit(0));
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

/* ── Initial startup ── */
const main = async () => {
  log("info", "🚀 HealthID Watchdog starting...");
  saveStatus();

  // Start both servers
  startServer("backend");
  await new Promise((r) => setTimeout(r, 3000)); // let backend settle first
  startServer("frontend");

  // Quick initial checks after 1 minute
  setTimeout(async () => {
    log("info", "🔍 Initial stability check...");
    await checkServer("backend");
    await checkServer("frontend");
  }, CONFIG.QUICK_CHECK_MS);

  // Schedule 30-min recurring checks
  scheduleChecks();
};

main();
