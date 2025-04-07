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

You can generate a test JWT token directly using the CLI script:

```bash
npm run token '{"userId": "abc123", "role": "admin"}'
```
This will output a valid token using the secret defined in your .env file.
Example output:

```bash
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
Use this token in your API requests (e.g. in Postman) by setting the following header:

```bash
Authorization: Bearer <your-token>
```

### Available Routes

| Method | Route     | Description                                                        |
|--------|-----------|--------------------------------------------------------------------|
| POST   | /encrypt  | Encrypts top-level fields of a flat object to Base64               |
| POST   | /decrypt  | Decrypts Base64 fields (including JSON-encoded strings in fields)  |
| POST   | /sign     | Generates an HMAC signature based on sorted data                   |
| POST   | /verify   | Verifies that a provided HMAC signature matches the original data  |



## Future Improvements

This project currently processes data in memory. A natural next step is to persist signed or encrypted data in a database like **MongoDB**, allowing for operations such as storing, retrieving, and verifying historical records.

