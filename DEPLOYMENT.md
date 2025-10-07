# Deployment Guide for Netlify

This guide will help you deploy your Angular frontend to Netlify and connect it to your Render backend.

## Backend Configuration

Your backend is already deployed on Render at:
- **URL**: `https://validation-engine-backend.onrender.com/api`

## Frontend Deployment to Netlify

### Prerequisites
1. A Netlify account (sign up at https://app.netlify.com)
2. Your code pushed to a Git repository (GitHub, GitLab, or Bitbucket)

### Option 1: Deploy via Git (Recommended)

1. **Push your code to GitHub/GitLab/Bitbucket** (if not already done):
   ```bash
   git add .
   git commit -m "Configure for Netlify deployment"
   git push origin main
   ```

2. **Connect to Netlify**:
   - Go to https://app.netlify.com
   - Click "Add new site" → "Import an existing project"
   - Choose your Git provider and authorize Netlify
   - Select your repository: `validation-engine-frontend`

3. **Configure Build Settings**:
   - **Build command**: `npm run build -- --configuration production`
   - **Publish directory**: `dist/validation-engine-frontend/browser`
   - Click "Deploy site"

4. **Wait for deployment** (usually takes 2-3 minutes)

5. **Your site is live!** Netlify will provide you with a URL like:
   - `https://random-name-123456.netlify.app`

### Option 2: Deploy via Netlify CLI

1. **Install Netlify CLI**:
   ```bash
   npm install -g netlify-cli
   ```

2. **Build your project**:
   ```bash
   npm run build -- --configuration production
   ```

3. **Login to Netlify**:
   ```bash
   netlify login
   ```

4. **Deploy**:
   ```bash
   netlify deploy --prod
   ```

5. **Follow the prompts**:
   - Choose "Create & configure a new site"
   - Select your team
   - Site name: (optional, or press Enter for random name)
   - Publish directory: `dist/validation-engine-frontend/browser`

### Option 3: Manual Drag & Drop

1. **Build your project**:
   ```bash
   npm run build -- --configuration production
   ```

2. **Go to Netlify**:
   - Visit https://app.netlify.com/drop
   - Drag and drop the `dist/validation-engine-frontend/browser` folder

## Configuration Files Created

The following files have been created/modified for deployment:

### 1. Environment Files
- **`src/environments/environment.ts`**: Development environment (localhost)
- **`src/environments/environment.prod.ts`**: Production environment (Render backend)

### 2. Netlify Configuration
- **`netlify.toml`**: Build and deployment settings
- **`public/_redirects`**: Routing configuration for single-page app

### 3. Updated Files
- **`angular.json`**: Added file replacement for production builds
- **`src/app/services/validation-rule.ts`**: Updated to use environment-based API URL

## Environment Configuration

### Development (Local)
- API URL: `http://localhost:8000/api/validation_rules`

### Production (Netlify)
- API URL: `https://validation-engine-backend.onrender.com/api/validation_rules`

## CORS Configuration (Backend)

Make sure your Render backend allows requests from your Netlify domain. Update your backend CORS settings to include:
- Your Netlify domain (e.g., `https://your-app.netlify.app`)
- Or use `*` for all origins (less secure, only for testing)

Example in your backend (Python/FastAPI):
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://your-app.netlify.app"],  # or ["*"] for all
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Custom Domain (Optional)

1. Go to your Netlify site settings
2. Click "Domain settings"
3. Click "Add custom domain"
4. Follow the instructions to configure your DNS

## Continuous Deployment

Once connected to Git, Netlify will automatically:
- Deploy every push to your main branch
- Create preview deployments for pull requests
- Roll back to previous deployments if needed

## Troubleshooting

### Issue: 404 errors on page refresh
- **Solution**: The `_redirects` file and `netlify.toml` are configured to handle this. Make sure they are deployed correctly.

### Issue: CORS errors
- **Solution**: Update your backend CORS settings to allow your Netlify domain.

### Issue: API connection fails
- **Solution**: 
  1. Check that your Render backend is running
  2. Verify the API URL in `src/environments/environment.prod.ts`
  3. Check browser console for exact error messages

### Issue: Build fails on Netlify
- **Solution**:
  1. Check the build logs in Netlify dashboard
  2. Ensure all dependencies are in `package.json`
  3. Try building locally with `npm run build -- --configuration production`

## Testing

After deployment, test your app:
1. Visit your Netlify URL
2. Try creating a validation rule in the admin panel
3. Try validating a work order form
4. Check browser console for any errors

## Support

For issues:
- Netlify: https://docs.netlify.com/
- Angular: https://angular.dev/
- Your backend logs: https://dashboard.render.com/

---

**Your app is now configured and ready for deployment!** 🚀

