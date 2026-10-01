const express = require('express');
const router = express.Router();
const {
  getAllCourses,
  getCourseById,
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

module.exports = router;