# ESP32 Ecommerce Platform

A specialized ecommerce application built for selling ESP32 microcontrollers and IoT hardware. This project uses the MERN stack and features a professional UI with integrated payment processing.

## Technology Stack

- Frontend: React.js, Vite, Tailwind CSS, Lucide Icons, Axios
- Backend: Node.js, Express.js
- Database: MongoDB (Atlas)
- Payments: Razorpay Integration
- Authentication: JSON Web Tokens (JWT)
- Deployment: Vercel (Frontend), Render (Backend)

## Features

- Dynamic Product Catalog: Browse various ESP32 modules with real-time stock status.
- Shopping Cart: Add, remove, and update quantities with server-side synchronization.
- Secure Checkout: Integrated Razorpay payment gateway for cashless transactions.
- User Authentication: Secure login and registration with encrypted passwords.
- Admin Dashboard: Manage products, view statistics, and track orders.
- Responsive Design: Fully optimized for desktop, tablet, and mobile devices.
- Production Proxy: Environment-agnostic API configuration for seamless local and live testing.

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB account (local or Atlas)
- Razorpay developer account (for test keys)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd 32-ecommerce-notrazer
   ```

2. Install dependencies for the Backend:
   ```bash
   cd server
   npm install
   ```

3. Install dependencies for the Frontend:
   ```bash
   cd ../client
   npm install
   ```

### Configuration

#### Backend (.env)
Create a `.env` file in the `server` directory:
```env
MONGO_URI = your_mongodb_connection_string
JWT_SECRET = your_secret_key
RAZORPAY_KEY_ID = your_razorpay_key_id
RAZORPAY_KEY_SECRET = your_razorpay_key_secret
```

#### Frontend (.env)
Create a `.env` file in the `client` directory:
```env
VITE_RAZORPAY_KEY_ID = your_razorpay_key_id
VITE_API_URL = 
```

## Running the Application

### Local Development

1. Start the Backend server:
   ```bash
   cd server
   npm run dev
   ```

2. Start the Frontend dev server:
   ```bash
   cd client
   npm run dev
   ```

The application will be available at http://localhost:5173.

### Seeding Data

To populate the database with sample products:
```bash
cd server
node seeder.js
```

To create a default admin account (admin@example.com / adminpassword123):
```bash
cd server
node createAdmin.js
```

## Deployment

### Backend (Render)
- Connect your GitHub repository to Render.
- Create a "Web Service".
- Set the Build Command to `npm install`.
- Set the Start Command to `node server.js`.
- Add all environment variables from the server `.env` file to the Render Dashboard.

### Frontend (Vercel)
- Connect your GitHub repository to Vercel.
- The `vercel.json` file in the client directory will automatically handle API proxying and routing.
- Add `VITE_RAZORPAY_KEY_ID` to the Vercel Environment Variables.
- Deployment will be automated on every push to the main branch.

## License

This project is licensed under the MIT License.
