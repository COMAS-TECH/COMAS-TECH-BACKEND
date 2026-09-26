const pool = require('../config/db');
const { hashValue, lastChars } = require('../utils/hash');

const METODOS_VALIDOS = ['yape', 'tarjeta'];

// POST /api/orders -> crea una matricula/orden (sin login, "checkout" como invitado)
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
      card_last4,
      card_brand,
    } = req.body;

    if (!course_id || !full_name || !email || !phone || !document_number || !payment_method) {
      return res.status(400).json({ message: 'Faltan datos obligatorios' });
    }

    if (!METODOS_VALIDOS.includes(payment_method)) {
      return res.status(400).json({ message: 'Metodo de pago invalido' });
    }

    // 1) Validar que el curso exista
    const [courseRows] = await pool.query(
      'SELECT * FROM courses WHERE id = ? AND active = 1',
      [course_id]
    );
    if (courseRows.length === 0) {
      return res.status(404).json({ message: 'Curso no encontrado' });
    }
    const course = courseRows[0];

    // 2) Resolver el monto segun el plan de pago elegido (o precio base del curso)
    let amount = Number(course.price);
    let planId = null;
    if (payment_plan_id) {
      const [planRows] = await pool.query(
        'SELECT * FROM payment_plans WHERE id = ? AND course_id = ?',
        [payment_plan_id, course_id]
      );
      if (planRows.length === 0) {
        return res.status(400).json({ message: 'Plan de pago invalido para este curso' });
      }
      amount = Number(planRows[0].total_amount);
      planId = planRows[0].id;
    }

    // 3) Nunca se guarda el numero de documento ni la tarjeta completa.
    //    Se hashea el documento (bcrypt) y de la tarjeta solo se guardan los ultimos 4 digitos.
    const document_number_hash = await hashValue(document_number);
    const document_last4 = lastChars(document_number, 4);
    const safeCardLast4 = payment_method === 'tarjeta' ? lastChars(card_last4, 4) : null;

    const [result] = await pool.query(
      `INSERT INTO orders
        (course_id, payment_plan_id, full_name, email, phone, document_number_hash, document_last4,
         payment_method, card_last4, card_brand, amount, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pendiente')`,
      [
        course_id,
        planId,
        full_name,
        email,
        phone,
        document_number_hash,
        document_last4,
        payment_method,
        safeCardLast4,
        payment_method === 'tarjeta' ? (card_brand || null) : null,
        amount,
      ]
    );

    res.status(201).json({
      message: 'Matricula registrada correctamente',
      order_id: result.insertId,
      course: course.title,
      amount,
      payment_method,
      status: 'pendiente',
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al registrar la matricula' });
  }
}

module.exports = { createOrder };
