import jwt from "jsonwebtoken";
import { COOKIE_NAME } from "./constants.js";
export const createToken = (id, email, expiresIn) => {
    const payload = { id, email };
    const raw = process.env.JWT_SECRET;
    if (!raw || raw.trim() === "") {
        throw new Error("JWT_SECRET not set or empty");
    }
    const secret = raw.trim();
    const opts = { expiresIn: expiresIn };
    return jwt.sign(payload, secret, opts);
};
export const verifyToken = (req, res, next) => {
    // ✅ Only read the signed cookie. Do NOT fall back to req.cookies (that gives "s:..." and will fail verification)
    const token = req.signedCookies?.[COOKIE_NAME];
    if (!token || String(token).trim() === "") {
        return res.status(401).json({ message: "Token expired" });
    }
    try {
        const raw = process.env.JWT_SECRET;
        if (!raw || raw.trim() === "")
            throw new Error("JWT_SECRET missing");
        const secret = raw.trim();
        const payload = jwt.verify(token, secret);
        // console.log("✅ Token verification successful");
        res.locals.jwtData = payload;
        return next();
    }
    catch {
        return res.status(401).json({ message: "Token expired" });
    }
};
//# sourceMappingURL=token-manager.js.map