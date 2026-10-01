// crear-admin.js
const bcrypt = require('bcryptjs');
const pool = require('./src/config/db');

(async () => {
  const email = 'admin@comastech.pe';
  const password = 'admin123';
  const full_name = 'Admin Comas TECH';

  console.log('\n🔧 Creando/actualizando admin...\n');

  try {
    const hash = await bcrypt.hash(password, 10);

    const verificado = await bcrypt.compare(password, hash);
    if (!verificado) {
      console.error('❌ El hash generado no coincide. Abortando.');
      process.exit(1);
    }
    console.log('✅ Hash generado y verificado');

    await pool.query('DELETE FROM users WHERE email = ?', [email]);
    console.log('🗑️  Usuario previo eliminado (si existía)');

    const [result] = await pool.query(
      `INSERT INTO users (full_name, email, password_hash, role, active)
       VALUES (?, ?, ?, 'admin', 1)`,
      [full_name, email, hash]
    );

    console.log('\n🎉 Admin creado correctamente');
    console.log('   ID       :', result.insertId);
    console.log('   Email    :', email);
    console.log('   Password :', password);
    console.log('   Hash     :', hash);
    console.log('\n👉 Ya puedes loguearte con esas credenciales.\n');

    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
})();