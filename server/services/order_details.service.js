// import pool 
const pool = require('../dao/dao');

// export service module
module.exports = {
    getOrderDetailsByFoodId: (id, callback) => {
        pool.query('SELECT * FROM order_details INNER JOIN menu ON order_details.food_id = menu.food_id WHERE order_details.food_id = ?', [id], (error, results, fields) => {
            if (error) {
                return callback(error);
            } else {
                return callback(null, results[0]);
            }
        });
    },
    insertOrderDetail: (data, callback) => {
        pool.query('INSERT INTO order_details SET ?', [data], (error, results, fields) => {
            if (error) {
                return callback(error);
            } else {
                return callback(null, results);
            }
        });
    },
    deleteOrderDetailById: (id, callback) => {
        pool.query('DELETE FROM order_details WHERE order_detail_id = ?', [id], (error, results, fields) => {
            if (error) {
                return callback(error);
            } else {
                return callback(null, results);
            }
        });
    }
}