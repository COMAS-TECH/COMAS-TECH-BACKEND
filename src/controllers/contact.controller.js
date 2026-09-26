const pool = require('../config/db');

// POST /api/contact -> guarda un mensaje del formulario de contacto
async function createContact(req, res) {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Faltan datos obligatorios' });
    }
    await pool.query(
      'INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)',
      [name, email, message]
    );
    res.status(201).json({ message: 'Mensaje enviado correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al enviar el mensaje' });
  }
}

module.exports = { createContact };
