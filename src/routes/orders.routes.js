const express = require('express');
const router = express.Router();
const { createOrder } = require('../controllers/orders.controller');

/**
 * @swagger
 * components:
 *   schemas:
 *     NuevaOrden:
 *       type: object
 *       required: [course_id, full_name, email, phone, document_number, payment_method]
 *       properties:
 *         course_id: { type: integer, example: 1 }
 *         payment_plan_id: { type: integer, example: 2, nullable: true }
 *         full_name: { type: string, example: "Maria Perez" }
 *         email: { type: string, example: "maria@example.com" }
 *         phone: { type: string, example: "987654321" }
 *         document_number: { type: string, example: "72345678", description: "DNI, se guarda hasheado" }
 *         payment_method: { type: string, enum: [yape, tarjeta] }
 *         card_last4: { type: string, example: "4242", description: "Solo requerido si payment_method=tarjeta" }
 *         card_brand: { type: string, example: "Visa" }
 */

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Registra una matricula/inscripcion a un curso (sin login)
 *     tags: [Ordenes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/NuevaOrden' }
 *     responses:
 *       201:
 *         description: Matricula creada
 *       400:
 *         description: Datos invalidos
 *       404:
 *         description: Curso no encontrado
 */
router.post('/', createOrder);

module.exports = router;
