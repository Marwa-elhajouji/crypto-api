import { HMAC_SECRET } from "../../config/env";
import request from "supertest";
import app from "../../index";
import { generateToken } from "../utils";

const createAuthHeader = () =>
  `Bearer ${generateToken({ userId: "abc123", role: "admin" })}`;

describe("POST /sign", () => {
  const secret = HMAC_SECRET;

  const payload1 = {
    message: "Hello World",
    timestamp: 1616161616,
  };

  const payload2 = {
    timestamp: 1616161616,
    message: "Hello World",
  };

  it("should return a signature for valid data", async () => {
    const res = await request(app)
      .post("/sign")
      .set("Authorization", createAuthHeader())
      .send(payload1);

    expect(res.status).toBe(200);
    expect(res.body.signature).toBeDefined();
  });

  it("should return the same signature for equivalent data order", async () => {
    const res1 = await request(app).post("/sign").send(payload1);
    const res2 = await request(app).post("/sign").send(payload2);

    expect(res1.body.signature).toBe(res2.body.signature);
  });

  it("should return 400 for invalid sign body", async () => {
    const res = await request(app)
      .post("/sign")
      .send(null as any)
      .set("Content-Type", "application/json");

    expect(res.status).toBe(400);
  });
});

describe("POST /verify", () => {
  const secret = HMAC_SECRET;

  const validPayload = {
    message: "Hello World",
    timestamp: 1616161616,
  };

  it("should return 204 for valid signature", async () => {
    const { body } = await request(app)
      .post("/sign")
      .set("Authorization", createAuthHeader())
      .send(validPayload);

    const res = await request(app)
      .post("/verify")
      .set("Authorization", createAuthHeader())
      .send({
        signature: body.signature,
        data: validPayload,
      });

    expect(res.status).toBe(204);
  });

  it("should return 400 for invalid signature", async () => {
    const fakeSignature =
      "0000000000000000000000000000000000000000000000000000000000000000";

    const res = await request(app)
      .post("/verify")
      .set("Authorization", createAuthHeader())
      .send({
        signature: fakeSignature,
        data: validPayload,
      });

    expect(res.status).toBe(400);
  });

  it("should return 400 for invalid body format", async () => {
    const res = await request(app)
      .post("/verify")
      .send(null as any)
      .set("Content-Type", "application/json");

    expect(res.status).toBe(400);
  });
});
