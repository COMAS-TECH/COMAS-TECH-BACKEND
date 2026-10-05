// crear-admin.js
//
// Crea o actualiza el usuario administrador SIN clave escrita en el codigo.
//
// Uso:
//   node crear-admin.js "MiClaveSegura123"
// o con variables de entorno:
//   ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_FULL_NAME
//
// Si el admin ya existe, SOLO actualiza sus datos (UPSERT):
// no borra al usuario ni rompe sus ordenes/matriculas.
const bcrypt = require('bcryptjs');
const pool = require('./src/config/db');

const WEAK_PASSWORDS = [
  'admin123',
  'password',
  '123456',
  '12345678',
  'comastech',
  'comastech123',
  'admin',
];

(async () => {
  const email = (process.env.ADMIN_EMAIL || 'admin@comastech.pe')
    .toLowerCase()
    .trim();
  const password = process.env.ADMIN_PASSWORD || process.argv[2] || '';
  const full_name = process.env.ADMIN_FULL_NAME || 'Admin Comas TECH';

  if (!password) {
    console.error(
      '❌ Falta la contraseña. Uso: node crear-admin.js "TuClaveSegura" (o define ADMIN_PASSWORD).'
    );
    process.exit(1);
  }
  if (password.length < 8) {
    console.error('❌ La contraseña debe tener al menos 8 caracteres.');
    process.exit(1);
  }
  if (WEAK_PASSWORDS.includes(password.toLowerCase())) {
    console.error('❌ Esa contraseña es demasiado comun. Elige otra mas segura.');
    process.exit(1);
  }
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    console.error('❌ El correo del admin no tiene formato valido.');
    process.exit(1);
  }

  try {
    const hash = await bcrypt.hash(password, 10);

    // UPSERT: si ya existe el admin, solo se actualizan sus datos
    await pool.query(
      `INSERT INTO users (full_name, email, password_hash, role, active)
       VALUES (?, ?, ?, 'admin', 1)
       ON DUPLICATE KEY UPDATE
         full_name = VALUES(full_name),
         password_hash = VALUES(password_hash),
         role = 'admin',
         active = 1`,
      [full_name, email, hash]
    );

    console.log('\n🎉 Admin listo:');
    console.log('   Email    :', email);
    console.log('   Nombre   :', full_name);
    console.log('   (la contraseña no se imprime por seguridad)\n');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
})();
