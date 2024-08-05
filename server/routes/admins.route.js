// import modules 
const router = require('express').Router();
const userAuth = require('../auth/users.auth');
const {
    getAllAdmins,
    getAdminById,
    getAdminByUserId,
    insertAdmin,
    deleteAdminById
} = require('../controllers/admins.controller');

// routes
router.get('/', userAuth, getAllAdmins);
router.get('/:id', userAuth, getAdminById);
router.get('/user/:id', getAdminByUserId);
router.post('/', userAuth, insertAdmin);
router.delete('/:id', userAuth, deleteAdminById);

// export router module
module.exports = router;