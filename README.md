# Xterics - Graphic Design Services Website

A professional, full-stack graphic design services website built with modern web technologies. Clients can browse design services, select packages, fill in their requirements, request custom orders, and make payments.

## 🎨 Features

### For Clients
- **Service Browsing**: Browse 6+ professional design services with descriptions and pricing
- **Service Selection**: Click "Select" to choose a service and fill in order details
- **Order Form**: Provide name, email, and detailed description of design requirements
- **Custom Orders**: Request custom design work with budget specifications
- **User Dashboard**: View order history and track custom order status
- **Google OAuth Authentication**: Secure login with Google

### For Administrators
- **Admin Dashboard**: Exclusive dashboard for admin user (whestwhest5@gmail.com)
- **Order Management**: View and update status of all service orders
- **Custom Order Management**: Review custom requests and update their status
- **Real-time Updates**: Instant status updates for all orders
- **WhatsApp Integration**: Direct WhatsApp contact link (+234 704 690 7742)

## 🛠️ Tech Stack

**Frontend:**
- React 19
- Tailwind CSS 4
- shadcn/ui components
- Wouter (lightweight routing)
- tRPC (type-safe API calls)

**Backend:**
- Express 4
- tRPC 11
- Node.js
- JWT authentication

**Database:**
- MySQL with Drizzle ORM
- Migrations with Drizzle Kit

**Authentication:**
- Google OAuth 2.0
- JWT session tokens

## 📦 Services Included

1. **Logo Design** - $250
2. **Branding Package** - $750
3. **Social Media Graphics** - $150
4. **Business Card Design** - $80
5. **Website Design** - $1,500
6. **Packaging Design** - $500

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- pnpm (or npm/yarn)
- MySQL database
- Google OAuth credentials

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project "Xterics Design"
3. Enable Google+ API
4. Create OAuth 2.0 Web Application credentials
5. Add redirect URIs:
   - Development: `http://localhost:3000/api/oauth/callback`
   - Production: `https://your-vercel-domain.vercel.app/api/oauth/callback`
6. Copy Client ID and Client Secret

### Installation

1. Clone the repository
2. Run `pnpm install`
3. Set up database with `pnpm db:push`
4. Start dev server with `pnpm dev`

## 📁 Project Structure

```
xterics-design/
├── client/              # React frontend
├── server/              # Express backend
├── drizzle/             # Database schema
└── shared/              # Shared types
```

## 🎯 User Workflows

### Placing a Service Order
1. Browse services on homepage
2. Click "Select" on desired service
3. Fill in name, email, and design description
4. Review price and submit order

### Requesting Custom Design
1. Click "Request Custom Design"
2. Fill in project description and budget
3. Submit request
4. Admin reviews and provides quote

### Admin Managing Orders
1. Login with email: `whestwhest5@gmail.com`
2. Click "Admin" link in navigation
3. View and update all orders
4. Manage custom order requests

## 🔐 Security

- Google OAuth 2.0 for authentication
- JWT session tokens
- Protected admin procedures
- Email-based access control

## 📞 Contact & Support

**WhatsApp:** +234 704 690 7742  
**Admin Email:** whestwhest5@gmail.com

## 🚀 Deployment to Vercel

1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel settings:
   - GOOGLE_CLIENT_ID
   - GOOGLE_CLIENT_SECRET
   - GOOGLE_REDIRECT_URI
   - JWT_SECRET
   - DATABASE_URL
4. Deploy

---

**Built with ❤️ for Xterics Design Services**

---

## 🚀 Deployment Guide

For complete deployment instructions to Koyeb, see [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

### Quick Deployment Steps

1. **Prepare Code**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Set Up Database**
   - Use TiDB Cloud, Planetscale, or MySQL
   - Get connection string

3. **Get API Keys**
   - Google OAuth: https://console.cloud.google.com
   - Stripe: https://dashboard.stripe.com
   - Flutterwave: https://dashboard.flutterwave.com
   - Nowpayments: https://nowpayments.io

4. **Deploy to Koyeb**
   - Create Koyeb account
   - Connect GitHub repository
   - Add environment variables
   - Deploy

5. **Verify Deployment**
   - Test homepage
   - Test Google login
   - Test order creation
   - Test payment gateways

---

## 📋 Environment Variables

All required environment variables are listed in `.env.example`

**Critical Variables:**
- `DATABASE_URL` - MySQL connection string
- `VITE_APP_ID` - Google OAuth Client ID
- `JWT_SECRET` - Random secret key
- `STRIPE_SECRET_KEY` - Stripe API key
- `FLUTTERWAVE_SECRET_KEY` - Flutterwave API key
- `NOWPAYMENTS_API_KEY` - Nowpayments API key

---

## 💳 Payment Gateways

### Stripe
- Credit/Debit cards
- Test card: `4242 4242 4242 4242`

### Flutterwave
- Nigerian Naira (NGN)
- Cards, Bank Transfer, Mobile Money
- Perfect for Nigerian customers

### Nowpayments
- Polygon USDT & USDC
- Solana USDT & USDC
- Cryptocurrency payments

---

## 👨‍💼 Admin Access

Email: **whestwhest5@gmail.com**

Admin features:
- View all orders
- Update order status
- Manage portfolio
- View custom orders

---

## 📱 Contact

- **WhatsApp:** +234 704 690 7742
- **Email:** whestwhest5@gmail.com
- **GitHub:** https://github.com/ekenegodwins22-eng/xterics-design

---

## 📄 License

MIT License - See LICENSE file for details

---

**© 2025 Xterics. All rights reserved.**
