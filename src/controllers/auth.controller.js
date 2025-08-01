import User from "../models/user.model.js"
import bcrypt from "bcryptjs"
import { generateToken } from "../lib/utils.js"


// export const signup = async (req, res) => {
//     const {fullName, userName, email, password} = req.body;
//     try {
//         if(password.length < 6) {
//             return res.status(400).json({message: "Password must be at leat 6 character"})
//         }
//         if(!fullName || !userName || !email || !password){
//             return res.status(400).json({message : "All fields are required"});
//         }

//         const existingUser = await User.findOne({email, userName});
//         if(existingUser) return res.status(400).json({ message : "User already exist"});

//         const hashedPassword = await bcrypt.hash(password, 10);

//         const newUser = new User({
//             fullName,
//             userName,
//             email,
//             password : hashedPassword,
//         })


//         if(newUser){
//             // jwt token generate
//             generateToken(newUser._id, res)
//             await newUser.save();

//             res.status(201).json({
//                 message : "Account create succesfully!!"
//             })
//         } else {
//             res.status(400).json({message: "Invalid user data"});
//         }

//     } catch (error) {
//         console.log("Error in signup controller", error.message)
//         res.status(500).json({message : "Internal server error"})
//     }
// }

export const signup = async (req, res) => {
  const { name, username, email, password } = req.body;
  const fullName = name;
  const userName = username;

  try {
    if (!fullName?.trim() || !userName?.trim() || !email?.trim() || !password?.trim()) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { userName }]
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists with same email or username" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      fullName,
      userName,
      email,
      password: hashedPassword
    });

    await newUser.save();
    generateToken(newUser._id, res);

    return res.status(201).json({ message: "Account created successfully!" });

  } catch (error) {
    console.error("Error in signup controller", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req, res) => {
    const {email, password} = req.body;
    try {
        if(!email || !password) {
            return res.status(400).json({message : "All fields are required"});
        }
        const existingUser = await User.findOne({email});
        if(!existingUser) return res.status(400).json({message : "User not found"});

        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password)
        if(!isPasswordCorrect) return res.status(400).json({ message : "Password is incorrect"})
        generateToken(existingUser._id, res);

        res.status(200).json({
            message: "Account logging successfully and account details",
            _id: existingUser._id,
            fullName: existingUser.fullName,
            userName: existingUser.userName,
            email: existingUser.email,
            profilePic: existingUser.profilePic
        })
    } catch (error) {
        console.log('Error in login controller', error.message);
        res.status(500).json({message : "Internal server error"})
    }
}


export const logout = (req, res) => {
    try {
        res.cookie("jwt", "", {
            maxAge: 0
        })
        res.status(200).json({message: "Logout successfully!"});
    } catch (error) {
        console.log("Error in logout controller", error.message);
        res.status(500).json({meaage : "Internal server error"});
    }
}

export const authCheck = (req, res) => {
    try {
        res.status(200).json(req.existingUser)
    } catch (error) {
        console.log("Error in authCheck controller", error.message);
        res.status(500).json({message : "Internal server error"});
    }
}