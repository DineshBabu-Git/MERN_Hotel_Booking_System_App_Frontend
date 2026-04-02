
# 🏨 MERN Stack - Hotel Booking System - Frontend

> React-based frontend for the MERN Hotel Booking System. Provides a responsive user interface for browsing rooms, making bookings, processing payments, and managing reservations.

---

## 🔐 Demo Credentials

Use these credentials to test the application:

### Regular User
```
Email: user@demo.com
Password: demo123
```

### Admin User
```
Email: admin@demo.com
Password: admin123
```

### Test Payment Credentials (Razorpay)

#### Network    |   Card Number   |   Use a random CVV and Any future date

- Visa        |  4100 2800 0000 1007	
- Mastercard  |  5500 6700 0000 1002	
- RuPay       |  6527 6589 0000 1005
- Diners      |  3608 280009 1007	
- Amex        |  3402 560004 01007	

#### Example :
- **Card Number:** 6527 6589 0000 1005
- **Expiry:** Any future date (e.g., 12/30)
- **CVV:** Any 3 digits (e.g., 123)
- **OTP:** 123456

---

## 📋 Overview

The frontend is a React application that allows users to:
- Register and login securely
- Browse and search hotel rooms
- View room details and availability
- Create and manage bookings
- Make payments via Razorpay
- Submit and view reviews
- Apply discount codes
- View booking history (dashboard)
- Admin panel for analytics

**Frontend URL:** `http://localhost:5173`

---

## 🛠️ Tech Stack

```
Framework & Build:
- React 19.2.0
- Vite 7.3.1 (Build tool & dev server)
- React Router 7.13.0 (Page navigation)

Styling & UI:
- Tailwind CSS 4.1.18 (Styling)
- Lucide React (Icons)
- Swiper 12.1.2 (Image carousel)

API & HTTP:
- Axios 1.13.5 (API requests)

Development:
- ESLint (Code linting)
- Node 18+
```

---

## 📁 Project Structure

```
frontend/src/
├── pages/
│   ├── Home.jsx              # Landing page
│   ├── Login.jsx             # User login
│   ├── Register.jsx          # User signup
│   ├── Rooms.jsx             # Room listing & filters
│   ├── RoomDetails.jsx       # Single room view
│   ├── BookingPage.jsx       # Booking form
│   ├── Dashboard.jsx         # User booking history
│   ├── Offers.jsx            # View discount offers
│   ├── Reviews.jsx           # All reviews
│   ├── WriteReview.jsx       # Submit review
│   └── AdminDashboard.jsx    # Admin panel
├── components/
│   ├── Navbar.jsx            # Navigation header
│   ├── RoomCard.jsx          # Room card component
│   └── CheckoutForm.jsx      # Payment form
├── services/
│   ├── api.js                # API client configuration
│   └── mockRooms.js          # Fallback mock data
├── App.jsx                   # Main app component
└── main.jsx                  # Entry point
```

---

## 🚀 Installation & Setup

### Prerequisites

- Node.js 18+
- npm or yarn
- Backend running on `http://localhost:5000`

### Step 1: Install Dependencies

```bash
cd frontend
npm install
```

### Step 2: Create `.env` File

```env
# Backend API URL
VITE_API_BASE_URL=http://localhost:5000/api

# Razorpay Test Key
VITE_RAZORPAY_KEY_ID=rzp_test_your_test_key_id
```

### Step 3: Start Development Server

```bash
npm run dev
```

Access at: **http://localhost:5173**

---

## 📱 Pages Overview

| Page | Purpose | Auth Required |
|------|---------|---|
| Home | Landing page with featured rooms | ❌ |
| Login | User sign in | ❌ |
| Register | User sign up | ❌ |
| Rooms | Browse all rooms with filters | ❌ |
| Room Details | View room info & reviews | ❌ |
| Booking | Create new booking | ✅ |
| Dashboard | View your bookings | ✅ |
| Reviews | Browse all reviews | ❌ |
| Write Review | Submit review for booking | ✅ |
| Offers | View discount codes | ❌ |
| Admin | Analytics & management | ✅ Admin |

---

## 🔌 API Integration

Frontend communicates with backend API at `VITE_API_BASE_URL`:

### Authentication
```
POST   /auth/register    - Create new account
POST   /auth/login       - Login user
GET    /auth/profile     - Get user profile
PUT    /auth/profile     - Update profile
```

### Rooms & Bookings
```
GET    /rooms            - Get all rooms
GET    /rooms/:id        - Get room details
POST   /bookings         - Create booking
GET    /bookings         - Get user bookings
PUT    /bookings/:id/cancel - Cancel booking
```

### Payments
```
POST   /payments/create-order  - Create payment order
POST   /payments/verify        - Verify payment
```

### Reviews
```
GET    /reviews          - Get all reviews
POST   /reviews          - Submit review
```

### Offers
```
GET    /offers           - Get active offers
POST   /offers/validate  - Check discount code
```

---

## 🎨 Features

### User Features
- ✅ Secure authentication with JWT
- ✅ Room search and filtering
- ✅ Real-time availability checking
- ✅ Secure Razorpay payments
- ✅ Booking management
- ✅ Review system
- ✅ Discount code application
- ✅ Booking history dashboard

### Admin Features
- ✅ Revenue analytics
- ✅ Occupancy metrics
- ✅ Room management
- ✅ Booking management
- ✅ Review moderation

---

## 🛣️ Routing

```
/                  → Home page
/login             → Login page
/register          → Registration page
/rooms             → Room listing
/rooms/:id         → Room details
/booking/:id       → Booking form
/dashboard         → User dashboard
/reviews           → Reviews page
/offers            → Offers page
/write-review/:id  → Write review
/admin             → Admin dashboard
```

---

## 📊 State Management

Uses React hooks for state:
- `useState` - Component state
- `useEffect` - Side effects & API calls
- `useNavigate` - Page navigation
- `useParams` - Route parameters
- `localStorage` - Persist user token

---

## 🔒 Authentication

1. User enters credentials on login/register
2. Frontend sends to backend API
3. Backend returns JWT token
4. Token stored in localStorage
5. Token auto-included in all API requests
6. Backend verifies token on protected routes

---

## 💳 Payment

1. User enters booking details
2. Frontend requests payment order
3. Razorpay modal opens for card entry
4. User completes payment
5. Frontend verifies with backend
6. Backend confirms and updates booking
7. Confirmation email sent

---

## ⚠️ Error Handling

Error messages appear with:
- **Close (X) button** - Click to dismiss
- **Auto-clear** - Clears when navigating pages
- **Clear descriptions** - Explains what went wrong

---

## 🚀 Build & Deploy

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm run preview
```

### Deploy to Netlify
```bash
npm run build
netlify deploy --prod --dir=dist
```

### Deploy to Vercel
```bash
npm run build
vercel --prod
```

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Blank page | Check `VITE_API_BASE_URL` in `.env` |
| API errors | Verify backend is running on port 5000 |
| Payment fails | Check `VITE_RAZORPAY_KEY_ID` is set |
| Token errors | Clear localStorage and login again |
| Images not loading | Check public folder paths |
| CORS errors | Update backend `FRONTEND_URL` |

---

## 📦 Available Scripts

```bash
npm run dev       # Start dev server at :5173
npm run build     # Build for production
npm run preview   # Preview production build
npm run lint      # Run ESLint linter
```

---

## 📄 Environment Variables

| Variable | Value | Example |
|----------|-------|---------|
| `VITE_API_BASE_URL` | Backend API URL | `http://localhost:5000/api` |
| `VITE_RAZORPAY_KEY_ID` | Razorpay test key | `rzp_test_xxx` |

---

## 🎯 Best Practices

- Keep components small and reusable
- Use custom hooks for shared logic
- Handle errors properly with user feedback
- Optimize images before using
- Clear sensitive data on logout
- Use environment variables for config

---

## 🙏 Support

For issues:
- Check troubleshooting section
- Verify `.env` variables
- Check backend is running
- Review browser console for errors

---

## 📄 License

This project is open-source and free to use for educational and personal projects. For commercial use, please contact the author for licensing options.

---
