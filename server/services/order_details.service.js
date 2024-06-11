// import pool 
const pool = require('../dao/dao');

// export service module
module.exports = {
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