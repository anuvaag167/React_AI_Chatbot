import User from "../models/User.js";
import { hash, compare } from "bcrypt";
import { createToken } from "../utils/token-manager.js";
import { COOKIE_NAME } from "../utils/constants.js";
// GET /users
export const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find();
        return res.status(200).json({ message: "ok", users });
    }
    catch (error) {
        return res.status(400).json({ message: "ERROR", cause: error.message });
    }
};
// POST /auth/signup
export const userSignUp = async (req, res, next) => {
    try {
        const { name, email, password } = req.body || {};
        if (!name || !email || !password) {
            return res.status(400).json({ message: "name, email, and password are required" });
        }
        const existingUser = await User.findOne({ email }).lean().exec();
        if (existingUser) {
            return res.status(409).json({ message: "User already registered" });
        }
        const hashedPassword = await hash(password, 10);
        const user = await User.create({ name, email, password: hashedPassword });
        //create token and store cookie
        res.clearCookie(COOKIE_NAME, {
            httpOnly: true,
            domain: "localhost",
            signed: true,
            path: "/",
        });
        const token = createToken(user._id.toString(), user.email, "7d");
        const expires = new Date();
        expires.setDate(expires.getDate() + 7);
        res.cookie(COOKIE_NAME, token, { path: "/",
            domain: "localhost",
            expires,
            httpOnly: true,
            signed: true,
        });
        // NOTE: User.create already saved the document.
        return res
            .status(201)
            .json({ message: "created", id: user._id.toString() });
    }
    catch (error) {
        return res.status(400).json({ message: "ERROR", cause: error.message });
    }
};
// POST /auth/login
export const userLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body || {};
        if (!email || !password) {
            return res.status(400).send("email and password are required");
        }
        // IMPORTANT: password has select:false in schema => use +password
        const user = await User.findOne({ email }).select("+password").exec();
        if (!user) {
            return res.status(404).send("User not registered");
        }
        if (!user.password) {
            // Shouldn’t happen if we selected +password, but keep a guard.
            return res.status(500).send("User has no stored password; signup may not be hashing");
        }
        const isPasswordCorrect = await compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(403).send("Incorrect Password");
        }
        res.clearCookie(COOKIE_NAME, {
            httpOnly: true,
            domain: "localhost",
            signed: true,
            path: "/",
        });
        const token = createToken(user._id.toString(), user.email, "7d");
        const expires = new Date();
        expires.setDate(expires.getDate() + 7);
        res.cookie(COOKIE_NAME, token, { path: "/",
            domain: "localhost",
            expires,
            httpOnly: true,
            signed: true,
        });
        // ✅ DO NOT FORGET TO RESPOND ON SUCCESS
        // You can generate a JWT here if you want; for now return basic info.
        return res.status(200).json({
            message: "login successful",
            id: user._id.toString(),
            name: user.name,
            email: user.email,
        });
    }
    catch (error) {
        return res.status(400).json({ message: "ERROR", cause: error.message });
    }
};
//# sourceMappingURL=user-controllers.js.map