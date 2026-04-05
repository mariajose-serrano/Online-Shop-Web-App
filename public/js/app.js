/* ════════════════════════════════════════════════════
   TIENDA ONLINE — app.js
   Consume la API REST de productos y autenticación
   ════════════════════════════════════════════════════ */

const API = "/api/productos";
let token = localStorage.getItem("token") || null;
let editandoId = null;

/* ── Utilidades ────────────────────────────────────── */

function toast(msg, tipo = "") {
  const el = document.getElementById("toast");
  el.textContent = msg;
  el.className = `toast show ${tipo}`;
  setTimeout(() => {
    el.className = "toast";
  }, 3000);
}

function mostrarMsg(id, msg, tipo) {
  const el = document.getElementById(id);
  el.textContent = msg;
  el.className = `msg ${tipo}`;
  el.style.display = "block";
  setTimeout(() => {
    el.style.display = "none";
  }, 4000);
}

function actualizarEstadoToken() {
  const dot = document.querySelector(".token-dot");
  const label = document.getElementById("tokenLabel");
  if (token) {
    dot.classList.add("active");
    label.textContent = "Sesión activa";
  } else {
    dot.classList.remove("active");
    label.textContent = "Sin sesión";
  }
}

/* ── Navegación ─────────────────────────────────────── */
document.querySelectorAll(".nav__btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document
      .querySelectorAll(".nav__btn")
      .forEach((b) => b.classList.remove("active"));
    document
      .querySelectorAll(".section")
      .forEach((s) => s.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById(btn.dataset.section).classList.add("active");
  });
});

/* ── CATÁLOGO ───────────────────────────────────────── */

document.getElementById("btnCargar").addEventListener("click", cargarCatalogo);

async function cargarCatalogo() {
  const grid = document.getElementById("productGrid");
  grid.innerHTML = '<div class="loader">Cargando productos</div>';

  try {
    const res = await fetch(API);
    const data = await res.json();

    if (!data.success) throw new Error(data.error);

    if (data.data.length === 0) {
      grid.innerHTML = `
        <div class="empty">
          <div class="empty__icon">📦</div>
          <p>No hay productos en la base de datos todavía.</p>
        </div>`;
      return;
    }

    grid.innerHTML = "";
    data.data.forEach((p, i) => {
      const card = document.createElement("div");
      card.className = "product-card";
      card.style.animationDelay = `${i * 0.04}s`;
      const stock = p.stock > 10 ? "" : p.stock > 0 ? "low" : "low";
      card.innerHTML = `
        ${p.imagen_url ? `<img src="${p.imagen_url}" alt="${p.nombre}" class="product-card__img" />` : '<div class="product-card__no-img">📦</div>'}
        <div class="product-card__badge">${p.categoria_nombre || "Sin categoría"}</div>
        <div class="product-card__name">${p.nombre}</div>
        <div class="product-card__desc">${p.descripcion || "Sin descripción disponible."}</div>
        <div class="product-card__price">${parseFloat(p.precio).toFixed(2)} €</div>
        <div class="product-card__stock ${stock}">
          ${p.stock > 0 ? `✓ ${p.stock} en stock` : "✕ Sin stock"}
        </div>
        <button class="btn btn--primary product-card__buy" ${p.stock === 0 ? "disabled" : ""} onclick="comprar('${p.nombre}')">
          ${p.stock > 0 ? "🛒 Añadir al carrito" : "Sin stock"}
        </button>
        <div class="product-card__id">ID: ${p.id}</div>`;
      grid.appendChild(card);
    });
  } catch (err) {
    grid.innerHTML = `
      <div class="empty">
        <div class="empty__icon">⚠️</div>
        <p>Error al cargar: ${err.message}</p>
      </div>`;
  }
}

/* ── ADMIN ──────────────────────────────────────────── */

document
  .getElementById("btnRecargar")
  .addEventListener("click", cargarListaAdmin);
document.getElementById("btnCrear").addEventListener("click", crearOActualizar);
document
  .getElementById("btnCancelarEdicion")
  .addEventListener("click", cancelarEdicion);

async function cargarListaAdmin() {
  const lista = document.getElementById("adminList");
  lista.innerHTML = '<div class="loader">Cargando</div>';

  try {
    const res = await fetch(API);
    const data = await res.json();

    if (!data.success) throw new Error(data.error);

    lista.innerHTML = "";
    if (data.data.length === 0) {
      lista.innerHTML = '<div class="empty"><p>No hay productos.</p></div>';
      return;
    }

    data.data.forEach((p) => {
      const item = document.createElement("div");
      item.className = "admin-item";
      item.innerHTML = `
        <div class="admin-item__info">
          <div class="admin-item__name">${p.nombre}</div>
          <div class="admin-item__price">${parseFloat(p.precio).toFixed(2)} € · ID: ${p.id}</div>
        </div>
        <div class="admin-item__actions">
          <button class="btn btn--icon" title="Editar" onclick="prepararEdicion(${p.id})">✏️</button>
          <button class="btn btn--icon" title="Eliminar" onclick="eliminarProducto(${p.id})">🗑️</button>
        </div>`;
      lista.appendChild(item);
    });
  } catch (err) {
    lista.innerHTML = `<div class="empty"><p>Error: ${err.message}</p></div>`;
  }
}

async function crearOActualizar() {
  if (!token) {
    mostrarMsg(
      "adminMsg",
      "Debes iniciar sesión para gestionar productos.",
      "error",
    );
    return;
  }

  const body = {
    nombre: document.getElementById("inputNombre").value.trim(),
    descripcion: document.getElementById("inputDescripcion").value.trim(),
    precio: parseFloat(document.getElementById("inputPrecio").value),
    stock: parseInt(document.getElementById("inputStock").value) || 0,
    imagen_url: document.getElementById("inputImagen").value.trim() || null,
    categoria_id:
      parseInt(document.getElementById("inputCategoria").value) || null,
  };

  if (!body.nombre || isNaN(body.precio)) {
    mostrarMsg("adminMsg", "El nombre y el precio son obligatorios.", "error");
    return;
  }

  try {
    const url = editandoId ? `${API}/${editandoId}` : API;
    const method = editandoId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
    const data = await res.json();

    if (!data.success) throw new Error(data.error);

    toast(
      editandoId ? "✅ Producto actualizado" : "✅ Producto creado",
      "success",
    );
    cancelarEdicion();
    cargarListaAdmin();
  } catch (err) {
    mostrarMsg("adminMsg", `Error: ${err.message}`, "error");
  }
}

async function prepararEdicion(id) {
  try {
    const res = await fetch(`${API}/${id}`);
    const data = await res.json();
    if (!data.success) throw new Error(data.error);
    const p = data.data;

    document.getElementById("inputNombre").value = p.nombre;
    document.getElementById("inputDescripcion").value = p.descripcion || "";
    document.getElementById("inputPrecio").value = p.precio;
    document.getElementById("inputStock").value = p.stock;
    document.getElementById("inputImagen").value = p.imagen_url || "";
    document.getElementById("inputCategoria").value = p.categoria_id || "";

    editandoId = id;
    document.getElementById("formTitle").textContent = `Editando #${id}`;
    document.getElementById("btnCrear").textContent = "Guardar cambios";
    document.getElementById("btnCancelarEdicion").style.display = "inline-flex";

    // Scroll al formulario
    document.getElementById("formTitle").scrollIntoView({ behavior: "smooth" });
  } catch (err) {
    toast(`Error: ${err.message}`, "error");
  }
}

function cancelarEdicion() {
  editandoId = null;
  document.getElementById("formTitle").textContent = "Nuevo Producto";
  document.getElementById("btnCrear").textContent = "Crear producto";
  document.getElementById("btnCancelarEdicion").style.display = "none";
  [
    "inputNombre",
    "inputDescripcion",
    "inputPrecio",
    "inputStock",
    "inputImagen",
    "inputCategoria",
  ].forEach((id) => {
    document.getElementById(id).value = "";
  });
}

async function eliminarProducto(id) {
  if (!token) {
    toast("Inicia sesión primero.", "error");
    return;
  }
  if (!confirm(`¿Eliminar el producto #${id}?`)) return;

  try {
    const res = await fetch(`${API}/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error);

    toast("🗑️ Producto eliminado", "success");
    cargarListaAdmin();
  } catch (err) {
    toast(`Error: ${err.message}`, "error");
  }
}

/* ── AUTH ───────────────────────────────────────────── */

document.getElementById("btnRegistro").addEventListener("click", async () => {
  const nombre = document.getElementById("regNombre").value.trim();
  const user = document.getElementById("regEmail").value.trim();
  const pass = document.getElementById("regPass").value;

  if (!user || !pass) {
    mostrarMsg("regMsg", "Email y contraseña son obligatorios.", "error");
    return;
  }

  try {
    const res = await fetch("/registro", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, user, pass }),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error);

    guardarToken(data.token);
    mostrarMsg(
      "regMsg",
      "✅ Cuenta creada e inicio de sesión automático.",
      "success",
    );
    toast("¡Bienvenida! Cuenta creada.", "success");
  } catch (err) {
    mostrarMsg("regMsg", `Error: ${err.message}`, "error");
  }
});

document.getElementById("btnLogin").addEventListener("click", async () => {
  const user = document.getElementById("loginEmail").value.trim();
  const pass = document.getElementById("loginPass").value;

  if (!user || !pass) {
    mostrarMsg("loginMsg", "Email y contraseña son obligatorios.", "error");
    return;
  }

  try {
    const res = await fetch("/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user, pass }),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error);

    guardarToken(data.token);
    mostrarMsg("loginMsg", "✅ Sesión iniciada correctamente.", "success");
    toast("¡Bienvenida de vuelta!", "success");
  } catch (err) {
    mostrarMsg("loginMsg", `Error: ${err.message}`, "error");
  }
});

document.getElementById("btnLogout").addEventListener("click", () => {
  token = null;
  localStorage.removeItem("token");
  actualizarEstadoToken();
  document.getElementById("btnLogout").style.display = "none";
  document.getElementById("btnLogin").style.display = "inline-flex";
  document.getElementById("tokenDisplay").style.display = "none";
  toast("Sesión cerrada.", "");
});

function guardarToken(t) {
  token = t;
  localStorage.setItem("token", t);
  actualizarEstadoToken();
  document.getElementById("tokenValue").textContent = t;
  document.getElementById("tokenDisplay").style.display = "block";
  document.getElementById("btnLogout").style.display = "inline-flex";
  document.getElementById("btnLogin").style.display = "none";
}

/* ── COMPRAR ────────────────────────────────────────── */
function comprar(nombre) {
  toast(`🛒 "${nombre}" añadido al carrito`, "success");
}

/* ── Init ───────────────────────────────────────────── */
actualizarEstadoToken();
if (token) {
  document.getElementById("tokenValue").textContent = token;
  document.getElementById("tokenDisplay").style.display = "block";
  document.getElementById("btnLogout").style.display = "inline-flex";
  document.getElementById("btnLogin").style.display = "none";
}
// Cargar catálogo y lista admin al arrancar
cargarCatalogo();
cargarListaAdmin();
