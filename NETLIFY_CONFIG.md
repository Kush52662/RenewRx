# Netlify Deployment Configuration

## 1. Static Site Hosting
The `mock_sites/` directory contains all the static HTML/CSS/JS files for the demo. Netlify will serve this directory directly.

- **Publish Directory**: `mock_sites`
- **Build Command**: `echo 'Deploying static mock sites'` (No build process needed for static HTML)

## 2. Functions (Optional)
If we need backend logic (e.g., for proxying API calls to Yutori or TinyFish to avoid CORS or hide keys), we can add serverless functions in `netlify/functions/`.

- **Functions Directory**: `netlify/functions`

## 3. Configuration File
The `netlify.toml` file in the root directory handles the configuration.

## 4. How to Deploy
1. **Push to Git**: Ensure your repo is connected to Netlify.
2. **Netlify Settings**:
   - Base directory: `/`
   - Build command: `echo 'Deploying static mock sites'`
   - Publish directory: `mock_sites`
3. **Environment Variables**: Add any API keys in the Netlify dashboard if using functions.

## 5. Mock Sites URLs (After Deployment)
- Portal: `https://<your-site-name>.netlify.app/portal.html`
- Pharmacy: `https://<your-site-name>.netlify.app/pharmacy.html`
- Dashboard: `https://<your-site-name>.netlify.app/portal/dashboard.html`
