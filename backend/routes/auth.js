const express= require('express');
const User= require('../models/User/User'); 
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.post('/signup', async(req, res) => {
    const {name, email, password,address} = req.body;
    const newuser=User({
        name,
        email,
        password,
        address
    });
    await newuser.save();
    const token = jwt.sign({ userId: newuser._id }, process.env.JWT_SECRET || 'meh', {expiresIn: '7d'});
    res.status(201).json({
        message: 'User created successfully',
        token: token,
        user: {
            id: newuser._id,
            name: newuser.name,
            email: newuser.email,
            address: newuser.address
        }
    });
});
router.post('/login', async(req, res) => {
    const {email, password} = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(401).json({ message: 'Invalid email' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).json({ message: 'Invalid password' });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'meh', {expiresIn: '7d'});
    res.status(200).json({
        message: 'Login successful',
        token: token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            address: user.address,
            role: user.role,
        }
    });
});
router.get('/profile', async(req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({
            id: user._id,
            name: user.name,
            email: user.email,
            address: user.address,
            role: user.role,
        });
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
});
module.exports = router;