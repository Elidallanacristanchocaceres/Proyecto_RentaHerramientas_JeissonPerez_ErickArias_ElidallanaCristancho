const API_BASE_URL = "http://localhost:8080"

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL
  }

  getAuthToken() {
    return localStorage.getItem("authToken") || localStorage.getItem("token")
  }

  async fetchApi(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`
    const token = this.getAuthToken()

    const defaultOptions = {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    }

    // Agregar token de autorización si existe
    if (token) {
      defaultOptions.headers.Authorization = `Bearer ${token}`
    }

    const config = { ...defaultOptions, ...options }

    // Merge headers properly
    if (options.headers) {
      config.headers = { ...defaultOptions.headers, ...options.headers }
    }

    try {
      console.log(`Making ${config.method || "GET"} request to:`, url)
      console.log("Headers:", config.headers)

      if (config.body) {
        console.log("Request body:", config.body)
      }

      const response = await fetch(url, config)

      console.log(`Response status: ${response.status}`)

      // Manejar error 401 - token expirado o inválido
      if (response.status === 401) {
        console.error("Token inválido o expirado, redirigiendo al login")
        localStorage.clear()
        window.location.href = "login.html"
        return
      }

      if (!response.ok) {
        const errorText = await response.text()
        console.error(`HTTP error! status: ${response.status}, body: ${errorText}`)
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      // Handle empty responses (like 204 No Content)
      if (response.status === 204) {
        return { success: true }
      }

      // Handle responses with content
      const contentType = response.headers.get("content-type")
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json()
        console.log("Response data:", data)
        return data
      } else {
        const text = await response.text()
        return text || { success: true }
      }
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error)
      throw error
    }
  }

  // ============ AUTENTICACIÓN ============
  async login(credentials) {
    try {
      const response = await fetch(`${this.baseURL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(credentials),
      })

      if (!response.ok) {
        throw new Error("Credenciales inválidas")
      }

      const data = await response.json()

      // Guardar token y datos del usuario
      if (data.token) {
        localStorage.setItem("authToken", data.token)
        localStorage.setItem("isAuthenticated", "true")

        if (data.usuario) {
          localStorage.setItem("userData", JSON.stringify(data.usuario))
          localStorage.setItem("userRole", data.usuario.rol?.toLowerCase() || "client")
        }
      }

      return data
    } catch (error) {
      console.error("Error en login:", error)
      throw error
    }
  }

  async register(userData) {
    return fetch(`${this.baseURL}/auth/registro`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(userData),
    }).then((response) => {
      if (!response.ok) {
        throw new Error("Error en el registro")
      }
      return response.json()
    })
  }

  // ============ USUARIOS ============
  async getUsuarios() {
    return this.fetchApi("/api/usuarios")
  }

  async getUsuarioById(id) {
    return this.fetchApi(`/api/usuarios/${id}`)
  }

  async createUsuario(usuario) {
    return this.fetchApi("/api/usuarios", {
      method: "POST",
      body: JSON.stringify(usuario),
    })
  }

  async updateUsuario(id, usuario) {
    return this.fetchApi(`/api/usuarios/${id}`, {
      method: "PUT",
      body: JSON.stringify(usuario),
    })
  }

  async changeUserStatus(id, activo) {
    return this.fetchApi(`/api/usuarios/${id}/estado`, {
      method: "PATCH",
      body: JSON.stringify(activo),
    })
  }

  async deleteUsuario(id) {
    return this.fetchApi(`/api/usuarios/${id}`, {
      method: "DELETE",
    })
  }

  // ============ HERRAMIENTAS ============
  async getHerramientas() {
    return this.fetchApi("/api/herramientas")
  }

  async getHerramientaById(id) {
    return this.fetchApi(`/api/herramientas/${id}`)
  }

  async createHerramienta(herramienta) {
    return this.fetchApi("/api/herramientas", {
      method: "POST",
      body: JSON.stringify(herramienta),
    })
  }

  async updateHerramienta(id, herramienta) {
    return this.fetchApi(`/api/herramientas/${id}`, {
      method: "PUT",
      body: JSON.stringify(herramienta),
    })
  }

  async deleteHerramienta(id) {
    return this.fetchApi(`/api/herramientas/${id}`, {
      method: "DELETE",
    })
  }

  // ============ RESERVAS ============
  async getReservas() {
    return this.fetchApi("/api/reservas")
  }

  async getReservaById(id) {
    return this.fetchApi(`/api/reservas/${id}`)
  }

  async createReserva(reserva) {
    return this.fetchApi("/api/reservas", {
      method: "POST",
      body: JSON.stringify(reserva),
    })
  }

  async updateReserva(id, reservaData) {
    const updateDto = {
      fechaInicio: reservaData.fechaInicio,
      fechaFin: reservaData.fechaFin,
      estado: reservaData.estado,
      monto: reservaData.monto,
      costoTotal: reservaData.costoTotal,
    }

    return this.fetchApi(`/api/reservas/${id}`, {
      method: "PUT",
      body: JSON.stringify(updateDto),
    })
  }

  async deleteReserva(id) {
    return this.fetchApi(`/api/reservas/${id}`, {
      method: "DELETE",
    })
  }

  // ============ FACTURAS ============
  async getFacturas() {
    return this.fetchApi("/api/facturas")
  }

  async getFacturaById(id) {
    return this.fetchApi(`/api/facturas/${id}`)
  }

  async createFactura(factura) {
    return this.fetchApi("/api/facturas", {
      method: "POST",
      body: JSON.stringify(factura),
    })
  }

  async generateFactura(facturaData) {
    return this.fetchApi("/api/facturas/generate", {
      method: "POST",
      body: JSON.stringify(facturaData),
    })
  }

  // ============ CATEGORIAS ============
  async getCategorias() {
    return this.fetchApi("/api/categorias")
  }

  async getCategoriaById(id) {
    return this.fetchApi(`/api/categorias/${id}`)
  }

  // ============ PROVEEDORES ============
  async getProveedores() {
    return this.fetchApi("/api/proveedores")
  }

  async getProveedorById(id) {
    return this.fetchApi(`/api/proveedores/${id}`)
  }

  // ============ NOTIFICACIONES ============
  async getNotificaciones() {
    return this.fetchApi("/api/notificaciones/todas")
  }

  async getNotificacionById(id) {
    return this.fetchApi(`/api/notificaciones/${id}`)
  }

  // ============ PAGOS ============
  async getPagos() {
    return this.fetchApi("/pagos")
  }

  async getPagoById(id) {
    return this.fetchApi(`/pagos/${id}`)
  }

  async createPago(pago) {
    return this.fetchApi("/pagos", {
      method: "POST",
      body: JSON.stringify(pago),
    })
  }
}

export const apiService = new ApiService()
