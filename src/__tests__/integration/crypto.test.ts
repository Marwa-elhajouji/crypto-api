import request from "supertest";
import app from "../../index";
import { base64Encrypt } from "../../utils/base64-crypto";
import { generateToken } from "../utils";
import dotenv from "dotenv";
dotenv.config();

const createAuthHeader = () =>
  `Bearer ${generateToken({ userId: "abc123", role: "admin" })}`;

describe("POST /encrypt", () => {
  it("should encrypt top-level fields", async () => {
    const input = { name: "name", age: 25 };
    const res = await request(app)
      .post("/encrypt")
      .set("Authorization", createAuthHeader())
      .send(input);

    expect(res.status).toBe(200);
    expect(res.body.name).toBe(Buffer.from("name").toString("base64"));
    expect(res.body.age).toBe(Buffer.from("25").toString("base64"));
  });

  it("should return 400 for malformed JSON", async () => {
    const res = await request(app)
      .post("/encrypt")
      .set("Authorization", createAuthHeader())
      .send("mal_formed_json")
      .set("Content-Type", "application/json");

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("BadRequest");
    expect(res.body.message).toBe("Malformed JSON in request body");
  });

  it("should return 400 for invalid body", async () => {
    const res = await request(app)
      .post("/encrypt")
      .set("Authorization", createAuthHeader())
      .set("Content-Type", "application/json")
      .send(["a", "b", "c"]);

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("ValidationError");
    expect(res.body.message).toBe("Invalid request body");
  });

  it("should return 401 if Authorization header is missing", async () => {
    const res = await request(app).post("/encrypt").send({ name: "name" });

    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Unauthorized");
    expect(res.body.message).toBe("No authorization token was found");
  });

  it("should return 401 for invalid token", async () => {
    const res = await request(app)
      .post("/encrypt")
      .set("Authorization", "Bearer invalid.token.value")
      .send({ name: "name" });

    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Unauthorized");
    expect(res.body.message).toBe("invalid token");
  });
});

describe("POST /decrypt", () => {
  it("should decrypt base64-encoded fields", async () => {
    const original = {
      name: "name",
      age: 25,
      contact: {
        email: "name@example.com",
        phone: "123-456-7890",
      },
    };

    const encrypted = {
      name: base64Encrypt("name"),
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
      .set("Authorization", createAuthHeader())
      .send(["a", "b", "c"])
      .set("Content-Type", "application/json");

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("ValidationError");
    expect(res.body.message).toBe("Invalid request body");
    expect(res.body.details).toBeDefined();
  });

  it("should return 400 for malformed JSON", async () => {
    const res = await request(app)
      .post("/decrypt")
      .set("Authorization", createAuthHeader())
      .set("Content-Type", "application/json")
      .send("mal_formed_json");
    expect(res.status).toBe(400);
    expect(res.body.error).toBe("BadRequest");
    expect(res.body.message).toBe("Malformed JSON in request body");
  });

  it("should return 401 if Authorization header is missing", async () => {
    const res = await request(app).post("/decrypt").send({ name: "name" });

    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Unauthorized");
    expect(res.body.message).toBe("No authorization token was found");
  });

  it("should return 401 for invalid token", async () => {
    const res = await request(app)
      .post("/decrypt")
      .set("Authorization", "Bearer invalid.token.value")
      .send({ name: "name" });

    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Unauthorized");
    expect(res.body.message).toBe("invalid token");
  });
});
