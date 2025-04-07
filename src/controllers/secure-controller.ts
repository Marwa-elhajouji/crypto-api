import { Request, Response } from "express";
import * as cryptoService from "../services/crypto";
import * as signService from "../services/sign";
import { base64Encrypt, base64Decrypt } from "../utils/base64-crypto";
import { HMAC_SECRET } from "../config/env";
import { isBase64 } from "validator";

const signFn = (json: string) => signService.signHmac(json, HMAC_SECRET);

export const encrypt = (req: Request, res: Response): void => {
  const result = cryptoService.encrypt(req.body, base64Encrypt);
  res.json(result);
};

export const decrypt = (req: Request, res: Response): void => {
  const result = cryptoService.decrypt(req.body, base64Decrypt, isBase64);
  res.json(result);
};

export const sign = (req: Request, res: Response): void => {
  const result = signService.sign(req.body, signFn);
  res.json(result);
};

export const verify = (req: Request, res: Response): void => {
  const { signature, data } = req.body;
  const isValid = signService.validateSignature({ data, signature }, signFn);
  if (isValid) {
    res.sendStatus(204);
  } else {
    res.status(400).json({
      status: 400,
      error: "InvalidSignature",
      message: "The provided signature is invalid.",
    });
  }
};
