const express = require('express');
const router = express.Router();
const {
  authRequired,
  adminRequired,
} = require('../middlewares/auth.middleware');
const {
  listOrders,
  updateOrderStatus,
  stats,
} = require('../controllers/admin.controller');

router.use(authRequired, adminRequired);

/**
 * @swagger
 * /admin/stats:
 *   get:
 *     summary: Estadisticas generales del panel
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Metricas del dashboard
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/AdminStats' }
 *       403:
 *         description: Solo administradores
 */
router.get('/stats', stats);

/**
 * @swagger
 * /admin/orders:
 *   get:
 *     summary: Lista todas las ordenes (opcional filtrar por status)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pendiente, en_revision, pagado, rechazado]
 *     responses:
 *       200:
 *         description: Lista de ordenes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Orden' }
 */
router.get('/orders', listOrders);

/**
 * @swagger
 * /admin/orders/{id}:
 *   patch:
 *     summary: Aprueba o rechaza una orden (y abre el curso si se aprueba)
 *     tags: [Admin]
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
 *         application/json:
 *           schema: { $ref: '#/components/schemas/AdminOrderUpdate' }
 *     responses:
 *       200:
 *         description: Orden actualizada
 *       400:
 *         description: Estado invalido
 *       404:
 *         description: Orden no encontrada
 */
router.patch('/orders/:id', updateOrderStatus);

module.exports = router;