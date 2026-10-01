const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload.middleware');
const { authRequired } = require('../middlewares/auth.middleware');
const {
  createOrder,
  uploadReceipt,
  myOrders,
  myEnrollments,
} = require('../controllers/orders.controller');

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Registra una inscripcion (requiere login)
 *     tags: [Ordenes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/NuevaOrden' }
 *     responses:
 *       201:
 *         description: Orden creada en estado pendiente
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/NuevaOrdenResponse' }
 *       400:
 *         description: Datos invalidos
 *       401:
 *         description: No autenticado
 *       404:
 *         description: Curso no encontrado
 */
router.post('/', authRequired, createOrder);

/**
 * @swagger
 * /orders/{id}/receipt:
 *   post:
 *     summary: Sube el comprobante de pago (imagen o PDF)
 *     tags: [Ordenes]
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
 *               receipt:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Comprobante subido, orden pasa a en_revision
 *       400:
 *         description: Archivo faltante o formato invalido
 *       404:
 *         description: Orden no encontrada
 */
router.post(
  '/:id/receipt',
  authRequired,
  upload.single('receipt'),
  uploadReceipt
);

/**
 * @swagger
 * /orders/me:
 *   get:
 *     summary: Lista las ordenes del usuario autenticado
 *     tags: [Ordenes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de ordenes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Orden' }
 */
router.get('/me', authRequired, myOrders);

/**
 * @swagger
 * /orders/me/courses:
 *   get:
 *     summary: Lista los cursos abiertos (matriculados) del usuario
 *     tags: [Ordenes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de cursos abiertos
 */
router.get('/me/courses', authRequired, myEnrollments);

module.exports = router;