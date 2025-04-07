import { Router } from "express";
import { encryptDto } from "../schemas/encryptDto";
import { decryptDto } from "../schemas/decryptDto";
import { signDto } from "../schemas/signDto";
import { validate } from "../middlewares/validate";
import { verifyDto } from "../schemas/verifyDto";
import { authenticateJWT } from "../middlewares/auth";
import * as secureController from "../controllers/secure-controller";

const protectedRouter = Router();

protectedRouter.use(authenticateJWT);

protectedRouter.post(
  "/encrypt",
  validate(encryptDto),
  secureController.encrypt
);
protectedRouter.post(
  "/decrypt",
  validate(decryptDto),
  secureController.decrypt
);
protectedRouter.post("/sign", validate(signDto), secureController.sign);
protectedRouter.post("/verify", validate(verifyDto), secureController.verify);

const router = Router();
router.use("/", protectedRouter);

export default router;
