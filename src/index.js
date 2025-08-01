import express from "express";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.route.js";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";
import cors from "cors";


const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "https://mentor-whiz-frontend.onrender.com",
    credentials: true,
}))

app.use("/auth", authRoutes);


dotenv.config();

const port = process.env.PORT;


// app.use(cookieParser());


app.listen(port, () => {
    console.log(`app listening on port ${port}`)
    connectDB()
})
