# Finance Dashboard Backend

A RESTful backend API for a finance dashboard system with role-based access control, financial transaction management, and summary analytics.

---

## Tech Stack

- **Runtime:** Node.js
- **Language:** TypeScript
- **Framework:** Express.js
- **Database:** SQLite (via Prisma ORM)
- **Authentication:** JWT (JSON Web Tokens)
- **Password Hashing:** SHA-256 (crypto module)

---

## Project Structure

```
finance-dashboard-backend/
├── prisma/
│   ├── schema.prisma        # Database schema
│   ├── seed.ts              # Seed data (roles + admin user)
│   └── dev.db               # SQLite database file
├── src/
│   ├── config/
│   │   ├── database.ts      # Prisma client
│   │   ├── env.ts           # Environment variables
│   │   └── constants.ts     # App constants (roles, permissions)
│   ├── controllers/
│   │   ├── authController.ts
│   │   ├── userController.ts
│   │   ├── transactionController.ts
│   │   └── dashboardController.ts
│   ├── middlewares/
│   │   ├── authMiddleware.ts    # JWT verification
│   │   ├── roleMiddleware.ts    # Role-based access control
│   │   └── errorHandler.ts     # Global error handler
│   ├── routes/
│   │   ├── index.ts
│   │   ├── authRoutes.ts
│   │   ├── userRoutes.ts
│   │   ├── transactionRoutes.ts
│   │   └── dashboardRoutes.ts
│   ├── services/
│   │   ├── userService.ts
│   │   ├── transactionService.ts
│   │   └── dashboardService.ts
│   ├── types/
│   │   └── index.ts             # TypeScript interfaces
│   ├── utils/
│   │   ├── helpers.ts           # Password hashing, calculations
│   │   ├── logger.ts            # Console logger
│   │   └── responseFormatter.ts # Standardized API responses
│   ├── validators/
│   │   ├── userValidator.ts
│   │   └── transactionValidator.ts
│   └── app.ts                   # Express app entry point
├── .env
├── package.json
└── tsconfig.json
```

---

## Setup Instructions

### Prerequisites

- Node.js v18 or higher
- npm

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/TusharSharmaji/Finance-Data-Processing-and-Access-Control-Backend.git
cd Finance-Data-Processing-and-Access-Control-Backend

# 2. Install dependencies
npm install

# 3. Create a .env file (see Environment Variables below)

# 4. Generate Prisma client
npx prisma generate

# 5. Run database migrations
npx prisma migrate dev --name init

# 6. Seed the database (creates roles and admin user)
npx ts-node --skip-project prisma/seed.ts

# 7. Start the development server
npm run dev
```

Server runs at: `http://localhost:3000`

---

## Environment Variables

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-secret-key"
PORT=3000
NODE_ENV=development
```

---

## Default Seeded Users

| Email | Password | Role |
|---|---|---|
| admin@finance.com | admin123 | ADMIN |
| analyst@finance.com | analyst123 | ANALYST |
| viewer@finance.com | viewer123 | VIEWER |

---

## Roles and Permissions

| Action | ADMIN | ANALYST | VIEWER |
|---|---|---|---|
| Login | ✅ | ✅ | ✅ |
| View transactions | ✅ | ✅ | ✅ |
| Create transaction | ✅ | ✅ | ❌ |
| Update transaction | ✅ | ✅ | ❌ |
| Delete transaction | ✅ | ❌ | ❌ |
| View dashboard summary | ✅ | ✅ | ✅ |
| View monthly trends | ✅ | ✅ | ❌ |
| View all users | ✅ | ✅ | ❌ |
| Create user | ✅ | ❌ | ❌ |

---

## API Endpoints

### Authentication

#### POST /api/auth/login
Login and receive a JWT token.

**Request Body:**
```json
{
  "email": "admin@finance.com",
  "password": "admin123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { "id": 1, "email": "admin@finance.com", "name": "Admin", "role": { "name": "ADMIN" } },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6..."
  }
}
```

---

### Users (Requires Auth Token)

#### POST /api/users
Create a new user. **ADMIN only.**

**Request Body:**
```json
{
  "email": "newuser@finance.com",
  "password": "password123",
  "name": "New User",
  "roleId": 3
}
```

#### GET /api/users
Get all users with pagination. **ADMIN and ANALYST only.**

**Query Params:** `?page=1&limit=10`

---

### Transactions (Requires Auth Token)

#### POST /api/transactions
Create a transaction. **ADMIN and ANALYST only.**

**Request Body:**
```json
{
  "type": "INCOME",
  "category": "Salary",
  "amount": 50000,
  "date": "2026-04-01",
  "description": "Monthly salary"
}
```

#### GET /api/transactions
Get transactions with pagination and filters. **All roles.**

**Query Params:**
```
?page=1&limit=10
?type=INCOME
?type=EXPENSE
?category=Salary
?startDate=2026-01-01&endDate=2026-04-30
?type=INCOME&category=Salary&page=1&limit=5
```

#### PUT /api/transactions/:id
Update a transaction. **ADMIN and ANALYST only.**

**Request Body:**
```json
{
  "amount": 60000,
  "description": "Updated description"
}
```

#### DELETE /api/transactions/:id
Soft delete a transaction. **ADMIN only.**

---

### Dashboard (Requires Auth Token)

#### GET /api/dashboard/summary
Get financial summary. **All roles.**

**Response:**
```json
{
  "success": true,
  "data": {
    "totalIncome": 100000,
    "totalExpense": 45000,
    "netBalance": 55000,
    "categoryBreakdown": [
      { "category": "Salary", "total": 100000, "percentage": 68.96 }
    ],
    "recentTransactions": [...]
  }
}
```

> Note: ADMIN sees all users' data. ANALYST and VIEWER see only their own data.

#### GET /api/dashboard/trends
Get monthly income vs expense trends. **ADMIN and ANALYST only.**

**Response:**
```json
{
  "success": true,
  "data": [
    { "month": "2026-01", "income": 50000, "expense": 20000, "net": 30000 },
    { "month": "2026-02", "income": 50000, "expense": 25000, "net": 25000 }
  ]
}
```

---

### Health Check

#### GET /health
Check if server is running. No auth required.

```json
{ "status": "OK" }
```

---

## Response Format

All responses follow this structure:

**Success:**
```json
{
  "success": true,
  "message": "Description",
  "data": { ... },
  "timestamp": "2026-04-04T19:00:00.000Z"
}
```

**Error:**
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error",
  "timestamp": "2026-04-04T19:00:00.000Z"
}
```

**Paginated:**
```json
{
  "success": true,
  "message": "Description",
  "data": {
    "data": [...],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 50,
      "pages": 5
    }
  }
}
```

---

## Features Implemented

- JWT Authentication with 24h token expiry
- Role-based access control (ADMIN, ANALYST, VIEWER)
- Full CRUD for financial transactions
- Soft delete (records are never permanently deleted)
- Transaction filtering by type, category, date range
- Pagination on all list endpoints
- Dashboard summary (income, expense, net balance, category breakdown)
- Monthly trends analytics
- Input validation with descriptive error messages
- Standardized API response format
- Global error handling and 404 handler

---

## Assumptions Made

1. Each transaction belongs to the user who created it. ADMIN can see all transactions in the dashboard; other roles see only their own.
2. Soft delete is used for transactions — deleted records are hidden from all queries but remain in the database.
3. Password hashing uses SHA-256 via Node's built-in `crypto` module for simplicity. In production, bcrypt would be preferred.
4. Role IDs are fixed: 1 = ADMIN, 2 = ANALYST, 3 = VIEWER (seeded on first run).
5. The `Permission` model is defined in the schema for future expansion but role-based access is currently enforced directly via middleware.

---

## Database Schema

- **User** — stores user accounts with role reference and soft delete support
- **Role** — ADMIN, ANALYST, VIEWER
- **Transaction** — financial entries with type, category, amount, date, soft delete
- **Permission** — defined for future granular permission support
- **AuditLog** — defined for future audit trail support

---

## Scripts

```bash
npm run dev          # Start development server with hot reload
npm run build        # Compile TypeScript to JavaScript
npm run start        # Run compiled production build
npm run prisma:migrate   # Run database migrations
npm run prisma:generate  # Regenerate Prisma client
npm run prisma:seed      # Seed roles and default users
npm run prisma:studio    # Open Prisma Studio (database GUI)
```
