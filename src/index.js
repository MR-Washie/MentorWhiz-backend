import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";
import { connectDB } from "./lib/db.js";
import cors from "cors";
import mentor from "./routes/mentorRegister.route.js";
import contact from "./routes/contact.route.js";
import userRoutes from "./routes/user.route.js";
import setupGoogleAuth from "../passportConfig.js";
import passport from "passport";
import session from 'express-session';
import adminJobRoutes from "./routes/admin.job.route.js";
import jobsRoutes from "./routes/jobs.route.js";

dotenv.config();


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: `${process.env.BASE_URL}`,
    credentials: true,
}))

app.use(session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false
}));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

setupGoogleAuth();

app.use(passport.initialize());
// app.use(passport.session());


const port = process.env.PORT;


app.use("/auth", authRoutes);

app.use("/api", mentor);
app.use("/api", contact);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminJobRoutes);
app.use("/api/jobs", jobsRoutes);


app.listen(port, () => {
    console.log(`app listening on port ${port}`)
    connectDB()
})
