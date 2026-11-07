require('dotenv').config();
const path = require('path');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

// Rutas
const authRoutes = require('./routes/auth.routes');
const coursesRoutes = require('./routes/courses.routes');
const ordersRoutes = require('./routes/orders.routes');
const contactRoutes = require('./routes/contact.routes');
const adminRoutes = require('./routes/admin.routes');
const settingsRoutes = require('./routes/settings.routes');
const uploadsRoutes = require('./routes/uploads.routes');

const app = express();

// ============================================
// MIDDLEWARES GLOBALES
// ============================================
// CORS: acepta varios orígenes separados por coma (útil para Vercel + localhost)
const allowedOrigins = (process.env.CORS_ORIGIN || '*')
  .split(',')
  .map((o) => o.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      // Permitir requests sin origin (curl, Postman, health checks)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`Origen no permitido por CORS: ${origin}`));
    },
    credentials: true,
  })
);

app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));

// Archivos públicos: portadas de cursos y video de la Home
const COURSES_DIR = path.resolve(__dirname, '../uploads/courses');
const HOME_VIDEO_DIR = path.resolve(__dirname, '../uploads/home-video');

for (const dir of [COURSES_DIR, HOME_VIDEO_DIR]) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}
const DEFAULT_COURSE_IMAGE_PATH = path.join(COURSES_DIR, 'imagen_defecto.jpg');
if (!fs.existsSync(DEFAULT_COURSE_IMAGE_PATH)) {
  console.warn(
    `⚠️  Falta la imagen por defecto en: ${DEFAULT_COURSE_IMAGE_PATH}\n` +
      `    Coloca una imagen llamada "imagen_defecto.jpg" en uploads/courses/`
  );
}

app.use('/uploads/courses', express.static(COURSES_DIR));
app.use('/uploads/home-video', express.static(HOME_VIDEO_DIR));

// Comprobantes de pago: solo con sesión (admin o dueño de la orden)
app.use('/uploads', uploadsRoutes);

// ============================================
// DOCUMENTACIÓN SWAGGER
// ============================================
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/api-docs.json', (req, res) => res.json(swaggerSpec));

// ============================================
// HEALTHCHECK  (Render usará /api/health)
// ============================================
app.get('/api/health', (req, res) =>
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
);

// ============================================
// RUTAS DE LA API
// ============================================
app.use('/api/auth', authRoutes);
app.use('/api/courses', coursesRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/settings', settingsRoutes);

// ============================================
// 404 y manejo de errores
// ============================================
app.use((req, res) => res.status(404).json({ message: 'Ruta no encontrada' }));

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.message);

  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({
      message: 'El archivo excede el tamaño máximo permitido',
    });
  }
  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({
      message: `Campo de archivo inesperado: ${err.field}`,
    });
  }
  res.status(err.status || 500).json({
    message: err.message || 'Error interno del servidor',
  });
});

// ============================================
// ARRANQUE
// ============================================
const PORT = process.env.PORT || 4000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🚀 Comas TECH API corriendo en el puerto ${PORT}`);
  console.log(`🌍 Entorno: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🩺 Health check: /api/health`);
});