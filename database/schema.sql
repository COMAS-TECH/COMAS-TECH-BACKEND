CREATE DATABASE IF NOT EXISTS comas_tech CHARACTER SET utf8mb4;
USE comas_tech;

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
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS payment_plans (
  id INT AUTO_INCREMENT PRIMARY KEY,
  course_id INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  installments INT DEFAULT 1,
  total_amount DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- Los datos sensibles de la persona (N de documento, tarjeta) NUNCA se guardan en texto plano:
-- document_number_hash guarda un hash bcrypt; de la tarjeta solo se guardan los ultimos 4 digitos.
CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  course_id INT NOT NULL,
  payment_plan_id INT NULL,
  full_name VARCHAR(150) NOT NULL,
  email VARCHAR(150) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  document_number_hash VARCHAR(255) NOT NULL,
  document_last4 VARCHAR(4),
  payment_method ENUM('yape','tarjeta') NOT NULL,
  card_last4 VARCHAR(4) NULL,
  card_brand VARCHAR(30) NULL,
  amount DECIMAL(10,2) NOT NULL,
  status ENUM('pendiente','pagado','rechazado') DEFAULT 'pendiente',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (course_id) REFERENCES courses(id),
  FOREIGN KEY (payment_plan_id) REFERENCES payment_plans(id)
);

CREATE TABLE IF NOT EXISTS contacts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150),
  email VARCHAR(150),
  message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
