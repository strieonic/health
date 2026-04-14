# 🚀 Deployment Guide: HealthIdApp (Arogyam)

This guide provides step-by-step instructions on how to take your project from development to production. We will use the most reliable, easy-to-use, and free-tier-friendly platforms.

---

## 🏗️ 1. Infrastructure Overview
- **Database**: MongoDB Atlas (Cloud)
- **Backend (API)**: Render or Railway
- **Frontend (UI)**: Vercel or Netlify
- **Storage**: Cloudinary (Image/PDF storage)
- **Email**: Resend (OTP Delivery)

---

## 📡 2. Database: MongoDB Atlas
If you aren't already using Atlas, follow these steps:
1. Create a free account at [mongodb.com](https://www.mongodb.com/cloud/atlas).
2. Create a new Cluster and a Database User.
3. In **Network Access**, add `0.0.0.0/0` (Allow access from anywhere) so Render can connect.
4. Get your **Connection String** (e.g., `mongodb+srv://...`).

---

## ⚙️ 3. Backend: Render
Render is excellent for Node.js apps.
1. Connect your **GitHub repository** to Render.
2. Select **New > Web Service**.
3. **Environment**: `Node`
4. **Root Directory**: `server`
5. **Build Command**: `npm install`
6. **Start Command**: `node index.js`
7. **Environment Variables**:
   - `PORT`: `8000`
   - `MONGO_URI`: (Your Atlas string)
   - `JWT_SECRET`: (A random long string)
   - `CLOUDINARY_CLOUD_NAME`: (From your dashboard)
   - `CLOUDINARY_API_KEY`: (From your dashboard)
   - `CLOUDINARY_API_SECRET`: (From your dashboard)
   - `EMAIL_API_KEY`: (Your Resend key)
   - `FRONTEND_URL`: (The URL of your Vercel app - see next step)

---

## 🖥️ 4. Frontend: Vercel
Vercel is the best platform for React/Vite apps.
1. In Vercel, click **New Project** and select your GitHub repo.
2. **Root Directory**: `frontend`
3. **Framework Preset**: `Vite`
4. **Environment Variables**:
   - `VITE_API_URL`: (E.g., `https://your-backend.onrender.com/api`)
5. Click **Deploy**.

---

## 🛡️ 5. Final Connection: CORS
Once you have your Vercel URL (e.g., `https://health-id-app.vercel.app`):
1. Go back to your **Render** dashboard.
2. Update the `FRONTEND_URL` environment variable with your Vercel URL.
3. Render will automatically redeploy the backend.

---

## 🔍 6. Post-Deployment Checklist
- [ ] Test **Patient Registration** to ensure OTPs are sent via Resend.
- [ ] Test **Record Upload** to ensure Cloudinary is storing files.
- [ ] Log into the **Admin Dashboard** and verify you can view hospital licenses.

> [!TIP]
> **HTTPS**: Both Render and Vercel provide automatic SSL (HTTPS), so your medical data transfers will be encrypted by default.

> [!IMPORTANT]
> **Data Privacy**: Ensure your `JWT_SECRET` and `MONGO_URI` are never committed to GitHub. Always use the platform's Environment Variable settings.
