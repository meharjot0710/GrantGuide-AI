const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  const token = authHeader.split(' ')[1];

  jwt.verify(token, process.env.JWT_SECRET || 'meh', (err, decoded) => {
    if (err) {
      const errorMessages = {
        TokenExpiredError: 'Unauthorized! Token has expired.',
        JsonWebTokenError: 'Unauthorized! Invalid Token.'
      };
      return res.status(401).json({ message: errorMessages[err.name] || 'Failed to authenticate token.' });
    }
    req.user = decoded;
    next();
  });
};
module.exports = verifyToken;