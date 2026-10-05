const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET;
const EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// Claves conocidas o de ejemplo que jamas deben usarse
const FORBIDDEN_SECRETS = [
  'comastech-secret-change-me',
  'genera_una_clave_larga_y_aleatoria',
];

// Fail-fast: sin una clave secreta segura, el servidor no arranca.
// Asi nunca se firman tokens con un secreto publico.
if (!SECRET || SECRET.length < 32 || FORBIDDEN_SECRETS.includes(SECRET)) {
  throw new Error(
    'JWT_SECRET no configurado o inseguro: define en tu archivo .env una clave aleatoria de al menos 32 caracteres.'
  );
}

function signToken(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: EXPIRES_IN });
}

function verifyToken(token) {
  return jwt.verify(token, SECRET);
}

module.exports = { signToken, verifyToken };
