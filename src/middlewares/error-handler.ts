import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { UnauthorizedError } from "express-jwt";

const isSyntaxError = (err: unknown): err is SyntaxError & { status: number } =>
  err instanceof SyntaxError && "status" in err && err.status === 400;

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (err instanceof UnauthorizedError) {
    res.status(401).json({ error: "Unauthorized", message: err.message });
    return;
  }

  if (err instanceof ZodError) {
    res.status(400).json({
      error: "ValidationError",
      message: "Invalid request body",
      details: err.format(),
    });
    return;
  }

  if (isSyntaxError(err)) {
    res.status(400).json({
      error: "BadRequest",
      message: "Malformed JSON in request body",
    });
    return;
  }

  next(err);
};
