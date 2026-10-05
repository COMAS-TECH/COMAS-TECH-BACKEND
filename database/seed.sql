-- ============================================
-- COMAS TECH — Datos iniciales (seed)
-- Sincronizado con la BD de producción (24 cursos + 34 planes).
-- Ejecutar UNA SOLA VEZ sobre una base recién creada con schema.sql.
-- Los cursos son idempotentes (ON DUPLICATE KEY no-op); los planes NO:
-- re-ejecutar el seed duplicaría planes. Para un reset completo,
-- usar el dump con DROP DATABASE (siempre con respaldo previo).
--
-- NOTA: el usuario admin NO se crea aquí. Usar `node crear-admin.js`
-- (que se endurecerá en el PASO 4: credenciales por variable de entorno).
-- La clave actual de producción es admin123 y DEBE cambiarse (PASO 0).
-- ============================================

USE comas_tech;

-- ============================================
-- CURSOS (24) — image_url ya apunta a /uploads/courses/*.jpg (igual que producción)
-- ============================================
INSERT INTO courses
(title, slug, description, image_url, category, duration_weeks, modality, price, has_certification)
VALUES
('Desarrollo Web con Inteligencia Artificial', 'desarrollo-web-ia',
 'Aprende a crear paginas y aplicaciones web modernas apoyandote en herramientas de IA generativa. Ideal para personas que quieren su primer empleo tech.',
 '/uploads/courses/course-1790973416712-63873449.jpg', 'Programacion', 8, 'virtual', 150.00, 1),

('Ciberseguridad Basica', 'ciberseguridad-basica',
 'Fundamentos de seguridad informatica, buenas practicas y proteccion de datos personales en internet. Para personas de todas las edades.',
 '/uploads/courses/course-1790973494817-751554235.jpg', 'Seguridad', 6, 'virtual', 120.00, 1),

('Edicion de Video y Contenido Digital', 'edicion-video-digital',
 'Domina herramientas de edicion de video e imagen para redes sociales y emprendimientos digitales.',
 '/uploads/courses/course-1790973532545-260009357.jpg', 'Diseno', 5, 'presencial', 100.00, 1),

('Automatizacion e IA para el Trabajo', 'automatizacion-ia-trabajo',
 'Usa herramientas de inteligencia artificial para automatizar tareas y aumentar tu productividad.',
 '/uploads/courses/course-1790973565802-983743486.jpg', 'Inteligencia Artificial', 4, 'virtual', 90.00, 1),

('Programacion de Videojuegos para Niños', 'videojuegos-ninos',
 'Aprende a crear tus propios videojuegos con Scratch y bloques visuales. Ideal para niños y niñas de 8 a 12 años.',
 '/uploads/courses/course-1790973606393-958641803.jpg', 'Programacion', 6, 'virtual', 90.00, 1),

('Robotica y Electronica para Adolescentes', 'robotica-adolescentes',
 'Diseña y construye robots basicos con Arduino. Curso practico para adolescentes de 13 a 17 años.',
 '/uploads/courses/course-1790973639393-200407892.jpg', 'Programacion', 8, 'presencial', 130.00, 1),

('Diseno Grafico Digital para Adolescentes', 'diseno-grafico-adolescentes',
 'Aprende Photoshop, Illustrator y Canva para crear afiches, logos y contenido para redes sociales.',
 '/uploads/courses/course-1790973671379-135933863.jpg', 'Diseno', 6, 'virtual', 110.00, 1),

('Excel Avanzado para el Trabajo', 'excel-avanzado',
 'Domina tablas dinamicas, macros, formulas avanzadas y analisis de datos.',
 '/uploads/courses/course-1790973702081-709939079.jpg', 'Productividad', 5, 'virtual', 100.00, 1),

('Marketing Digital y Redes Sociales', 'marketing-digital',
 'Aprende a crear campanas, gestionar redes, hacer publicidad en Meta y Google Ads.',
 '/uploads/courses/course-1790973736931-715293184.jpg', 'Marketing', 8, 'virtual', 140.00, 1),

('Contabilidad Basica con Software', 'contabilidad-basica',
 'Lleva la contabilidad de tu negocio con herramientas digitales.',
 '/uploads/courses/course-1790973793697-366246149.jpg', 'Negocios', 6, 'virtual', 120.00, 1),

('Community Manager Profesional', 'community-manager',
 'Gestiona comunidades digitales, crea contenido estrategico y mide resultados.',
 '/uploads/courses/course-1790973822520-830805569.jpg', 'Marketing', 6, 'virtual', 130.00, 1),

('Fotografia Digital y Edicion Profesional', 'fotografia-digital',
 'Domina tu camara o celular, composicion, iluminacion y edicion en Lightroom y Photoshop.',
 '/uploads/courses/course-1790973854408-801689776.jpg', 'Diseno', 5, 'presencial', 110.00, 1),

('Computacion Basica para Adultos Mayores', 'computacion-adultos-mayores',
 'Aprende a usar la computadora, internet, correo electronico y redes sociales a tu ritmo.',
 '/uploads/courses/course-1790973887912-550603340.jpg', 'Tecnologia Basica', 6, 'presencial', 80.00, 1),

('Uso del Celular y Aplicaciones Utiles', 'celular-adultos-mayores',
 'Aprende a usar WhatsApp, Yape, Google Maps, YouTube y apps utiles en tu dia a dia.',
 '/uploads/courses/course-1790973924561-634838091.jpg', 'Tecnologia Basica', 4, 'presencial', 70.00, 1),

('Finanzas Personales y Ahorro Digital', 'finanzas-personales',
 'Aprende a manejar tu dinero, ahorrar, invertir y usar banca digital.',
 '/uploads/courses/course-1790973962569-495111980.jpg', 'Finanzas', 4, 'virtual', 90.00, 1),

('Inteligencia Artificial para Emprendedores', 'ia-emprendedores',
 'Usa ChatGPT, Midjourney y otras IAs para crear contenido y automatizar tu negocio.',
 '/uploads/courses/course-1790973994346-723976182.jpg', 'Inteligencia Artificial', 5, 'virtual', 120.00, 1),

('Creacion de Tienda Online con Shopify', 'tienda-online-shopify',
 'Aprende a crear y gestionar tu propia tienda online, desde cero hasta tu primera venta.',
 '/uploads/courses/course-1790974042584-360620094.jpg', 'Negocios', 6, 'virtual', 140.00, 1),

('Locucion y Creacion de Podcast', 'locucion-podcast',
 'Aprende a hablar en publico, grabar tu propio podcast y monetizarlo.',
 '/uploads/courses/course-1790974075305-464953014.jpg', 'Comunicacion', 5, 'virtual', 100.00, 1),

('Reparacion de Celulares y Tablets', 'reparacion-celulares',
 'Aprende a diagnosticar y reparar celulares y tablets. Curso tecnico con salida laboral.',
 '/uploads/courses/course-1790974123680-696403098.jpg', 'Tecnico', 8, 'presencial', 150.00, 1),

('Instalaciones Electricas Basicas', 'instalaciones-electricas',
 'Aprende a realizar instalaciones electricas basicas y reparaciones del hogar de forma segura.',
 '/uploads/courses/course-1790974206193-137319911.jpg', 'Tecnico', 6, 'presencial', 130.00, 1),

('Costura y Confeccion Digital', 'costura-digital',
 'Aprende costura basica y uso de maquinas digitales para crear tus propias prendas o emprender.',
 '/uploads/courses/course-1790974243770-811098262.jpg', 'Oficios', 8, 'presencial', 120.00, 1),

('Reposteria y Emprendimiento', 'reposteria-emprendimiento',
 'Aprende a preparar postres y tortas, calcular costos y vender por redes sociales.',
 '/uploads/courses/course-1790974328305-963998092.jpg', 'Oficios', 6, 'presencial', 110.00, 1),

('Huertos Urbanos y Agricultura Familiar', 'huertos-urbanos',
 'Aprende a cultivar tus propios alimentos en casa, sin experiencia previa.',
 '/uploads/courses/course-1790974375401-759196041.jpg', 'Medio Ambiente', 5, 'presencial', 90.00, 1),

('Ingles Basico para el Trabajo', 'ingles-basico-trabajo',
 'Aprende ingles basico orientado al trabajo, atencion al cliente y turismo.',
 '/uploads/courses/course-1790974413313-344585112.jpg', 'Idiomas', 8, 'virtual', 120.00, 1)
ON DUPLICATE KEY UPDATE slug = slug;

-- ============================================
-- PLANES DE PAGO (34) — referencian cursos por slug para no depender de IDs
-- ============================================
INSERT INTO payment_plans (course_id, name, installments, total_amount)
SELECT id, 'Pago unico', 1, 150.00 FROM courses WHERE slug = 'desarrollo-web-ia';
INSERT INTO payment_plans (course_id, name, installments, total_amount)
SELECT id, '3 cuotas', 3, 165.00 FROM courses WHERE slug = 'desarrollo-web-ia';

INSERT INTO payment_plans (course_id, name, installments, total_amount)
SELECT id, 'Pago unico', 1, 120.00 FROM courses WHERE slug = 'ciberseguridad-basica';
INSERT INTO payment_plans (course_id, name, installments, total_amount)
SELECT id, '2 cuotas', 2, 130.00 FROM courses WHERE slug = 'ciberseguridad-basica';

INSERT INTO payment_plans (course_id, name, installments, total_amount)
SELECT id, 'Pago unico', 1, 100.00 FROM courses WHERE slug = 'edicion-video-digital';
INSERT INTO payment_plans (course_id, name, installments, total_amount)
SELECT id, '2 cuotas', 2, 108.00 FROM courses WHERE slug = 'edicion-video-digital';

INSERT INTO payment_plans (course_id, name, installments, total_amount)
SELECT id, 'Pago unico', 1, 90.00 FROM courses WHERE slug = 'automatizacion-ia-trabajo';

INSERT INTO payment_plans (course_id, name, installments, total_amount)
SELECT id, 'Pago unico', 1, 90.00 FROM courses WHERE slug = 'videojuegos-ninos';
INSERT INTO payment_plans (course_id, name, installments, total_amount)
SELECT id, '2 cuotas', 2, 96.00 FROM courses WHERE slug = 'videojuegos-ninos';

INSERT INTO payment_plans (course_id, name, installments, total_amount)
SELECT id, 'Pago unico', 1, 130.00 FROM courses WHERE slug = 'robotica-adolescentes';
INSERT INTO payment_plans (course_id, name, installments, total_amount)
SELECT id, '2 cuotas', 2, 140.00 FROM courses WHERE slug = 'robotica-adolescentes';

INSERT INTO payment_plans (course_id, name, installments, total_amount)
SELECT id, 'Pago unico', 1, 110.00 FROM courses WHERE slug = 'diseno-grafico-adolescentes';

INSERT INTO payment_plans (course_id, name, installments, total_amount)
SELECT id, 'Pago unico', 1, 100.00 FROM courses WHERE slug = 'excel-avanzado';
INSERT INTO payment_plans (course_id, name, installments, total_amount)
SELECT id, '2 cuotas', 2, 108.00 FROM courses WHERE slug = 'excel-avanzado';

INSERT INTO payment_plans (course_id, name, installments, total_amount)
SELECT id, 'Pago unico', 1, 140.00 FROM courses WHERE slug = 'marketing-digital';
INSERT INTO payment_plans (course_id, name, installments, total_amount)
SELECT id, '2 cuotas', 2, 150.00 FROM courses WHERE slug = 'marketing-digital';

INSERT INTO payment_plans (course_id, name, installments, total_amount)
SELECT id, 'Pago unico', 1, 120.00 FROM courses WHERE slug = 'contabilidad-basica';

INSERT INTO payment_plans (course_id, name, installments, total_amount)
SELECT id, 'Pago unico', 1, 130.00 FROM courses WHERE slug = 'community-manager';

INSERT INTO payment_plans (course_id, name, installments, total_amount)
SELECT id, 'Pago unico', 1, 110.00 FROM courses WHERE slug = 'fotografia-digital';

INSERT INTO payment_plans (course_id, name, installments, total_amount)
SELECT id, 'Pago unico', 1, 80.00 FROM courses WHERE slug = 'computacion-adultos-mayores';

INSERT INTO payment_plans (course_id, name, installments, total_amount)
SELECT id, 'Pago unico', 1, 70.00 FROM courses WHERE slug = 'celular-adultos-mayores';

INSERT INTO payment_plans (course_id, name, installments, total_amount)
SELECT id, 'Pago unico', 1, 90.00 FROM courses WHERE slug = 'finanzas-personales';

INSERT INTO payment_plans (course_id, name, installments, total_amount)
SELECT id, 'Pago unico', 1, 120.00 FROM courses WHERE slug = 'ia-emprendedores';
INSERT INTO payment_plans (course_id, name, installments, total_amount)
SELECT id, '2 cuotas', 2, 130.00 FROM courses WHERE slug = 'ia-emprendedores';

INSERT INTO payment_plans (course_id, name, installments, total_amount)
SELECT id, 'Pago unico', 1, 140.00 FROM courses WHERE slug = 'tienda-online-shopify';

INSERT INTO payment_plans (course_id, name, installments, total_amount)
SELECT id, 'Pago unico', 1, 100.00 FROM courses WHERE slug = 'locucion-podcast';

INSERT INTO payment_plans (course_id, name, installments, total_amount)
SELECT id, 'Pago unico', 1, 150.00 FROM courses WHERE slug = 'reparacion-celulares';
INSERT INTO payment_plans (course_id, name, installments, total_amount)
SELECT id, '3 cuotas', 3, 165.00 FROM courses WHERE slug = 'reparacion-celulares';

INSERT INTO payment_plans (course_id, name, installments, total_amount)
SELECT id, 'Pago unico', 1, 130.00 FROM courses WHERE slug = 'instalaciones-electricas';

INSERT INTO payment_plans (course_id, name, installments, total_amount)
SELECT id, 'Pago unico', 1, 120.00 FROM courses WHERE slug = 'costura-digital';

INSERT INTO payment_plans (course_id, name, installments, total_amount)
SELECT id, 'Pago unico', 1, 110.00 FROM courses WHERE slug = 'reposteria-emprendimiento';

INSERT INTO payment_plans (course_id, name, installments, total_amount)
SELECT id, 'Pago unico', 1, 90.00 FROM courses WHERE slug = 'huertos-urbanos';

INSERT INTO payment_plans (course_id, name, installments, total_amount)
SELECT id, 'Pago unico', 1, 120.00 FROM courses WHERE slug = 'ingles-basico-trabajo';
INSERT INTO payment_plans (course_id, name, installments, total_amount)
SELECT id, '2 cuotas', 2, 130.00 FROM courses WHERE slug = 'ingles-basico-trabajo';

-- ============================================
-- CONFIGURACIÓN INICIAL DEL SITIO (idempotente)
-- ============================================
INSERT INTO site_settings (`key`, `value`) VALUES
  ('home_video_url', NULL),
  ('home_video_title', 'Conoce Comas TECH'),
  ('site_name', 'Comas TECH'),
  ('contact_email', 'contacto@comastech.pe'),
  ('contact_phone', '+51 999 999 999')
ON DUPLICATE KEY UPDATE `key` = `key`;
