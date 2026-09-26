const express = require('express');
const router = express.Router();
const { getAllCourses, getCourseById } = require('../controllers/courses.controller');

/**
 * @swagger
 * components:
 *   schemas:
 *     PaymentPlan:
 *       type: object
 *       properties:
 *         id: { type: integer }
 *         course_id: { type: integer }
 *         name: { type: string, example: "3 cuotas" }
 *         installments: { type: integer, example: 3 }
 *         total_amount: { type: number, example: 180.00 }
 *     Course:
 *       type: object
 *       properties:
 *         id: { type: integer }
 *         title: { type: string, example: "Desarrollo Web con IA" }
 *         slug: { type: string, example: "desarrollo-web-ia" }
 *         description: { type: string }
 *         image_url: { type: string, example: "/images/curso-web.jpg" }
 *         category: { type: string, example: "Programacion" }
 *         duration_weeks: { type: integer, example: 8 }
 *         modality: { type: string, example: "virtual" }
 *         price: { type: number, example: 150.00 }
 *         has_certification: { type: boolean, example: true }
 *         payment_plans:
 *           type: array
 *           items: { $ref: '#/components/schemas/PaymentPlan' }
 */

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
 */
router.get('/:id', getCourseById);

module.exports = router;
