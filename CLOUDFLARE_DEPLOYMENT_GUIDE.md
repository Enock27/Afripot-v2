# 🚀 Cloudflare Pages Deployment Guide

## Quick Start (5 Minutes)

This guide will help you deploy your AfriPort restaurant website to Cloudflare Pages.

---

## Prerequisites

You'll need:
1. ✅ GitHub account (free)
2. ✅ Cloudflare account (free)
3. ✅ Your code pushed to GitHub
4. ✅ This project repository

---

## Step 1: Push Your Code to GitHub

### If you haven't already:

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: AfriPort restaurant website"

# Add GitHub remote (replace YOUR_USERNAME and REPO_NAME)
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### If you already have it on GitHub:
Just make sure your latest changes are pushed:
```bash
git push origin main
```

---

## Step 2: Create Cloudflare Account

1. Go to [cloudflare.com](https://www.cloudflare.com)
2. Click **Sign Up** (top right)
3. Enter your email and create a password
4. Verify your email
5. You now have a free Cloudflare account!

---

## Step 3: Connect GitHub to Cloudflare Pages

### 3.1 Go to Cloudflare Dashboard
- Log in to [dash.cloudflare.com](https://dash.cloudflare.com)
- Click **Pages** in the left sidebar

### 3.2 Create New Project
- Click **Create a project**
- Click **Connect to Git**

### 3.3 Authorize GitHub
- Click **Authorize Cloudflare**
- GitHub will ask for permission
- Click **Authorize cloudflare** on GitHub
- Select your repository (or search for it)
- Click **Begin setup**

### 3.4 Configure Build Settings

Fill in these settings:

| Setting | Value |
|---------|-------|
| **Project name** | `afriport-restaurant` (or your choice) |
| **Production branch** | `main` |
| **Framework preset** | `None` (we'll set custom) |
| **Build command** | `npm run build` |
| **Build output directory** | `dist/client` |
| **Root directory** | `/` (leave blank) |

### 3.5 Environment Variables (Optional)
If you have any `.env` variables, add them here:
- Click **Add environment variable**
- Add any API keys or secrets needed

### 3.6 Deploy
- Click **Save and Deploy**
- Cloudflare will build and deploy your site
- Wait 2-3 minutes for deployment to complete

---

## Step 4: Get Your Live URL

After deployment completes:

1. You'll see a success message
2. Your site URL will be: `https://afriport-restaurant.pages.dev`
3. Click the link to view your live website!

---

## Step 5: Custom Domain (Optional)

### Add Your Own Domain

1. In Cloudflare Pages dashboard, click your project
2. Go to **Settings** → **Domains**
3. Click **Add domain**
4. Enter your domain (e.g., `afriport.com`)
5. Follow the DNS setup instructions
6. Wait for DNS to propagate (5-30 minutes)

---

## Automatic Deployments

After initial setup, every time you push to GitHub:

```bash
git add .
git commit -m "Your changes"
git push origin main
```

Cloudflare will **automatically**:
1. ✅ Detect the push
2. ✅ Build your project
3. ✅ Deploy to production
4. ✅ Update your live site

No manual steps needed!

---

## Troubleshooting

### Build Fails with "npm run build" error

**Solution:** Check the build logs in Cloudflare dashboard:
1. Go to your project
2. Click **Deployments**
3. Click the failed deployment
4. Scroll down to see error messages
5. Common fixes:
   - Missing dependencies: Run `npm install` locally and push
   - TypeScript errors: Run `npm run lint` locally to find issues
   - Wrong build output: Verify `dist/client` exists after `npm run build`

### Site shows 404 errors

**Solution:** 
1. Verify build output directory is `dist/client`
2. Check that `index.html` exists in `dist/client`
3. Redeploy: Go to Deployments → Click latest → Click **Retry deployment**

### Custom domain not working

**Solution:**
1. Wait 24 hours for DNS propagation
2. Check DNS records in Cloudflare
3. Verify domain is added correctly in Pages settings

### Site is slow

**Solution:**
1. Cloudflare Pages includes global CDN (should be fast)
2. Check browser DevTools for slow assets
3. Optimize images in `/src/assets`

---

## Monitoring & Analytics

### View Deployment Status
1. Go to your project in Cloudflare Pages
2. Click **Deployments**
3. See all past deployments and their status

### View Analytics
1. Click **Analytics**
2. See traffic, requests, and performance metrics

### View Logs
1. Click a deployment
2. Scroll to see build logs
3. Useful for debugging issues

---

## Environment Variables

### Add Secrets/API Keys

1. Go to your project **Settings**
2. Click **Environment variables**
3. Add variables for:
   - Production environment
   - Preview environment (optional)

Example:
```
VITE_API_URL = https://api.example.com
VITE_API_KEY = your-secret-key
```

Then use in your code:
```typescript
const apiUrl = import.meta.env.VITE_API_URL;
```

---

## Rollback to Previous Version

If something breaks:

1. Go to **Deployments**
2. Find the previous working deployment
3. Click **Rollback to this deployment**
4. Your site reverts instantly!

---

## Performance Tips

### Optimize for Cloudflare Pages

1. **Minimize bundle size:**
   ```bash
   npm run build
   # Check dist/client size
   ```

2. **Enable caching:**
   - Cloudflare automatically caches static assets
   - Add `Cache-Control` headers in `wrangler.jsonc`

3. **Use Cloudflare Analytics:**
   - Monitor performance
   - Identify slow pages

4. **Optimize images:**
   - Use WebP format
   - Compress before uploading
   - Use responsive images

---

## Advanced: Custom Build Configuration

If you need to modify build settings:

### Edit `wrangler.jsonc`

```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "afriport-restaurant",
  "compatibility_date": "2025-09-24",
  "compatibility_flags": ["nodejs_compat"],
  "main": "@tanstack/react-start/server-entry",
  
  // Add custom configuration here
  "env": {
    "production": {
      "name": "afriport-restaurant-prod"
    }
  }
}
```

---

## Advanced: GitHub Actions (Optional)

For more control over deployments, create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Cloudflare Pages

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Install dependencies
        run: npm install
      
      - name: Build
        run: npm run build
      
      - name: Deploy to Cloudflare Pages
        uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: afriport-restaurant
          directory: dist/client
          gitHubToken: ${{ secrets.GITHUB_TOKEN }}
```

Then add secrets to GitHub:
1. Go to repository **Settings**
2. Click **Secrets and variables** → **Actions**
3. Add `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`

---

## Frequently Asked Questions

### Q: Is Cloudflare Pages free?
**A:** Yes! Free tier includes:
- Unlimited sites
- Unlimited requests
- 500 deployments/month
- Global CDN
- SSL/HTTPS included

### Q: Can I use a custom domain?
**A:** Yes! Add it in Pages settings. You can use any domain registrar.

### Q: How do I update my site?
**A:** Just push to GitHub. Cloudflare automatically rebuilds and deploys.

### Q: What if I need a backend?
**A:** Use Cloudflare Workers (included) or add a separate backend service.

### Q: Can I rollback if something breaks?
**A:** Yes! Go to Deployments and click "Rollback to this deployment".

### Q: How long does deployment take?
**A:** Usually 1-3 minutes from push to live.

### Q: Can I preview changes before deploying?
**A:** Yes! Create a preview branch in GitHub. Cloudflare will deploy it to a preview URL.

---

## Next Steps

After deployment:

1. ✅ Test your site on mobile and desktop
2. ✅ Check all links and forms work
3. ✅ Set up custom domain (optional)
4. ✅ Add analytics (Cloudflare Analytics Engine)
5. ✅ Monitor performance
6. ✅ Set up email notifications for deployments

---

## Support & Resources

- **Cloudflare Pages Docs:** https://developers.cloudflare.com/pages/
- **Cloudflare Community:** https://community.cloudflare.com/
- **GitHub Issues:** Check your repository issues
- **TanStack Start Docs:** https://tanstack.com/start/latest

---

## Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Cloudflare account created
- [ ] GitHub connected to Cloudflare
- [ ] Build settings configured
- [ ] First deployment successful
- [ ] Site accessible at `https://afriport-restaurant.pages.dev`
- [ ] All pages loading correctly
- [ ] Forms and interactions working
- [ ] Mobile responsive
- [ ] Custom domain added (optional)
- [ ] Analytics enabled (optional)

---

## Summary

Your AfriPort restaurant website is now:
- ✅ **Live on the internet**
- ✅ **Automatically updated** when you push to GitHub
- ✅ **Globally distributed** via Cloudflare CDN
- ✅ **Secure** with free SSL/HTTPS
- ✅ **Fast** with automatic caching
- ✅ **Scalable** to handle traffic spikes

**Congratulations! Your restaurant is online! 🎉**

---

**Last Updated:** May 2026  
**Framework:** TanStack Start + Cloudflare Pages  
**Status:** Ready for Production
