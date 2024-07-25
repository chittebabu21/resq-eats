// import modules
const router = require('express').Router();
const userAuth = require('../auth/users.auth');
const uploadVendor = require('../auth/upload_vendor.auth');
const {
    getAllVendors,
    getVendorById,
    getVendorByUserId,
    insertVendor,
    updateVendorById,
    deleteVendorById
} = require('../controllers/vendors.controller');

// routes
router.get('/', getAllVendors);
router.get('/:id', getVendorById);
router.get('/user/:id', userAuth, getVendorByUserId);
router.post('/', userAuth, insertVendor);
router.put('/:id', userAuth, uploadVendor, updateVendorById);
router.delete('/:id', userAuth, deleteVendorById);

// export router modules
module.exports = router;