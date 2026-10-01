const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const { signToken } = require('../utils/jwt');

// POST /api/auth/register
async function register(req, res) {
  try {
    const { full_name, email, password, phone } = req.body;
    if (!full_name || !email || !password) {
      return res.status(400).json({ message: 'Faltan datos obligatorios' });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: 'La contraseña debe tener al menos 6 caracteres' });
    }

    const [exists] = await pool.query('SELECT id FROM users WHERE email = ?', [
      email.toLowerCase().trim(),
    ]);
    if (exists.length > 0) {
      return res.status(409).json({ message: 'Ese correo ya esta registrado' });
    }

    const password_hash = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      `INSERT INTO users (full_name, email, password_hash, phone, role)
       VALUES (?, ?, ?, ?, 'student')`,
      [full_name.trim(), email.toLowerCase().trim(), password_hash, phone || null]
    );

    const token = signToken({
      id: result.insertId,
      email: email.toLowerCase().trim(),
      role: 'student',
    });

    res.status(201).json({
      message: 'Registro exitoso',
      token,
      user: {
        id: result.insertId,
        full_name: full_name.trim(),
        email: email.toLowerCase().trim(),
        phone: phone || null,
        role: 'student',
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al registrar usuario' });
  }
}

// POST /api/auth/login
async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Faltan credenciales' });
    }

    const [rows] = await pool.query(
      'SELECT * FROM users WHERE email = ? AND active = 1',
      [email.toLowerCase().trim()]
    );
    if (rows.length === 0) {
      return res.status(401).json({ message: 'Credenciales invalidas' });
    }

    const user = rows[0];
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) {
      return res.status(401).json({ message: 'Credenciales invalidas' });
    }

    const token = signToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    res.json({
      message: 'Login exitoso',
      token,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al iniciar sesion' });
  }
}

// GET /api/auth/me
async function me(req, res) {
  try {
    const [rows] = await pool.query(
      'SELECT id, full_name, email, phone, role, created_at FROM users WHERE id = ?',
      [req.user.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json({ user: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al obtener usuario' });
  }
}

module.exports = { register, login, me };