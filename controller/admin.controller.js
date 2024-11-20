const bcrypt = require("bcryptjs");
// const jwt = require('jsonwebtoken');
const { Admin } = require("../models");

const auth = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Check if the user exists
    const user = await Admin.findOne({ email, status: true });
   
    if (!user) {
      return res
        .status(400)
        .json({ status: false, message: "Admin Not Found!", data: false });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ status: false, message: "Password Not Match!", data: false });
    }

    // Remove the password field before sending the response
    const userWithoutPassword = { ...user._doc }; // Clone the user object
    delete userWithoutPassword.password;

    return res.status(200).json({
      status: true,
      message: "Admin Logged In Successfully",
      data: userWithoutPassword,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: false, message: "Server error", data: false });
  }
};

const register = async (req, res) => {
  const { username, password, type, email, mobile, pincode, lastLogin } =
    req.body;

  try {
    const existingUser = await Admin.findOne({ username });
    if (existingUser) {
      return res.status(400).json({
        status: false,
        message: "Admin already exists",
        data: false,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new Admin({
      username,
      password: hashedPassword,
      type,
      email,
      mobile,
      pincode,
      lastLogin,
    });
    await newAdmin.save();

    res.status(201).json({
      status: true,
      message: "Admin registered successfully",
      data: false,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: false,
      message: "Server error",
      data: false,
    });
  }
};
module.exports = {
  auth,
  register,
};
