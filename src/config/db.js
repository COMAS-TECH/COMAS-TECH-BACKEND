const path = require('path');
require('dotenv').config();

const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: {
    rejectUnauthorized: false,
    checkServerIdentity: () => undefined,  // 👈 ignora validación del hostname
  },
});

pool.query('SELECT 1')
  .then(() => console.log('✅ Conectado a MySQL como', process.env.DB_USER))
  .catch((err) => console.error('❌ Error MySQL:', err.message));

module.exports = pool;