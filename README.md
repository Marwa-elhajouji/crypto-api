# Riot Take-Home Project

A minimal Node.js/Express server to encrypt, sign, and verify data. It uses JWT for authentication, Zod for validation, and Jest for testing.

## Technologies used

- JWT (`express-jwt`) to secure routes
- Zod for input validation
- Jest + Supertest for integration tests

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Marwa-elhajouji/crypto-api.git
cd riot-take-home
```

### 2.Install dependencies

```bash
npm install
````

### 3. Add a .env file

```env
PORT=3000
JWT_SECRET=your-jwt-secret
HMAC_SECRET=your-hmac-secret
```

## Start the server
```bash
npm run dev 
```

## Run the tests
```bash
npm test 
```
To see the test coverage:
```bash
npm run test -- --coverage
```

## Endpoints
All routes are protected by a JWT middleware.
You must include the following header in every request: Authorization: Bearer <token>

### Generate a test token (e.g. for Postman)
- You can generate a test token with the following script:


 ```typescript 
 import jwt from "jsonwebtoken"; import { JWT_SECRET } from "../config/env"; const token = jwt.sign( { userId: "abc123", role: "admin" }, JWT_SECRET, { algorithm: "HS256", expiresIn: "1h", } ); console.log("Generated JWT:", token);
  ``` 

- Then run:
```bash
npx ts-node src/scripts/generateToken.ts
```
- Copy the printed token and use it in Postman as a header:

Authorization: Bearer eyJhbGciOiJI...

### Available Routes

| Method | Route     | Description                                                        |
|--------|-----------|--------------------------------------------------------------------|
| POST   | /encrypt  | Encrypts top-level fields of a flat object to Base64               |
| POST   | /decrypt  | Decrypts Base64 fields (including JSON-encoded strings in fields)  |
| POST   | /sign     | Generates an HMAC signature based on sorted data                   |
| POST   | /verify   | Verifies that a provided HMAC signature matches the original data  |



## Future Improvements

This project currently processes data in memory. A natural next step is to persist signed or encrypted data in a database like **MongoDB**, allowing for operations such as storing, retrieving, and verifying historical records.

