// routes/uploads.routes.js
//
// Los comprobantes de pago ya NO son publicos.
// Solo puede verlos el admin o el usuario dueño de la orden.
// (Las portadas y el video se sirven como estaticos en server.js)
const express = require('express');
const path = require('path');
const fs = require('fs');
const pool = require('../config/db');
const { authRequired } = require('../middlewares/auth.middleware');

const router = express.Router();

const UPLOADS_DIR = path.resolve(__dirname, '../../uploads');
// Solo nombres generados por multer: receipt-<timestamp>-<aleatorio>.<ext>
const FILE_RE = /^receipt-\d+-\d+\.[a-zA-Z0-9]+$/;

router.get('/:filename', authRequired, async (req, res) => {
  try {
    const { filename } = req.params;

    // 1) El nombre debe tener el formato exacto que genera el servidor
    if (!FILE_RE.test(filename)) {
      return res.status(404).json({ message: 'Archivo no encontrado' });
    }

    const receiptUrl = `/uploads/${filename}`;

    // 2) Debe existir una orden con ese comprobante
    const [rows] = await pool.query(
      'SELECT user_id FROM orders WHERE receipt_url = ?',
      [receiptUrl]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Archivo no encontrado' });
    }

    // 3) Solo el admin o el dueño de la orden pueden verlo
    const isAdmin = req.user.role === 'admin';
    const isOwner = rows.some((r) => r.user_id === req.user.id);
    if (!isAdmin && !isOwner) {
      return res
        .status(403)
        .json({ message: 'No tienes permiso para ver este comprobante' });
    }

    const filePath = path.join(UPLOADS_DIR, filename);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'Archivo no encontrado' });
    }

    res.sendFile(filePath);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al obtener el archivo' });
  }
});

module.exports = router;
