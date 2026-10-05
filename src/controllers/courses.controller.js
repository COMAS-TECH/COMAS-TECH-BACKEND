const fs = require('fs');
const path = require('path');
const pool = require('../config/db');

const DEFAULT_COURSE_IMAGE = '/uploads/courses/imagen_defecto.jpg';
const COURSES_UPLOAD_DIR = path.resolve(__dirname, '../../uploads/courses');

/** Asegura que image_url nunca vaya vacío y normaliza booleanos */
function withDefaultImage(course) {
  return {
    ...course,
    has_certification: !!course.has_certification,
    image_url: course.image_url || DEFAULT_COURSE_IMAGE,
  };
}

/** Borra un archivo físico a partir de su URL pública (/uploads/...) */
function deleteUploadByUrl(imageUrl) {
  if (!imageUrl) return;
  if (imageUrl === DEFAULT_COURSE_IMAGE) return;
  if (!imageUrl.startsWith('/uploads/courses/')) return;

  const filename = path.basename(imageUrl);
  const abs = path.join(COURSES_UPLOAD_DIR, filename);
  if (!abs.startsWith(COURSES_UPLOAD_DIR)) return;

  fs.promises
    .unlink(abs)
    .then(() => console.log(`🗑️  Portada anterior eliminada: ${filename}`))
    .catch((err) => {
      if (err.code !== 'ENOENT') {
        console.warn(`⚠️  No se pudo borrar ${filename}:`, err.message);
      }
    });
}

// GET /api/courses -> lista todos los cursos activos con sus planes de pago
async function getAllCourses(req, res) {
  try {
    const [courses] = await pool.query(
      'SELECT * FROM courses WHERE active = 1 ORDER BY created_at DESC'
    );
    const [plans] = await pool.query('SELECT * FROM payment_plans');

    const data = courses.map((course) => ({
      ...withDefaultImage(course),
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
    res.json({
      ...withDefaultImage(rows[0]),
      payment_plans: plans,
    });
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

    const previousImage = rows[0].image_url;

    // Si se subio una portada nueva, se usa; si no, se conserva la actual
    const imageUrl = req.file
      ? `/uploads/courses/${req.file.filename}`
      : previousImage || DEFAULT_COURSE_IMAGE;

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

    // Si se reemplazo la portada, borra la anterior (si no era la default)
    if (req.file && previousImage && previousImage !== imageUrl) {
      deleteUploadByUrl(previousImage);
    }

    if (req.file) {
      console.log(`📤 Nueva portada para curso ${id}: ${imageUrl}`);
    }

    const [updatedRows] = await pool.query('SELECT * FROM courses WHERE id = ?', [id]);
    const [plans] = await pool.query(
      'SELECT * FROM payment_plans WHERE course_id = ?',
      [id]
    );

    res.json({
      ...withDefaultImage(updatedRows[0]),
      payment_plans: plans,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al actualizar el curso' });
  }
}

module.exports = {
  getAllCourses,
  getCourseById,
  updateCourse,
  DEFAULT_COURSE_IMAGE,
};