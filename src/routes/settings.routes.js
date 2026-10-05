const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload.middleware');
const {
  authRequired,
  adminRequired,
} = require('../middlewares/auth.middleware');
const {
  getHomeVideo,
  updateHomeVideo,
  deleteHomeVideo,
} = require('../controllers/settings.controller');

/**
 * @swagger
 * /settings/home-video:
 *   get:
 *     summary: Devuelve el video configurado para la Home (publico)
 *     tags: [Configuracion]
 *     responses:
 *       200:
 *         description: Video actual (video_url puede ser null)
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/HomeVideo' }
 */
router.get('/home-video', getHomeVideo);

/**
 * @swagger
 * /settings/home-video:
 *   put:
 *     summary: Guarda el titulo y/o el video de la Home (solo admin)
 *     tags: [Configuracion]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: 'Conoce Comas TECH'
 *               video:
 *                 type: string
 *                 format: binary
 *                 description: 'MP4 o WEBM, max 50MB (opcional)'
 *     responses:
 *       200:
 *         description: Configuracion guardada
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/HomeVideo' }
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Solo administradores
 */
router.put(
  '/home-video',
  authRequired,
  adminRequired,
  upload.homeVideo.single('video'),
  updateHomeVideo
);

/**
 * @swagger
 * /settings/home-video:
 *   delete:
 *     summary: Elimina el video de la Home (solo admin)
 *     tags: [Configuracion]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Video eliminado
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Solo administradores
 */
router.delete('/home-video', authRequired, adminRequired, deleteHomeVideo);

module.exports = router;
