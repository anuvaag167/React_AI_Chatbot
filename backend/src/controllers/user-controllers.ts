import { Request, Response, NextFunction } from "express";
import User from "../models/User.js";
import { hash, compare } from "bcrypt";
import { createToken } from "../utils/token-manager.js";
import { COOKIE_NAME } from "../utils/constants.js";

export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.find();
    return res.status(200).json({ message: "ok", users });
  } catch (error: any) {
    return res.status(400).json({ message: "ERROR", cause: error.message });
  }
};

export const userSignUp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password } = req.body || {};
    if (!name || !email || !password) {
      return res.status(400).json({ message: "name, email, and password are required" });
    }

    const existing = await User.findOne({ email }).lean().exec();
    if (existing) return res.status(409).json({ message: "User already registered" });

    const hashedPassword = await hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });

    // Clear old cookie (must match options used when setting)
    res.clearCookie(COOKIE_NAME, {
      path: "/",
      httpOnly: true,
      signed: true,
      sameSite: "lax",
      secure: false,
    });

    const token = createToken(user._id.toString(), user.email, "7d");
    const expires = new Date();
    expires.setDate(expires.getDate() + 7);

    res.cookie(COOKIE_NAME, token, {
      path: "/",
      httpOnly: true,
      signed: true,
      sameSite: "lax",   // localhost:5173 → localhost:5000 works with Lax
      secure: false,     // set true only behind HTTPS
      expires,
    });

    return res.status(201).json({ message: "created", name: user.name, email: user.email });
  } catch (error: any) {
    return res.status(400).json({ message: "ERROR", cause: error.message });
  }
};

export const userLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).send("email and password are required");

    const user = await User.findOne({ email }).select("+password").exec();
    if (!user) return res.status(404).send("User not registered");
    if (!user.password) return res.status(500).send("User has no stored password");

    const ok = await compare(password, user.password);
    if (!ok) return res.status(403).send("Incorrect Password");

    // Clear old cookie
    res.clearCookie(COOKIE_NAME, {
      path: "/",
      httpOnly: true,
      signed: true,
      sameSite: "lax",
      secure: false,
    });

    const token = createToken(user._id.toString(), user.email, "7d");
    const expires = new Date();
    expires.setDate(expires.getDate() + 7);

    res.cookie(COOKIE_NAME, token, {
      path: "/",
      httpOnly: true,
      signed: true,
      sameSite: "lax",
      secure: false,
      expires,
    });

    console.log("🔹 Sent headers:", res.getHeaders());
    return res.status(200).json({ message: "login successful", name: user.name, email: user.email });
  } catch (error: any) {
    return res.status(400).json({ message: "ERROR", cause: error.message });
  }
};

// Runs AFTER verifyToken; returns user info if token is valid
export const verifyUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { jwtData } = res.locals as any; // { id, email, iat, exp }
    const user = await User.findById(jwtData.id).exec();
    if (!user) return res.status(404).send("User not registered or token malfunctioned");

    return res.status(200).json({
      message: "authenticated",
      name: user.name,
      email: user.email,
    });
  } catch (error: any) {
    return res.status(400).json({ message: "ERROR", cause: error.message });
  }
};
