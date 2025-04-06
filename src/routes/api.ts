import { HMAC_SECRET } from "../config/env";
import { Router } from "express";
import { Request, Response } from "express";
import { encrypt, decrypt } from "../services/crypto";
import { sign, signHmac, validateSignature } from "../services/sign";
import { isBase64 } from "validator";
import { encryptDto } from "../schemas/encryptDto";
import { decryptDto } from "../schemas/decryptDto";
import { signDto } from "../schemas/signDto";
import { validate } from "../middlewares/validate";
import { base64Encrypt, base64Decrypt } from "../utils/functional";
import { verifyDto } from "../schemas/verifyDto";
import { authenticateJWT } from "../middlewares/auth";

const router = Router();
const secret = HMAC_SECRET;
const signFn = (json: string) => signHmac(json, secret);

router.post(
  "/encrypt",
  authenticateJWT,
  validate(encryptDto),
  async (req: Request, res: Response): Promise<void> => {
    const result = encrypt(req.body, base64Encrypt);
    res.json(result);
  }
);

router.post(
  "/decrypt",
  authenticateJWT,
  validate(decryptDto),
  async (req: Request, res: Response): Promise<void> => {
    const result = decrypt(req.body, base64Decrypt, isBase64);
    res.json(result);
  }
);

router.post(
  "/sign",
  authenticateJWT,
  validate(signDto),
  async (req: Request, res: Response): Promise<void> => {
    const result = sign(req.body, signFn);
    res.json(result);
  }
);

router.post(
  "/verify",
  authenticateJWT,
  validate(verifyDto),
  async (req: Request, res: Response): Promise<void> => {
    const { signature, data } = req.body;
    const isValid = validateSignature({ data, signature }, signFn);
    isValid ? res.sendStatus(204) : res.sendStatus(400);
  }
);
export default router;
