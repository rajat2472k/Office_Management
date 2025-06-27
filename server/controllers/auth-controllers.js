const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { singupSchema, loginSchema } = require("../vildators/auth-vildation");

const home = async (req, res) => {
  try {
    res.status(200).send("Welcome this is first code router ");
  } catch {
    console.log(error);
  }
};

//---------------
// Register
//---------------
const register = async (req, res) => {
  try {
    const validatedData = singupSchema.parse(req.body);

    const { firstName, lastName, email, password, confirmPassword, role } =
      validatedData;

    // 1. Validate required fields
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !role
    ) {
      return res
        .status(400)
        .json({ error: "All required fields must be filled." });
    }

    // 2. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ error: "User already registered with this email." });
    }

    // 4. Create new user
    const newUser = new User({
      firstName,
      lastName,
      email,
      password,
      role,
    });

    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match." });
    }

    // 5. Save to DB
    await newUser.save();

    // 6. Success response
    res.status(201).json({
      message: "User registered successfully",
      userId: newUser._id,
      role: newUser.role,
    });
  } catch (error) {
    // 🛑 Handle Zod validation errors
    if (error.name === "ZodError") {
      return res.status(400).json({ error: error.errors[0].message });
    }
    console.error("Registration error:", error);
    res.status(500).json({ error: "Server error during registration" });
  }
};

//---------------
// Login
//---------------

const login = async (req, res) => {
  try {
    const validatedData = loginSchema.parse(req.body);
    const { email, password } = validatedData;
    const userExist = await User.findOne({ email });
    if (!userExist) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, userExist.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    let redirect = "/userdashboard";
    if (userExist.role === "admin") {
      redirect = "/adminpanel";
    } else if (userExist.role === "manager") {
      redirect = "/managerpanel";
    }

    res.status(200).json({
      msg: "Login successful",
      token: userExist.generateToken(),
      userId: userExist._id.toString(),
      role: userExist.role,
      redirect,
    });
  } catch (error) {
      if (error.name === "ZodError") {
      return res.status(400).json({ error: error.errors[0].message });
    }
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = { home, register, login };
