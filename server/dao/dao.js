// import modules
const { createPool } = require('mysql');
const dotenv = require('dotenv');

// initialize modules
dotenv.config();

// create the pool with mysql database credentials
const pool = createPool({
    host: process.env.MYSQL_HOSTNAME,
    user: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB,
    port: process.env.MYSQL_PORT,
    connectionLimit: 100,
    ssl: false
});

// create connection
pool.getConnection((error, connection) => {
    if (error) {
        console.error(`MYSQL Error: ${error}`);

        // check error type
        switch (error.code) {
            case 'PROTOCOL_CONNECTION_LOST':
                console.log('Database connection was closed...');
            case 'ER_CON_COUNT_ERROR':
                console.log('Database has too many connections...');
            case 'ECONNREFUSED':
                console.log('Database connection was refused...');
        }
    } else {
        console.log(`Successfully connected to ${process.env.MYSQL_DB} database!`);
    }

    // release connection
    if (connection) connection.release();
    return;
});

// export module
module.exports = pool;