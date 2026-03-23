
# Hotel Booking System Project – MERN Stack Application

A full-stack **MERN** hotel booking platform that allows users to browse rooms, check availability, make reservations, apply offers, complete payments, and leave reviews. The project also includes an **Admin Dashboard** for managing rooms, bookings, offers, reviews, and analytics.

------------------------------------------------------------------------------------------------------------------

## Features

### Customer Features

- User registration and login with **JWT authentication**
- Browse available rooms with search, filter, and sorting options
- View room details, images, amenities, pricing, and availability
- Book rooms with check-in/check-out selection
- Apply discount codes / special offers
- Make payments using **Razorpay**
- Receive booking confirmation and cancellation emails
- Manage profile and view personal bookings
- Submit room reviews and ratings
- Save favorite rooms

------------------------------------------------------------------------------------------------------------------

### Admin Features

- Admin-only dashboard access
- Create, update, and delete rooms
- Manage bookings and booking status
- Create and manage offers
- Approve reviews and respond to customers
**- View business analytics such as:**
  - Total bookings
  - Revenue reports
  - Occupancy rate
  - Booking trends
  - Room performance
  - Review analytics
  - User demographics

------------------------------------------------------------------------------------------------------------------

## Tech Stack

**Frontend**
- React
- React Router
- Axios
- Vite
- Tailwind CSS
- Swiper
- Lucide React
--------------------
**Backend**
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- Nodemailer
- Razorpay
- CORS
- dotenv

------------------------------------------------------------------------------------------------------------------

## Project Structure

```bash
MERN_Hotel_Booking_System/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── server.js
│   └── package.json
└── frontend/
    ├── src/
    │   ├── api/
    │   ├── components/
    │   ├── pages/
    │   ├── services/
    │   └── App.jsx
    ├── public/
    └── package.json
```
------------------------------------------------------------------------------------------------------------------

## Prerequisites

**Make sure you have the following installed:**

- **Node.js** (v18 or later recommended)
- **npm** or **yarn**
- **MongoDB** (local or cloud instance)
- **Razorpay** account for payment integration
- An email service account for booking notifications

------------------------------------------------------------------------------------------------------------------

## Installation

### 1) Clone the repository
```bash
git clone <your-repo-url>
cd MERN_Hotel_Booking_System
```

### 2) Install backend dependencies
```bash
cd backend
npm install
```

### 3) Install frontend dependencies
```bash
cd ../frontend
npm install
```
------------------------------------------------------------------------------------------------------------------

## Environment Variables

### Backend `.env`
Create a `.env` file inside the `backend/` folder:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
RAZORPAY_WEBHOOK_SECRET=your_razorpay_webhook_secret
EMAIL_SERVICE=your_email_service
EMAIL_USER=your_email_address
EMAIL_PASS=your_email_password
FRONTEND_URL=http://localhost:5173
PORT=5000
```

### Frontend `.env`
Create a `.env` file inside the `frontend/` folder:

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```
------------------------------------------------------------------------------------------------------------------

## Running the Project

### Start the backend server
```bash
cd backend
npm start
```

The backend runs on:
```bash
http://localhost:5000
```

### Start the frontend application
```bash
cd frontend
npm run dev
```

The frontend runs on:
```bash
http://localhost:5173
```
------------------------------------------------------------------------------------------------------------------

## Available Scripts

### Backend
- `npm start` — Start the backend server
- `npm run seed` — Seed room data
- `npm run seed:rooms` — Seed rooms
- `npm run seed:reviews` — Seed reviews
- `npm run seed:bookings` — Seed bookings
- `npm run seed:offers` — Seed offers
- `npm run seed:all` — Run all seed scripts

### Frontend
- `npm run dev` — Start the development server
- `npm run build` — Build the production bundle
- `npm run preview` — Preview the production build
- `npm run lint` — Run ESLint

------------------------------------------------------------------------------------------------------------------

## API Overview

### Authentication
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/profile`
- `PUT /api/auth/profile`

### Rooms
- `GET /api/rooms`
- `GET /api/rooms/:id`
- `GET /api/rooms/availability`
- `POST /api/rooms`
- `PUT /api/rooms/:id`
- `DELETE /api/rooms/:id`

### Bookings
- `GET /api/bookings`
- `POST /api/bookings`
- `GET /api/bookings/:id`
- `PUT /api/bookings/:id/confirm`
- `PUT /api/bookings/:id/cancel`

### Reviews
- `GET /api/reviews`
- `POST /api/reviews`
- `GET /api/reviews/room/:roomId`
- `PUT /api/reviews/:id/approve`

### Offers
- `GET /api/offers/active`
- `POST /api/offers/validate`
- `POST /api/offers`
- `PUT /api/offers/:id`
- `DELETE /api/offers/:id`

### Payments
- `POST /api/payments/create-order`
- `POST /api/payments/verify`
- `GET /api/payments/:paymentId/status`
- `POST /api/payments/refund`

### Admin Analytics
- `GET /api/admin/dashboard`
- `GET /api/admin/revenue/monthly`
- `GET /api/admin/occupancy`
- `GET /api/admin/trends/booking`
- `GET /api/admin/performance/rooms`
- `GET /api/admin/analytics/reviews`
- `GET /api/admin/demographics/users`

------------------------------------------------------------------------------------------------------------------

## Authentication & Access Control

- Public users can browse rooms and offers
- Logged-in users can book rooms, view their dashboard, and write reviews
- Admin users can access the admin panel and manage platform data

------------------------------------------------------------------------------------------------------------------

## Key Notes

- The frontend uses a token stored in `localStorage` for protected routes.
- The backend exposes a health endpoint at `GET /api/health`.
- Email notifications are used for booking confirmation and cancellation.
- Payment processing is integrated with Razorpay.
- Sample data can be loaded using the provided seed scripts.

------------------------------------------------------------------------------------------------------------------

## Deployment

**Before deploying, update the following:**
- `MONGO_URI`
- `JWT_SECRET`
- Razorpay credentials
- Email service credentials
- `FRONTEND_URL`
- Frontend API base URL

**For production:**
- Build the frontend with `npm run build`
- Serve the frontend build using your preferred hosting platform
- Deploy the backend to a Node.js hosting service
- Configure environment variables securely on the hosting platform

------------------------------------------------------------------------------------------------------------------

## License

This project is open-source and free to use for educational and personal projects. 

------------------------------------------------------------------------------------------------------------------

## Acknowledgements

Built as a MERN stack Hotel Booking System with support for reservations, payments, reviews, offers, and admin analytics.

------------------------------------------------------------------------------------------------------------------
