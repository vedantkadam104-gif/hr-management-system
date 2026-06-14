# HR & Employee Management System

A full-stack web application built with React JS, Tailwind CSS, Node JS, Express JS, and MySQL. This system provides HR administrators with tools to manage employees, departments, attendance, leave requests, and payroll — while giving employees a self-service portal to access their own data.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React JS |
| Styling | Tailwind CSS |
| Backend | Node JS + Express JS |
| Database | MySQL |
| Auth | JWT (Access + Refresh Tokens) |

---

## Features

### Admin / HR Panel
- Secure login with session management
- Add, Edit, Delete employee records
- Manage Departments (create, rename, assign employees)
- Approve or Reject Leave Requests
- Track and view Employee Attendance records
- Manage Payroll (salary, allowances, deductions)
- Dashboard with analytics, summary cards, and recent activity

### Employee Panel
- Secure login with role-based access
- View and update personal profile
- Apply for Leave (type, dates, reason)
- View personal Attendance history
- View Salary and Payroll information
- Update contact and emergency information

---

## Project Structure

```
root/
├── client/                  # React JS frontend
│   ├── public/
│   └── src/
│       ├── components/      # Reusable UI components
│       ├── pages/           # Admin and Employee pages
│       ├── context/         # React Context / state management
│       ├── hooks/           # Custom hooks
│       ├── services/        # Axios API calls
│       └── utils/           # Helper functions
│
├── server/                  # Node JS + Express backend
│   ├── config/              # DB and environment config
│   ├── controllers/         # Route handler logic
│   ├── middleware/          # Auth, error handling, CORS
│   ├── models/              # MySQL query models
│   ├── routes/              # API route definitions
│   └── utils/               # Utility functions
│
├── .env.example             # Environment variable template
└── README.md
```

---

## Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) v18+
- [MySQL](https://www.mysql.com/) v8+
- npm or yarn

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

### 2. Set Up the Database

Log in to MySQL and create the database:

```sql
CREATE DATABASE hr_system;
```

Then import the schema:

```bash
mysql -u root -p hr_system < server/config/schema.sql
```

### 3. Configure Environment Variables

#### Backend (`server/.env`)

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=DB_NAME=hr_system  
JWT_SECRET=your_jwt_secret_key
JWT_REFRESH_SECRET=your_refresh_secret_key
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
CLIENT_URL=http://localhost:3000
```

#### Frontend (`client/.env`)

```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 4. Install Dependencies

**Backend:**

```bash
cd server
npm install
```

**Frontend:**

```bash
cd client
npm install
```

### 5. Run the Application

**Start the backend server:**

```bash
cd server
npm run dev
```

**Start the frontend (in a new terminal):**

```bash
cd client
npm start
```

The app will be available at `http://localhost:3000`.

---

## API Overview

All endpoints are prefixed with `/api/v1`.

| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| POST | `/auth/login` | Login and receive tokens | All |
| POST | `/auth/refresh` | Refresh access token | All |
| GET | `/employees` | List all employees | Admin |
| POST | `/employees` | Add new employee | Admin |
| PUT | `/employees/:id` | Update employee | Admin |
| DELETE | `/employees/:id` | Delete employee | Admin |
| GET | `/departments` | List departments | Admin |
| POST | `/departments` | Create department | Admin |
| GET | `/leave` | View all leave requests | Admin |
| PUT | `/leave/:id/status` | Approve/Reject leave | Admin |
| POST | `/leave` | Apply for leave | Employee |
| GET | `/attendance` | View attendance records | Admin |
| GET | `/attendance/me` | View own attendance | Employee |
| GET | `/payroll` | View all payroll | Admin |
| GET | `/payroll/me` | View own payroll | Employee |
| GET | `/profile/me` | View own profile | Employee |
| PUT | `/profile/me` | Update own profile | Employee |

---

## Default Login Credentials

> **Note:** Change these immediately after first login.

| Role | Email | Password |
|------|-------|----------|
| Admin/HR | admin@company.com | Admin@123 |
| Employee | employee@company.com | Emp@123 |

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start backend in development mode (nodemon) |
| `npm start` | Start backend in production mode |
| `npm start` (client) | Start React development server |
| `npm run build` (client) | Build React app for production |

---

## Security Measures

- JWT-based authentication with access and refresh tokens
- Role-Based Access Control (Admin / Employee)
- Password hashing with bcrypt
- Input sanitization to prevent SQL injection
- CORS configured for allowed origins
- Rate limiting on auth endpoints
- Environment variables for all sensitive config

---

## License

This project was developed as part of a technical assignment for NeoWesolutize Technology Pvt. Ltd.
