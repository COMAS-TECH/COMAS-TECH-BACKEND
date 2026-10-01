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
 *           schema: { $ref: '#/components/schemas/ContactoInput' }
 *     responses:
 *       201:
 *         description: Mensaje enviado
 *       400:
 *         description: Datos invalidos
 */
router.post('/', createContact);

module.exports = router;