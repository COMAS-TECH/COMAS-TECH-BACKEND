const pool = require('../config/db');
const path = require('path');
const fs = require('fs');

const UPLOADS_DIR = path.resolve(__dirname, '../../uploads');

/** Lee un valor de site_settings (null si no existe) */
async function getSetting(key) {
  const [rows] = await pool.query(
    'SELECT `value` FROM site_settings WHERE `key` = ?',
    [key]
  );
  return rows.length ? rows[0].value : null;
}

/** Inserta o actualiza un valor de site_settings */
async function setSetting(key, value) {
  await pool.query(
    'INSERT INTO site_settings (`key`, `value`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `value` = ?',
    [key, value, value]
  );
}

/** Borra del disco un archivo de /uploads (mejor esfuerzo, nunca lanza error) */
function safeUnlink(relativeUrl) {
  if (!relativeUrl) return;
  try {
    const rel = relativeUrl.replace(/^\/uploads\//, '');
    const filePath = path.join(UPLOADS_DIR, rel);
    if (!filePath.startsWith(UPLOADS_DIR)) return; // nunca salir de /uploads
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  } catch {
    /* si no se puede borrar, se ignora */
  }
}

// GET /api/settings/home-video -> video actual (publico, lo usa la Home)
async function getHomeVideo(req, res) {
  try {
    const [videoUrl, title] = await Promise.all([
      getSetting('home_video_url'),
      getSetting('home_video_title'),
    ]);
    res.json({
      title: title || 'Conoce Comas TECH',
      video_url: videoUrl || null,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al obtener la configuracion del video' });
  }
}

// PUT /api/settings/home-video -> guarda titulo y/o video nuevo (solo admin)
async function updateHomeVideo(req, res) {
  try {
    const { title } = req.body;
    const previousUrl = await getSetting('home_video_url');

    let videoUrl = previousUrl;

    if (req.file) {
      const newUrl = `/uploads/home-video/${req.file.filename}`;
      await setSetting('home_video_url', newUrl);
      videoUrl = newUrl;
      // Si habia un video anterior, se borra del disco para no acumular archivos
      if (previousUrl && previousUrl !== newUrl) {
        safeUnlink(previousUrl);
      }
    }

    if (title !== undefined && title !== null && String(title).trim()) {
      await setSetting('home_video_title', String(title).trim());
    }

    const finalTitle = await getSetting('home_video_title');
    res.json({
      title: finalTitle || 'Conoce Comas TECH',
      video_url: videoUrl || null,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al actualizar el video de la Home' });
  }
}

// DELETE /api/settings/home-video -> quita el video (solo admin)
async function deleteHomeVideo(req, res) {
  try {
    const previousUrl = await getSetting('home_video_url');
    await setSetting('home_video_url', null);
    if (previousUrl) {
      safeUnlink(previousUrl);
    }
    const title = await getSetting('home_video_title');
    res.json({
      message: 'Video eliminado',
      title: title || 'Conoce Comas TECH',
      video_url: null,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al eliminar el video de la Home' });
  }
}

module.exports = { getHomeVideo, updateHomeVideo, deleteHomeVideo };
