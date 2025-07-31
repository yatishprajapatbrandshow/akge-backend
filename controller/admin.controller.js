const bcrypt = require("bcryptjs");
const validator = require('validator');
// const jwt = require('jsonwebtoken');
const { Admin } = require("../models");

const isGettingData = (req) => {
  const data = req.body;
  if (!data || Object.keys(data).length === 0) {
    throw new Error("Data not found");
  }
}

const loginValidation = (req) => {
  const { email, password } = req.body;

  if (!email) {
    throw new Error("emailId is required");
  } else if (!validator.isEmail(email)) {
    throw new Error("Invalid email address");
  } else if (!password) {
    throw new Error("password is required");
  }
}

const auth = async (req, res) => {
  try {
    const { email, password } = req.body;

    isGettingData(req);
    loginValidation(req);
    // Check if the user exists
    const user = await Admin.findOne({ email, status: true });

    if (!user) {
      return res
        .status(400)
        .json({ status: false, message: "Admin Not Found!", data: false });
    }

    const isPasswordValid = await user.checkBcryptPassword(password);

    if (isPasswordValid) {
      const token = await user.getJWT();
      const isProd = process.env.NODE_ENV === 'production';

      res.cookie("token", token, {
        httpOnly: true,
        secure: isProd, // true in prod (required for SameSite=None)
        sameSite: isProd ? 'None' : 'Lax', // None for cross-origin, Lax for local dev
        expires: new Date(Date.now() + 24 * 3600000),
      });

      return res.status(200).json({ status: true, message: "Logged in successfully", data: user });
    } else {
      throw new Error("Wrong password please check");
    }

  } catch (error) {
    return res
      .status(500)
      .json({ status: false, message: error, data: false });
  }
};

const register = async (req, res) => {
  const { username, password, type, email, mobile, pincode, lastLogin } =
    req.body;

  try {
    await isEmailAlreadyRegistered(req);

    const existingUser = await Admin.findOne({ username });
    if (existingUser) {
      return res.status(400).json({
        status: false,
        message: "Admin already exists",
        data: false,
      });
    }

    const newAdmin = new Admin({
      username,
      password,
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

const logout = async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now())
  });

  res.status(200).json({ message: "Logged out successfully" });
}

module.exports = {
  auth,
  register,
  logout
};
