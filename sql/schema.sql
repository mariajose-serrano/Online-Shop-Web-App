-- ============================================
--  TIENDA ONLINE - Esquema de Base de Datos
-- ============================================

CREATE DATABASE IF NOT EXISTS tienda_online CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE tienda_online;

-- Tabla de categorías
CREATE TABLE IF NOT EXISTS categorias (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla principal: productos
CREATE TABLE IF NOT EXISTS productos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  descripcion TEXT,
  precio DECIMAL(10, 2) NOT NULL,
  stock INT NOT NULL DEFAULT 0,
  imagen_url VARCHAR(500),
  categoria_id INT,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE SET NULL
);

-- Tabla de usuarias (BONUS)
CREATE TABLE IF NOT EXISTS usuarias (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  nombre VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
--  DATOS DE EJEMPLO
-- ============================================

INSERT INTO categorias (nombre, descripcion) VALUES
  ('Electrónica', 'Dispositivos y gadgets tecnológicos'),
  ('Ropa', 'Moda y accesorios de vestir'),
  ('Hogar', 'Artículos para el hogar y decoración'),
  ('Deportes', 'Equipamiento y ropa deportiva'),
  ('Libros', 'Libros, revistas y material educativo');

INSERT INTO productos (nombre, descripcion, precio, stock, categoria_id) VALUES
  ('Auriculares Bluetooth Pro', 'Auriculares inalámbricos con cancelación de ruido activa', 89.99, 50, 1),
  ('Camiseta Algodón Orgánico', 'Camiseta 100% algodón orgánico, disponible en varios colores', 24.99, 200, 2),
  ('Lámpara LED de Escritorio', 'Lámpara LED regulable con 3 temperaturas de color', 39.99, 75, 3),
  ('Zapatillas Running X200', 'Zapatillas ligeras para corredores de asfalto', 119.99, 30, 4),
  ('El Arte de Programar', 'Guía completa para aprender programación desde cero', 34.99, 100, 5),
  ('Teclado Mecánico RGB', 'Teclado mecánico con switches Cherry MX y retroiluminación RGB', 149.99, 25, 1),
  ('Chaqueta Impermeable', 'Chaqueta técnica impermeable y transpirable', 79.99, 60, 2),
  ('Set de Cocina Premium', 'Juego de utensilios de cocina en acero inoxidable', 59.99, 40, 3);
