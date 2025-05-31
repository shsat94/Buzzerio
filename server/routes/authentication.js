//imports
const express = require('express');
const router = express.Router();
const User = require('../database/schema/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const fetchUser = require('../middleware/fetchuser');
const { OAuth2Client } = require('google-auth-library');

//environment variables
const secretKey = process.env.JWT_AUTHENTICATION_KEY;
const nodemailerEmail = process.env.ADMIN_EMAIL;
const nodemailerPassword = process.env.NODEMAILER_PASSWORD;
const nodemailerPort = process.env.NODEMAILER_PORT;
const googleClientId = process.env.GOOGLE_CLIENT_ID;

// Initialize Google OAuth2 client
const client = new OAuth2Client(googleClientId);

// Google Sign-in/Sign-up route
router.post('/google-auth', async (req, res) => {
    let execution = true;
    try {
        const { credential } = req.body; // This is the JWT token from Google
        
        if (!credential) {
            return res.status(400).json({ 
                execution: false, 
                error: 'Google credential is required' 
            });
        }

        // Verify the Google token
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: googleClientId,
        });

        const payload = ticket.getPayload();
        const { sub: googleId, email, name, picture } = payload;

        if (!email || !name) {
            return res.status(400).json({ 
                execution: false, 
                error: 'Invalid Google token payload' 
            });
        }

        // Check if user already exists
        let user = await User.findOne({ email: email });
        let isNewUser = false;

        if (!user) {
            // Create new user for Google sign-up
            user = await User.create({
                name: name,
                email: email,
                password: null, // No password for Google users
                googleId: googleId,
                profilePicture: picture,
                authProvider: 'google'
            });
            isNewUser = true;
        } else {
            // Update existing user with Google info if not already present
            if (!user.googleId) {
                user.googleId = googleId;
                user.profilePicture = picture;
                user.authProvider = user.authProvider || 'google';
                await user.save();
            }
        }

        // Generate JWT token
        const data = {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                authProvider: user.authProvider
            }
        };
        const authenticationToken = jwt.sign(data, secretKey);

        res.status(200).json({
            execution,
            authenticationToken,
            isNewUser,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                profilePicture: user.profilePicture,
                authProvider: user.authProvider
            }
        });

    } catch (error) {
        execution = false;
        console.error('Google Auth Error:', error);
        res.status(500).json({ 
            execution, 
            error: 'Google authentication failed' 
        });
    }
});

// Regular signup route (existing)
router.post('/signup', async (req, res) => {
    let execution = true;
    try {
        let userisPresent = false;
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            userisPresent = true;
            return res.status(422).json({ userisPresent });
        }

        //password hashing 
        const salt = await bcrypt.genSalt(10);
        const securePassword = await bcrypt.hash(req.body.password, salt);
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: securePassword,
            authProvider: 'local'
        });

        const data = {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                authProvider: user.authProvider
            }
        };
        const authenticationToken = jwt.sign(data, secretKey);
        res.status(200).json({ userisPresent, execution, authenticationToken });

    } catch (error) {
        execution = false;
        console.error(error);
        res.status(500).json({ execution });
    }
});

// Regular signin route (existing)
router.post('/signin', async (req, res) => {
    let execution = true;
    try {
        let login = true;
        let user = await User.findOne({ email: req.body.email });
        if (!user) {
            login = false;
            return res.status(404).json({ login });
        }

        // Check if user signed up with Google
        if (user.authProvider === 'google' && !user.password) {
            return res.status(422).json({ 
                login: false, 
                error: 'Please sign in with Google for this account' 
            });
        }

        const comparePassword = await bcrypt.compare(req.body.password, user.password);
        if (!comparePassword) {
            login = false;
            return res.status(422).json({ login });
        }

        const data = {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                authProvider: user.authProvider
            }
        };
        const authenticationToken = jwt.sign(data, secretKey);
        res.status(200).json({ execution, login, authenticationToken });

    } catch (error) {
        execution = false;
        res.status(500).json({ execution });
    }
});

// Link Google account to existing local account
router.post('/link-google', fetchUser, async (req, res) => {
    let execution = true;
    try {
        const { credential } = req.body;
        
        if (!credential) {
            return res.status(400).json({ 
                execution: false, 
                error: 'Google credential is required' 
            });
        }

        // Verify the Google token
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: googleClientId,
        });

        const payload = ticket.getPayload();
        const { sub: googleId, picture } = payload;

        // Update current user with Google info
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ 
                execution: false, 
                error: 'User not found' 
            });
        }

        user.googleId = googleId;
        user.profilePicture = picture;
        if (!user.authProvider || user.authProvider === 'local') {
            user.authProvider = 'both'; // User can sign in with both methods
        }
        await user.save();

        res.status(200).json({
            execution,
            message: 'Google account linked successfully',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                profilePicture: user.profilePicture,
                authProvider: user.authProvider
            }
        });

    } catch (error) {
        execution = false;
        console.error('Link Google Error:', error);
        res.status(500).json({ 
            execution, 
            error: 'Failed to link Google account' 
        });
    }
});

//send otp to email (existing)
router.post('/sendotptomail', async (req, res) => {
    let execution = true;
    try {
        let userisPresent = true;
        let user = await User.findOne({ email: req.body.email });
        if (!user) {
            userisPresent = false;
        }
        const generatedEmailOtp = Math.floor(100000 + Math.random() * 900000);
        const transporter = nodemailer.createTransporter({
            service: 'gmail',
            secure: false,
            port: nodemailerPort,
            auth: {
                user: nodemailerEmail,
                pass: nodemailerPassword
            }
        });

        const htmlTemplate = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Email Verification</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: Arial, sans-serif;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; padding: 40px 0;">
                <tr>
                    <td align="center">
                        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                            <tr>
                                <td style="padding: 40px; text-align: center; background: linear-gradient(135deg, #667eea, #764ba2); color: #ffffff;">
                                    <h1 style="margin: 0; font-size: 28px;">Verify Your Email</h1>
                                    <p style="margin: 8px 0 0;">for Buzzerio</p>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 40px; text-align: center;">
                                    <p style="font-size: 16px; color: #475569;">
                                        Hello,<br><br>
                                        To complete your account verification for <strong>Buzzerio</strong>, please use the following one-time password (OTP). This helps ensure the security of your account.
                                    </p>
                                    <div style="margin: 32px 0;">
                                        <span style="display: inline-block; font-size: 36px; font-weight: bold; color: #1e293b; letter-spacing: 10px; padding: 20px 30px; border: 2px dashed #cbd5e1; border-radius: 8px; background-color: #f1f5f9;">
                                            ${generatedEmailOtp}
                                        </span>
                                        <div style="margin-top: 8px; font-size: 12px; color: #94a3b8;">
                                            Your verification code
                                        </div>
                                    </div>
                                    <p style="font-size: 14px; color: #64748b;">
                                        This code will expire in 10 minutes. Please do not share this code with anyone.
                                    </p>
                                    <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; margin-top: 30px; text-align: left;">
                                        <strong style="color: #b45309;">Security Tip:</strong><br />
                                        Velociraptor Industries will never ask for your OTP. If someone does, report it immediately.
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 32px; background-color: #f8fafc; text-align: center; border-top: 1px solid #e2e8f0;">
                                    <p style="font-size: 13px; color: #64748b;">
                                        Need help? Reach out to us at <a href="mailto:velociraptorindustires.home@gmail.com" style="color: #667eea; text-decoration: none;">velociraptorindustires.home@gmail.com</a>
                                    </p>
                                    <p style="font-size: 12px; color: #94a3b8;">
                                        © 2025 Velociraptor Industries. All rights reserved.
                                    </p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </body>
        </html>`;

        const reciever = {
            from: nodemailerEmail,
            to: `${req.body.email}`,
            subject: "Verification for reseting the password of buzzerio",
            html: htmlTemplate
        }
        let errorinOTP = false;
        transporter.sendMail(reciever, (error, info) => {
            if (error) {
                console.error(error);
                errorinOTP = true;
                res.status(500).json({ errorinOTP });
            } else {
                res.status(200).json({ generatedEmailOtp, userisPresent });
            }
        });
    } catch (error) {
        execution = false;
        res.status(500).json({ execution });
    }
});

//reset password (existing)
router.put('/resetpassword', async (req, res) => {
    let execution = true;
    try {
        let updation = false;
        const salt = await bcrypt.genSalt(10);
        const securePass = await bcrypt.hash(req.body.password, salt);

        let user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).json({ 
                execution: false, 
                error: 'User not found' 
            });
        }

        let newUser = {
            name: user.name,
            email: req.body.email,
            mobileNo: user.mobileNo,
            password: securePass
        }
        user = await User.findOneAndUpdate({ email: req.body.email }, { $set: newUser }, { new: true });
        updation = true;
        res.status(200).json({ execution, updation });
    } catch (error) {
        execution = false;
        console.error(error);
        res.status(500).json({ execution });
    }
});

//user details (existing)
router.get('/getuserdetail', fetchUser, async (req, res) => {
    let execution = true;
    try {
        const user = await User.findOne({ email: req.user.email });
        res.status(200).json({ execution, user });
    } catch (error) {
        execution = false;
        console.error(error);
        res.status(500).json({ execution });
    }
});

module.exports = router;