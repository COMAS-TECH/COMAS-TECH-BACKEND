const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.resolve(__dirname, '../../uploads');
const coursesDir = path.join(uploadDir, 'courses');
const videoDir = path.join(uploadDir, 'home-video');

// Asegura que existan las carpetas de destino
for (const dir of [uploadDir, coursesDir, videoDir]) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

/** Crea el storage de multer para una subcarpeta de /uploads */
function makeStorage(subdir, prefix) {
  return multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, path.join(uploadDir, subdir)),
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      const name = `${prefix}-${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`;
      cb(null, name);
    },
  });
}

/** Filtro por tipo MIME; si no pasa, responde 400 con mensaje claro */
function typeFilter(allowed) {
  return (_req, file, cb) => {
    const ok = allowed.includes(file.mimetype);
    if (!ok) {
      const err = new Error('Formato no permitido');
      err.status = 400;
      return cb(err, false);
    }
    cb(null, true);
  };
}

// Comprobantes de pago (export por defecto: compatible con orders.routes.js)
const receiptUpload = multer({
  storage: makeStorage('', 'receipt'),
  fileFilter: typeFilter(['image/jpeg', 'image/png', 'image/webp', 'application/pdf']),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});

// Portadas de cursos (mismo patrón de nombre que producción: course-<ts>-<rand>.<ext>)
const courseImageUpload = multer({
  storage: makeStorage('courses', 'course'),
  fileFilter: typeFilter(['image/jpeg', 'image/png', 'image/webp']),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});

// Video de la Home (MP4 / WEBM, máximo 50 MB)
const homeVideoUpload = multer({
  storage: makeStorage('home-video', 'home-video'),
  fileFilter: typeFilter(['video/mp4', 'video/webm']),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB
});

module.exports = receiptUpload;
module.exports.receipt = receiptUpload;
module.exports.courseImage = courseImageUpload;
module.exports.homeVideo = homeVideoUpload;
