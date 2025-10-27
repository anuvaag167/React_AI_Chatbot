import User from "../models/User.js";
import { hash } from "bcrypt";
export const getAllUsers = async (req, res, next) => {
    try {
        //get all users
        const users = await User.find();
        return res.status(200).json({ message: "ok", users });
    }
    catch (error) {
        return res.status(400).json({ message: "ERROR", cause: error.message });
    }
};
export const userSignUp = async (req, res, next) => {
    try {
        //user signup
        const { name, email, password } = req.body;
        const hashedPassword = await hash(password, 10);
        const user = await User.create({ name, email, password: hashedPassword });
        await user.save();
        return res.status(201).json({ message: "created", id: user._id.toString() });
    }
    catch (error) {
        return res.status(400).json({ message: "ERROR", cause: error.message });
    }
};
//# sourceMappingURL=user-controllers.js.map