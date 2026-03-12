# JunubHive — Deployment Guide

Complete instructions for deploying JunubHive to **Vercel**, **Google Play Store** (via Trusted Web Activity), and **Apple App Store** (via PWA).

---

## 1. Deploying to Vercel

### Prerequisites
- A [Vercel account](https://vercel.com)
- Your Supabase project URL and anon key

### Steps

1. **Push your code to GitHub** (already done)

2. **Import into Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Click **"Import Git Repository"** → select `Junubhive-Updated`
   - Framework: **Next.js** (auto-detected)

3. **Set Environment Variables** in Vercel project settings:
   ```
   NEXT_PUBLIC_SUPABASE_URL      = https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY = your-anon-key
   NEXT_PUBLIC_APP_URL           = https://your-vercel-domain.vercel.app
   ```

4. **Deploy** — Vercel will build and deploy automatically.

5. **Set up Supabase Auth redirect URL**
   - In Supabase → Authentication → URL Configuration
   - Add `https://your-vercel-domain.vercel.app/auth/callback` to **Redirect URLs**

6. **Custom Domain** (optional)
   - In Vercel → Project Settings → Domains → Add your domain

---

## 2. Google Play Store (via Trusted Web Activity)

The app is a PWA and can be published to the Play Store using **Bubblewrap CLI**.

### Prerequisites
```bash
npm install -g @bubblewrap/cli
# Also requires Android Studio + JDK 11+
```

### Steps

1. **Initialize Bubblewrap**
   ```bash
   bubblewrap init --manifest https://your-vercel-domain.vercel.app/manifest.json
   ```
   - Set Package Name: `com.junubhive.app`
   - Set App Name: `JunubHive`
   - Set Signing key details when prompted

2. **Build the APK/AAB**
   ```bash
   bubblewrap build
   ```
   This generates `app-release-bundle.aab`

3. **Set up Digital Asset Links** (required for TWA)
   - Bubblewrap will give you a SHA-256 fingerprint
   - Create `public/.well-known/assetlinks.json`:
   ```json
   [{
     "relation": ["delegate_permission/common.handle_all_urls"],
     "target": {
       "namespace": "android_app",
       "package_name": "com.junubhive.app",
       "sha256_cert_fingerprints": ["YOUR_SHA256_HERE"]
     }
   }]
   ```
   - Redeploy to Vercel so this file is served

4. **Upload to Play Store**
   - Go to [Google Play Console](https://play.google.com/console)
   - Create new app → Upload `.aab` file
   - Fill in store listing, screenshots, and content rating

---

## 3. Apple App Store

Apple requires an **App Store Connect** submission. There are two approaches:

### Option A: Progressive Web App (No App Store)
iOS Safari supports PWAs natively. Users can:
1. Open the app in Safari on iPhone
2. Tap **Share → Add to Home Screen**
3. The app installs with the JunubHive icon

> ⚠️ Apple does NOT allow pure PWAs in the App Store. Use Option B for a proper listing.

### Option B: Capacitor (Recommended for App Store)

[Capacitor](https://capacitorjs.com) wraps your Next.js web app in a native iOS shell.

1. **Export as static site** (create a static export)
   ```bash
   # In next.config.ts, temporarily set: output: 'export'
   npm run build
   ```

2. **Install Capacitor**
   ```bash
   npm install @capacitor/core @capacitor/ios
   npx cap init JunubHive com.junubhive.app
   npx cap add ios
   ```

3. **Sync and open in Xcode**
   ```bash
   npx cap sync
   npx cap open ios
   ```

4. **In Xcode**:
   - Set your Apple Developer Team
   - Update Bundle ID to `com.junubhive.app`
   - Add app icons (use the generated icons in `/public`)
   - Set minimum iOS version to 15.0

5. **Archive and Submit**
   - Product → Archive
   - Upload to App Store Connect
   - Fill in listing details, screenshots, and submit for review

---

## Environment Variables Reference

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Your Supabase anon/public key |
| `NEXT_PUBLIC_APP_URL` | ✅ | Your production app URL |

---

## Health Check

Once deployed, verify your app is running:
```
GET https://your-domain.com/api/health
```
Should return: `{ "status": "ok", "service": "junubhive-api", "timestamp": "..." }`
