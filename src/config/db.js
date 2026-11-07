const path = require('path');
const fs = require('fs');
require('dotenv').config();

const mysql = require('mysql2/promise');

// Leer el certificado CA desde la raíz del proyecto
const caCert = fs.readFileSync(path.resolve(__dirname, '../../ca.pem'));

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
    ca: caCert,
    rejectUnauthorized: true, // Ahora sí validamos con el CA de Aiven
  },
});

pool.query('SELECT 1')
  .then(() => console.log('✅ Conectado a MySQL como', process.env.DB_USER))
  .catch((err) => console.error('❌ Error MySQL:', err.message));

module.exports = pool;