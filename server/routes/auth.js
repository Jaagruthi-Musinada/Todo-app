const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const nodemailer = require('nodemailer');
const router = express.Router();

const prisma = new PrismaClient();

// Configure Nodemailer (Placeholder to avoid crash if env vars missing)
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.ethereal.email',
    port: process.env.EMAIL_PORT || 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER || 'user',
        pass: process.env.EMAIL_PASS || 'pass',
    },
});



// Signup
router.post('/signup', async (req, res) => {
    const { email, password } = req.body;
    try {
        // Removed deep-email-validator as it blocks legitimate institutional emails.
        // OTP verification is sufficient proof of email validity.

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) return res.status(400).json({ message: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate Verification OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours expiry

        // Create user first
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                isVerified: false,
                verificationToken: otp,
                verificationTokenExpiry: expiry
            },
        });

        // Send Verification Email
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Verify Your Email - TaskFlow',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
                    <h2 style="color: #c026d3; text-align: center;">Welcome to TaskFlow!</h2>
                    <p style="color: #333;">Please verify your email address to activate your account.</p>
                    <div style="background-color: #fce7f3; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0;">
                        <span style="font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #db2777;">${otp}</span>
                    </div>
                </div>
            `
        };

        try {
            await transporter.sendMail(mailOptions);
            console.log(`Verification email sent to ${email}`);
            // Only send response success if email actually sent
            res.status(201).json({ message: 'Signup successful. Please verify your email.', userId: user.id });
        } catch (emailError) {
            console.error('Error sending verification email:', emailError);

            // CRITICAL: If email fails, delete the user so they can try again with a valid email
            await prisma.user.delete({ where: { id: user.id } });

            // Return detailed error for debugging (simplify for production later if needed)
            return res.status(500).json({
                message: 'Failed to send verification email. Please check server logs.',
                error: emailError.message
            });
        }

    } catch (error) {
        console.error("Signup Error:", error);
        res.status(500).json({ message: 'Server error during signup', error: error.message });
    }
});

// Verify Email Route
router.post('/verify-email', async (req, res) => {
    const { email, otp } = req.body;
    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return res.status(404).json({ message: 'User not found' });

        if (user.isVerified) {
            return res.status(400).json({ message: 'Email already verified' });
        }

        if (user.verificationToken !== otp) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        await prisma.user.update({
            where: { email },
            data: {
                isVerified: true,
                verificationToken: null,
                verificationTokenExpiry: null
            }
        });

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, user: { id: user.id, email: user.email } });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        if (!user.isVerified) {
            return res.status(403).json({ message: 'Please verify your email first' });
        }

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, user: { id: user.id, email: user.email } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Forgot Password - Request OTP
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

        await prisma.user.update({
            where: { email },
            data: {
                resetToken: otp,
                resetTokenExpiry: expiry
            }
        });

        // Send Email using Nodemailer
        const mailOptions = {
            from: process.env.EMAIL_USER, // Sender address
            to: email, // Receiver address
            subject: 'Password Reset OTP - TaskFlow',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
                    <h2 style="color: #c026d3; text-align: center;">Password Reset Request</h2>
                    <p style="color: #333;">Hello,</p>
                    <p style="color: #333;">You requested to reset your password for TaskFlow. Use the code below to proceed:</p>
                    <div style="background-color: #fce7f3; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0;">
                        <span style="font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #db2777;">${otp}</span>
                    </div>
                    <p style="color: #333;">This code is valid for 10 minutes.</p>
                    <p style="color: #666; font-size: 12px; margin-top: 30px;">If you didn't request this, please ignore this email.</p>
                </div>
            `
        };

        try {
            await transporter.sendMail(mailOptions);
            console.log(`Email sent successfully to ${email}`);
        } catch (emailError) {
            console.error('Error sending email:', emailError);
            // Fallback for development/testing if email fails
            console.log('================================================');
            console.log(`FALLBACK OTP for ${email}: ${otp}`);
            console.log('================================================');

            // Return detailed error to client for debugging
            return res.status(500).json({
                message: 'Failed to send OTP email',
                error: emailError.message
            });
        }

        res.json({ message: 'OTP sent to your email' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Reset Password - Verify OTP and Set New Password
router.post('/reset-password', async (req, res) => {
    const { email, otp, newPassword } = req.body;
    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return res.status(404).json({ message: 'User not found' });

        if (user.resetToken !== otp) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        if (new Date() > new Date(user.resetTokenExpiry)) {
            return res.status(400).json({ message: 'OTP has expired' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await prisma.user.update({
            where: { email },
            data: {
                password: hashedPassword,
                resetToken: null,
                resetTokenExpiry: null
            }
        });

        res.json({ message: 'Password reset successful' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
