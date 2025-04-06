import request from "supertest";
import app from "../../index";
import { base64Encrypt } from "../../utils/functional";
import { generateToken } from "../utils";

import dotenv from "dotenv";
dotenv.config();

const createAuthHeader = () =>
  `Bearer ${generateToken({ userId: "abc123", role: "admin" })}`;

describe("POST /encrypt", () => {
  it("should encrypt top-level fields", async () => {
    const input = { name: "Alice", age: 25 };
    const res = await request(app)
      .post("/encrypt")
      .set("Authorization", createAuthHeader())
      .send(input);

    expect(res.status).toBe(200);
    expect(res.body.name).toBe(Buffer.from("Alice").toString("base64"));
    expect(res.body.age).toBe(Buffer.from("25").toString("base64"));
  });
  it("should return 400 for invalid body", async () => {
    const res = await request(app)
      .post("/encrypt")
      .send(null as any)
      .set("Content-Type", "application/json");
    expect(res.status).toBe(400);
  });
});

describe("POST /decrypt", () => {
  it("should decrypt base64-encoded fields", async () => {
    const original = {
      name: "Alice",
      age: 25,
      contact: {
        email: "alice@example.com",
        phone: "123-456-7890",
      },
    };

    const encrypted = {
      name: base64Encrypt("Alice"),
      age: base64Encrypt("25"),
      contact: base64Encrypt(JSON.stringify(original.contact)),
    };

    const res = await request(app)
      .post("/decrypt")
      .set("Authorization", createAuthHeader())
      .send(encrypted);

    expect(res.status).toBe(200);
    expect(res.body).toEqual(original);
  });

  it("should return 400 for invalid body", async () => {
    const res = await request(app)
      .post("/decrypt")
      .send(null as any)
      .set("Content-Type", "application/json");

    expect(res.status).toBe(400);
  });
});
