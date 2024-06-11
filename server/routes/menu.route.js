// import modules
const router = require('express').Router();
const upload = require('../auth/upload.auth');
const userAuth = require('../auth/users.auth');
const {
    getAllMenuItems,
    getMenuItemById,
    getMenuItemByVendorId,
    insertMenuItem,
    updateMenuItem,
    deleteMenuItemById
} = require('../controllers/menu.controller');

// routes
router.get('/', getAllMenuItems);
router.get('/:id', getMenuItemById);
router.get('/vendor/:id', getMenuItemByVendorId);
router.post('/', userAuth, insertMenuItem);
router.put('/', userAuth, upload, updateMenuItem);
router.delete('/:id', userAuth, deleteMenuItemById);

// export module
module.exports = router;