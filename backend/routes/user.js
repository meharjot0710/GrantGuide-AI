const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const verifyToken = require('./verifytoken');
const User = require('../models/User/User');
require('dotenv').config();

router.get('/get-info', verifyToken, async (req, res) => {
    try {
        const userId = req.user.userId || req.user._id || req.user.id;
        const user = await User.findById(userId);
        if (!user) {
        return res.status(401).json({ message: 'Unauthorized' });
        }
        res.status(200).json({ user });
    } catch (error) {
        console.error('Error retrieving user info:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.post('/update-info', verifyToken, async (req, res) => {
    try {
        const userId = req.user.userId || req.user._id || req.user.id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const {
            name,
            email,
            phone,
            userType,
            region,
            country,
            preferredLanguage,
            interests,
            goals,
            domainFocus,
            projectStage,
            hasPrototype,
            grantTypeNeeded,
            techStack
        } = req.body;

        if (name) user.name = name;
        if (email) user.email = email;
        if (phone) user.phone = phone;
        if (userType) user.userType = userType;
        if (region) user.region = region;
        if (country) user.country = country;
        if (preferredLanguage) user.preferredLanguage = preferredLanguage;
        if (interests) user.interests = Array.isArray(interests) ? interests : interests.split(',').map(i => i.trim());
        if (goals) user.goals = goals;
        if (domainFocus) user.domainFocus = domainFocus;
        if (projectStage) user.projectStage = projectStage;
        if (typeof hasPrototype !== 'undefined') user.hasPrototype = hasPrototype === true || hasPrototype === 'true';
        if (grantTypeNeeded) user.grantTypeNeeded = Array.isArray(grantTypeNeeded) ? grantTypeNeeded : grantTypeNeeded.split(',').map(i => i.trim());
        if (techStack) user.techStack = Array.isArray(techStack) ? techStack : techStack.split(',').map(i => i.trim());

        user.profileCompleted = true;

        await user.save();

        res.status(200).json({ message: 'User info updated successfully', user });
    } catch (error) {
        console.error('Error updating user info:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.post('/cart', verifyToken, async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.user.userId);
        const { productId, quantity } = req.body;

        if (!productId || !quantity) {
            return res.status(400).json({ message: 'Product ID and quantity are required' });
        }

        let cart = await Cart.findOne({ userId });

        if (!cart) {
            cart = new Cart({ userId, items: [] });
        }

        const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);

        if (itemIndex > -1) {
            cart.items[itemIndex].quantity += quantity;
        } else {
            cart.items.push({ productId, quantity });
        }

        await cart.save();

        res.status(200).json({ message: 'Cart updated successfully', cart });
    } catch (error) {
        console.error('Error updating cart:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.get('/cart', verifyToken, async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.user.userId);
        const cart = await Cart.findOne({ userId }).populate('items.productId');

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        res.status(200).json({ cart });
    }
    catch (error) {
        console.error('Error retrieving cart:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.delete('/cart/:productId', verifyToken, async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.user.userId);
        const { productId } = req.params;

        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
        if (itemIndex === -1) {
            return res.status(404).json({ message: 'Product not found in cart' });
        }
        cart.items.splice(itemIndex, 1);
        await cart.save();
        res.status(200).json({ message: 'Product removed from cart successfully' });
    } catch (error) {
        console.error('Error removing product from cart:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.post('/checkout', verifyToken, async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.user.userId);

        const cart = await Cart.findOne({ userId }).populate('items.productId');
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' });
        }

        const totalAmount = cart.items.reduce((total, item) => {
            return total + (item.quantity * item.productId.price);
        }, 0);

        const order = new Order({
            user: userId,
            products: cart.items.map(item => ({
                product: item.productId._id,
                quantity: item.quantity,
                price: item.productId.price
            })),
            totalAmount,
            status: 'Pending',
            createdAt: new Date(),
        });
        
        console.log('Order created successfully:', order.products);
        
        const productIds = cart.items.map(item => item.productId._id);
        const productsFromDB = await Product.find({ _id: { $in: productIds } });

        const lineItems = cart.items.map(item => {
            const productData = productsFromDB.find(p => p._id.toString() === item.productId._id.toString());
            return {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: productData.name,
                        images: [productData.image], 
                    },
                    unit_amount: productData.price * 100,
                },
                quantity: item.quantity,
            };
        });

        const telll=await payment.createCheckoutSession(lineItems);

        order.stripeSessionId = telll.id;
        await order.save();
        
        cart.items = [];
        await cart.save();

        res.status(201).json({ message: 'Order created successfully', telll });
    } catch (error) {
        console.error('Error during checkout:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;