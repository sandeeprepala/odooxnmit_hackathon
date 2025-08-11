## Rental Management System (MERN) - MVP

This is a beginner-friendly MERN stack MVP for a Rental Management System. It includes a Node/Express backend with MongoDB (Mongoose) and a React frontend (Vite). The project is structured for clarity and easy modification.

### Roles
- Varshith - Both frontend and Backend
- Sandeep - Both frontend and Backend 

### Features (MVP)
- JWT authentication (register, login, profile)
- Product CRUD with image uploads (Multer)
- Basic availability checker utilities
- Rental quotation to order workflow (quotation → confirmed → picked_up → returned → cancelled)
- Simple Razorpay integration scaffold (server-side order create & signature verify)
- Nodemailer email helper and templates scaffold
- React Context for Auth, Cart, and Notifications
- Simple pages and components wired with services

### Tech Stack
- Backend: Node.js, Express.js, MongoDB, Mongoose, JWT, Multer, Nodemailer, Razorpay
- Frontend: React (Vite), React Router, Context API, Axios

---

## Getting Started

### Prerequisites
- Node.js >= 18
- MongoDB running locally or a MongoDB Atlas connection string

### 1) Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your values
npm run dev
```

Server default: http://localhost:5000

### 2) Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

App default: http://localhost:5173

---

## Environment Variables

See `backend/.env.example` and `frontend/.env.example` for required keys.

Key backend vars:
- `MONGO_URI`
- `JWT_SECRET`
- `CLIENT_URL` (CORS)
- Email & Razorpay keys (optional for local dev)

---

## Project Structure

```
rental management/
  backend/
    src/
      config/      # db, env, email, razorpay
      models/      # Mongoose schemas
      controllers/ # Route handlers
      routes/      # Express routers
      middlewares/ # auth, errors, uploads
      utils/       # helpers (pricing, availability, tokens, etc.)
      app.js       # Express app
      server.js    # HTTP server bootstrap
  frontend/
    src/
      components/  # UI components
      pages/       # Routed pages
      context/     # React Contexts
      hooks/       # Custom hooks
      services/    # API calls
      utils/       # frontend helpers
      styles/      # CSS
      App.jsx, main.jsx
```

---

## Quick Notes
- Code favors clarity over cleverness.
- Controllers contain simple, readable flows.
- Utils encapsulate pricing and availability basics for easy extension.
- Frontend Contexts are minimal and easy to follow.


