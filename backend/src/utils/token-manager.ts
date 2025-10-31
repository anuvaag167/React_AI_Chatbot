import jwt, { Secret, SignOptions } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { COOKIE_NAME } from "./constants.js";

export const createToken = (
  id: string,
  email: string,
  expiresIn: string | number
) => {
  const payload = { id, email };

  const raw = process.env.JWT_SECRET;
  if (!raw || raw.trim() === "") {
    throw new Error("JWT_SECRET not set or empty");
  }
  const secret: Secret = raw.trim();

  const opts: SignOptions = { expiresIn: expiresIn as SignOptions["expiresIn"] };
  return jwt.sign(payload, secret, opts);
};

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // ✅ Only read the signed cookie. Do NOT fall back to req.cookies (that gives "s:..." and will fail verification)
  const token = req.signedCookies?.[COOKIE_NAME];

  if (!token || String(token).trim() === "") {
    return res.status(401).json({ message: "Token expired" });
  }

  try {
    const raw = process.env.JWT_SECRET;
    if (!raw || raw.trim() === "") throw new Error("JWT_SECRET missing");
    const secret: Secret = raw.trim();

    const payload = jwt.verify(token as string, secret);
    // console.log("✅ Token verification successful");
    (res.locals as any).jwtData = payload;
    return next();
  } catch {
    return res.status(401).json({ message: "Token expired" });
  }
};
