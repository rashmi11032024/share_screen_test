# Deployment Guide

This guide covers deploying the Screen Share Test App to various platforms.

## 🚀 Deploy to Vercel (Recommended)

Vercel is the easiest way to deploy Next.js applications.

### Method 1: Deploy from GitHub (Recommended)

1. Push your code to a GitHub repository:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-github-repo-url>
git push -u origin main
```

2. Go to [vercel.com](https://vercel.com)
3. Sign in with your GitHub account
4. Click "Add New Project"
5. Import your repository
6. Vercel will auto-detect Next.js and configure everything
7. Click "Deploy"

Your app will be live at `https://your-project-name.vercel.app`

### Method 2: Deploy from CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

## 🔧 Deploy to Netlify

1. Build your application:
```bash
npm run build
```

2. Install Netlify CLI:
```bash
npm install -g netlify-cli
```

3. Deploy:
```bash
netlify deploy --prod
```

Or connect your GitHub repository on [netlify.com](https://netlify.com)

**Build settings:**
- Build command: `npm run build`
- Publish directory: `.next`

## 🐳 Deploy with Docker

Create a `Dockerfile`:

```dockerfile
FROM node:18-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

Build and run:
```bash
docker build -t screen-share-test .
docker run -p 3000:3000 screen-share-test
```

## 🌐 Custom Domain

### On Vercel:
1. Go to your project settings
2. Navigate to "Domains"
3. Add your custom domain
4. Configure DNS records as shown

### Important: HTTPS Required
Screen sharing API requires HTTPS in production. All deployment platforms above provide automatic HTTPS.

## 🔒 CORS and Security

The app uses browser APIs that require secure contexts:
- ✅ HTTPS in production (auto-provided by hosting platforms)
- ✅ localhost for development
- ❌ Will not work on `http://` in production

## 🧪 Testing Production Build Locally

```bash
# Build the application
npm run build

# Start production server
npm start
```

Visit `http://localhost:3000` to test.

## 📊 Environment Variables

This app doesn't require any environment variables by default. All functionality uses browser APIs.

If you add analytics or other services:

```bash
# .env.local
NEXT_PUBLIC_ANALYTICS_ID=your-id-here
```

## 🔍 Monitoring

After deployment, monitor:
- Browser console for errors
- Network tab for API calls
- Performance metrics
- User feedback

Vercel provides built-in analytics and error tracking.

## 🐛 Common Deployment Issues

### Issue: Build fails
**Solution:** Check Node.js version (requires 18+)
```bash
node --version
```

### Issue: App works locally but not in production
**Solution:** Ensure you're using HTTPS. Screen sharing requires secure context.

### Issue: TypeScript errors during build
**Solution:** Run type check locally:
```bash
npx tsc --noEmit
```

### Issue: CSS not loading
**Solution:** Ensure Tailwind is configured correctly and PostCSS is installed.

## 🎯 Performance Tips

1. **Enable compression** - Most platforms do this automatically
2. **Use CDN** - Vercel/Netlify provide global CDN
3. **Monitor bundle size** - Use Next.js built-in bundle analyzer
4. **Optimize images** - Use Next.js Image component (if you add images)

## 📱 Mobile Considerations

Remember: Most mobile browsers don't support screen sharing. Your app handles this gracefully by showing an "unsupported" message.

## 🔄 Continuous Deployment

### GitHub Actions (Vercel)

Vercel automatically deploys on:
- Push to `main` branch → Production
- Pull requests → Preview deployments

### Manual Deployment

```bash
# Build and test locally
npm run build
npm start

# If all looks good, deploy
vercel --prod
```

## 📈 Post-Deployment

After deploying:

1. ✅ Test on different browsers (Chrome, Edge, Firefox)
2. ✅ Test on different devices
3. ✅ Check console for errors
4. ✅ Verify all features work
5. ✅ Test screen/window/tab sharing
6. ✅ Monitor performance

## 🆘 Support

If deployment fails:
1. Check build logs
2. Verify all dependencies are in package.json
3. Test build locally first
4. Check platform-specific documentation

---

**Happy Deploying! 🚀**
