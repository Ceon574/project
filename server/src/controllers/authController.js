const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');
const mockStore = require('../data/mockStore');

const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'smart_doctor_super_secret_jwt_key_2026',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role, phone, age, gender, address } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password',
      });
    }

    if (mongoose.connection.readyState !== 1) {
      const existing = mockStore.findUser(email);
      if (existing) {
        return res.status(409).json({
          success: false,
          message: 'A user with this email or username already exists',
        });
      }

      const userRole = role === 'admin' ? 'admin' : (role === 'doctor' ? 'doctor' : 'patient');
      const user = mockStore.createUser({
        name,
        email,
        password,
        role: userRole,
        phone,
        age,
        gender,
        address,
      });

      const token = generateToken(user._id);
      return res.status(201).json({
        success: true,
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          age: user.age,
          gender: user.gender,
          address: user.address,
        },
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'A user with this email or username already exists',
      });
    }

    const userRole = role === 'admin' ? 'admin' : (role === 'doctor' ? 'doctor' : 'patient');
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role: userRole,
      phone: phone || '',
      age: age || null,
      gender: gender || '',
      address: address || '',
    });

    const token = generateToken(user._id);
    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        age: user.age,
        gender: user.gender,
        address: user.address,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email/username and password',
      });
    }

    if (mongoose.connection.readyState !== 1) {
      const user = mockStore.findUser(email);
      if (!user || user.password !== password) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password',
        });
      }

      const token = generateToken(user._id);
      return res.status(200).json({
        success: true,
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          age: user.age,
          gender: user.gender,
          address: user.address,
        },
      });
    }

    const user = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { email: email }],
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const token = generateToken(user._id);
    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        age: user.age,
        gender: user.gender,
        address: user.address,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, phone, age, gender, address } = req.body;

    if (mongoose.connection.readyState !== 1) {
      const user = mockStore.findUserById(req.user._id);
      if (user) {
        if (name) user.name = name;
        if (phone !== undefined) user.phone = phone;
        if (age !== undefined) user.age = age;
        if (gender !== undefined) user.gender = gender;
        if (address !== undefined) user.address = address;
      }
      return res.status(200).json({ success: true, user: user || req.user });
    }

    const fieldsToUpdate = {};
    if (name) fieldsToUpdate.name = name;
    if (phone !== undefined) fieldsToUpdate.phone = phone;
    if (age !== undefined) fieldsToUpdate.age = age;
    if (gender !== undefined) fieldsToUpdate.gender = gender;
    if (address !== undefined) fieldsToUpdate.address = address;

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true,
    }).select('-password');

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};
