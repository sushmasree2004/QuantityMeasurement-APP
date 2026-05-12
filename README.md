# Quantity Measurement API

A REST API built with Node.js, Express.js, and MySQL for performing unit conversions and arithmetic operations across different measurement types.

---

## Tech Stack

| Technology | Purpose |
|---|---|
| Node.js | Runtime environment |
| Express.js | Web framework |
| MySQL | Database |
| Sequelize | ORM (Object Relational Mapper) |
| JWT | Authentication tokens |
| bcrypt | Password hashing |
| express-validator | Input validation |
| helmet | Security headers |
| morgan | Request logging |
| dotenv | Environment variables |
| nodemon | Auto-restart in development |

---

## Project Structure

```
backend/
│
├── server.js                    # Entry point — starts server
├── app.js                       # Express app — middleware + routes
├── .env                         # Environment variables (secrets)
├── package.json                 # Dependencies
│
└── src/
    ├── config/
    │   └── db.js                # MySQL connection (Sequelize)
    │
    ├── models/
    │   ├── User.js              # Users table blueprint
    │   └── QuantityMeasurement.js # Measurements table blueprint
    │
    ├── utils/
    │   └── generateToken.js     # JWT token creator
    │
    ├── services/
    │   ├── authService.js       # Auth logic (register, login)
    │   └── quantityService.js   # Measurement logic (add, subtract, etc.)
    │
    ├── controllers/
    │   ├── authController.js    # Auth request/response handler
    │   └── quantityController.js # Quantity request/response handler
    │
    ├── middleware/
    │   ├── authMiddleware.js    # JWT verification + role authorization
    │   └── errorHandler.js      # Global error catcher
    │
    └── routes/
        ├── authRoutes.js        # Auth URL mapping
        └── quantityRoutes.js    # Quantity URL mapping
```

---

## Prerequisites

Make sure you have these installed:

| Tool | Version | Check Command |
|---|---|---|
| Node.js | 18+ | `node -v` |
| npm | 9+ | `npm -v` |
| MySQL | 8+ | `mysql --version` |

---

## Setup & Installation

### Step 1 — Clone or Extract Project

```bash
cd quantity-app/backend
```

### Step 2 — Install Dependencies

```bash
npm install
```

### Step 3 — Create MySQL Database

Open MySQL Workbench or terminal and run:

```sql
CREATE DATABASE quantity_db;
```

### Step 4 — Configure Environment Variables

Open `.env` file and update with your values:

```dotenv
DB_HOST=localhost
DB_PORT=3306
DB_NAME=quantity_db
DB_USER=root
DB_PASSWORD=your_mysql_password

SERVER_PORT=9097

JWT_SECRET=your_long_random_secret_key_here
JWT_EXPIRES_IN=1h
```

>  Never push `.env` to GitHub

### Step 5 — Run the Server

```bash
# Development (auto-restart on file changes)
npm run dev

# Production
npm start
```

You should see:

```
 Database connected & tables synced
 Server running on http://localhost:9097
 Auth:       http://localhost:9097/api/auth
 Quantities: http://localhost:9097/api/v1/quantities
```

---

## Environment Variables

| Variable | Description | Example |
|---|---|---|
| `DB_HOST` | MySQL host | `localhost` |
| `DB_PORT` | MySQL port | `3306` |
| `DB_NAME` | Database name | `quantity_db` |
| `DB_USER` | MySQL username | `root` |
| `DB_PASSWORD` | MySQL password | `yourpassword` |
| `SERVER_PORT` | Port to run server | `9097` |
| `JWT_SECRET` | Secret key for JWT signing | `f7k2mN9qX3...` |
| `JWT_EXPIRES_IN` | Token expiry time | `1h` |

---

## API Endpoints

### Auth Routes
Base URL: `/api/auth`

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | `/register` | Register new user |  No |
| POST | `/login` | Login existing user |  No |
| GET | `/profile` | Get logged in user profile |  Yes |

---

### Quantity Routes
Base URL: `/api/v1/quantities`

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | `/add` | Add two quantities |  No |
| POST | `/subtract` | Subtract two quantities |  No |
| POST | `/compare` | Compare two quantities |  No |
| POST | `/convert` | Convert unit to another |  No |
| GET | `/history/:operation` | Get operation history | No |
| GET | `/errors` | Get all error records |  No |
| GET | `/count/:operation` | Count operations |  No |

---

## Request & Response Examples

### Register User

**Request:**
```http
POST /api/auth/register
Content-Type: application/json

{
    "name": "John Doe",
    "email": "john@gmail.com",
    "password": "mypass123"
}
```

**Response: 201 Created**
```json
{
    "success": true,
    "message": "User registered successfully",
    "data": {
        "id": 1,
        "name": "John Doe",
        "email": "john@gmail.com",
        "role": "user",
        "token": "eyJhbGciOiJIUzI1NiJ9..."
    }
}
```

---

### Login

**Request:**
```http
POST /api/auth/login
Content-Type: application/json

{
    "email": "john@gmail.com",
    "password": "mypass123"
}
```

**Response: 200 OK**
```json
{
    "success": true,
    "message": "Login successful",
    "data": {
        "id": 1,
        "name": "John Doe",
        "email": "john@gmail.com",
        "role": "user",
        "token": "eyJhbGciOiJIUzI1NiJ9..."
    }
}
```

---

### Get Profile (Protected)

**Request:**
```http
GET /api/auth/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
```

**Response: 200 OK**
```json
{
    "success": true,
    "data": {
        "id": 1,
        "name": "John Doe",
        "email": "john@gmail.com",
        "role": "user",
        "createdAt": "2026-05-10T17:45:23.000Z"
    }
}
```

---

### Add Two Quantities

**Request:**
```http
POST /api/v1/quantities/add
Content-Type: application/json

{
    "thisQuantityDTO": {
        "value": 2,
        "unit": "FEET",
        "measurementType": "LengthUnit"
    },
    "thatQuantityDTO": {
        "value": 12,
        "unit": "INCHES",
        "measurementType": "LengthUnit"
    }
}
```

**Response: 200 OK**
```json
{
    "id": 1,
    "thisValue": 2,
    "thisUnit": "FEET",
    "thisMeasurementType": "LengthUnit",
    "thatValue": 12,
    "thatUnit": "INCHES",
    "thatMeasurementType": "LengthUnit",
    "operation": "ADD",
    "resultValue": 3,
    "resultUnit": "FEET",
    "isError": false,
    "createdAt": "2026-05-10T17:45:23.000Z"
}
```

---

### Convert Unit

**Request:**
```http
POST /api/v1/quantities/convert
Content-Type: application/json

{
    "thisQuantityDTO": {
        "value": 100,
        "unit": "CELSIUS",
        "measurementType": "TemperatureUnit"
    },
    "targetQuantityDTO": {
        "value": 0,
        "unit": "FAHRENHEIT",
        "measurementType": "TemperatureUnit"
    }
}
```

**Response: 200 OK**
```json
{
    "operation": "CONVERT",
    "resultValue": 212,
    "resultUnit": "FAHRENHEIT",
    "isError": false
}
```

---

### Compare Two Quantities

**Request:**
```http
POST /api/v1/quantities/compare
Content-Type: application/json

{
    "thisQuantityDTO": {
        "value": 1,
        "unit": "LITRE",
        "measurementType": "VolumeUnit"
    },
    "thatQuantityDTO": {
        "value": 1000,
        "unit": "MILLILITRE",
        "measurementType": "VolumeUnit"
    }
}
```

**Response: 200 OK**
```json
{
    "operation": "COMPARE",
    "resultString": "Equal",
    "isError": false
}
```

---

## Supported Measurement Types & Units

| Measurement Type | Units | Base Unit |
|---|---|---|
| `LengthUnit` | FEET, INCHES, YARDS | INCHES |
| `WeightUnit` | KG, GRAM | GRAM |
| `VolumeUnit` | LITRE, MILLILITRE | MILLILITRE |
| `TemperatureUnit` | CELSIUS, FAHRENHEIT | CELSIUS |

---

## Supported Operations

| Operation | Endpoint | Supported Types |
|---|---|---|
| ADD | `/add` | Length, Weight, Volume |
| SUBTRACT | `/subtract` | Length, Weight, Volume |
| COMPARE | `/compare` | All types |
| CONVERT | `/convert` | All types |

>  ADD and SUBTRACT are not supported for TemperatureUnit

---

## Error Responses

### Validation Error
```json
{
    "timestamp": "2026-05-10T17:45:23.000Z",
    "status": 400,
    "error": "Validation failed",
    "details": [
        "thisQuantityDTO.unit: unit is required",
        "thatQuantityDTO.value: value must be a number"
    ]
}
```

### Unauthorized (No Token)
```json
{
    "success": false,
    "message": "Access denied. No token provided."
}
```

### Invalid Token
```json
{
    "success": false,
    "message": "Invalid or expired token. Please login again."
}
```

### Duplicate Email
```json
{
    "timestamp": "2026-05-10T17:45:23.000Z",
    "status": 409,
    "error": "Email already registered"
}
```

### Invalid Credentials
```json
{
    "timestamp": "2026-05-10T17:45:23.000Z",
    "status": 401,
    "error": "Invalid credentials"
}
```

---

## HTTP Status Codes Used

| Code | Meaning | When |
|---|---|---|
| `200` | OK | Successful GET, POST |
| `201` | Created | User registered |
| `400` | Bad Request | Validation failed |
| `401` | Unauthorized | Wrong credentials or no token |
| `403` | Forbidden | Wrong role |
| `404` | Not Found | User not found |
| `409` | Conflict | Email already exists |
| `500` | Server Error | Unexpected error |

---

## Request Flow

```
Request
    ↓
helmet()         Security headers
    ↓
morgan()         Log request
    ↓
cors()           Check origin
    ↓
express.json()   Parse body
    ↓
Routes           Match URL
    ↓
Validation       Check input
    ↓
authMiddleware   Verify token (protected only)
    ↓
Controller       Handle req/res
    ↓
Service          Business logic
    ↓
Model            Database query
    ↓
Response         Send back to client
    ↓
errorHandler     Catch any errors
```

---

## Database Tables

### users
| Column | Type | Rules |
|---|---|---|
| id | BIGINT | Auto increment, Primary key |
| name | VARCHAR | Required |
| email | VARCHAR | Required, Unique |
| password | VARCHAR | Required, bcrypt hashed |
| role | ENUM | user / admin, default: user |
| createdAt | DATETIME | Auto managed |
| updatedAt | DATETIME | Auto managed |

### quantity_measurements
| Column | Type | Description |
|---|---|---|
| id | BIGINT | Auto increment, Primary key |
| thisValue | DOUBLE | First quantity value |
| thisUnit | VARCHAR | First quantity unit |
| thisMeasurementType | VARCHAR | First quantity type |
| thatValue | DOUBLE | Second quantity value |
| thatUnit | VARCHAR | Second quantity unit |
| thatMeasurementType | VARCHAR | Second quantity type |
| operation | VARCHAR | ADD / SUBTRACT / COMPARE / CONVERT |
| resultValue | DOUBLE | Calculated result |
| resultUnit | VARCHAR | Result unit |
| resultString | VARCHAR | Equal / Not Equal (COMPARE only) |
| isError | BOOLEAN | Was there an error? |
| errorMessage | VARCHAR | Error details if any |
| createdAt | DATETIME | Auto managed |
| updatedAt | DATETIME | Auto managed |

---

## Scripts

```bash
npm run dev    # Start with nodemon (auto-restart)
npm start      # Start normally
```

---

## Common Errors & Fixes

| Error | Cause | Fix |
|---|---|---|
| `Unknown database 'quantity_db'` | DB not created | Run `CREATE DATABASE quantity_db` in MySQL |
| `Access denied for user 'root'` | Wrong password | Update `DB_PASSWORD` in `.env` |
| `nodemon not recognized` | Not installed | Run `npm install` first |
| `Port 9097 already in use` | Another process | Change `SERVER_PORT` in `.env` |
| `JWT malformed` | Bad token format | Send `Bearer <token>` in Authorization header |

---

## Author

Built with Node.js + Express.js + MySQL + Sequelize + JWT
