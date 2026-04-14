import express from 'express';
import { getPublicStats } from '../controllers/publicController.js';

const router = express.Router();

router.get('/stats', getPublicStats);

// Watchdog health ping — always returns 200 if server is alive
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', ts: Date.now() });
});

export default router;
