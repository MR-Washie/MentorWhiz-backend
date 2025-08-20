import express from 'express';
import { authCheck, login, logout, signup } from '../controllers/auth.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import jwt from 'jsonwebtoken';
import { generateToken } from '../lib/utils.js';

const router = express.Router();

router.post("/signup", signup)

router.post("/login", login)

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/google/callback",
  passport.authenticate("google", { failureRedirect: `${process.env.BASE_URL}/login` }),
  (req, res) => {
    generateToken(req.user._id, res);
    return res.redirect(`${process.env.BASE_URL}`);
  }
);



router.post("/logout", logout)

router.get("/check", protectRoute, authCheck);

export default router;