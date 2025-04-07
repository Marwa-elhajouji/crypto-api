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
      .post("/sign")
      .set("Authorization", createAuthHeader())
      .set("Content-Type", "application/json")
      .send("mal_formed_json");
    expect(res.status).toBe(400);
    expect(res.body.error).toBe("BadRequest");
    expect(res.body.message).toBe("Malformed JSON in request body");
  });
  it("should return 401 if Authorization header is missing", async () => {
    const res = await request(app).post("/sign").send({ name: "name" });

    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Unauthorized");
    expect(res.body.message).toBe("No authorization token was found");
  });
  it("should return 401 for invalid token", async () => {
    const res = await request(app)
      .post("/sign")
      .set("Authorization", "Bearer invalid.token.value")
      .send({ name: "name" });

    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Unauthorized");
    expect(res.body.message).toBe("invalid token");
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
    expect(res.body.error).toBe("InvalidSignature");
    expect(res.body.message).toBe("The provided signature is invalid.");
  });

  it("should return 400 for invalid body format", async () => {
    const res = await request(app)
      .post("/verify")
      .set("Authorization", createAuthHeader())
      .set("Content-Type", "application/json")
      .send(["a", "b", "c"]);

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("ValidationError");
    expect(res.body.message).toBe("Invalid request body");
  });
  it("should return 400 for malformed JSON", async () => {
    const res = await request(app)
      .post("/verify")
      .set("Authorization", createAuthHeader())
      .set("Content-Type", "application/json")
      .send("mal_formed_json");
    expect(res.status).toBe(400);
    expect(res.body.error).toBe("BadRequest");
    expect(res.body.message).toBe("Malformed JSON in request body");
  });
  it("should return 401 if Authorization header is missing", async () => {
    const res = await request(app).post("/verify").send({ name: "name" });

    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Unauthorized");
    expect(res.body.message).toBe("No authorization token was found");
  });
  it("should return 401 for invalid token", async () => {
    const res = await request(app)
      .post("/verify")
      .set("Authorization", "Bearer invalid.token.value")
      .send({ name: "name" });

    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Unauthorized");
    expect(res.body.message).toBe("invalid token");
  });
});
