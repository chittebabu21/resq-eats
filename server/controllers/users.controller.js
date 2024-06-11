// import modules
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { 
        getAllUsers, 
        getUserById, 
        getUserByEmail, 
        getUserByVerificationToken,
        insertUser, 
        updateUser, 
        deleteUserById, 
        verifyPassword
} = require('../services/users.service');
const bodyParser = require('body-parser');

// configurations
dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'Hotmail',
    auth: {
        user: 'babu@ednovation.com',
        pass: 'Soundsofunity@21'
    }
});

// controller module object
module.exports = {
    getAllUsers: (req, res) => {
        getAllUsers((error, results) => {
            if (error) {
                return res.status(500).json({
                    success: 0,
                    message: 'Failed to retrieve users...'
                });
            } else {
                return res.status(200).json({
                    success: 1,
                    data: results
                });
            }
        })
    },
    getUserById: (req, res) => {
        const id = req.params.id;

        getUserById(id, (error, results) => {
            if (error) {
                return res.status(400).json({
                    success: 0,
                    message: 'Failed to retrieve user data...'
                });
            } else if (!results) {
                return res.status(500).json({
                    success: 0,
                    message: 'User not found...'
                });
            } else {
                return res.status(200).json({
                    success: 1,
                    data: results
                });
            }
        });
    },
    getUserByEmail: (req, res) => {
        const email = req.query.email;

        getUserByEmail(email, (error, results) => {
            if (error) {
                return res.status(400).json({
                    success: 0,
                    message: 'Failed to retrieve user data...'
                });
            } else if (!results) {
                return res.status(500).json({
                    success: 0,
                    message: 'User not found...'
                });
            } else {
                return res.status(200).json({
                    success: 1,
                    data: results
                });
            }
        });
    },
    insertUser: (req, res) => {
        // request body
        const body = req.body;

        if (!body.username) {
            return res.status(500).json({
                success: 0,
                message: 'Username is required...'
            });
        } else if (!body.email_address) {
            return res.status(500).json({
                success: 0,
                message: 'Email address is required...'
            });
        } else if (!body.password_hash) {
            return res.status(500).json({
                success: 0,
                message: 'Password is required...'
            });
        }

        // insert new user
        insertUser(body, (error, results) => {
            if (error) {
                console.log(`Insert user error: ${error}`);
                return res.status(400).json({
                    success: 0,
                    message: 'Failed to insert new user...'
                });
            } else if (results.user_found) {
                return res.status(500).json({
                    success: 0,
                    message: 'User already exists...'
                });
            } else {
                return res.status(200).json({
                    success: 1,
                    message: 'User created successfully!'
                });
            }
        });
    },
    updateUser: (req, res) => {
        // get request body 
        const body = req.body;

        if (!body.email_address) {
            return res.status(500).json({
                success: 0,
                message: 'Email address is required'
            });
        }

        if (req.file) {
            const imageUrl = req.file.filename;
            body.image_url = imageUrl;
        } 

        updateUser(body, (error, results) => {
            if (error) {
                return res.status(400).json({
                    success: 0,
                    message: 'Failed to update user...'
                });
            } else {
                return res.status(200).json({
                    success: 1,
                    data: results
                });
            }
        });
    },
    deleteUserById: (req, res) => {
        // get id from params
        const id = req.params.id;

        // check if user exists 
        getUserById(id, (error, results) => {
            if (error) {
                return res.status(400).json({
                    success: 0,
                    message: 'Failed to retrieve user...'
                });
            } else if (!results) {
                return res.status(500).json({
                    success: 0,
                    message: 'User not found...'
                });
            } else {
                deleteUserById(id, (error, results) => {
                    if (error) {
                        return res.status(400).json({
                            success: 0,
                            message: 'Failed to delete user...'
                        });
                    } else {
                        return res.status(200).json({
                            success: 1,
                            message: 'User deleted successfully!'
                        });
                    }
                });
            }
        });
    },
    login: (req, res) => {
        // get request body
        const body = req.body;

        verifyPassword(body.email_address, body.password_hash, (error, passwordMatch) => {
            if (error) {
                return res.status(400).json({
                    success: 0,
                    message: 'Failed to verify user...'
                });
            } else if (!passwordMatch) {
                return res.status(500).json({
                    success: 0,
                    message: 'Invalid email address or password...'
                });
            } else {
                const token = jwt.sign(body, process.env.JWT_KEY, {
                    expiresIn: '24h'
                });

                return res.status(200).json({
                    success: 1,
                    token: token
                });
            }
        });
    },
    sendResetPasswordLink: (req, res) => {
        // get request body
        const body = req.body;

        if (!body.email_address) {
            return res.status(500).json({
                success: 0,
                message: 'Email address is required...'
            });
        }

        getUserByEmail(body.email_address, (error, results) => {
            if (error) {
                return res.status(400).json({
                    success: 0,
                    message: 'Failed to retrieve user...'
                });
            } else if (!results) {
                return res.status(500).json({
                    success: 0,
                    message: 'User not found...'
                });
            } else {
                const resetPasswordToken = crypto.randomBytes(20).toString('hex');

                // call update user method
                updateUser({ email_address: results.email_address, reset_password_token: resetPasswordToken }, (error, results) => {
                    if (error) {
                        return res.status(500).json({
                            success: 0,
                            message: 'Failed to update password reset token...'
                        });
                    } else {
                        // define reset password link
                        const resetPasswordLink = `http://localhost:4000/resq-eats/reset-password/${resetPasswordToken}`;

                        // message to be sent
                        const message = `
                            <h1>ResQ Eats</h1>
                            <p>Click on the link below to reset your password</p>
                            <a href="${resetPasswordLink}">${resetPasswordLink}</a>
                        `;

                        transporter.sendMail({
                            from: 'babu@ednovation.com',
                            to: body.email_address,
                            subject: 'Reset Password Request',
                            html: message
                        }, (error, info) => {
                            if (error) {
                                return res.status(400).json({
                                    success: 0,
                                    message: 'Failed to send reset password link...'
                                });
                            } else {
                                return res.status(200).json({
                                    success: 1,
                                    message: `Reset password link sent to ${body.email_address} successfully!`,
                                    info: info
                                });
                            }
                        });
                    }
                });
            }
        });
    },
    sendVerificationLink: (req, res) => {
        const body = req.body;

        if (!body.email_address) {
            return res.status(500).json({
                success: 0,
                message: 'Email address is required...'
            });
        }

        getUserByEmail(body.email_address, (error, results) => {
            if (error) {
                return res.status(400).json({
                    success: 0,
                    message: 'Failed to retrieve user...'
                });
            } else if (!results) {
                return res.status(500).json({
                    success: 0,
                    message: 'User not found...'
                });
            } else {
                const verificationToken = crypto.randomBytes(20).toString('hex');

                updateUser({ email_address: results.email_address, verification_token: verificationToken }, (error, results) => {
                    if (error) {
                        return res.status(400).json({
                            success: 0,
                            message: 'Failed to update user...'
                        });
                    } else {
                        const verificationLink = `http://localhost:4000/resq-eats/verify-email/${verificationToken}`;

                        const message = `
                            <h1>ResQ Eats</h1>
                            <p>Click on the link below to verify your email</p>
                            <a href="${verificationLink}">${verificationLink}</a>
                        `;

                        transporter.sendMail({
                            from: 'babu@ednovation.com',
                            to: body.email_address,
                            subject: 'Email Verification Request',
                            html: message
                        }, (error, info) => {
                            if (error) {
                                return res.status(400).json({
                                    success: 0,
                                    message: 'Failed to send verification email...'
                                });
                            } else {
                                return res.status(200).json({
                                    success: 1,
                                    message: `Verification link sent to ${body.email_address} successfully!`,
                                    info: info
                                });
                            }
                        });
                    }
                });
            }
        });
    },
    updatePassword: (req, res) => {
        // get request body
        const body = req.body;

        if (!body.email_address) {
            return res.status(500).json({
                success: 0,
                message: 'Invalid form submission...'
            });
        }

        bcrypt.hash(body.password_hash, 10, (error, hash) => {
            if (error) {
                return res.status(500).json({
                    success: 0,
                    message: 'Failed to hash password...'
                });
            } else {
                body.password_hash = hash;
                updateUser(body, (error, results) => {
                    if (error) {
                        return res.status(400).json({
                            success: 0,
                            message: 'Failed to update password'
                        });
                    } else {
                        return res.status(200).json({
                            success: 1,
                            message: 'Password updated successfully!'
                        });
                    }
                });
            }
        });
    },
    verifyEmail: (req, res) => {
        const token = req.params.token;

        getUserByVerificationToken(token, (error, results) => {
            if (error) {
                return res.status(400).json({
                    success: 0,
                    message: 'Failed to retrieve user...'
                });
            } else if (!results) {
                return res.status(500).json({
                    success: 0,
                    message: 'Invalid verification token...'
                });
            } else {
                const body = {
                    email_address: results.email_address,
                    is_verified: 1,
                    verification_token: null // clear the token once verified
                }

                updateUser(body, (error, results) => {
                    if (error) {
                        return res.status(400).json({
                            success: 0,
                            message: 'Failed to verify email...'
                        });
                    } else {
                        return res.status(200).json({
                            success: 1,
                            message: 'Email verified successfully!'
                        });
                    }
                });
            }
        });
    } 
}