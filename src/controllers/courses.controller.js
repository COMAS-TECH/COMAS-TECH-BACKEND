const pool = require('../config/db');

// GET /api/courses  -> lista todos los cursos activos con sus planes de pago
async function getAllCourses(req, res) {
  try {
    const [courses] = await pool.query(
      'SELECT * FROM courses WHERE active = 1 ORDER BY created_at DESC'
    );

    const [plans] = await pool.query('SELECT * FROM payment_plans');

    const data = courses.map((course) => ({
      ...course,
      has_certification: !!course.has_certification,
      payment_plans: plans.filter((p) => p.course_id === course.id),
    }));

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al obtener los cursos' });
  }
}

// GET /api/courses/:id -> detalle de un curso
async function getCourseById(req, res) {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(
      'SELECT * FROM courses WHERE id = ? AND active = 1',
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Curso no encontrado' });
    }
    const [plans] = await pool.query(
      'SELECT * FROM payment_plans WHERE course_id = ?',
      [id]
    );
    res.json({ ...rows[0], has_certification: !!rows[0].has_certification, payment_plans: plans });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al obtener el curso' });
  }
}

module.exports = { getAllCourses, getCourseById };
