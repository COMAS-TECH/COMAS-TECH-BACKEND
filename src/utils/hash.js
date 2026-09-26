const bcrypt = require('bcryptjs');

const SALT_ROUNDS = Number(process.env.HASH_SALT_ROUNDS) || 10;

/**
 * Hashea un dato sensible (ej. N de documento) antes de guardarlo.
 * No es reversible: solo sirve como respaldo/verificacion, nunca se muestra el dato original.
 */
async function hashValue(value) {
  if (!value) return null;
  return bcrypt.hash(String(value).trim(), SALT_ROUNDS);
}

/** Devuelve solo los ultimos N caracteres de un valor (para mostrar referencia sin exponer el dato completo) */
function lastChars(value, n = 4) {
  if (!value) return null;
  const str = String(value).trim();
  return str.slice(-n);
}

module.exports = { hashValue, lastChars };
