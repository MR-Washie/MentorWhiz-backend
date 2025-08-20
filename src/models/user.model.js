import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";


const userSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            // required: true,
        },
        userName: {
            type: String,
            required: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: false,
            minlength: 6,
        },
        profilePic: {
            type: String,
            default: "",
        },
        googleId: {
            type: String,
            unique: true,
            sparse: true,
        },
        mobileNo:{
            type: Number,
            required: false,
            unique: true,
            length: 10,
            default: "",
        },
        city: {
            type: String,
            required: false,
            default: "",
        },
        country: {
            type: String,
            required: false,
            default: "India",
        },
        role: {
            type: String,
            required: false,
            enum: [ "mentor", "student", "admin"],
            default: "student",
        },
        language: {
            type: String,
            required: false,
            default: "English",
        },
        college: {
            type: String,
            required: false,
            default: "",
        },
    },
    {
        timestamps: true
    }
)
userSchema.plugin(passportLocalMongoose);
const User = mongoose.model("User", userSchema);

export default User;