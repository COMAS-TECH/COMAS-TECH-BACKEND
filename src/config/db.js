const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD,   // 👈 sin fallback ''
  database: process.env.DB_NAME || 'comas_tech',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Verificación rápida al arrancar
pool.query('SELECT 1')
  .then(() => console.log('✅ Conectado a MySQL como', process.env.DB_USER))
  .catch((err) => console.error('❌ Error MySQL:', err.message));

module.exports = pool;