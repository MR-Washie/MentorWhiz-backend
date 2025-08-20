import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getMe, updateMe } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/me", protectRoute, getMe);
router.put("/me", protectRoute, updateMe);

export default router;
