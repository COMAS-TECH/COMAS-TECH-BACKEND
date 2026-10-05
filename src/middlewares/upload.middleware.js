const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.resolve(__dirname, '../../uploads');
const coursesDir = path.join(uploadDir, 'courses');
const homeVideoDir = path.join(uploadDir, 'home-video');

// Asegura que existan las carpetas
for (const dir of [uploadDir, coursesDir, homeVideoDir]) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

/** Storage para una subcarpeta de /uploads */
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

/** Filtro por MIME con log si rechaza */
function typeFilter(allowed) {
  return (_req, file, cb) => {
    if (allowed.includes(file.mimetype)) return cb(null, true);
    console.warn(
      `[upload] Rechazado: mimetype="${file.mimetype}" name="${file.originalname}"`
    );
    const err = new Error(
      `Formato no permitido (${file.mimetype}). Permitidos: ${allowed.join(', ')}`
    );
    err.status = 400;
    cb(err, false);
  };
}

// Comprobantes de pago
const receiptUpload = multer({
  storage: makeStorage('', 'receipt'),
  fileFilter: typeFilter([
    'image/jpeg',
    'image/png',
    'image/webp',
    'application/pdf',
  ]),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});

// Portadas de cursos
const courseImageUpload = multer({
  storage: makeStorage('courses', 'course'),
  fileFilter: typeFilter(['image/jpeg', 'image/png', 'image/webp']),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});

// Video de la Home
const homeVideoUpload = multer({
  storage: makeStorage('home-video', 'home-video'),
  fileFilter: typeFilter([
    'video/mp4',
    'video/webm',
    'video/quicktime',
    'video/x-msvideo',
    'video/x-matroska',
    'application/octet-stream',
  ]),
  limits: { fileSize: 500 * 1024 * 1024 }, // 500 MB
});

module.exports = receiptUpload; // export por defecto (compat)
module.exports.receipt = receiptUpload;
module.exports.courseImage = courseImageUpload;
module.exports.homeVideo = homeVideoUpload;