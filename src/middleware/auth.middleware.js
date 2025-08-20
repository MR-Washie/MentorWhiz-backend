import jwt from "jsonwebtoken";
import User from "../models/user.model.js";


export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        // console.log(token);
        if(!token){
            return res.status(401).json({message: "Unauthorized - No token provided"});
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if(!decoded){
            return res.status(401).json({message : "Unauthorized - Invalid token"});
        }

        const existingUser = await User.findById(decoded.userId).select("-password");

        if(!existingUser){
            return res.status(404).json({message : "User not found"});
        }

        req.existingUser = existingUser;

        next();

    } catch (error) {
        console.log("Error in protectRoute middleware : ", error.message);
        res.status(500).json({ message : "Internal server error"});
    }
}

export const requireAdmin = (req, res, next) => {
  try {
    // protectRoute ran before and set req.existingUser
    const user = req.existingUser;
    if (!user) return res.status(401).json({ message: "Unauthorized" });
    if (user.role !== "admin") return res.status(403).json({ message: "Forbidden: Admins only" });
    next();
  } catch (e) {
    res.status(500).json({ message: "Internal server error" });
  }
};
