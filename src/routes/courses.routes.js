const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload.middleware');
const {
  authRequired,
  adminRequired,
} = require('../middlewares/auth.middleware');
const {
  getAllCourses,
  getCourseById,
  updateCourse,
} = require('../controllers/courses.controller');

/**
 * @swagger
 * /courses:
 *   get:
 *     summary: Lista todos los cursos activos con sus planes de pago
 *     tags: [Cursos]
 *     responses:
 *       200:
 *         description: Lista de cursos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Course' }
 */
router.get('/', getAllCourses);

/**
 * @swagger
 * /courses/{id}:
 *   get:
 *     summary: Obtiene el detalle de un curso por id
 *     tags: [Cursos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Detalle del curso
 *       404:
 *         description: Curso no encontrado
 */
router.get('/:id', getCourseById);

/**
 * @swagger
 * /courses/{id}:
 *   put:
 *     summary: Actualiza un curso y/o su portada (solo admin)
 *     tags: [Cursos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: string }
 *               description: { type: string }
 *               category: { type: string }
 *               duration_weeks: { type: integer }
 *               modality: { type: string }
 *               price: { type: number }
 *               has_certification: { type: string, enum: ['0','1'] }
 *               active: { type: string, enum: ['0','1'] }
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Curso actualizado
 */
router.put(
  '/:id',
  authRequired,
  adminRequired,
  upload.courseImage.single('image'),
  updateCourse
);

module.exports = router;