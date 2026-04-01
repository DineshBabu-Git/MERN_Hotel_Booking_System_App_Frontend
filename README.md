# 🏨 MERN Hotel Booking System

> A comprehensive full-stack hotel booking and management platform built with the MERN stack (MongoDB, Express, React, Node.js). Features real-time availability, payment processing, admin analytics, and email notifications.

------------------------------------------------------------------------------

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Project](#running-the-project)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Key Features Deep Dive](#key-features-deep-dive)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

------------------------------------------------------------------------------

## 🎯 Overview

The **MERN Hotel Booking System** is a production-ready hotel management and booking platform that enables:

- **Users** to discover, book, and review hotel rooms
- **Admins** to manage rooms, bookings, offers, and view comprehensive analytics
- **Seamless payments** via Razorpay integration
- **Automated email notifications** via Brevo email service
- **Real-time availability tracking** based on check-in/check-out dates

------------------------------------------------------------------------------

## ✨ Features

### 👥 Customer Features

| Feature | Description |
|---------|-------------|
| **User Authentication** | Secure registration & login with JWT-based sessions |
| **Room Discovery** | Advanced search, filtering, and sorting capabilities |
| **Room Details** | View detailed room information, images, amenities, and pricing |
| **Availability Check** | Real-time availability checking based on selected dates |
| **Booking Management** | Create, modify, and cancel bookings with instant confirmations |
| **Payment Processing** | Secure payments via Razorpay integration |
| **Discount & Offers** | Apply promo codes for special discounts |
| **Review System** | Submit ratings and detailed reviews after stay |
| **Email Notifications** | Automated confirmation, cancellation, and Review Approval emails |
| **User Dashboard** | View booking history and manage profile |
| **Favorites** | Save preferred rooms for quick access |
| **Responsive Design** | Optimized for mobile, tablet, and desktop |


### 🛠️ Admin Features

| Feature | Description |
|---------|-------------|
| **Room Management** | Create, edit, and delete room listings with images |
| **Booking Management** | View all bookings with status updates and guest details |
| **Offer Management** | Create and manage promotional offers with discount rules |
| **Review Moderation** | Approve/reject reviews and respond to guests |
| **Analytics Dashboard** | Comprehensive business insights and metrics |
| **Revenue Reports** | Monthly revenue tracking and trends |
| **Occupancy Metrics** | Room availability and occupancy rates |
| **Booking Trends** | Historical booking patterns and forecasts |
| **Room Performance** | Track best and worst performing rooms |
| **Review Analytics** | Monitor guest satisfaction and feedback |
| **User Demographics** | Guest data and booking patterns analysis |

------------------------------------------------------------------------------

### 🎨 UI/UX Enhancements

- **Loading Animations** - Smooth spinner animations during form submissions
- **Vertical Scrolling** - Optimized scroll for filter sections on Rooms page
- **Error Handling** - User-friendly error messages and validation
- **Toast Notifications** - Success/error alerts for user actions
- **Sticky Navigation** - Always accessible header and filters
- **Dark/Light Themes** - Responsive design principles

------------------------------------------------------------------------------

## 🛠️ Tech Stack

### Frontend
```
Core Framework:
- React 19.2.0
- React Router 7.13.0 (Navigation)
- Vite 7.3.1 (Build tool)

Styling & UI:
- Tailwind CSS 4.1.18 (Utility CSS)
- Lucide React (Icon library)
- Swiper 12.1.2 (Carousel/Slider)

API & State:
- Axios 1.13.5 (HTTP Client)

Development:
- ESLint (Linting)
- Node 18+
```

### Backend
```
Server & Framework:
- Node.js 18+
- Express.js 5.2.1

Database:
- MongoDB 9.1.3 (NoSQL)
- Mongoose 9.1.3 (ODM)

Authentication & Security:
- JWT (JSON Web Tokens)
- bcryptjs 3.0.3 (Password hashing)
- CORS 2.8.5 (Cross-origin support)

Payment & Email:
- Razorpay 2.8.2 (Payment gateway)
- Axios 1.8.0 (HTTP requests for Brevo)

Utilities:
- dotenv 17.2.3 (Environment variables)
- Nodemon 3.1.11 (Development auto-reload)
```

------------------------------------------------------------------------------

## 📁 Project Structure

```
MERN_Hotel_Booking_System_App/
│
├── backend/
│   ├── config/
│   │   └── mongodb.js              # MongoDB connection setup
│   │
│   ├── controllers/
│   │   ├── authController.js       # User authentication logic
│   │   ├── roomController.js       # Room management
│   │   ├── bookingController.js    # Booking operations
│   │   ├── paymentController.js    # Payment processing (Razorpay)
│   │   ├── reviewController.js     # Review management
│   │   ├── offerController.js      # Offer/discount logic
│   │   └── adminController.js      # Admin analytics and stats
│   │
│   ├── models/
│   │   ├── User.js                 # User schema
│   │   ├── Room.js                 # Room schema
│   │   ├── Booking.js              # Booking schema
│   │   ├── Review.js               # Review schema
│   │   ├── Offer.js                # Offer schema
│   │   └── Payment.js              # Payment schema
│   │
│   ├── routes/
│   │   ├── authRoutes.js           # Authentication endpoints
│   │   ├── roomRoutes.js           # Room endpoints
│   │   ├── bookingRoutes.js        # Booking endpoints
│   │   ├── paymentRoutes.js        # Payment endpoints
│   │   ├── reviewRoutes.js         # Review endpoints
│   │   ├── offerRoutes.js          # Offer endpoints
│   │   └── adminRoutes.js          # Admin endpoints
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js       # JWT verification
│   │   ├── errorHandler.js         # Global error handling
│   │   └── validate.js             # Request validation
│   │
│   ├── utils/
│   │   ├── sendEmail.js            # Email service (Brevo)
│   │   ├── seed.js                 # Database seeding
│   │   ├── mockRooms.js            # Sample room data
│   │   └── logger.js               # Logging utility
│   │
│   ├── server.js                   # Express app entry point
│   ├── package.json
│   └── .env                        # Environment variables
│
└── frontend/
    ├── src/
    │   ├── pages/
    │   │   ├── Home.jsx            # Landing page
    │   │   ├── Login.jsx           # User login
    │   │   ├── Register.jsx        # User registration
    │   │   ├── Rooms.jsx           # Room browse & filter
    │   │   ├── RoomDetails.jsx     # Individual room view
    │   │   ├── BookingPage.jsx     # Booking creation
    │   │   ├── Dashboard.jsx       # User dashboard
    │   │   ├── Offers.jsx          # Offers page
    │   │   ├── Reviews.jsx         # Reviews listing
    │   │   ├── WriteReview.jsx     # Review submission
    │   │   └── AdminDashboard.jsx  # Admin panel
    │   │
    │   ├── components/
    │   │   ├── Navbar.jsx          # Navigation header
    │   │   ├── RoomCard.jsx        # Room listing card
    │   │   └── CheckoutForm.jsx    # Payment form (Razorpay)
    │   │
    │   ├── services/
    │   │   └── api.js              # Axios API client
    │   │
    │   ├── assets/                 # Images, fonts, etc.
    │   ├── App.jsx                 # Main app component
    │   └── main.jsx                # React entry point
    │
    ├── public/                     # Static files
    ├── package.json
    └── .env                        # Frontend environment variables
```

------------------------------------------------------------------------------

## 📋 Prerequisites

Ensure you have the following installed:

| Software | Version | Purpose |
|----------|---------|---------|
| **Node.js** | 18.0.0+ | JavaScript runtime |
| **npm** or **yarn** | Latest | Package manager |
| **MongoDB** | 4.0+ | Database (local or Atlas) |
| **Git** | Latest | Version control |

### External Services Required:

1. **MongoDB Atlas** - Cloud database
2. **Razorpay Account** - Payment processing
3. **Brevo Account** - Email service (formerly Sendinblue)
4. **Verified Email Sender** - For email notifications

------------------------------------------------------------------------------

## 🚀 Installation

### Step 1: Clone the Repository

```bash
git clone https://github.com/DineshBabu-Git/MERN_Hotel_Booking_System_App_Frontend.git

git clone https://github.com/DineshBabu-Git/MERN_Hotel_Booking_System_App_Backend.git

cd MERN_Hotel_Booking_System_App
```

### Step 2: Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Start the development server
npm start
# Or use nodemon for auto-reload:
npm run dev
```

The backend will run on: `http://localhost:5000`

### Step 3: Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will run on: `http://localhost:5173`

### Step 4: Database Seeding (Optional)

To populate the database with sample data:

```bash
cd backend
npm run seed          # Seed all data
npm run seed:rooms    # Seed rooms only
npm run seed:reviews  # Seed reviews
npm run seed:bookings # Seed bookings
npm run seed:offers   # Seed offers
```

------------------------------------------------------------------------------

## 🔐 Environment Variables

### Backend `.env` Configuration

Create a `.env` file in the `backend/` directory:

```env
# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/hotelbook-db

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here

# Razorpay Payment Gateway
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret_key

# Email Service (Brevo)
BREVO_API_KEY=your_brevo_api_key
EMAIL_FROM=noreply@yourdomain.com

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Server Port
PORT=5000

# Node Environment
NODE_ENV=development
```

### Frontend `.env` Configuration

Create a `.env` file in the `frontend/` directory:

```env
# API Base URL
VITE_API_BASE_URL=http://localhost:5000/api

# Razorpay
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

### 🔑 Getting API Keys

#### MongoDB Atlas
1. Go to [MongoDB Cloud](https://cloud.mongodb.com)
2. Create a cluster
3. Get your connection string

#### Razorpay
1. Sign up at [Razorpay](https://razorpay.com)
2. Go to Dashboard → API Keys
3. Copy Key ID and Secret

#### Brevo
1. Register at [Brevo](https://www.brevo.com)
2. Verify a sender email address
3. Go to Account → API Keys
4. Generate and copy your API key

------------------------------------------------------------------------------

## ▶️ Running the Project

### Development Mode (Recommended)

**Terminal 1: Backend**
```bash
cd backend
npm start
```

**Terminal 2: Frontend**
```bash
cd frontend
npm run dev
```

### Production Build

**Frontend Build:**
```bash
cd frontend
npm run build
npm run preview
```

**Backend:** Ready to deploy as-is on Node.js hosting

------------------------------------------------------------------------------

## 📚 API Documentation

### Authentication Endpoints

```
POST   /api/auth/register       → Register new user
POST   /api/auth/login          → Login user
GET    /api/auth/profile        → Get user profile (Protected)
PUT    /api/auth/profile        → Update profile (Protected)
POST   /api/auth/logout         → Logout user
```

### Room Endpoints

```
GET    /api/rooms               → Get all rooms
GET    /api/rooms/:id           → Get room by ID
GET    /api/rooms/availability  → Check availability by date
POST   /api/rooms               → Create room (Admin)
PUT    /api/rooms/:id           → Update room (Admin)
DELETE /api/rooms/:id           → Delete room (Admin)
```

### Booking Endpoints

```
GET    /api/bookings            → Get all bookings (User/Admin)
POST   /api/bookings            → Create new booking
GET    /api/bookings/:id        → Get booking details
PUT    /api/bookings/:id/status → Update booking status (Admin)
PUT    /api/bookings/:id/cancel → Cancel booking
```

### Payment Endpoints

```
POST   /api/payments/create-order    → Create Razorpay order
POST   /api/payments/verify          → Verify payment
GET    /api/payments/:id/status      → Check payment status
POST   /api/payments/refund          → Process refund (Admin)
```

### Review Endpoints

```
GET    /api/reviews                  → Get all reviews
POST   /api/reviews                  → Submit review (Protected)
GET    /api/reviews/room/:roomId     → Get reviews for room
PUT    /api/reviews/:id/approve      → Approve review (Admin)
PUT    /api/reviews/:id/response     → Add admin response
```

### Offer Endpoints

```
GET    /api/offers                   → Get active offers
POST   /api/offers/validate          → Validate offer code
POST   /api/offers                   → Create offer (Admin)
PUT    /api/offers/:id               → Update offer (Admin)
DELETE /api/offers/:id               → Delete offer (Admin)
```

### Admin Analytics Endpoints

```
GET    /api/admin/dashboard          → Dashboard summary stats
GET    /api/admin/revenue/monthly    → Monthly revenue data
GET    /api/admin/occupancy          → Room occupancy rates
GET    /api/admin/trends/booking     → Booking trends
GET    /api/admin/performance/rooms  → Room performance metrics
GET    /api/admin/analytics/reviews  → Review analytics
GET    /api/admin/demographics/users → User demographics
```

------------------------------------------------------------------------------

## 🗄️ Database Schema

### User Schema
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  avatar: String,
  role: "user" | "admin",
  createdAt: Date,
  updatedAt: Date
}
```

### Room Schema
```javascript
{
  name: String,
  roomType: "single" | "double" | "suite",
  price: Number,
  bedType: "single" | "double" | "queen" | "king",
  maxGuests: Number,
  roomSize: Number,
  view: String,
  description: String,
  amenities: [String],
  images: [String] (base64 or URLs),
  totalRooms: Number,
  isActive: Boolean,
  rating: Number,
  ratingCount: Number,
  createdAt: Date
}
```

### Booking Schema
```javascript
{
  userId: ObjectId (ref: User),
  roomId: ObjectId (ref: Room),
  checkIn: Date,
  checkOut: Date,
  numberOfNights: Number,
  numberOfGuests: Number,
  bookingStatus: "pending" | "confirmed" | "cancelled" | "completed",
  paymentStatus: "pending" | "paid" | "failed" | "refunded",
  totalPrice: Number,
  originalPrice: Number,
  discountCode: String,
  discountAmount: Number,
  specialRequests: String,
  createdAt: Date
}
```

### Review Schema
```javascript
{
  userId: ObjectId (ref: User),
  roomId: ObjectId (ref: Room),
  rating: Number (1-5),
  comment: String,
  cleanlinessRating: Number,
  serviceRating: Number,
  amenitiesRating: Number,
  isApproved: Boolean,
  adminResponse: String,
  createdAt: Date
}
```

------------------------------------------------------------------------------

## 🎯 Key Features Deep Dive

### 🔐 Authentication & Authorization

- **JWT-based Authentication**: Secure token-based sessions
- **Role-based Access Control**: User vs Admin permissions
- **Password Security**: bcryptjs hashing with salt rounds
- **Protected Routes**: Middleware verification on sensitive endpoints

### 💳 Payment Integration

- **Razorpay Gateway**: Secure payment processing
- **Order Management**: Create and verify orders
- **Refund Processing**: Admin-controlled refunds
- **Payment Status Tracking**: Real-time payment monitoring

### 📧 Email Notifications

- **Brevo Email Service**: Reliable email delivery
- **Booking Confirmations**: Automatic confirmation emails
- **Cancellation Notices**: Cancellation email notifications
- **Review Approvals**: Notify users when reviews are approved
- **Promotional Emails**: Marketing campaign support

### 📊 Analytics Dashboard

- **Revenue Metrics**: Monthly revenue tracking
- **Occupancy Rates**: Real-time occupancy calculations
- **Booking Trends**: Historical booking patterns
- **Room Performance**: Best/worst performing rooms
- **Review Analytics**: Guest satisfaction insights
- **User Demographics**: Guest data analysis

### 🎨 UI/UX Improvements

- **Loading Animations**: Smooth spinner on form submissions
- **Vertical Scrolling**: Optimized filter section scrolling
- **Responsive Design**: Mobile-first approach
- **Error Messages**: User-friendly validation feedback
- **Success Notifications**: Toast alerts for actions

------------------------------------------------------------------------------

## 🌐 Deployment

### Frontend Deployment (Vercel/Netlify)

```bash
# Build the frontend
cd frontend
npm run build

# Deploy to Vercel
vercel

# Or deploy to Netlify
netlify deploy --prod --dir=dist
```

### Backend Deployment (Render/Heroku)

1. Push code to GitHub
2. Connect repository to hosting platform
3. Set environment variables in platform settings
4. Deploy automatically on push

### Environment Variables for Production

Update these for your production environment:
- `MONGO_URI` - Production MongoDB connection
- `JWT_SECRET` - Strong random secret
- `RAZORPAY_KEY_ID` - Production Razorpay keys
- `BREVO_API_KEY` - Production Brevo API key
- `FRONTEND_URL` - Production frontend URL
- `NODE_ENV=production`

------------------------------------------------------------------------------

## 🐛 Troubleshooting

### Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| **MongoDB Connection Error** | Verify MONGO_URI in .env, check network access in Atlas |
| **JWT Token Expired** | Token expires after 7 days; user needs to re-login |
| **Email Not Sending** | Check Brevo API key, verify sender email is approved |
| **Payment Fails** | Ensure Razorpay keys are correct for test/production |
| **Rooms Not Loading** | Check MongoDB connection and seed data with `npm run seed` |
| **CORS Errors** | Verify FRONTEND_URL matches axios baseURL configuration |
| **Build Errors** | Clear node_modules and reinstall: `rm -rf node_modules && npm install` |

### Debug Mode

Enable debug logging:

```bash
# Backend
DEBUG=* npm start

# Frontend
VITE_DEBUG=true npm run dev
```

------------------------------------------------------------------------------

## 📖 Additional Documentation

- [API Routes Guide](./backend/routes/)
- [Database Models](./backend/models/)
- [Component Structure](./frontend/src/components/)
- [Page Layouts](./frontend/src/pages/)

------------------------------------------------------------------------------

## 🙏 Acknowledgments

- Built with the MERN stack
- Payment processing by [Razorpay](https://razorpay.com)
- Email service by [Brevo](https://www.brevo.com)
- UI components from [Lucide React](https://lucide.dev)
- Styling by [Tailwind CSS](https://tailwindcss.com)

------------------------------------------------------------------------------

## 🚀 Future Enhancements

- [ ] Multi-language support
- [ ] Push notifications
- [ ] Advanced filters (distance, star rating)
- [ ] Room image gallery with carousel
- [ ] Social login (Google, Facebook)
- [ ] Mobile app (React Native)
- [ ] Two-factor authentication
- [ ] Guest wishlists
- [ ] Advanced search with AI
- [ ] Integration with calendar APIs

------------------------------------------------------------------------------

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

------------------------------------------------------------------------------
