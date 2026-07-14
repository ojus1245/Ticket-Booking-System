# Ticket Booking System

> A modern, full-featured **ticket booking web application**.
> Designed to demonstrate frontend architecture, real-time database integration, authentication flows, and premium UI/UX design.

---

## 🚀 Live Demo
You can explore the deployed application here:  
👉 [Ticket Booking System Live](https://ticket-booking-e1513.web.app)

---

##  Overview

This project is a **React + TypeScript** single-page application integrated with **Firebase** (Auth + Firestore) as its backend-as-a-service. It covers the complete lifecycle of a ticket booking platform � from event discovery and seat selection to payment checkout and downloadable tickets � along with a fully functional admin panel.

---

##  Features

###  Authentication
- **User Registration** � Full name, email, phone, and password with real-time Zod validation
- **Login** � Email/password login via Firebase Authentication
- **Forgot Password** � Email-based password reset flow
- **Auth Context** � Global auth state management across the app; protected routes for authenticated users and admins

---

###  Home Page
- Hero section with prominent search / call-to-action
- Featured events and trending shows in rich card layouts
- Category browsing and top destinations
- Responsive Navbar with dynamic links based on auth state
- Footer with quick links and contact info

---

###  Discover / Search
- Browse all available events and tickets
- **Filter** by price, rating, time, and availability
- **Sort** by price, duration, popularity, and newest
- Results rendered as interactive event cards with key details

---

###  Event Details
- Full event detail view: image, title, operator, departure/arrival, duration, seats available, price, ratings, and amenities
- "Book Now" CTA leading directly to seat selection

---

###  Seat Selection
- **Interactive seat map** with color-coded seat states:
  -  Available |  Booked |  Selected |  VIP | Disabled
- Live seat count and dynamic price update as seats are selected
- Seat legend and selection summary panel

---

###  Checkout
- Passenger detail form (name, age, gender, phone, email, special requests, emergency contact)
- **Payment methods**: Credit Card, Debit Card, UPI, Net Banking, Wallet
- **Order summary**: Ticket price, taxes, convenience fee, discount, and coupon code support
- Form validation on every field via `react-hook-form` + `zod`

---

###  Booking Confirmation and Ticket
- Animated booking success screen with Booking ID display
- **Printable digital ticket** featuring: Logo, Booking ID, passenger info, seat number, QR code placeholder, journey details, date/time, and price
- **Download ticket** functionality and share option

---

###  User Dashboard
- View all past and upcoming bookings in card/table layout
- Each booking shows: Booking ID, event/journey, date, status (pending / confirmed / cancelled), and payment status
- Actions: **Cancel Ticket**, **Download Ticket**, **View Details**

---

###  User Profile
- View and edit profile (name, email, phone, profile picture)
- Change password
- Saved routes and favorite events
- Notification preferences toggle
- **Dark mode toggle** persisted via ThemeContext

---

### Admin Dashboard
- Separate full-screen admin interface (no Navbar/Footer for immersive experience)
- **Analytics cards**: Total Users, Total Bookings, Revenue, Today Bookings, Pending Refunds, Active Events
- Revenue and booking charts
- **Manage Events/Routes**: Add, edit, delete, search, and filter events (title, location, time, seats, price, status, image, description)
- **Manage Users**: Table view with search, sort, edit, deactivate, and delete
- **Booking Management**: Approve, cancel, refund, view payment details, export CSV
- **Reports**: Revenue, bookings, users, popular destinations, seat occupancy (daily / weekly / monthly)
- **Settings**: Company info, taxes, payment gateway config, email/SMS settings, theme, and security

---

###  Toast Notifications
- Real-time toast notification system for booking confirmation, payment success, cancellations, and offer alerts

---

###  Dark / Light Mode
- Theme toggle available in the user profile, persisted globally

---

###  Responsive Design
- Fully responsive across **Desktop**, **Tablet**, and **Mobile**
- Hamburger navigation on mobile
- Cards stack vertically on small screens; tables become scrollable

---

##  Tech Stack

| Category | Technology |
|---|---|
| **Framework** | React 19 + TypeScript |
| **Build Tool** | Vite 8 |
| **Routing** | React Router DOM v7 |
| **Backend / DB** | Firebase (Authentication + Firestore) |
| **Forms and Validation** | React Hook Form + Zod |
| **Icons** | Lucide React |
| **Date Handling** | date-fns |
| **Styling** | Vanilla CSS (custom design system) |
| **Linting** | OxLint |

---

##  Project Structure

```
src/
+-- components/         # Reusable UI components (Navbar, Footer, Button, Input, EventCard)
+-- context/            # Global state providers
�   +-- AuthContext.tsx      � Firebase auth state
�   +-- BookingContext.tsx   � Booking state management
�   +-- ThemeContext.tsx     � Dark/light mode
�   +-- ToastContext.tsx     � Toast notifications
+-- data/               # Mock/seed data
+-- lib/
�   +-- firebase.ts     � Firebase app initialization
+-- pages/              # Route-level page components
�   +-- Home.tsx
�   +-- Discover.tsx
�   +-- EventDetails.tsx
�   +-- SeatSelection.tsx
�   +-- Checkout.tsx
�   +-- Dashboard.tsx
�   +-- TicketPage.tsx
�   +-- UserProfile.tsx
�   +-- Login.tsx
�   +-- Register.tsx
�   +-- ForgotPassword.tsx
�   +-- AdminDashboard.tsx
�   +-- NotFound.tsx
+-- styles/             # Global and shared stylesheets
```

---

##  Getting Started

### Prerequisites
- Node.js >= 18
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/ticket-booking-system.git

# Navigate into the project
cd ticket-booking-system

# Install dependencies
npm install

# Start the development server
npm run dev
```

### Firebase Setup

1. Create a Firebase project at https://console.firebase.google.com
2. Enable **Authentication** (Email/Password) and **Firestore**
3. Replace the config object in `src/lib/firebase.ts` with your own project credentials

---

##  Build for Production

```bash
npm run build
```

Output will be in the `dist/` folder, ready to deploy on Vercel, Netlify, or Firebase Hosting.


---

##  License

This project is for educational and demonstration purposes.
