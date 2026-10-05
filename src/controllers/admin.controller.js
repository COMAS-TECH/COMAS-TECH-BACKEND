const pool = require('../config/db');

// GET /api/admin/orders  -> lista todas las ordenes
async function listOrders(req, res) {
  try {
    const { status } = req.query;
    let sql = `
      SELECT o.*, c.title AS course_title, c.image_url AS course_image_url,
             u.email AS user_email,
             u.full_name AS user_full_name
      FROM orders o
      JOIN courses c ON c.id = o.course_id
      LEFT JOIN users u ON u.id = o.user_id
    `;
    const params = [];
    if (status) {
      sql += ' WHERE o.status = ?';
      params.push(status);
    }
    sql += ' ORDER BY o.created_at DESC';

    const [rows] = await pool.query(sql, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al listar ordenes' });
  }
}

// PATCH /api/admin/orders/:id  -> cambiar estado (aprobar/rechazar)
async function updateOrderStatus(req, res) {
  try {
    const { id } = req.params;
    const { status, admin_notes } = req.body;

    const validos = ['pendiente', 'en_revision', 'pagado', 'rechazado'];
    if (!validos.includes(status)) {
      return res.status(400).json({ message: 'Estado invalido' });
    }

    const [rows] = await pool.query('SELECT * FROM orders WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Orden no encontrada' });
    }
    const order = rows[0];

    await pool.query(
      `UPDATE orders
       SET status = ?, admin_notes = ?, reviewed_at = NOW()
       WHERE id = ?`,
      [status, admin_notes || null, id]
    );

    // Si se aprueba, abrir el curso para el usuario
    if (status === 'pagado' && order.user_id) {
      await pool.query(
        `INSERT IGNORE INTO enrollments (user_id, course_id, order_id)
         VALUES (?, ?, ?)`,
        [order.user_id, order.course_id, order.id]
      );
    }

    res.json({ message: 'Orden actualizada', status });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al actualizar orden' });
  }
}

// GET /api/admin/stats  -> mini dashboard
async function stats(req, res) {
  try {
    const [[{ total_users }]] = await pool.query(
      'SELECT COUNT(*) AS total_users FROM users WHERE role = "student"'
    );
    const [[{ total_orders }]] = await pool.query(
      'SELECT COUNT(*) AS total_orders FROM orders'
    );
    const [[{ pending_orders }]] = await pool.query(
      "SELECT COUNT(*) AS pending_orders FROM orders WHERE status IN ('pendiente','en_revision')"
    );
    const [[{ paid_orders }]] = await pool.query(
      "SELECT COUNT(*) AS paid_orders FROM orders WHERE status = 'pagado'"
    );
    const [[{ total_revenue }]] = await pool.query(
      "SELECT COALESCE(SUM(amount),0) AS total_revenue FROM orders WHERE status = 'pagado'"
    );

    res.json({
      total_users,
      total_orders,
      pending_orders,
      paid_orders,
      total_revenue,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al obtener estadisticas' });
  }
}

module.exports = { listOrders, updateOrderStatus, stats };