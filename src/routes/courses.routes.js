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
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Course' }
 *       404:
 *         description: Curso no encontrado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
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
 *               title:
 *                 type: string
 *                 example: 'Desarrollo Web con IA'
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *                 example: 'Programacion'
 *               duration_weeks:
 *                 type: integer
 *                 example: 8
 *               modality:
 *                 type: string
 *                 example: 'virtual'
 *               price:
 *                 type: number
 *                 example: 150.0
 *               has_certification:
 *                 type: string
 *                 enum: ['0', '1']
 *               active:
 *                 type: string
 *                 enum: ['0', '1']
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: 'Portada JPG/PNG/WEBP, max 5MB (opcional)'
 *     responses:
 *       200:
 *         description: Curso actualizado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Course' }
 *       400:
 *         description: Datos invalidos
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Solo administradores
 *       404:
 *         description: Curso no encontrado
 */
router.put('/:id', authRequired, adminRequired, upload.courseImage.single('image'), updateCourse);

module.exports = router;
