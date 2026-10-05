// hash-admin.js
//
// Genera el hash bcrypt de una contraseña para pegarlo como UPDATE en MySQL.
//
// Uso: node src/scripts/hash-admin.js "TuClaveSegura"
const bcrypt = require('bcryptjs');

const password = process.argv[2];

if (!password) {
  console.error('❌ Uso: node src/scripts/hash-admin.js "TuClaveSegura"');
  process.exit(1);
}
if (password.length < 8) {
  console.error('❌ La contraseña debe tener al menos 8 caracteres.');
  process.exit(1);
}

const rounds = 10;

bcrypt.hash(password, rounds).then((hash) => {
  console.log('\n========================================');
  console.log('Hash generado (la contraseña no se muestra):');
  console.log(hash);
  console.log('========================================\n');
  console.log('Copia este SQL y ejecútalo en MySQL:\n');
  console.log('USE comas_tech;');
  console.log(
    `UPDATE users SET password_hash = '${hash}' WHERE email = 'admin@comastech.pe';\n`
  );
  process.exit(0);
});
