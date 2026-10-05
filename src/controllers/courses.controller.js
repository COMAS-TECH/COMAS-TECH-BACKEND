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

// PUT /api/courses/:id -> actualiza un curso y/o su portada (solo admin)
async function updateCourse(req, res) {
  try {
    const { id } = req.params;

    const [rows] = await pool.query('SELECT * FROM courses WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Curso no encontrado' });
    }

    const {
      title,
      description,
      category,
      duration_weeks,
      modality,
      price,
      has_certification,
      active,
    } = req.body;

    const newTitle = String(title ?? '').trim();
    if (!newTitle) {
      return res.status(400).json({ message: 'El titulo es obligatorio' });
    }

    const newPrice = Number(price);
    if (!Number.isFinite(newPrice) || newPrice < 0) {
      return res.status(400).json({ message: 'Precio invalido' });
    }

    const newDuration =
      duration_weeks === '' || duration_weeks === undefined || duration_weeks === null
        ? null
        : Number(duration_weeks);

    const newHasCert = ['1', 'true', 1, true].includes(has_certification) ? 1 : 0;
    const newActive = ['1', 'true', 1, true].includes(active) ? 1 : 0;

    // Si se subio una portada nueva, se usa; si no, se conserva la actual
    const imageUrl = req.file
      ? `/uploads/courses/${req.file.filename}`
      : rows[0].image_url;

    await pool.query(
      `UPDATE courses
       SET title = ?, description = ?, category = ?, duration_weeks = ?,
           modality = ?, price = ?, has_certification = ?, active = ?, image_url = ?
       WHERE id = ?`,
      [
        newTitle,
        String(description ?? ''),
        String(category ?? ''),
        newDuration,
        String(modality ?? ''),
        newPrice,
        newHasCert,
        newActive,
        imageUrl,
        id,
      ]
    );

    const [updatedRows] = await pool.query('SELECT * FROM courses WHERE id = ?', [id]);
    const [plans] = await pool.query(
      'SELECT * FROM payment_plans WHERE course_id = ?',
      [id]
    );

    res.json({
      ...updatedRows[0],
      has_certification: !!updatedRows[0].has_certification,
      payment_plans: plans,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al actualizar el curso' });
  }
}

module.exports = { getAllCourses, getCourseById, updateCourse };
