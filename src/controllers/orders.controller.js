const pool = require('../config/db');
const { hashValue, lastChars } = require('../utils/hash');

const METODOS_VALIDOS = ['yape', 'plin'];

// POST /api/orders  (requiere login)
async function createOrder(req, res) {
  try {
    const {
      course_id,
      payment_plan_id,
      full_name,
      email,
      phone,
      document_number,
      payment_method,
    } = req.body;

    if (
      !course_id ||
      !full_name ||
      !email ||
      !phone ||
      !document_number ||
      !payment_method
    ) {
      return res.status(400).json({ message: 'Faltan datos obligatorios' });
    }

    if (!METODOS_VALIDOS.includes(payment_method)) {
      return res
        .status(400)
        .json({ message: 'Metodo de pago invalido. Usa yape o plin.' });
    }

    const [courseRows] = await pool.query(
      'SELECT * FROM courses WHERE id = ? AND active = 1',
      [course_id]
    );
    if (courseRows.length === 0) {
      return res.status(404).json({ message: 'Curso no encontrado' });
    }
    const course = courseRows[0];

    let amount = Number(course.price);
    let planId = null;
    if (payment_plan_id) {
      const [planRows] = await pool.query(
        'SELECT * FROM payment_plans WHERE id = ? AND course_id = ?',
        [payment_plan_id, course_id]
      );
      if (planRows.length === 0) {
        return res
          .status(400)
          .json({ message: 'Plan de pago invalido para este curso' });
      }
      amount = Number(planRows[0].total_amount);
      planId = planRows[0].id;
    }

    const document_number_hash = await hashValue(document_number);
    const document_last4 = lastChars(document_number, 4);

    const [result] = await pool.query(
      `INSERT INTO orders
       (user_id, course_id, payment_plan_id, full_name, email, phone,
        document_number_hash, document_last4, payment_method, amount, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pendiente')`,
      [
        req.user.id,
        course_id,
        planId,
        full_name,
        email,
        phone,
        document_number_hash,
        document_last4,
        payment_method,
        amount,
      ]
    );

    res.status(201).json({
      message: 'Inscripcion registrada. Sube tu comprobante.',
      order_id: result.insertId,
      course: course.title,
      amount,
      payment_method,
      status: 'pendiente',
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al registrar la inscripcion' });
  }
}

// POST /api/orders/:id/receipt  (sube captura)
async function uploadReceipt(req, res) {
  try {
    const { id } = req.params;
    if (!req.file) {
      return res.status(400).json({ message: 'No se subio ningun archivo' });
    }

    const [rows] = await pool.query(
      'SELECT * FROM orders WHERE id = ? AND user_id = ?',
      [id, req.user.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Orden no encontrada' });
    }

    const receiptUrl = `/uploads/${req.file.filename}`;

    await pool.query(
      `UPDATE orders SET receipt_url = ?, status = 'en_revision' WHERE id = ?`,
      [receiptUrl, id]
    );

    res.json({
      message: 'Comprobante subido. Un administrador lo revisara pronto.',
      receipt_url: receiptUrl,
      status: 'en_revision',
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al subir comprobante' });
  }
}

// GET /api/orders/me  (mis inscripciones)
async function myOrders(req, res) {
  try {
    const [rows] = await pool.query(
      `SELECT o.*, c.title AS course_title, c.image_url AS course_image,
              c.duration_weeks, c.modality
       FROM orders o
       JOIN courses c ON c.id = o.course_id
       WHERE o.user_id = ?
       ORDER BY o.created_at DESC`,
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al listar tus inscripciones' });
  }
}

// GET /api/orders/me/courses  (mis cursos abiertos / matriculados)
async function myEnrollments(req, res) {
  try {
    const [rows] = await pool.query(
      `SELECT e.id AS enrollment_id, e.opened_at,
              c.id AS course_id, c.title, c.description, c.image_url,
              c.duration_weeks, c.modality, c.category
       FROM enrollments e
       JOIN courses c ON c.id = e.course_id
       WHERE e.user_id = ?
       ORDER BY e.opened_at DESC`,
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al listar tus cursos' });
  }
}

module.exports = { createOrder, uploadReceipt, myOrders, myEnrollments };