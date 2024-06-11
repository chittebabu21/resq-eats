// import modules
const {
    getAllOrders,
    getOrderById,
    getOrderWithOrderDetails,
    insertOrder,
    updateOrder,
    deleteOrderById
} = require('../services/orders.service');
const { insertOrderDetail, deleteOrderDetailById } = require('../services/order_details.service');
const { getMenuItemById, updateMenuItem } = require('../services/menu.service');

// export controller modules
module.exports = {
    getAllOrders: (req, res) => {
        getAllOrders((error, results) => {
            if (error) {
                return res.status(400).json({
                    success: 0,
                    message: 'Failed to retrieve all orders...'
                });
            } else {
                return res.status(200).json({
                    success: 1,
                    data: results
                });
            }
        });
    },
    getOrderById: (req, res) => {
        const id = req.params.id;

        getOrderById(id, (error, results) => {
            if (error) {
                return res.status(400).json({
                    success: 0,
                    message: 'Failed to retrieve order...'
                });
            } else if (!results) {
                return res.status(500).json({
                    success: 0,
                    message: 'Order not found...'
                });
            } else {
                return res.status(200).json({
                    success: 1,
                    data: results
                });
            }
        });
    }, 
    getOrderWithOrderDetails: (req, res) => {
        const id = req.params.id;

        getOrderWithOrderDetails(id, (error, results) => {
            if (error) {
                return res.status(400).json({
                    success: 0,
                    message: 'Failed to retrieve order with oreder details...'
                });
            } else if (!results) {
                return res.status(500).json({
                    success: 0,
                    message: 'Failed to retrieve order with order details...'
                });
            } else {
                return res.status(200).json({
                    success: 1,
                    data: results
                });
            }
        });
    },
    insertOrderWithOrderDetails: (req, res) => {
        const body = req.body;
        const userId = body.user_id;
        const foodId = body.food_id;
        const quantity = body.quantity;

        if (!body.user_id || !body.food_id || !body.quantity) {
            return res.status(500).json({
                success: 0,
                message: 'All fields are required...'
            });
        }

        getMenuItemById(foodId, (error, results) => {
            if (error) {
                return res.status(400).json({
                    success: 0,
                    message: 'Failed to retrieve menu item...'
                });
            } else if (!results) {
                return res.status(500).json({
                    success: 1,
                    message: 'Menu item not found...'
                });
            } else {
                const amountPaid = results.price * quantity;

                insertOrder({ amount_paid: amountPaid, user_id: userId }, (error, results) => {
                    if (error) {
                        return res.status(400).json({
                            success: 0,
                            message: 'Failed to insert order...'
                        });
                    } else {
                        const orderId = results.insertId;
        
                        insertOrderDetail({ order_id: orderId, food_id: foodId, quantity: quantity }, (error, results) => {
                            if (error) {
                                return res.status(400).json({
                                    success: 0,
                                    message: 'Failed to insert order details...'
                                });
                            } else {
                                getMenuItemById(foodId, (error, results) => {
                                    if (error) {
                                        return res.status(400).json({
                                            success: 0,
                                            message: 'Failed to retrieve menu item...'
                                        });
                                    } else {
                                        const balance = results.quantity - quantity;
        
                                        updateMenuItem({ food_id: foodId, quantity: balance }, (error, results) => {
                                            if (error) {
                                                return res.status(400).json({
                                                    success: 0,
                                                    message: 'Failed to update menu item...'
                                                });
                                            } else {
                                                getOrderWithOrderDetails(orderId, (error, results) => {
                                                    if (error) {
                                                        return res.status(400).json({
                                                            success: 0,
                                                            message: 'Failed to retrieve order with oreder details...'
                                                        });
                                                    } else {
                                                        return res.status(200).json({
                                                            success: 1,
                                                            data: results
                                                        });
                                                    }
                                                });
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            }
        }); 
    },
    updateOrder: (req, res) => {
        const body = req.body;

        if (!body.order_id) {
            return res.status(500).json({
                success: 0,
                message: 'Order ID is required...'
            });
        }

        updateOrder(body, (error, results) => {
            if (error) {
                return res.status(400).json({
                    success: 0,
                    message: 'Failed to update order...'
                });
            } else {
                return res.status(200).json({
                    success: 1,
                    data: results
                });
            }
        });
    },
    deleteOrderAndOrderDetailsByOrderId: (req, res) => {
        const id = req.params.id;

        // get order and details by id
        getOrderWithOrderDetails(id, (error, results) => {
            if (error) {
                return res.status(400).json({
                    success: 0,
                    message: 'Failed to retrieve order with oreder details...'
                });
            } else if (!results) {
                return res.status(500).json({
                    success: 0,
                    message: 'Failed to retrieve order with order details...'
                });
            } else {
                const orderDetailId = results.order_detail_id;

                deleteOrderDetailById(orderDetailId, (error, results) => {
                    if (error) {
                        return res.status(400).json({
                            success: 0,
                            message: 'Failed to delete order detail...'
                        });
                    } else {
                        deleteOrderById(id, (error, results) => {
                            if (error) {
                                return res.status(400).json({
                                    success: 0,
                                    message: 'Failed to delete order...'
                                }); 
                            } else {
                                return res.status(200).json({
                                    success: 1,
                                    message: 'Order and order details deleted successfully!'
                                });
                            }
                        });
                    }
                });
            }
        });
    }
}