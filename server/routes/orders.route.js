// import modules
const router = require('express').Router();
const userAuth = require('../auth/users.auth');
const {
    getAllOrders,
    getOrderById,
    getOrdersByUserId,
    getOrderWithOrderDetails,
    insertOrderWithOrderDetails,
    updateOrder,
    deleteOrderAndOrderDetailsByOrderId
} = require('../controllers/orders.controller');

// routes 
router.get('/', userAuth, getAllOrders);
router.get('/:id', userAuth, getOrderById);
router.get('/user/:id', userAuth, getOrdersByUserId);
router.get('/order-details/:id', userAuth, getOrderWithOrderDetails);
router.post('/', userAuth, insertOrderWithOrderDetails);
router.put('/', userAuth, updateOrder);
router.delete('/:id', userAuth, deleteOrderAndOrderDetailsByOrderId);

// export router module
module.exports = router;