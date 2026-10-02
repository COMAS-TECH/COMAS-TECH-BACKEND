const bcrypt = require('bcryptjs');

const password = process.argv[2] || 'admin123';
const rounds = 10;

bcrypt.hash(password, rounds).then((hash) => {
  console.log('\n========================================');
  console.log(`Contraseña: ${password}`);
  console.log(`Hash:       ${hash}`);
  console.log('========================================\n');
  console.log('Copia este SQL y ejecútalo en MySQL:\n');
  console.log('USE comas_tech;');
  console.log(
    `UPDATE users SET password_hash = '${hash}' WHERE email = 'admin@comastech.pe';\n`
  );
  process.exit(0);
});