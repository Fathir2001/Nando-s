# 🍗 Nando's Restaurant — Full-Stack Web Application

A fully functional restaurant web application for **Nando's**, built with React, Firebase, and Netlify serverless functions. Customers can browse the menu, add items to cart, place orders, and receive email confirmations — all in a smooth, responsive, and animated UI.

---

## 🌐 Live Demo

**[https://poetic-kitten-7661d3.netlify.app](https://poetic-kitten-7661d3.netlify.app)**

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Netlify Serverless Functions](#-netlify-serverless-functions)
- [Firebase Setup](#-firebase-setup)
- [Scripts](#-scripts)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### 🧑‍💼 Authentication

- User **registration** with full name, email, phone, and address
- **Login** and **logout** with Firebase Authentication
- **Forgot password** via email reset link
- **Protected routes** — cart and order pages require authentication

### 🍽️ Menu & Browsing

- Browse menu across multiple categories: **Dishes**, **Desserts**, **Fresh Juices**, and **Shakes**
- Smooth scroll navigation between sections
- Animated menu cards with hover effects

### 🛒 Shopping Cart

- **Add to cart** from any menu category
- Adjust **item quantities** directly in the cart
- **Remove items** individually
- Automatic **subtotal calculation** with delivery fee (LKR 150)
- Cart state persisted in **Cloud Firestore** per user

### 📦 Order Management

- Place orders directly from the cart
- Order confirmation **dialog** before placing
- **Email notification** sent to the restaurant on every new order (with customer info and itemized order details)
- Customers can view their **order history** in their profile
- Each order tracks status: **Pending → Processing → Delivered / Cancelled**

### 📧 Email-Based Order Status Updates

- Restaurant receives an email with **one-click action links**
- Admin can update order status (Processing / Delivered / Cancelled) directly from the email without logging in
- Status changes are securely validated with a **token-based system**

### 👤 User Profile

- View and **edit profile** (display name, phone, address)
- View **order history** with order details and current status
- Navigate to individual order detail pages

### 🎨 UI / UX

- Fully **responsive** design (mobile-first with Tailwind CSS)
- Smooth **page animations** powered by Framer Motion
- **Toast notifications** for actions (add to cart, order placed, errors)
- Login prompt banner for unauthenticated users
- Custom brand colors (`#F4511F` — Nando's signature orange)

---

## 🛠️ Tech Stack

| Technology              | Purpose                     | Why Used                                                                                                                     |
| ----------------------- | --------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| **React 18**            | Frontend UI library         | Component-based architecture enables modular, reusable UI; hooks (useState, useEffect, useContext) simplify state management |
| **Vite**                | Build tool & dev server     | Extremely fast HMR and build times compared to Create React App; native ES module support                                    |
| **Tailwind CSS**        | Utility-first CSS framework | Rapid UI development with utility classes; eliminates writing custom CSS; easy responsive design                             |
| **Firebase Auth**       | User authentication         | Handles secure auth flows (sign-up, login, password reset) out of the box with no backend needed                             |
| **Cloud Firestore**     | NoSQL cloud database        | Real-time, scalable database for storing users, cart items, and orders; seamless Firebase integration                        |
| **Firebase Analytics**  | Usage analytics             | Tracks page views and user interactions to understand app usage                                                              |
| **Framer Motion**       | Animation library           | Declarative animations for page transitions, card reveals, and micro-interactions with minimal code                          |
| **React Router DOM v7** | Client-side routing         | Handles multi-page navigation (SPA); supports protected routes and nested layouts                                            |
| **React Toastify**      | Toast notifications         | Lightweight, customizable notification system for user feedback on actions                                                   |
| **React Icons**         | Icon library                | Massive collection of icons (FontAwesome, Bootstrap, etc.) as React components                                               |
| **React Scroll**        | Smooth scroll               | Enables smooth scrolling to named sections without custom JS                                                                 |
| **Nodemailer**          | Email sending (server-side) | Sends order confirmation emails via Gmail SMTP from Netlify serverless functions                                             |
| **Netlify Functions**   | Serverless backend          | Runs server-side logic (email sending, order status updates) without maintaining a dedicated backend server                  |
| **Netlify**             | Deployment & hosting        | Git-based continuous deployment, CDN hosting, and built-in support for serverless functions                                  |

---

## 📁 Project Structure

```
Nando-s/
├── netlify/
│   └── functions/
│       ├── sendOrderEmail.js       # Serverless: sends order email to restaurant
│       └── updateOrderStatus.js    # Serverless: updates order status via email link
├── public/
│   └── _redirects                  # SPA fallback routing for Netlify
├── src/
│   ├── assets/img/                 # Static images
│   ├── components/
│   │   ├── About.jsx               # About section
│   │   ├── AddToCart.jsx           # Cart page (view, manage, place orders)
│   │   ├── Desserts.jsx            # Desserts menu
│   │   ├── Dishes.jsx              # Main dishes menu
│   │   ├── Footer.jsx              # Site footer
│   │   ├── ForgotPassword.jsx      # Password reset form
│   │   ├── FreshJuice.jsx          # Fresh juices menu
│   │   ├── Home.jsx                # Hero / landing section
│   │   ├── Login.jsx               # Login page
│   │   ├── Menu.jsx                # Full menu page
│   │   ├── Navbar.jsx              # Navigation bar
│   │   ├── OrderDetail.jsx         # Individual order detail
│   │   ├── OrderList.jsx           # List of all orders (admin view)
│   │   ├── PasswordReset.jsx       # Password reset confirmation
│   │   ├── PrflOrdrDetails.jsx     # Profile order details
│   │   ├── Profile.jsx             # User profile + order history
│   │   ├── ProtectedRoute.jsx      # Auth guard wrapper
│   │   ├── Register.jsx            # Registration form
│   │   ├── Review.jsx              # Customer reviews section
│   │   ├── Shakes.jsx              # Shakes menu
│   ├── contexts/
│   │   └── AuthContext.jsx         # Global auth state & Firebase methods
│   ├── firebase/
│   │   └── config.js               # Firebase initialization
│   ├── layouts/
│   │   ├── Button.jsx              # Reusable button component
│   │   ├── DishesCard.jsx          # Menu item card
│   │   └── ReviewCard.jsx          # Review card
│   ├── utils/
│   │   └── imageUtils.js           # Image URL helper
│   ├── App.jsx                     # Root component with routing
│   ├── App.css                     # Global app styles
│   ├── main.jsx                    # React entry point
│   └── index.css                   # Base styles (Tailwind imports)
├── index.html                      # HTML entry point
├── vite.config.js                  # Vite configuration
├── tailwind.config.js              # Tailwind theme customization
├── postcss.config.js               # PostCSS config for Tailwind
├── netlify.toml                    # Netlify build & function settings
└── package.json                    # Dependencies & scripts
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- A [Firebase](https://firebase.google.com/) project
- A [Netlify](https://www.netlify.com/) account (for deployment and functions)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/nandos-restaurant.git
cd nandos-restaurant
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory (see [Environment Variables](#-environment-variables) section below).

### 4. Start the Development Server

```bash
npm run dev
```

The app will be available at [http://localhost:5173](http://localhost:5173).

To also run Netlify serverless functions locally, use the [Netlify CLI](https://docs.netlify.com/cli/get-started/):

```bash
npm install -g netlify-cli
netlify dev
```

---

## 🔐 Environment Variables

Create a `.env` file at the root of the project. **Never commit this file to version control.**

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Netlify Serverless Functions (set in Netlify dashboard for production)
EMAIL_USER=your_gmail_address@gmail.com
EMAIL_PASS=your_gmail_app_password
ORDER_SECRET_KEY=your_custom_secret_key
URL=https://poetic-kitten-7661d3.netlify.app
```

> **Note:** For production, set `EMAIL_USER`, `EMAIL_PASS`, `ORDER_SECRET_KEY`, and `URL` as environment variables in the **Netlify dashboard** under Site Settings → Environment variables.

---

## ⚙️ Netlify Serverless Functions

Located in `netlify/functions/`:

### `sendOrderEmail.js`

- **Trigger:** Called from the frontend when a customer places an order
- **Action:** Sends an HTML email to the restaurant with full order details and one-click status update links

### `updateOrderStatus.js`

- **Trigger:** Restaurant clicks a status link in the order email
- **Action:** Validates the token and updates the order status in Firestore (Processing / Delivered / Cancelled)

Netlify routes are configured in `netlify.toml`:

```toml
[build]
  functions = "netlify/functions"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200
```

---

## 🔥 Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/) and create a new project
2. Enable **Authentication** → Email/Password sign-in method
3. Create a **Firestore Database** in production mode
4. Add the following **Firestore collections** (they are created automatically on first use):
   - `users` — stores user profile data
   - `cart` — stores per-user cart items
   - `orders` — stores placed orders

### Firestore Security Rules (Recommended)

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /cart/{document} {
      allow read, write: if request.auth != null && resource.data.userId == request.auth.uid;
      allow create: if request.auth != null;
    }
    match /orders/{document} {
      allow read: if request.auth != null && resource.data.userId == request.auth.uid;
      allow create: if request.auth != null;
      allow update: if false; // Only updated via serverless function
    }
  }
}
```

---

## 📜 Scripts

| Command           | Description                      |
| ----------------- | -------------------------------- |
| `npm run dev`     | Start Vite development server    |
| `npm run build`   | Build for production             |
| `npm run preview` | Preview production build locally |
| `npm run lint`    | Run ESLint on all JS/JSX files   |

---

## 📄 License

This project is for educational and portfolio purposes. All rights reserved to the project owner.

---

> Built with ❤️ for Nando's Restaurant
