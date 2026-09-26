USE comas_tech;

INSERT INTO courses (title, slug, description, image_url, category, duration_weeks, modality, price, has_certification) VALUES
('Desarrollo Web con Inteligencia Artificial', 'desarrollo-web-ia',
 'Aprende a crear paginas y aplicaciones web modernas apoyandote en herramientas de IA generativa. Ideal para jovenes de Comas que quieren su primer empleo tech.',
 '/images/curso-web-ia.jpg', 'Programacion', 8, 'virtual', 150.00, 1),

('Ciberseguridad Basica', 'ciberseguridad-basica',
 'Fundamentos de seguridad informatica, buenas practicas y proteccion de datos personales en internet.',
 '/images/curso-ciberseguridad.jpg', 'Seguridad', 6, 'virtual', 120.00, 1),

('Edicion de Video y Contenido Digital', 'edicion-video-digital',
 'Domina herramientas de edicion de video e imagen para redes sociales y emprendimientos digitales.',
 '/images/curso-video.jpg', 'Diseno', 5, 'presencial', 100.00, 1),

('Automatizacion e IA para el Trabajo', 'automatizacion-ia-trabajo',
 'Usa herramientas de inteligencia artificial para automatizar tareas y aumentar tu productividad.',
 '/images/curso-automatizacion.jpg', 'Inteligencia Artificial', 4, 'virtual', 90.00, 1);

-- Planes de pago por curso
INSERT INTO payment_plans (course_id, name, installments, total_amount) VALUES
(1, 'Pago unico', 1, 150.00),
(1, '3 cuotas', 3, 165.00),
(2, 'Pago unico', 1, 120.00),
(2, '2 cuotas', 2, 130.00),
(3, 'Pago unico', 1, 100.00),
(3, '2 cuotas', 2, 108.00),
(4, 'Pago unico', 1, 90.00);
