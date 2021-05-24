const { Pool } = require('pg');


const pool = new Pool({
    ssl: process.env.ENV == 'prod' ? { rejectUnauthorized: false } : null,
    connectionString:process.env.AWS_DATABASE
});


module.exports = pool;