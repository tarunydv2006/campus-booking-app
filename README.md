# Smart Campus Resource Booking System

A complete MERN Stack campus booking platform for students, faculty, and admins to reserve labs, seminar halls, projectors, equipment, and classrooms.

## Tech Stack

- Frontend: React, Vite, Tailwind CSS, React Router, Axios, Framer Motion, Lucide React
- Backend: Node.js, Express.js, MongoDB Atlas, Mongoose, JWT, bcryptjs, Nodemailer
- Auth: JWT role-based authentication with email OTP verification

## Setup

### Backend

```bash
cd server
npm install
copy .env.example .env
npm run seed
npm run dev
```

Set `server/.env` with your new MongoDB Atlas URI. The backend only reads `MONGO_URI` from `.env`; there is no hardcoded database URL.

Required backend env values:

```env
MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/<database-name>?retryWrites=true&w=majority
JWT_SECRET=replace_with_a_long_random_secret
ADMIN_EMAIL=admin@campus.edu
ADMIN_PASSWORD=replace_with_secure_admin_password
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@example.com
SMTP_PASS=your_app_password
SMTP_FROM="Smart Campus Booking <your_email@example.com>"
```

### Frontend

```bash
cd client
npm install
copy .env.example .env
npm run dev
```

The frontend runs on `http://localhost:5173` and the backend runs on `http://localhost:5000`.

## Auth Flow

- Public signup creates only `student` or `faculty` accounts.
- The signup page creates a student account and sends a 6-digit OTP.
- Users must verify OTP before login.
- Login returns clear errors for user not found, invalid password, and email not verified.
- Admin cannot signup publicly.
- The seed script creates or updates one admin using `ADMIN_EMAIL` and `ADMIN_PASSWORD` from `.env`.

## Main Auth Routes

- `POST /api/auth/signup`
- `POST /api/auth/verify-otp`
- `POST /api/auth/resend-otp`
- `POST /api/auth/login`
- `GET /api/auth/me`

`POST /api/auth/register` is kept as a backward-compatible alias for signup.

## Core Features

- Resource catalog with search and category filters
- Date-time booking form
- Conflict detection for overlapping pending or approved bookings
- Booking statuses: pending, approved, rejected
- Admin resource create, edit, deactivate, delete
- Admin booking approval/rejection with approval logs
- User booking history
- Notifications and optional email reminders
- Admin analytics dashboard
- Premium responsive dark/light UI

## Verification

```bash
cd client
npm run build
```

```bash
cd server
node --check server.js
```

For full backend runtime verification, MongoDB Atlas credentials and SMTP credentials must be present in `server/.env`.
