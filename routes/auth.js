const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const router = express.Router();

const validateInput = (fields) => {
  const errors = {};
  if (!fields.name || fields.name.trim() === "") errors.name = "Name is required";
  if (!fields.email || !/\S+@\S+\.\S+/.test(fields.email))
    errors.email = "Valid email is required";
  if (!fields.password || fields.password.length < 6)
    errors.password = "Password must be at least 6 characters long";
  if (!fields.role || !["admin", "commuter", "operator"].includes(fields.role))
    errors.role = "Role must be admin, commuter, or operator";
  return errors;
};

// Registration route
router.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body;

  const errors = validateInput({ name, email, password, role });
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ message: "Validation errors", errors });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const user = new User({ name, email, password, role });
    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Registration Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});


// Login route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    return res.status(400).json({ message: "Valid email is required" });
  }
  if (!password) {
    return res.status(400).json({ message: "Password is required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({ message: "Login successful", token, user: {
      name: user.name,
      email: user.email,
      role: user.role,
      id: user.id
    } });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
