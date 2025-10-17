
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../module/Admin");



exports.register = asyncHandler(async (req, res) => {
  const { name, email, phone, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ message: "All fields required" });

  const exists = await Admin.findOne({ email });
  if (exists)
    return res.status(400).json({ message: "Admin already exists" });

  const hash = await bcrypt.hash(password, 10);
  const admin = await Admin.create({ name, email, phone, password: hash });

  res.status(201).json({ message: "Admin registered successfully", admin });
});

// ===== Admin Login =====
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const admin = await Admin.findOne({ email });
  if (!admin) return res.status(400).json({ message: "Invalid credentials" });

  const match = await bcrypt.compare(password, admin.password);
  if (!match) return res.status(400).json({ message: "Invalid credentials" });

  const token = jwt.sign({ id: admin._id }, process.env.JWT_KEY, {
    expiresIn: "1h",
  });

  res.cookie("adminToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 1000,
  });

  // ✅ Also return token in response if frontend uses headers
  res.status(200).json({
    message: "Login successful",
    admin: {
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      token,
    },
  });
});

// ===== Admin Logout =====
exports.logout = asyncHandler(async (req, res) => {
  res.clearCookie("adminToken");
  res.json({ message: "Admin logout success" });
});



// ===== Get Admin Profile =====
exports.getProfile = asyncHandler(async (req, res) => {
  if (!req.user) return res.status(404).json({ message: "Admin not found" });
  res.json(req.user);
});

// ===== Update Admin Profile =====
exports.updateProfile = asyncHandler(async (req, res) => {
  const { name, email, phone, password } = req.body;
  const admin = req.user;

  if (name) admin.name = name;
  if (email) admin.email = email;
  if (phone) admin.phone = phone;
  if (password) admin.password = await bcrypt.hash(password, 10);

  await admin.save();
  res.json({ message: "Profile updated successfully", admin });
});