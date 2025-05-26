const API_BASE_URL = "http://localhost:8080";

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  getAuthToken() {
    return localStorage.getItem("authToken") || localStorage.getItem("token");
  }

  async fetchApi(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = this.getAuthToken();

    const config = {
      ...options,
      credentials: 'include',
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    };

    try {
      console.log(`Making ${config.method || "GET"} request to:`, url);
      console.log("Headers:", config.headers);
      if (config.body) {
        console.log("Request body:", config.body);
      }

      const response = await fetch(url, config);

      console.log(`Response status: ${response.status}`);
      console.log("LocalStorage Role:", localStorage.getItem("userRole"));
      // Solo lanza error 401 sin redirigir
      if (response.status === 401) {
        console.error("Token inválido o expirado");
        throw new Error("Unauthorized");
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`HTTP error! status: ${response.status}, body: ${errorText}`);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Respuesta vacía
      if (response.status === 204) {
        return null;
      }

      // Determinar si es JSON
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        return await response.json();
      } else {
        return await response.text();
      }
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error.message);
      throw error;
    }
  }

  // ============ AUTENTICACIÓN ============
  async login(credentials) {
    const data = await this.fetchApi("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });

    if (data.token) {
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("isAuthenticated", "true");

      if (data.usuario) {
        localStorage.setItem("userData", JSON.stringify(data.usuario));
        localStorage.setItem("userRole", data.usuario.rol?.toLowerCase() || "CLIENTE");
      }
    }

    return data;
  }

  async register(userData) {
    return await this.fetchApi("/auth/registro", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  // ============ USUARIOS ============
  async getUsuarios() {
    return this.fetchApi("/api/usuarios");
  }

  async getUsuarioById(id) {
    return this.fetchApi(`/api/usuarios/${id}`);
  }

  async createUsuario(usuario) {
    return this.fetchApi("/api/usuarios", {
      method: "POST",
      body: JSON.stringify(usuario),
    });
  }

  async updateUsuario(id, usuario) {
    return this.fetchApi(`/api/usuarios/${id}`, {
      method: "PUT",
      body: JSON.stringify(usuario),
    });
  }

  async changeUserStatus(id, activo) {
    return this.fetchApi(`/api/usuarios/${id}/estado`, {
      method: "PATCH",
      body: JSON.stringify(activo),
    });
  }

  async deleteUsuario(id) {
    return this.fetchApi(`/api/usuarios/${id}`, {
      method: "DELETE",
    });
  }

  // ============ HERRAMIENTAS ============
  async getHerramientas() {
    return this.fetchApi("/api/herramientas");
  }

  async getHerramientaById(id) {
    return this.fetchApi(`/api/herramientas/${id}`);
  }

  async createHerramienta(herramienta) {
    return this.fetchApi("/api/herramientas", {
      method: "POST",
      body: JSON.stringify(herramienta),
    });
  }

  async updateHerramienta(id, herramienta) {
    return this.fetchApi(`/api/herramientas/${id}`, {
      method: "PUT",
      body: JSON.stringify(herramienta),
    });
  }

  async deleteHerramienta(id) {
    return this.fetchApi(`/api/herramientas/${id}`, {
      method: "DELETE",
    });
  }

  // ============ RESERVAS ============
  async getReservas() {
    return this.fetchApi("/api/reservas");
  }

  async getReservaById(id) {
    return this.fetchApi(`/api/reservas/${id}`);
  }

  async createReserva(reserva) {
    return this.fetchApi("/api/reservas", {
      method: "POST",
      body: JSON.stringify(reserva),
    });
  }

  async updateReserva(id, reservaData) {
    return this.fetchApi(`/api/reservas/${id}`, {
      method: "PUT",
      body: JSON.stringify(reservaData),
    });
  }

  async deleteReserva(id) {
    return this.fetchApi(`/api/reservas/${id}`, {
      method: "DELETE",
    });
  }

  // ============ FACTURAS ============
  async getFacturas() {
    return this.fetchApi("/api/facturas");
  }

  async getFacturaById(id) {
    return this.fetchApi(`/api/facturas/${id}`);
  }

  async createFactura(factura) {
    return this.fetchApi("/api/facturas", {
      method: "POST",
      body: JSON.stringify(factura),
    });
  }

  async generateFactura(facturaData) {
    return this.fetchApi("/api/facturas/generate", {
      method: "POST",
      body: JSON.stringify(facturaData),
    });
  }

  // ============ CATEGORIAS ============
  async getCategorias() {
    return this.fetchApi("/api/categorias");
  }

  async getCategoriaById(id) {
    return this.fetchApi(`/api/categorias/${id}`);
  }

  // ============ PROVEEDORES ============
  async getProveedores() {
    return this.fetchApi("/api/proveedores");
  }

  async getProveedorById(id) {
    return this.fetchApi(`/api/proveedores/${id}`);
  }

  // ============ NOTIFICACIONES ============
  async getNotificaciones() {
    return this.fetchApi("/api/notificaciones/todas");
  }

  async getNotificacionById(id) {
    return this.fetchApi(`/api/notificaciones/${id}`);
  }

  // ============ PAGOS ============
  async getPagos() {
    return this.fetchApi("/api/pagos");
  }

  async getPagoById(id) {
    return this.fetchApi(`/api/pagos/${id}`);
  }

  async createPago(pago) {
    return this.fetchApi("/api/pagos", {
      method: "POST",
      body: JSON.stringify(pago),
    });
  }
}

export const apiService = new ApiService();