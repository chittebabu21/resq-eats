// import modules
const pool = require('../dao/dao');

// export service module
module.exports = {
    getAllOrders: callback => {
        pool.query('SELECT * FROM orders', [], (error, results, fields) => {
            if (error) {
                return callback(error);
            } else {
                return callback(null, results);
            }
        });
    },
    getOrderById: (id, callback) => {
        pool.query('SELECT * FROM orders WHERE order_id = ?', [id], (error, results, fields) => {
            if (error) {
                return callback(error);
            } else {
                return callback(null, results[0]);
            }
        });
    },
    getOrdersByUserId: (id, callback) => {
        pool.query('SELECT * FROM orders INNER JOIN users ON orders.user_id = users.user_id WHERE orders.user_id = ?', [id], (error, results, fields) => {
            if (error) {
                return callback(error);
            } else {
                return callback(null, results);
            }
        });
    },
    getOrderWithOrderDetails: (id, callback) => {
        pool.query('SELECT * FROM orders INNER JOIN order_details ON orders.order_id = order_details.order_id WHERE orders.order_id = ?', [id], (error, results, fields) => {
            if (error) {
                return callback(error);
            } else {
                return callback(null, results[0]);
            }
        });
    },
    insertOrder: (data, callback) => {
        pool.query('INSERT INTO orders SET ?', [data], (error, results, fields) => {
            if (error) {
                return callback(error);
            } else {
                return callback(null, results);
            }
        });
    },
    updateOrder: (data, callback) => {
        pool.query('UPDATE orders SET ? WHERE order_id = ?', [data, data.order_id], (error, results, fields) => {
            if (error) {
                return callback(error);
            } else {
                return callback(null, results);
            }
        });
    },
    deleteOrderById: (id, callback) => {
        pool.query('DELETE FROM orders WHERE order_id = ?', [id], (error, results, fields) => {
            if (error) {
                return callback(error);
            } else {
                return callback(null, results);
            }
        });
    }
}