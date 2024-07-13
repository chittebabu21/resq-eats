// import modules
const pool = require('../dao/dao');

// export service module
module.exports = {
    getAllVendors: (callback) => {
        pool.query('SELECT * FROM vendors', [], (error, results, fields) => {
            if (error) {
                return callback(error);
            } else {
                return callback(null, results);
            }
        });
    },
    getVendorById: (id, callback) => {
        pool.query('SELECT * FROM vendors WHERE vendor_id = ?', [id], (error, results, fields) => {
            if (error) {
                return callback(error);
            } else {
                return callback(null, results[0]);
            }
        });
    },
    getVendorByUserId: (id, callback) => {
        pool.query('SELECT * FROM vendors INNER JOIN users ON vendors.user_id = users.user_id WHERE vendors.user_id = ?', [id], (error, results, fiedls) => {
            if (error) {
                return callback(error);
            } else {
                return callback(null, results[0]);
            }
        });
    },
    insertVendor: (data, callback) => {
        pool.query('INSERT INTO vendors SET ?', [data], (error, results, fields) => {
            if (error) {
                return callback(error);
            } else {
                return callback(null, results);
            }
        });
    },
    updateVendorById: (data, id, callback) => {
        pool.query('UPDATE vendors SET ? WHERE vendor_id = ?', [data, id], (error, results, fields) => {
            if (error) {
                return callback(error);
            } else {
                return callback(null, results);
            }
        });
    },
    deleteVendorById: (id, callback) => {
        pool.query('DELETE FROM vendors WHERE vendor_id = ?', [id], (error, results, fields) => {
            if (error) {
                return callback(error);
            } else {
                return callback(null, results[0]);
            }
        });
    }
}