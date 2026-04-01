const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const { users } = require("../data/store");

const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require("../utils/jwt");

// POST /api/auth/register
const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ message: "name, email, and password are required" });
  }
  if (password.length < 6) {
    return res
      .status(400)
      .json({ message: "Password must be at least 6 characters" });
  }

  const existing = [...users.values()].find((u) => u.email === email);
  if (existing) {
    return res.status(409).json({ message: "Email already in use" });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = { id: uuidv4(), name, email, passwordHash, refreshToken: null };
  users.set(user.id, user);

  const payload = { id: user.id, email: user.email, name: user.name };
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken({ id: user.id });
  user.refreshToken = refreshToken;

  return res.status(201).json({
    message: "User registered successfully",
    user: { id: user.id, name: user.name, email: user.email },
    accessToken,
    refreshToken,
  });
};

// POST /api/auth/login
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "email and password are required" });
  }

  const user = [...users.values()].find((u) => u.email === email);
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const payload = { id: user.id, email: user.email, name: user.name };
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken({ id: user.id });

  user.refreshToken = refreshToken;

  return res.status(200).json({
    message: "Login successful",
    user: { id: user.id, name: user.name, email: user.email },
    accessToken,
    refreshToken,
  });
};

// POST /api/auth/refresh
const refresh = (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ message: "refreshToken is required" });
  }

  let decoded;
  try {
    decoded = verifyRefreshToken(refreshToken);
  } catch {
    return res
      .status(401)
      .json({ message: "Invalid or expired refresh token" });
  }

  const user = users.get(decoded.id);
  if (!user || user.refreshToken !== refreshToken) {
    return res
      .status(401)
      .json({ message: "Refresh token revoked or not found" });
  }

  const accessToken = generateAccessToken({
    id: user.id,
    email: user.email,
    name: user.name,
  });
  return res.status(200).json({ accessToken });
};

// POST /api/auth/logout
const logout = (req, res) => {
  const { refreshToken } = req.body;

  if (refreshToken) {
    try {
      const decoded = verifyRefreshToken(refreshToken);
      const user = users.get(decoded.id);
      if (user) user.refreshToken = null;
    } catch {
      // Token invalid — still treat as successful logout
    }
  }

  return res.status(200).json({ message: "Logged out successfully" });
};

module.exports = { register, login, refresh, logout };
