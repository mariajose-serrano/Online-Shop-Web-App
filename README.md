# 🛍️ Tienda Online API

API REST desarrollada con **Node.js**, **Express** y **MySQL** para gestionar productos de una tienda online.  
Incluye autenticación con **JWT**, frontend integrado y documentación completa de endpoints.

---

## 📁 Estructura del proyecto

```
tienda-online/
├── public/               # Frontend estático
│   ├── index.html
│   ├── css/styles.css
│   └── js/app.js
├── sql/
│   └── schema.sql        # Esquema de base de datos + datos de ejemplo
├── src/
│   ├── config/
│   │   └── db.js         # Conexión a MySQL
│   ├── controllers/
│   │   ├── productosController.js
│   │   └── authController.js
│   ├── middleware/
│   │   └── auth.js       # Verificación de JWT
│   ├── routes/
│   │   ├── productos.js
│   │   └── auth.js
│   └── index.js          # Punto de entrada del servidor
├── .env.example
├── .gitignore
└── package.json
```

---

## 🗃️ Diagrama Entidad-Relación

```
┌───────────────────┐       ┌─────────────────────┐
│    categorias     │       │      productos       │
├───────────────────┤       ├─────────────────────┤
│ id (PK)           │◄──────│ id (PK)              │
│ nombre            │  1:N  │ nombre               │
│ descripcion       │       │ descripcion          │
│ creado_en         │       │ precio               │
└───────────────────┘       │ stock                │
                            │ imagen_url           │
                            │ categoria_id (FK)    │
                            │ creado_en            │
                            │ actualizado_en       │
                            └─────────────────────┘

┌───────────────────┐
│     usuarias      │  (BONUS - autenticación JWT)
├───────────────────┤
│ id (PK)           │
│ email (UNIQUE)    │
│ nombre            │
│ password (hash)   │
│ creado_en         │
└───────────────────┘
```

---

## 🚀 Instalación y puesta en marcha

### 1. Clonar el repositorio

```bash
git clone <url-de-tu-repositorio>
cd tienda-online
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

```bash
cp .env.example .env
```

Edita `.env` con tus datos:

```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_contraseña
DB_NAME=tienda_online
JWT_SECRET=una_clave_secreta_larga
```

### 4. Crear la base de datos

Ejecuta el archivo SQL en tu gestor de MySQL:

```bash
mysql -u root -p < sql/schema.sql
```

O cópialo y pégalo en **MySQL Workbench** / **phpMyAdmin**.

### 5. Iniciar el servidor

```bash
# Producción
npm start

# Desarrollo (con recarga automática)
npm run dev
```

El servidor estará disponible en: **http://localhost:3000**

---

## 🌐 Frontend

Al arrancar el servidor, el frontend estará disponible en `http://localhost:3000`.  
Permite:
- Visualizar el catálogo de productos
- Registrarse e iniciar sesión
- Crear, editar y eliminar productos (requiere sesión)

---

## 📡 Endpoints de la API

### Base URL: `http://localhost:3000`

---

### 📦 Productos

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| GET | `/api/productos` | Listar todos los productos | No |
| GET | `/api/productos/:id` | Obtener un producto por ID | No |
| POST | `/api/productos` | Crear un nuevo producto | ✅ JWT |
| PUT | `/api/productos/:id` | Actualizar un producto | ✅ JWT |
| DELETE | `/api/productos/:id` | Eliminar un producto | ✅ JWT |

---

#### `GET /api/productos`

Devuelve todos los productos con su categoría.

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nombre": "Auriculares Bluetooth Pro",
      "descripcion": "Auriculares inalámbricos con cancelación de ruido",
      "precio": "89.99",
      "stock": 50,
      "imagen_url": null,
      "categoria_id": 1,
      "categoria_nombre": "Electrónica",
      "creado_en": "2024-01-01T10:00:00.000Z"
    }
  ]
}
```

---

#### `GET /api/productos/:id`

**Respuesta exitosa (200):** igual que el anterior pero un solo objeto.

**Producto no encontrado (404):**
```json
{ "success": false, "error": "Producto no encontrado." }
```

---

#### `POST /api/productos` 🔒

**Headers:**
```
Authorization: Bearer <tu_token_jwt>
Content-Type: application/json
```

**Body:**
```json
{
  "nombre": "Teclado Mecánico",
  "descripcion": "Teclado con switches Cherry MX",
  "precio": 149.99,
  "stock": 25,
  "imagen_url": "https://ejemplo.com/imagen.jpg",
  "categoria_id": 1
}
```

**Respuesta exitosa (201):**
```json
{ "success": true, "mensaje": "Producto creado correctamente.", "id": 9 }
```

---

#### `PUT /api/productos/:id` 🔒

**Headers:** igual que POST.

**Body:** mismos campos que POST (todos opcionales excepto los obligatorios del schema).

**Respuesta exitosa (200):**
```json
{ "success": true, "mensaje": "Producto actualizado correctamente." }
```

---

#### `DELETE /api/productos/:id` 🔒

**Headers:**
```
Authorization: Bearer <tu_token_jwt>
```

**Respuesta exitosa (200):**
```json
{ "success": true, "mensaje": "Producto eliminado correctamente." }
```

---

### 🔐 Autenticación (BONUS)

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/registro` | Registrar nueva usuaria |
| POST | `/login` | Iniciar sesión |

---

#### `POST /registro`

**Body:**
```json
{
  "nombre": "Ana García",
  "user": "ana@ejemplo.com",
  "pass": "contraseña1234"
}
```

**Respuesta exitosa (201):**
```json
{ "success": true, "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }
```

**Error (409 - email ya existe):**
```json
{ "success": false, "error": "Ya existe una usuaria con ese email." }
```

---

#### `POST /login`

**Body:**
```json
{
  "user": "ana@ejemplo.com",
  "pass": "contraseña1234"
}
```

**Respuesta exitosa (200):**
```json
{ "success": true, "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }
```

**Error (401):**
```json
{ "success": false, "error": "Credenciales incorrectas." }
```

---

### 🔑 Uso del token JWT

Para los endpoints protegidos, incluye el token en la cabecera `Authorization`:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Error sin token (401):**
```json
{ "success": false, "error": "Acceso denegado. Token no proporcionado." }
```

**Error con token inválido (403):**
```json
{ "success": false, "error": "Token inválido o expirado." }
```

---

## 🛠️ Tecnologías utilizadas

- **Node.js** — entorno de ejecución JavaScript
- **Express.js** — framework para el servidor
- **MySQL2** — cliente MySQL para Node.js
- **bcryptjs** — encriptación de contraseñas
- **jsonwebtoken** — autenticación con JWT
- **dotenv** — gestión de variables de entorno
- **cors** — habilitación de CORS
- **nodemon** — recarga automática en desarrollo

---

## 📝 Notas adicionales

- Los endpoints GET son **públicos** (no requieren token).
- Los endpoints POST, PUT y DELETE son **protegidos** (requieren token JWT válido).
- El token JWT expira a las **24 horas**.
- Las contraseñas se almacenan **encriptadas** con bcrypt (salt rounds: 10).
- El archivo `.env` **no se sube a GitHub** (está en `.gitignore`). Usa `.env.example` como plantilla.
