// import modules
const router = require('express').Router();
const userAuth = require('../auth/users.auth');
const upload = require('../auth/upload.auth');
const { 
    getAllUsers, 
    getUserById, 
    getUserByEmail, 
    insertUser, 
    updateUser, 
    deleteUserById, 
    login, 
    sendResetPasswordLink, 
    sendVerificationLink, 
    updatePassword, 
    verifyEmail 
} = require('../controllers/users.controller');

// routes
router.get('/', getAllUsers);
router.get('/:id', userAuth, getUserById);
router.get('/', getUserByEmail);
router.get('/verify-email/:token', verifyEmail);
router.post('/', insertUser);
router.post('/login', login);
router.post('/verify-email-request', sendVerificationLink);
router.post('/reset-password-request', sendResetPasswordLink);
router.put('/', userAuth, upload, updateUser);
router.put('/update-password', updatePassword);
router.delete('/:id', userAuth, deleteUserById);

// export router module
module.exports = router;