# Xterics - Graphic Design Services Website

A professional, full-stack graphic design services website built with modern web technologies. Clients can browse design services, select packages, fill in their requirements, request custom orders, and make payments.

## 🎨 Features

### For Clients
- **Service Browsing**: Browse 6+ professional design services with descriptions and pricing
- **Service Selection**: Click "Select" to choose a service and fill in order details
- **Order Form**: Provide name, email, and detailed description of design requirements
- **Custom Orders**: Request custom design work with budget specifications
- **User Dashboard**: View order history and track custom order status
- **Authentication**: Secure login with OAuth integration

### For Administrators
- **Admin Dashboard**: Manage services, orders, and custom orders
- **Service Management**: Add, edit, or deactivate design services
- **Order Management**: Update order status and track progress
- **Custom Order Quotes**: Review custom requests and provide quotes

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

**Database:**
- MySQL with Drizzle ORM
- Migrations with Drizzle Kit

**Authentication:**
- Manus OAuth integration
- Session-based authentication

## 📦 Services Included

1. **Logo Design** - $250
   - Custom design, 3 revisions, source files, high resolution

2. **Branding Package** - $750
   - Logo design, brand guidelines, color palette, typography, 5 revisions

3. **Social Media Graphics** - $150
   - 20 templates, customizable, all platforms, high resolution

4. **Business Card Design** - $80
   - Front & back design, print-ready files, 2 revisions

5. **Website Design** - $1,500
   - Responsive design, 5 pages, SEO optimized, mobile friendly, 10 revisions

6. **Packaging Design** - $500
   - 3D mockup, print-ready files, 4 revisions

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- pnpm (or npm/yarn)
- MySQL database

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/xterics-design.git
   cd xterics-design
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up the database**
   ```bash
   pnpm db:push
   ```

4. **Start the development server**
   ```bash
   pnpm dev
   ```

   The website will be available at `http://localhost:3000`

## 📁 Project Structure

```
xterics-design/
├── client/                 # React frontend
│   ├── src/
│   │   ├── pages/         # Page components
│   │   ├── components/    # Reusable UI components
│   │   ├── lib/           # Utilities (tRPC client)
│   │   └── App.tsx        # Main app with routing
│   └── public/            # Static assets
├── server/                # Express backend
│   ├── routers.ts         # tRPC procedures
│   ├── db.ts              # Database queries
│   └── _core/             # Framework internals
├── drizzle/               # Database schema & migrations
│   └── schema.ts          # Table definitions
├── shared/                # Shared types & constants
└── storage/               # S3 file storage helpers
```

## 🔌 API Routes

All API calls use tRPC at `/api/trpc`

### Services
- `services.list` - Get all active services
- `services.getById` - Get service details

### Orders
- `orders.create` - Create a new order for a service
- `orders.list` - Get user's orders (protected)

### Custom Orders
- `customOrders.create` - Submit a custom order request
- `customOrders.list` - Get user's custom orders (protected)

### Authentication
- `auth.me` - Get current user info
- `auth.logout` - Logout current user

## 🎯 User Workflows

### Placing a Service Order
1. Browse services on homepage
2. Click "Select" on desired service
3. Fill in name, email, and design description
4. Review price and submit order
5. Proceed to payment (integration ready)

### Requesting Custom Design
1. Click "Request Custom Design" button
2. Fill in project description and optional budget
3. Submit request
4. Admin reviews and sends quote
5. Accept quote and proceed to payment

### Tracking Orders
1. Login to your account
2. Go to Dashboard
3. View service orders and custom orders
4. Track order status

## 💳 Payment Integration

The website is ready for payment integration. To add payment processing:

1. **Stripe Integration** (recommended):
   ```bash
   pnpm add stripe @stripe/stripe-js
   ```

2. Update the checkout flow in `client/src/pages/ServiceDetail.tsx`

3. Add payment endpoint in `server/routers.ts`

## 🔐 Security

- OAuth authentication for user accounts
- Protected procedures for sensitive operations
- Session-based authentication with secure cookies
- Input validation on all forms

## 📝 Database Schema

### Users Table
- id, openId, name, email, role, timestamps

### Services Table
- id, name, description, price, category, image, features, isActive, timestamps

### Orders Table
- id, userId, serviceId, clientName, clientEmail, description, price, status, paymentId, timestamps

### CustomOrders Table
- id, userId, clientName, clientEmail, description, budget, status, quotedPrice, paymentId, timestamps

## 🚀 Deployment

The website is ready to deploy to any Node.js hosting platform:

- **Vercel** (recommended for Next.js-like deployment)
- **Railway**
- **Render**
- **Heroku**
- **AWS/GCP/Azure**

## 📧 Contact & Support

For questions or support, contact: support@xterics.com

## 📄 License

This project is proprietary to Xterics Design Services.

---

**Built with ❤️ for Xterics Design Services**
