// import modules
const { verify } = require('jsonwebtoken');
const dotenv = require('dotenv');

// configure dotenv
dotenv.config();

// export auth module
module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;

    console.log(authHeader);

    if (!authHeader) {
        return res.status(400).json({
            success: 0,
            message: 'Access denied...'
        });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
        return res.status(500).json({
            success: 0,
            message: 'Invalid token...'
        });
    }

    try {
        const decoded = verify(token, process.env.JWT_KEY);
        req.data = decoded.user;
        next();
    } catch (error) {
        return res.status(400).json({
            success: 0,
            message: 'Error in decoding the token...'
        });
    }
}