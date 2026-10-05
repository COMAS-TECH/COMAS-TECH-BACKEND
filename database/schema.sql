-- ============================================
-- COMAS TECH — Esquema de base de datos
-- Versión sincronizada con la BD de producción (MySQL 8+ / MariaDB 10.4+)
-- Idempotente: usa CREATE TABLE IF NOT EXISTS (no es destructivo).
-- Para un reset completo usar el dump con DROP DATABASE (solo con respaldo).
-- ============================================

CREATE DATABASE IF NOT EXISTS comas_tech
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE comas_tech;

-- ============================================
-- 1. USUARIOS
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(150) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  role ENUM('student','admin') DEFAULT 'student',
  active TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_users_email (email),
  INDEX idx_users_role (role)
);

-- ============================================
-- 2. CURSOS
-- ============================================
CREATE TABLE IF NOT EXISTS courses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  slug VARCHAR(150) UNIQUE,
  description TEXT,
  image_url VARCHAR(500),
  category VARCHAR(100),
  duration_weeks INT DEFAULT 4,
  modality VARCHAR(50) DEFAULT 'virtual',
  price DECIMAL(10,2) NOT NULL,
  has_certification TINYINT(1) DEFAULT 1,
  active TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_courses_active (active),
  INDEX idx_courses_category (category)
);

-- ============================================
-- 3. PLANES DE PAGO
-- ============================================
CREATE TABLE IF NOT EXISTS payment_plans (
  id INT AUTO_INCREMENT PRIMARY KEY,
  course_id INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  installments INT DEFAULT 1,
  total_amount DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
  INDEX idx_plans_course (course_id)
);

-- ============================================
-- 4. ORDENES / INSCRIPCIONES
-- Los datos sensibles (N de documento) NUNCA se guardan en texto plano:
-- document_number_hash guarda un hash bcrypt; solo se conservan los ultimos 4 digitos.
-- ============================================
CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NULL,
  course_id INT NOT NULL,
  payment_plan_id INT NULL,
  full_name VARCHAR(150) NOT NULL,
  email VARCHAR(150) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  document_number_hash VARCHAR(255) NOT NULL,
  document_last4 VARCHAR(4),
  payment_method ENUM('yape','plin') NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  receipt_url VARCHAR(500) NULL,
  status ENUM('pendiente','en_revision','pagado','rechazado') DEFAULT 'pendiente',
  admin_notes TEXT NULL,
  reviewed_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (course_id) REFERENCES courses(id),
  FOREIGN KEY (payment_plan_id) REFERENCES payment_plans(id),
  INDEX idx_orders_status (status),
  INDEX idx_orders_created (created_at),
  INDEX idx_orders_user (user_id),
  INDEX idx_orders_course (course_id)
);

-- ============================================
-- 5. MATRICULAS (curso abierto para el usuario)
-- ============================================
CREATE TABLE IF NOT EXISTS enrollments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  course_id INT NOT NULL,
  order_id INT NOT NULL,
  opened_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uniq_user_course (user_id, course_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- ============================================
-- 6. CONTACTOS
-- ============================================
CREATE TABLE IF NOT EXISTS contacts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150),
  email VARCHAR(150),
  phone VARCHAR(20),
  message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_contacts_created (created_at)
);

-- ============================================
-- 7. CONFIGURACIÓN DEL SITIO (video de la Home, etc.)
-- ============================================
CREATE TABLE IF NOT EXISTS site_settings (
  `key` VARCHAR(100) PRIMARY KEY,
  `value` TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
