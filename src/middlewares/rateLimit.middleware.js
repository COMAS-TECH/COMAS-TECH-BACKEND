// rateLimit.middleware.js
//
// Limite simple en memoria para el login:
// maximo 10 intentos fallidos por cuenta (email+IP) en 15 minutos.
// Al iniciar sesion correctamente, el contador se reinicia.
// Se guarda en memoria: se limpia al reiniciar el servidor
// (suficiente para este proyecto).

const WINDOW_MS = 15 * 60 * 1000; // 15 minutos
const MAX_ATTEMPTS = 10;

const attempts = new Map(); // clave -> { count, resetAt }

function keyFor(req) {
  const email = String(req.body?.email || '').toLowerCase().trim();
  return `${email}|${req.ip}`;
}

/** Elimina entradas vencidas para que el mapa no crezca sin control */
function prune(now) {
  if (attempts.size < 500) return;
  for (const [k, v] of attempts) {
    if (v.resetAt <= now) attempts.delete(k);
  }
}

/** Middleware: solo bloquea si ya se supero el limite (no cuenta intentos) */
function loginLimiter(req, res, next) {
  const now = Date.now();
  const entry = attempts.get(keyFor(req));

  if (entry && entry.count >= MAX_ATTEMPTS && entry.resetAt > now) {
    const mins = Math.ceil((entry.resetAt - now) / 60000);
    return res.status(429).json({
      message: `Demasiados intentos fallidos. Intenta de nuevo en ${mins} minuto(s).`,
    });
  }
  next();
}

/** Registra un intento fallido (lo llama el controlador de login) */
function recordLoginFailure(req) {
  const now = Date.now();
  prune(now);
  const key = keyFor(req);
  const entry = attempts.get(key);

  if (!entry || entry.resetAt <= now) {
    attempts.set(key, { count: 1, resetAt: now + WINDOW_MS });
  } else {
    entry.count += 1;
  }
}

/** Reinicia el contador al iniciar sesion correctamente */
function recordLoginSuccess(req) {
  attempts.delete(keyFor(req));
}

module.exports = { loginLimiter, recordLoginFailure, recordLoginSuccess };
