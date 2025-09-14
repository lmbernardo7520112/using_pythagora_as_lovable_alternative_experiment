const express = require('express');
const UserService = require('../services/userService.js');
const { requireUser } = require('./middlewares/auth.js');
const User = require('../models/User.js');
const { generateAccessToken, generateRefreshToken } = require('../utils/auth.js');
const jwt = require('jsonwebtoken');
const { ALL_ROLES } = require('../../shared/config/roles.js');

const router = express.Router();

// POST /api/auth/login - Autentica um usuário
router.post('/login', async (req, res) => {
  const sendError = (msg) => res.status(400).json({ message: msg });
  const { email, password } = req.body;

  if (!email || !password) {
    return sendError('Email and password are required');
  }

  const user = await UserService.authenticateWithPassword(email, password);

  if (user) {
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();
    return res.json({ ...user.toObject(), accessToken, refreshToken });
  } else {
    return sendError('Email or password is incorrect');
  }
});

// POST /api/auth/register - Cria um novo usuário
router.post('/register', async (req, res, next) => {
  try {
    const { email, password, fullName } = req.body;
    if (!email || !password || !fullName) {
      return res.status(400).json({ error: 'Email, password, and fullName are required' });
    }
    const user = await UserService.create(req.body);
    return res.status(201).json(user); // 201 para criação bem-sucedida
  } catch (error) {
    console.error(`Error while registering user: ${error.message}`);
    return res.status(400).json({ error: error.message });
  }
});

// POST /api/auth/logout - Remove o refreshToken do usuário
router.post('/logout', async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (user) {
    user.refreshToken = null;
    await user.save();
  }

  res.status(200).json({ message: 'User logged out successfully.' });
});

// POST /api/auth/refresh - Renova o accessToken
router.post('/refresh', async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({
      success: false,
      message: 'Refresh token is required'
    });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await UserService.get(decoded.sub);

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({
        success: false,
        message: 'Invalid refresh token'
      });
    }

    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    user.refreshToken = newRefreshToken;
    await user.save();

    return res.status(200).json({
      success: true,
      data: { ...user.toObject(), accessToken: newAccessToken, refreshToken: newRefreshToken }
    });
  } catch (error) {
    console.error(`Token refresh error: ${error.message}`);

    if (error.name === 'TokenExpiredError') {
      return res.status(403).json({
        success: false,
        message: 'Refresh token has expired'
      });
    }

    return res.status(403).json({
      success: false,
      message: 'Invalid refresh token'
    });
  }
});

// GET /api/auth/me - Retorna os dados do usuário autenticado
router.get('/me', requireUser(ALL_ROLES), async (req, res) => {
  return res.status(200).json(req.user);
});

module.exports = router;
