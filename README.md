# StockFlow IMS — Inventory Management System

A complete, production-style MERN stack inventory management application. StockFlow IMS helps you manage products, track stock levels, record transactions, and generate reports — all with a polished, modern SaaS interface.

## Features

- **Authentication** — JWT-based login/register with access & refresh tokens, bcrypt password hashing, admin/staff roles, and protected routes
- **Product Management** — Full CRUD with search, category/supplier/stock-status filters, sorting, pagination, and stock status indicators (In Stock / Low Stock / Out of Stock)
- **Category Management** — Full CRUD with product count tracking and deletion protection for categories with linked products
- **Supplier Management** — Full CRUD with contact details and product count tracking
- **Stock Transactions** — Stock In / Stock Out with automatic quantity updates, transaction history with filtering by type, product, and date range
- **Dashboard** — Summary cards (Total Products, Stock Value, Low Stock, Out of Stock), stock-by-category bar chart, stock-movement area chart, recent transactions, and low-stock alerts
- **Reports** — Inventory and transaction reports with CSV export
- **Role-Based Access** — Admin has full management access; Staff has operational access (view + transactions)

## Tech Stack

### Frontend
- React.js (Vite)
- React Router
- Axios (with token refresh interceptor)
- Tailwind CSS
- React Context API (auth/session)
- Recharts (dashboard charts)
- react-hot-toast (notifications)

### Backend
- Node.js + Express.js
- Mongoose (MongoDB ODM)
- JWT authentication (access + refresh tokens)
- bcryptjs (password hashing)
- express-validator (request validation)
- CORS + dotenv

### Database
- MongoDB (Atlas or local)

## Project Structure

```
project/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── categoryController.js
│   │   ├── supplierController.js
│   │   ├── transactionController.js
│   │   └── reportController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── validate.js
│   │   └── error.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Category.js
│   │   ├── Supplier.js
│   │   └── Transaction.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   ├── categoryRoutes.js
│   │   ├── supplierRoutes.js
│   │   ├── transactionRoutes.js
│   │   └── reportRoutes.js
│   ├── scripts/
│   │   ├── seed.js
│   │   └── autoSeed.js
│   ├── utils/
│   │   └── response.js
│   ├── server.js
│   ├── .env.example
│   └── package.json
├── src/
│   ├── components/
│   │   ├── ConfirmationDialog.tsx
│   │   ├── DashboardCard.tsx
│   │   ├── LoadingState.tsx
│   │   ├── Modal.tsx
│   │   ├── Pagination.tsx
│   │   ├── SearchBar.tsx
│   │   ├── Sidebar.tsx
│   │   └── StockBadge.tsx
│   ├── context/
│   │   └── AuthContext.tsx
│   ├── layouts/
│   │   ├── DashboardLayout.tsx
│   │   └── ProtectedRoute.tsx
│   ├── pages/
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Products.tsx
│   │   ├── Categories.tsx
│   │   ├── Suppliers.tsx
│   │   ├── Transactions.tsx
│   │   └── Reports.tsx
│   ├── services/
│   │   ├── api.ts
│   │   ├── authService.ts
│   │   ├── productService.ts
│   │   ├── categoryService.ts
│   │   ├── supplierService.ts
│   │   ├── transactionService.ts
│   │   └── reportService.ts
│   ├── utils/
│   │   └── helpers.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── index.html
├── vite.config.ts
├── tailwind.config.js
└── package.json
```

## Requirements

- Node.js 18+
- MongoDB (Atlas cluster or local instance)

## Installation

### 1. Clone the repository

```bash
git clone <repo-url>
cd stockflow-ims
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file (see `.env.example`):

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_jwt_refresh_secret
PORT=5000
CLIENT_URL=http://localhost:5173
```

### 3. Frontend Setup

```bash
cd ../
npm install
```

### 4. MongoDB Setup

If using MongoDB Atlas:
1. Create a cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Add your IP to the IP whitelist
3. Create a database user
4. Copy the connection string into `MONGO_URI` in `backend/.env`

If using local MongoDB:
```
MONGO_URI=mongodb://localhost:27017/stockflow_ims
```

### 5. Database Seed

```bash
cd backend
npm run seed
```

This creates:
- **Admin user**: admin@stockflow.com / password123
- **Staff user**: staff@stockflow.com / password123
- 5 categories, 4 suppliers, 15 products, and 14 sample transactions

## Running Development Servers

### Backend (terminal 1)

```bash
cd backend
npm run dev
```

Server runs on `http://localhost:5000`

### Frontend (terminal 2)

```bash
npm run dev
```

Frontend runs on `http://localhost:5173` and proxies `/api` requests to the backend.

## API Overview

All responses follow this structure:

```json
{ "success": true, "data": {}, "message": "Operation successful" }
```

| Route | Method | Description |
|-------|--------|-------------|
| `/api/auth/register` | POST | Register new user |
| `/api/auth/login` | POST | Login |
| `/api/auth/me` | GET | Get current user |
| `/api/auth/logout` | POST | Logout |
| `/api/auth/refresh` | POST | Refresh access token |
| `/api/products` | GET, POST | List/create products |
| `/api/products/:id` | GET, PUT, DELETE | Product CRUD |
| `/api/products/low-stock` | GET | Low stock products |
| `/api/categories` | GET, POST | List/create categories |
| `/api/categories/:id` | GET, PUT, DELETE | Category CRUD |
| `/api/suppliers` | GET, POST | List/create suppliers |
| `/api/suppliers/:id` | GET, PUT, DELETE | Supplier CRUD |
| `/api/transactions` | GET, POST | List/create transactions |
| `/api/reports/dashboard` | GET | Dashboard data |
| `/api/reports/inventory` | GET | Inventory report |
| `/api/reports/transactions` | GET | Transaction report |

## Authentication

- **JWT Access Token** (15 min expiry) sent in `Authorization: Bearer <token>` header
- **JWT Refresh Token** (7 day expiry) stored client-side for automatic token renewal
- Passwords hashed with bcryptjs (salt rounds: 10)
- Frontend Axios interceptor automatically refreshes expired tokens

## Roles

| Feature | Admin | Staff |
|---------|-------|-------|
| View dashboard | Yes | Yes |
| View products | Yes | Yes |
| Add/edit/delete products | Yes | No |
| View categories/suppliers | Yes | Yes |
| Add/edit/delete categories | Yes | No |
| Add/edit/delete suppliers | Yes | No |
| Create transactions | Yes | Yes |
| View transactions | Yes | Yes |
| View/export reports | Yes | Yes |
