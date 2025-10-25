# Xterics Design - Complete Deployment Guide for Koyeb

This guide covers deploying the Xterics graphic design website to **Koyeb** (or any Node.js hosting platform).

## Table of Contents
1. [Tech Stack](#tech-stack)
2. [Prerequisites](#prerequisites)
3. [Database Setup](#database-setup)
4. [Environment Variables](#environment-variables)
5. [Payment Gateway Setup](#payment-gateway-setup)
6. [Deployment to Koyeb](#deployment-to-koyeb)
7. [Post-Deployment Steps](#post-deployment-steps)

---

## Tech Stack

**Backend:**
- Node.js + Express.js
- tRPC for type-safe APIs
- Drizzle ORM for database

**Frontend:**
- React 19
- Tailwind CSS
- TypeScript

**Database:**
- MySQL (TiDB compatible)
- Drizzle migrations

**Authentication:**
- Google OAuth 2.0
- JWT sessions

**Payment Gateways:**
- Stripe (Credit/Debit cards)
- Flutterwave (Nigerian Naira)
- Nowpayments (Polygon & Solana crypto)

**Storage:**
- S3 for portfolio images

---

## Prerequisites

Before deploying, you need:
- GitHub account with repository access
- Koyeb account (free tier available at https://koyeb.com)
- MySQL/TiDB database
- Payment gateway accounts:
  - Stripe (https://stripe.com)
  - Flutterwave (https://flutterwave.com)
  - Nowpayments (https://nowpayments.io)
- Google OAuth credentials (https://console.cloud.google.com)
- S3 or similar cloud storage for portfolio images

---

## Database Setup

### Option 1: TiDB Cloud (Recommended - Free Tier)
1. Go to https://tidbcloud.com
2. Create a free account
3. Create a new cluster
4. Copy the connection string
5. Format: `mysql://user:password@host:port/database?ssl=true`

### Option 2: MySQL Server
1. Set up MySQL locally or on a server
2. Create database: `CREATE DATABASE xterics_design;`
3. Connection string: `mysql://username:password@localhost:3306/xterics_design`

### Option 3: Planetscale (MySQL Compatible)
1. Go to https://planetscale.com
2. Create free account
3. Create a new database
4. Get connection string from "Connect" button

---

## Environment Variables

### All Required Variables

```
# ============ DATABASE ============
DATABASE_URL=mysql://user:password@host:port/database

# ============ AUTHENTICATION ============
VITE_APP_ID=your_google_oauth_client_id
JWT_SECRET=your_random_secret_key_here
VITE_OAUTH_PORTAL_URL=https://oauth.manus.im
OAUTH_SERVER_URL=https://api.manus.im

# ============ APP CONFIGURATION ============
VITE_APP_TITLE=Xterics - Graphic Design Services
VITE_APP_LOGO=https://your-domain.com/logo.png
VITE_APP_URL=https://your-koyeb-domain.com
NODE_ENV=production

# ============ PAYMENT GATEWAYS ============
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key
FLUTTERWAVE_SECRET_KEY=your_flutterwave_secret_key
FLUTTERWAVE_PUBLIC_KEY=your_flutterwave_public_key
NOWPAYMENTS_API_KEY=your_nowpayments_api_key
NOWPAYMENTS_IPN_SECRET=your_nowpayments_ipn_secret

# ============ STORAGE (S3) ============
S3_BUCKET=your_s3_bucket_name
S3_REGION=us-east-1
S3_ACCESS_KEY=your_s3_access_key
S3_SECRET_KEY=your_s3_secret_key

# ============ ADMIN ============
ADMIN_EMAIL=whestwhest5@gmail.com

# ============ ANALYTICS (Optional) ============
VITE_ANALYTICS_WEBSITE_ID=your_analytics_id
VITE_ANALYTICS_ENDPOINT=https://analytics.example.com
```

---

## Payment Gateway Setup

### 1. Stripe Setup

**Get API Keys:**
1. Go to https://dashboard.stripe.com
2. Sign up or login
3. Go to Settings → API Keys
4. Copy Secret Key (`sk_live_xxx`)
5. Copy Publishable Key (`pk_live_xxx`)

**Test Cards:**
- `4242 4242 4242 4242` - Success
- `4000 0000 0000 0002` - Decline

### 2. Flutterwave Setup (for Nigeria)

**Get API Keys:**
1. Go to https://dashboard.flutterwave.com
2. Sign up or login
3. Go to Settings → API Keys
4. Copy Secret Key and Public Key

**Features:**
- Supports Nigerian Naira (NGN)
- Cards, Bank Transfer, Mobile Money
- Perfect for Nigerian customers

### 3. Nowpayments Setup (for Crypto)

**Get API Keys:**
1. Go to https://nowpayments.io
2. Sign up or login
3. Go to Settings → API Keys
4. Create new API key

**Supported Cryptocurrencies:**
- Polygon USDT & USDC
- Solana USDT & USDC

---

## Google OAuth Setup

### Get Google OAuth Credentials

1. Go to https://console.cloud.google.com
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 Web Application credentials
5. Add authorized redirect URIs:
   - Development: `http://localhost:3000/api/oauth/callback`
   - Production: `https://your-koyeb-domain.com/api/oauth/callback`
6. Copy Client ID

---

## Deployment to Koyeb

### Step 1: Ensure Code is on GitHub

```bash
cd /path/to/xterics-design
git add .
git commit -m "Ready for Koyeb deployment"
git push origin main
```

Repository: https://github.com/ekenegodwins22-eng/xterics-design

### Step 2: Create Koyeb Account

1. Go to https://koyeb.com
2. Click "Sign up"
3. Choose "GitHub" authentication
4. Authorize Koyeb to access your repositories

### Step 3: Create New Service

1. Click "Create Service"
2. Select "GitHub" as source
3. Choose repository: `ekenegodwins22-eng/xterics-design`
4. Select branch: `main`
5. Configure build settings:
   - **Builder:** Buildpack
   - **Build command:** `pnpm install && pnpm build`
   - **Run command:** `pnpm start`
   - **Port:** `3000`
   - **Health check:** `/` (default)

### Step 4: Add Environment Variables

In Koyeb dashboard, go to "Environment Variables" and add:

**Database:**
```
DATABASE_URL=mysql://user:password@host:port/database
```

**Authentication:**
```
VITE_APP_ID=your_google_oauth_client_id
JWT_SECRET=generate_a_strong_random_key
VITE_OAUTH_PORTAL_URL=https://oauth.manus.im
OAUTH_SERVER_URL=https://api.manus.im
```

**Application:**
```
VITE_APP_TITLE=Xterics - Graphic Design Services
VITE_APP_LOGO=https://your-domain.com/logo.png
VITE_APP_URL=https://your-koyeb-domain.com
NODE_ENV=production
```

**Payment Gateways:**
```
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_PUBLISHABLE_KEY=pk_live_xxx
FLUTTERWAVE_SECRET_KEY=xxx
FLUTTERWAVE_PUBLIC_KEY=xxx
NOWPAYMENTS_API_KEY=xxx
NOWPAYMENTS_IPN_SECRET=xxx
```

**Storage:**
```
S3_BUCKET=your_bucket
S3_REGION=us-east-1
S3_ACCESS_KEY=xxx
S3_SECRET_KEY=xxx
```

**Admin:**
```
ADMIN_EMAIL=whestwhest5@gmail.com
```

### Step 5: Deploy

1. Click "Deploy"
2. Wait for build to complete (5-10 minutes)
3. Get your public URL from Koyeb dashboard (e.g., `https://xterics-design-xxx.koyeb.app`)

### Step 6: Update Google OAuth

1. Go back to Google Cloud Console
2. Update authorized redirect URI:
   ```
   https://your-koyeb-domain.com/api/oauth/callback
   ```

---

## Post-Deployment Steps

### 1. Run Database Migrations

Once deployed, the database schema will be automatically created on first run. To manually push migrations:

```bash
# Via Koyeb terminal or SSH
pnpm db:push
```

### 2. Verify Everything Works

Check these features:
- [ ] Homepage loads correctly
- [ ] Google login works
- [ ] Can browse services
- [ ] Can place orders (requires login)
- [ ] Payment page shows all 3 payment methods
- [ ] Admin dashboard accessible with whestwhest5@gmail.com
- [ ] Portfolio page loads

### 3. Test Payment Gateways

**Stripe Test:**
- Use card: `4242 4242 4242 4242`
- Any future expiry date
- Any 3-digit CVC

**Flutterwave Test:**
- Use test credentials from Flutterwave dashboard

**Nowpayments Test:**
- Use testnet addresses

### 4. Add Custom Domain (Optional)

1. In Koyeb dashboard, go to "Domains"
2. Add your custom domain
3. Update DNS records as instructed
4. Update `VITE_APP_URL` environment variable

### 5. Monitor Logs

In Koyeb dashboard:
- Check "Logs" for errors
- Monitor "Metrics" for performance
- Set up alerts for failures

---

## Troubleshooting

### Database Connection Error
```
Error: connect ECONNREFUSED
```
**Solution:**
- Verify `DATABASE_URL` is correct
- Check database is running and accessible
- Ensure IP whitelist allows Koyeb servers

### OAuth Error
```
Error: Invalid OAuth credentials
```
**Solution:**
- Verify `VITE_APP_ID` is correct
- Check redirect URI in Google Cloud Console matches your Koyeb domain
- Ensure Google+ API is enabled

### Payment Gateway Error
```
Error: API key not configured
```
**Solution:**
- Verify all payment gateway keys are set in environment variables
- Check keys are for live environment (not test)
- Ensure keys have not expired

### Build Fails
```
Error: pnpm: command not found
```
**Solution:**
- Koyeb should auto-detect. If not, update build command:
```
npm install -g pnpm && pnpm install && pnpm build
```

### Port Already in Use
```
Error: listen EADDRINUSE :::3000
```
**Solution:**
- Change port in environment variable
- Or kill process using port 3000

---

## Environment Variables Checklist

Before deploying, verify you have:

- [ ] `DATABASE_URL` - MySQL connection string
- [ ] `VITE_APP_ID` - Google OAuth Client ID
- [ ] `JWT_SECRET` - Random secret key (min 32 characters)
- [ ] `STRIPE_SECRET_KEY` - Stripe live secret
- [ ] `STRIPE_PUBLISHABLE_KEY` - Stripe live publishable
- [ ] `FLUTTERWAVE_SECRET_KEY` - Flutterwave secret
- [ ] `FLUTTERWAVE_PUBLIC_KEY` - Flutterwave public
- [ ] `NOWPAYMENTS_API_KEY` - Nowpayments API key
- [ ] `NOWPAYMENTS_IPN_SECRET` - Nowpayments IPN secret
- [ ] `VITE_APP_TITLE` - Application title
- [ ] `VITE_APP_LOGO` - Logo URL
- [ ] `VITE_APP_URL` - Your Koyeb domain
- [ ] `NODE_ENV` - Set to `production`
- [ ] `S3_BUCKET` - S3 bucket name
- [ ] `S3_REGION` - S3 region
- [ ] `S3_ACCESS_KEY` - S3 access key
- [ ] `S3_SECRET_KEY` - S3 secret key
- [ ] `ADMIN_EMAIL` - Admin email (whestwhest5@gmail.com)

---

## Performance Tips

1. **Database Optimization:**
   - Add indexes to frequently queried columns
   - Use connection pooling

2. **Caching:**
   - Cache portfolio images
   - Cache service list

3. **CDN:**
   - Use CDN for static assets
   - Serve logo and images from CDN

4. **Monitoring:**
   - Set up error tracking (Sentry, LogRocket)
   - Monitor database performance
   - Track payment gateway errors

---

## Next Steps After Deployment

1. **Add Portfolio Items:**
   - Login as admin (whestwhest5@gmail.com)
   - Go to Admin → Portfolio
   - Add your design work with images

2. **Customize Services:**
   - Update service descriptions
   - Adjust pricing
   - Add more services if needed

3. **Set Up Email Notifications:**
   - Configure email service for order notifications
   - Send confirmation emails to clients

4. **Monitor Orders:**
   - Check Admin Dashboard regularly
   - Update order status as work progresses
   - Communicate with clients

5. **Test Payment Flow:**
   - Place test orders
   - Complete test payments
   - Verify order status updates

---

## Support & Resources

- **Koyeb Docs:** https://docs.koyeb.com
- **Stripe Docs:** https://stripe.com/docs
- **Flutterwave Docs:** https://developer.flutterwave.com
- **Nowpayments Docs:** https://documenter.getpostman.com/view/7907941/S1a32RSP
- **GitHub Issues:** https://github.com/ekenegodwins22-eng/xterics-design/issues

---

## Deployment Checklist

Before going live:
- [ ] All environment variables set
- [ ] Database migrations completed
- [ ] Google OAuth configured
- [ ] Payment gateways tested
- [ ] Admin email verified
- [ ] Portfolio items added
- [ ] Custom domain set up (optional)
- [ ] Monitoring configured
- [ ] Backup strategy in place

Good luck with your deployment! 🚀

