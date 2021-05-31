const { Pool } = require('pg');

const pool = new Pool({
    host: '104.156.247.89',
    user:'postgres',
    password: 'PDDHbase2021$',
    database: 'SAT',
    port: '5432'
});

module.exports = pool;