const { Pool } = require('pg');

const pool = new Pool({
    host: 'localhost',
    user:'postgres',
    password: 'F1r3ba11$',
    database: 'sat-db-servidor',
    port: '5432'
});

module.exports = pool;