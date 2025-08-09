import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";
import { connectDB } from "./lib/db.js";
import cors from "cors";
import mentor from "./routes/mentorRegister.route.js";
import contact from "./routes/contact.route.js";


dotenv.config();


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: "https://mentor-whiz-frontend.onrender.com",
    credentials: true,
}))

app.use("/auth", authRoutes);


const port = process.env.PORT;


app.use(cookieParser());


// app.use("/api", contact);

app.use("/api", mentor);
app.use("/api", contact);



app.listen(port, () => {
    console.log(`app listening on port ${port}`)
    connectDB()
})
