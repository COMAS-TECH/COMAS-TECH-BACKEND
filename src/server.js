require('dotenv').config();
const path = require('path');
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
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));

// Archivos publicos: portadas de cursos y video de la Home
app.use('/uploads/courses', express.static(path.resolve(__dirname, '../uploads/courses')));
app.use('/uploads/home-video', express.static(path.resolve(__dirname, '../uploads/home-video')));

// Comprobantes de pago: solo con sesion (admin o dueño de la orden)
app.use('/uploads', uploadsRoutes);

// ============================================
// DOCUMENTACION SWAGGER
// ============================================
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/api-docs.json', (req, res) => res.json(swaggerSpec));

// ============================================
// HEALTHCHECK
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

// Middleware de errores (multer, json malformado, etc.)
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.message);
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res
      .status(400)
      .json({ message: 'El archivo excede el tamaño maximo permitido' });
  }
  res.status(err.status || 500).json({
    message: err.message || 'Error interno del servidor',
  });
});

// ============================================
// ARRANQUE
// ============================================
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`\n🚀 Comas TECH API corriendo en http://localhost:${PORT}`);
  console.log(`📚 Swagger docs en http://localhost:${PORT}/api-docs`);
  console.log(`🩺 Health check en http://localhost:${PORT}/api/health\n`);
});