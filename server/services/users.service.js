// import modules
const bcrypt = require('bcrypt');
const pool = require('../dao/dao');

// service module object
module.exports = {
    getAllUsers: callback => {
        pool.query('SELECT * FROM users', [], (error, results, fields) => {
            if (error) {
                return callback(error);
            } else {
                return callback(null, results);
            }
        });
    },
    getUserById: (id, callback) => {
        pool.query('SELECT * FROM users WHERE user_id = ?', [id], (error, results, fields) => {
            if (error) {
                return callback(error);
            } else {
                return callback(null, results[0]);
            }
        });
    },
    getUserByEmail: (email, callback) => {
        pool.query('SELECT * FROM users WHERE email_address = ?', [email], (error, results, fields) => {
            if (error) {
                return callback(error);
            } else {
                return callback(null, results[0]);
            }
        });
    },
    getUserByVerificationToken: (token, callback) => {
        pool.query('SELECT * FROM users WHERE verification_token = ?', [token], (error, results, fields) => {
            if (error) {
                return callback(error);
            } else {
                return callback(null, results[0]);
            }
        });
    },
    insertUser: (data, callback) => {
        pool.query('SELECT * FROM users WHERE email_address = ?', [data.email_address], (error, results, fields) => {
            if (error) {
                return callback(error);
            } else if (results.length > 0) {
                results.user_found = true;
                return callback(results);
            } else {
                // hash the password
                bcrypt.hash(data.password_hash, 10, (error, hash) => {
                    if (error) {
                        return callback(error);
                    } else {
                        if (hash) {
                            // store the hashed password
                            data.password_hash = hash;

                            // insert into database
                            pool.query('INSERT INTO users SET ?', [data], (error, results, fields) => {
                                if (error) {
                                    return callback(error);
                                } else {
                                    return callback(null, results);
                                }
                            });
                        }
                    }
                });
            }
        });
    }, 
    updateUser: (data, callback) => {
        pool.query('UPDATE users SET ? WHERE email_address = ?', [data, data.email_address], (error, results, fields) => {
            if (error) {
                return callback(error);
            } else {
                return callback(null, results);
            }
        });
    },
    deleteUserById: (id, callback) => {
        pool.query('DELETE FROM users WHERE user_id = ?', [id], (error, results, fields) => {
            if (error) {
                return callback(error);
            } else {
                return callback(null, results[0]);
            }
        });
    },
    verifyPassword: (email, password, callback) => {
        pool.query('SELECT * FROM users WHERE email_address = ?', [email], (error, results, fields) => {
            if (error) {
                return callback(error);
            } else if (results.length === 0) {
                return callback(null, false);
            }

            const user = results[0];
            bcrypt.compare(password, user.password_hash, (error, passwordMatch) => {
                if (error) {
                    return callback(error);
                } else {
                    user.password_hash = undefined;
                    return callback(null, passwordMatch);
                }
            });
        });
    }
}