# Xterics Setup Guides

Complete step-by-step guides for setting up all external services.

---

## Table of Contents

1. [Cloudinary Setup (Portfolio Images)](#cloudinary-setup)
2. [Google OAuth Setup](#google-oauth-setup)
3. [Payment Gateway Setup](#payment-gateway-setup)

---

## Cloudinary Setup

Cloudinary is a free image hosting service perfect for storing your portfolio images.

### Step 1: Create Cloudinary Account

1. Go to https://cloudinary.com
2. Click **"Sign Up Free"**
3. Choose **"For developers"**
4. Fill in:
   - Email address
   - Password
   - First Name
   - Last Name
5. Click **"Create Account"**
6. Verify your email

### Step 2: Get Your Cloud Name

1. After login, go to your **Dashboard**
2. Look for **"Cloud Name"** at the top (something like: `dxyz1234`)
3. **Copy and save this** - you'll need it for uploading images

### Step 3: Upload Portfolio Images

1. In Cloudinary Dashboard, click **"Media Library"** (left sidebar)
2. Click **"Upload"** button
3. Choose your portfolio images (logos, designs, etc.)
4. Upload them one by one or in batch
5. For each image, click on it and copy the **"URL"**

**Example Cloudinary URL:**
```
https://res.cloudinary.com/your-cloud-name/image/upload/v1234567890/portfolio-image.jpg
```

### Step 4: Add Portfolio Items to Your Website

1. Go to your website: https://supreme-henrietta-suhailtechlnf-9a0caa87.koyeb.app/
2. Login with Google (use whestwhest5@gmail.com)
3. Click **"Admin"** in navigation
4. Click **"Portfolio Management"**
5. Click **"Add Portfolio Item"**
6. Fill in:
   - **Title:** e.g., "Modern Tech Logo Design"
   - **Description:** e.g., "A minimalist logo for a tech startup with blue and white colors"
   - **Category:** Choose from: Logo, Branding, Social Media, Web, Packaging
   - **Price:** e.g., 250
   - **Image URL:** Paste the Cloudinary URL you copied
   - **Featured:** Check if you want it on homepage
7. Click **"Add"**
8. Image will display on your portfolio page!

### Step 5: Manage Your Portfolio

- **Edit:** Click on any portfolio item to edit details
- **Delete:** Click delete button to remove
- **Featured:** Check "Featured" to show on homepage (max 4)

---

## Google OAuth Setup

Google OAuth allows users to login with their Google account.

### Step 1: Go to Google Cloud Console

1. Open https://console.cloud.google.com
2. Sign in with your Google account
3. At the top, click the **project dropdown**
4. Click **"NEW PROJECT"**
5. Name it: `Xterics Design`
6. Click **"CREATE"**
7. Wait 1-2 minutes for project to be created

### Step 2: Enable Google+ API

1. In Google Cloud Console, go to **"APIs & Services"** (left sidebar)
2. Click **"Enable APIs and Services"** (top)
3. Search for: `Google+ API`
4. Click on it
5. Click **"ENABLE"**

### Step 3: Create OAuth Consent Screen

1. Go to **"APIs & Services"** → **"OAuth consent screen"**
2. Choose **"External"**
3. Click **"CREATE"**
4. Fill in:
   - **App name:** Xterics Design
   - **User support email:** your email
   - **Developer contact information:** your email
5. Click **"SAVE AND CONTINUE"**
6. Skip optional scopes, click **"SAVE AND CONTINUE"**
7. Review and click **"BACK TO DASHBOARD"**

### Step 4: Create OAuth 2.0 Credentials

1. Go to **"APIs & Services"** → **"Credentials"**
2. Click **"+ CREATE CREDENTIALS"** → **"OAuth client ID"**
3. Choose **"Web application"**
4. Name it: `Xterics Koyeb`
5. Under **"Authorized redirect URIs"**, add these two URLs:

**Production (Koyeb):**
```
https://supreme-henrietta-suhailtechlnf-9a0caa87.koyeb.app/api/oauth/callback
```

**Local Testing:**
```
http://localhost:3000/api/oauth/callback
```

6. Click **"CREATE"**
7. A popup will show your credentials

### Step 5: Copy Your Client ID

1. In the popup, copy the **"Client ID"** (looks like: `123456789.apps.googleusercontent.com`)
2. This is your `VITE_APP_ID`

### Step 6: Add to Koyeb

1. Go to your Koyeb dashboard
2. Click on your service "xterics-design"
3. Click **"Settings"** or **"Environment Variables"**
4. Add/Update:
   ```
   VITE_APP_ID=your_client_id.apps.googleusercontent.com
   ```
5. Click **"Save"**
6. Redeploy your service

### Step 7: Test Login

1. Go to your website: https://supreme-henrietta-suhailtechlnf-9a0caa87.koyeb.app/
2. Click **"Login with Google"**
3. You should be able to login!
4. Admin features appear if you login with whestwhest5@gmail.com

---

## Payment Gateway Setup

### Option 1: Stripe (Credit/Debit Cards)

#### Step 1: Create Stripe Account

1. Go to https://dashboard.stripe.com
2. Click **"Sign up"**
3. Fill in your information
4. Verify email

#### Step 2: Get API Keys

1. In Stripe Dashboard, go to **"Developers"** → **"API Keys"**
2. You'll see two keys:
   - **Publishable Key** (starts with `pk_live_`)
   - **Secret Key** (starts with `sk_live_`)
3. Copy both

#### Step 3: Add to Koyeb

In Koyeb Environment Variables, add:
```
STRIPE_SECRET_KEY=sk_live_your_secret_key
STRIPE_PUBLISHABLE_KEY=pk_live_your_publishable_key
```

#### Step 4: Test Payment

Use test card: `4242 4242 4242 4242`
- Expiry: Any future date
- CVC: Any 3 digits

---

### Option 2: Flutterwave (Nigerian Payments)

Perfect for Nigeria! Supports NGN, cards, bank transfer, mobile money.

#### Step 1: Create Flutterwave Account

1. Go to https://dashboard.flutterwave.com
2. Click **"Sign up"**
3. Fill in your information
4. Verify email

#### Step 2: Get API Keys

1. In Flutterwave Dashboard, go to **"Settings"** → **"API Keys"**
2. You'll see:
   - **Secret Key**
   - **Public Key**
3. Copy both

#### Step 3: Add to Koyeb

In Koyeb Environment Variables, add:
```
FLUTTERWAVE_SECRET_KEY=your_secret_key
FLUTTERWAVE_PUBLIC_KEY=your_public_key
```

#### Step 4: Test Payment

Flutterwave provides test credentials in dashboard.

---

### Option 3: Nowpayments (Cryptocurrency)

For Polygon & Solana USDT/USDC payments.

#### Step 1: Create Nowpayments Account

1. Go to https://nowpayments.io
2. Click **"Sign up"**
3. Fill in your information
4. Verify email

#### Step 2: Get API Keys

1. In Nowpayments Dashboard, go to **"Settings"** → **"API Keys"**
2. Create new API key
3. Copy:
   - **API Key**
   - **IPN Secret**

#### Step 3: Add to Koyeb

In Koyeb Environment Variables, add:
```
NOWPAYMENTS_API_KEY=your_api_key
NOWPAYMENTS_IPN_SECRET=your_ipn_secret
```

#### Step 4: Test Payment

Use testnet addresses for testing.

---

## Summary: All Environment Variables

Add these to your Koyeb Environment Variables:

```
# Google OAuth
VITE_APP_ID=your_google_client_id.apps.googleusercontent.com

# Stripe
STRIPE_SECRET_KEY=sk_live_your_stripe_secret
STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable

# Flutterwave
FLUTTERWAVE_SECRET_KEY=your_flutterwave_secret
FLUTTERWAVE_PUBLIC_KEY=your_flutterwave_public

# Nowpayments
NOWPAYMENTS_API_KEY=your_nowpayments_api_key
NOWPAYMENTS_IPN_SECRET=your_nowpayments_ipn_secret
```

---

## Next Steps

1. ✅ Set up Cloudinary and upload your portfolio images
2. ✅ Set up Google OAuth for login
3. ✅ Choose payment gateway(s) and add API keys
4. ✅ Redeploy on Koyeb
5. ✅ Test all features

---

## Support

- **Cloudinary Help:** https://cloudinary.com/documentation
- **Google OAuth Help:** https://developers.google.com/identity/protocols/oauth2
- **Stripe Help:** https://stripe.com/docs
- **Flutterwave Help:** https://developer.flutterwave.com/docs
- **Nowpayments Help:** https://documenter.getpostman.com/view/7907941/S1a32RSP

---

**© 2025 Xterics. All rights reserved.**
