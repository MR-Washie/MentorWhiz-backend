import User from "../models/user.model.js";

// Return the authenticated user (without password)
export const getMe = async (req, res) => {
  try {
    // req.existingUser is set by protectRoute
    return res.status(200).json(req.existingUser);
  } catch (e) {
    console.error("getMe error:", e.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Update allowed fields
export const updateMe = async (req, res) => {
  try {
    const allowed = [
      "fullName",
      "mobileNo",
      "city",
      "country",
      "language",
      "college",
      "profilePic",
    ];
    const updates = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }

    // Optional: protect userName uniqueness changes
    if (updates.userName) {
      const clash = await User.findOne({
        userName: updates.userName,
        _id: { $ne: req.existingUser._id },
      });
      if (clash) {
        return res.status(400).json({ message: "Username already taken" });
      }
    }

    // Example: enforce 10-digit mobile number only if provided
    if (updates.mobileNo !== undefined && updates.mobileNo !== "") {
      const asString = String(updates.mobileNo);
      if (!/^\d{10}$/.test(asString)) {
        return res.status(400).json({ message: "Mobile number must be 10 digits" });
      }
    }

    const updated = await User.findByIdAndUpdate(
      req.existingUser._id,
      { $set: updates },
      { new: true, runValidators: true, select: "-password" }
    );

    return res.status(200).json(updated);
  } catch (e) {
    console.error("updateMe error:", e.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};
