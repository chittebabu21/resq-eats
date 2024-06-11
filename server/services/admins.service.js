// import modules
const pool = require('../dao/dao');

// export serivce module
module.exports = {
    getAllAdmins: callback => {
        pool.query('SELECT * FROM admins', [], (error, results, fields) => {
            if (error) {
                return callback(error);
            } else {
                return callback(null, results);
            }
        });
    },
    getAdminById: (id, callback) => {
        pool.query('SELECT * FROM admins INNER JOIN users ON admins.user_id = users.user_id WHERE admin_id = ?', [id], (error, results, fields) => {
            if (error) {
                return callback(error);
            } else {
                return callback(null, results[0]);
            }
        });
    },
    insertAdmin: (data, callback) => {
        pool.query('INSERT INTO admins SET ?', [data], (error, results, fields) => {
            if (error) {
                return callback(error);
            } else {
                return callback(null, results);
            }
        });
    },
    updateAdminById: (data, id, callback) => {
        pool.query('UPDATE admins SET ? WHERE admin_id = ?', [data, id], (error, results, fields) => {
            if (error) {
                return callback(error);
            } else {
                return callback(null, results);
            }
        });
    },
    deleteAdminById: (id, callback) => {
        pool.query('DELETE FROM admins WHERE admin_id = ?', [id], (error, results, fields) => {
            if (error) {
                return callback(error);
            } else {
                return callback(null, results[0]);
            }
        });
    }
}