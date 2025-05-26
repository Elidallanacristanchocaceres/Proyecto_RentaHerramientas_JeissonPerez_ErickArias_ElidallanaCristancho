const API_BASE_URL = "http://localhost:8080"

async function fetchApi(endpoint, options = {}) {
  try {
    const token = localStorage.getItem("authToken")

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    })

    if (!response.ok) {
      const text = await response.text()
      throw new Error(`HTTP error! status: ${response.status}, body: ${text}`)
    }

    const contentType = response.headers.get("content-type")
    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text()
      throw new Error("La respuesta no es JSON válido: " + text)
    }

    return await response.json()
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error.message)
    throw error
  }
}

export const apiService = {
  // Autenticación
  login: (data) => fetchApi("/auth/login", { method: "POST", body: JSON.stringify(data) }),
  register: (data) => fetchApi("/auth/registro", { method: "POST", body: JSON.stringify(data) }),

  // Categorías
  getCategorias: () => fetchApi("/api/categorias"),
  createCategoria: (data) => fetchApi("/api/categorias", { method: "POST", body: JSON.stringify(data) }),
  updateCategoria: (id, data) => fetchApi(`/api/categorias/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteCategoria: (id) => fetchApi(`/api/categorias/${id}`, { method: "DELETE" }),

  // Facturas
  getFacturas: () => fetchApi("/api/facturas"),
  getFacturaById: (id) => fetchApi(`/api/facturas/${id}`),
  generateFactura: (data) => fetchApi("/api/facturas/generate", { method: "POST", body: JSON.stringify(data) }),
  createFactura: (data) => fetchApi("/api/facturas", { method: "POST", body: JSON.stringify(data) }),

  // Herramientas
  getHerramientas: () => fetchApi("/api/herramientas"),
  getHerramientaById: (id) => fetchApi(`/api/herramientas/${id}`),
  createHerramienta: (data) => fetchApi("/api/herramientas", { method: "POST", body: JSON.stringify(data) }),
  updateHerramienta: (id, data) => fetchApi(`/api/herramientas/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteHerramienta: (id) => fetchApi(`/api/herramientas/${id}`, { method: "DELETE" }),

  // Notificaciones
  getNotificaciones: () => fetchApi("/api/notificaciones"),
  markAsRead: (id) => fetchApi(`/api/notificaciones/${id}/read`, { method: "PUT" }),

  // Pagos
  getPagos: () => fetchApi("/api/pagos"),
  processPago: (data) => fetchApi("/api/pagos", { method: "POST", body: JSON.stringify(data) }),

  // Proveedores
  getProveedores: () => fetchApi("/api/proveedores"),
  getProveedorById: (id) => fetchApi(`/api/proveedores/${id}`),
  createProveedor: (data) => fetchApi("/api/proveedores", { method: "POST", body: JSON.stringify(data) }),
  updateProveedor: (id, data) => fetchApi(`/api/proveedores/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteProveedor: (id) => fetchApi(`/api/proveedores/${id}`, { method: "DELETE" }),

  // Reservas
  getReservas: () => fetchApi("/api/reservas"),
  getReservaById: (id) => fetchApi(`/api/reservas/${id}`),
  createReserva: (data) => fetchApi("/api/reservas", { method: "POST", body: JSON.stringify(data) }),
  updateReserva: (id, data) => fetchApi(`/api/reservas/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  cancelReserva: (id) => fetchApi(`/api/reservas/${id}/cancel`, { method: "PUT" }),

  // Usuarios
  getUsuarios: () => fetchApi("/api/usuarios"),
  getUsuarioById: (id) => fetchApi(`/api/usuarios/${id}`),
  createUsuario: (data) => fetchApi("/api/usuarios", { method: "POST", body: JSON.stringify(data) }),
  updateUsuario: (id, data) => fetchApi(`/api/usuarios/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteUsuario: (id) => fetchApi(`/api/usuarios/${id}`, { method: "DELETE" }),
  changeUserStatus: (id, active) =>
    fetchApi(`/api/usuarios/${id}/status`, { method: "PUT", body: JSON.stringify({ active }) }),
}