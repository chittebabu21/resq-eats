// import modules
const pool = require('../dao/dao');

// export service module
module.exports = {
    getAllMenuItems: callback => {
        pool.query('SELECT * FROM menu', [], (error, results, fields) => {
            if (error) {
                return callback(error);
            } else {
                return callback(null, results);
            }
        });
    },
    getMenuItemById: (id, callback) => {
        pool.query('SELECT * FROM menu WHERE food_id = ?', [id], (error, results, fields) => {
            if (error) {
                return callback(error);
            } else {
                return callback(null, results[0]);
            }
        });
    },
    getMenuItemByVendorId: (id, callback) => {
        pool.query('SELECT * FROM menu INNER JOIN vendors ON menu.vendor_id = vendors.vendor_id WHERE menu.vendor_id = ?', [id], (error, results, fields) => {
            if (error) {
                return callback(error);
            } else {
                return callback(null, results);
            }
        });
    },
    insertMenuItem: (data, callback) => {
        pool.query('INSERT INTO menu SET ?', [data], (error, results, fields) => {
            if (error) {
                return callback(error);
            } else {
                return callback(null, results);
            }
        });
    },
    updateMenuItem: (data, callback) => {
        pool.query('UPDATE menu SET ? WHERE food_id = ?', [data, data.food_id], (error, results, fields) => {
            if (error) {
                return callback(error);
            } else {
                return callback(null, results);
            }
        });
    },
    deleteMenuItemById: (id, callback) => {
        pool.query('DELETE FROM menu WHERE food_id = ?', [id], (error, results, fields) => {
            if (error) {
                return callback(error);
            } else {
                return callback(null, results);
            }
        });
    }
}