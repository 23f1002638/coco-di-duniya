# Deploying Coco-di-duniya

Since your code is already on GitHub, deploying is very easy! I recommend **Vercel** as it is optimized for Vite/Vue apps.

## Option 1: Vercel (Recommended) ⚡

1.  **Sign Up/Login**: Go to [vercel.com](https://vercel.com) and sign up with your **GitHub** account.
2.  **Add New Project**:
    *   Click the **"Add New..."** button > **"Project"**.
    *   Select "Continue with GitHub".
3.  **Import Repository**:
    *   You should see `coco-di-duniya` in the list. Click **"Import"**.
4.  **Configure Project**:
    *   **Framework Preset**: It should auto-detect **Vite**.
    *   **Root Directory**: `./` (Default)
    *   **Build Command**: `npm run build` (Default)
    *   **Output Directory**: `dist` (Default)
5.  **Deploy**:
    *   Click **"Deploy"**.
    *   Wait ~1 minute. Vercel will build your site and give you a live URL (e.g., `coco-di-duniya.vercel.app`).

## Option 2: Netlify 🌐

1.  Go to [netlify.com](https://netlify.com) and log in with GitHub.
2.  Click **"Add new site"** > **"Import from an existing project"**.
3.  Select **GitHub**.
4.  Pick `coco-di-duniya` from your repos.
5.  **Build Settings**:
    *   **Build command**: `npm run build`
    *   **Publish directory**: `dist`
6.  Click **"Deploy code"**.

---

### 💡 Tip for Photos
Since you added custom photos to `src/assets/memories`, they will be bundled automatically with your deployment. You don't need to do anything extra!
