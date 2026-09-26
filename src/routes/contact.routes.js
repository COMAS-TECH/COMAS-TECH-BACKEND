const express = require('express');
const router = express.Router();
const { createContact } = require('../controllers/contact.controller');

/**
 * @swagger
 * /contact:
 *   post:
 *     summary: Envia un mensaje desde el formulario de contacto
 *     tags: [Contacto]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, message]
 *             properties:
 *               name: { type: string, example: "Juan Lopez" }
 *               email: { type: string, example: "juan@example.com" }
 *               message: { type: string, example: "Quisiera mas info del curso de Redes" }
 *     responses:
 *       201:
 *         description: Mensaje enviado
 *       400:
 *         description: Datos invalidos
 */
router.post('/', createContact);

module.exports = router;
