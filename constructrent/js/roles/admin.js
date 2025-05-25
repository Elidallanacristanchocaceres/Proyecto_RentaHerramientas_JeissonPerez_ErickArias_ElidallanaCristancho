import { apiService } from "../services/apiService.js"
import { createStatCard } from "../components/cards.js"
import { createTable } from "../components/tables.js"

async function createAdminDashboardView() {
  try {
    const [users, tools, rentals] = await Promise.all([
      apiService.getUsuarios(),
      apiService.getHerramientas(),
      apiService.getReservas(),
    ])

    const recentRentals = rentals.slice(0, 5).map((rental) => [
      rental.id,
      rental.cliente?.nombre || "Cliente no disponible",
      rental.herramienta?.nombre || "Herramienta no disponible",
      rental.fechaInicio || "No especificada",
      rental.fechaFin || "No especificada",
      `<span class="status status-${rental.estado?.toLowerCase() || "unknown"}">${rental.estado || "Desconocido"}</span>`,
      `$${Number.parseFloat(rental.costoTotal || rental.monto || 0).toFixed(2)}`,
      `<div class="action-buttons-group">
         <button class="btn-icon" onclick="verDetallesReserva(${rental.id})" title="Ver detalles">
           <i class="fas fa-eye"></i>
         </button>
         <button class="btn-icon" onclick="editarReserva(${rental.id})" title="Editar">
           <i class="fas fa-edit"></i>
         </button>
         <button class="btn-icon" onclick="abrirModalFactura(${rental.id})" title="Generar factura">
           <i class="fas fa-file-invoice"></i>
         </button>
       </div>`,
    ])

    return `
      <div class="view admin-view admin-dashboard-view">
        <div class="dashboard-header">
          <div class="dashboard-title">Panel de Administrador</div>
          <div class="action-buttons">
            <button class="btn btn-secondary" onclick="exportarDatos()">
              <i class="fas fa-download"></i>
              <span>Exportar</span>
            </button>
            <button class="btn btn-primary" onclick="generarReporte()">
              <i class="fas fa-plus"></i>
              <span>Nuevo Reporte</span>
            </button>
          </div>
        </div>
        <div class="stats-container">
          ${createStatCard("Usuarios Totales", users.length.toString(), "fas fa-users", "#5e72e4", { type: "positive", icon: "fas fa-arrow-up", text: "12% desde el mes pasado" })}
          ${createStatCard("Herramientas Registradas", tools.length.toString(), "fas fa-tools", "#11cdef", { type: "positive", icon: "fas fa-arrow-up", text: "8% desde el mes pasado" })}
          ${createStatCard("Alquileres Activos", rentals.length.toString(), "fas fa-clipboard-list", "#fb6340", { type: "positive", icon: "fas fa-arrow-up", text: "5% desde el mes pasado" })}
          ${createStatCard("Ingresos del Mes", "$" + rentals.reduce((sum, r) => sum + Number.parseFloat(r.costoTotal || r.monto || 0), 0).toFixed(2), "fas fa-dollar-sign", "#2dce89", { type: "positive", icon: "fas fa-arrow-up", text: "15% desde el mes pasado" })}
        </div>
        ${createTable("Alquileres Recientes", ["ID", "Cliente", "Herramienta", "Fecha Inicio", "Fecha Fin", "Estado", "Monto", "Acciones"], recentRentals)}
      </div>
    `
  } catch (error) {
    console.error("Error fetching dashboard data:", error)
    return `<div class="error-message">Error al cargar los datos del dashboard.</div>`
  }
}

async function createAdminUsersView() {
  try {
    const users = await apiService.getUsuarios()

    const userData = users.map((user) => [
      user.id,
      user.nombre || "Nombre no disponible",
      user.email || "Email no disponible",
      user.rol || "Rol no definido",
      user.fechaRegistro || "Fecha no registrada",
      `<span class="status status-${user.activo ? "available" : "maintenance"}">${user.activo ? "Activo" : "Inactivo"}</span>`,
      `<div class="action-buttons-group">
         <button class="btn-icon" onclick="verDetallesUsuario(${user.id})" title="Ver detalles">
           <i class="fas fa-eye"></i>
         </button>
         <button class="btn-icon" onclick="editarUsuario(${user.id})" title="Editar">
           <i class="fas fa-edit"></i>
         </button>
         <button class="btn-icon" onclick="cambiarEstadoUsuario(${user.id}, ${!user.activo})" title="${user.activo ? "Desactivar" : "Activar"}">
           <i class="fas fa-${user.activo ? "ban" : "check"}"></i>
         </button>
       </div>`,
    ])

    return `
      <div class="view admin-view admin-users-view hidden">
        <div class="dashboard-header">
          <div class="dashboard-title">Gestión de Usuarios</div>
          <div class="action-buttons">
            <button class="btn btn-secondary" onclick="filtrarUsuarios()">
              <i class="fas fa-filter"></i>
              <span>Filtrar</span>
            </button>
            <button class="btn btn-primary" onclick="agregarUsuario()">
              <i class="fas fa-plus"></i>
              <span>Nuevo Usuario</span>
            </button>
          </div>
        </div>
        ${createTable("Usuarios Registrados", ["ID", "Nombre", "Email", "Rol", "Fecha Registro", "Estado", "Acciones"], userData)}
      </div>
    `
  } catch (error) {
    console.error("Error fetching users:", error)
    return `<div class="error-message">Error al cargar la lista de usuarios.</div>`
  }
}

async function createAdminRentalsView() {
  try {
    const [rentals, providers] = await Promise.all([apiService.getReservas(), apiService.getProveedores()])

    const rentalData = rentals.map((rental) => {
      const provider = providers.find((p) => p.id === rental.proveedor?.id) || { nombre: "Proveedor no encontrado" }
      return [
        rental.id,
        rental.cliente?.nombre || "Cliente no disponible",
        provider.nombre,
        rental.herramienta?.nombre || "Herramienta no disponible",
        rental.fechaInicio || "No especificada",
        rental.fechaFin || "No especificada",
        `<span class="status status-${rental.estado?.toLowerCase() || "unknown"}">${rental.estado || "Desconocido"}</span>`,
        `$${Number.parseFloat(rental.costoTotal || rental.monto || 0).toFixed(2)}`,
        `<div class="action-buttons-group">
           <button class="btn-icon" onclick="verDetallesReserva(${rental.id})" title="Ver detalles">
             <i class="fas fa-eye"></i>
           </button>
           <button class="btn-icon" onclick="editarReserva(${rental.id})" title="Editar">
             <i class="fas fa-edit"></i>
           </button>
           <button class="btn-icon" onclick="abrirModalFactura(${rental.id})" title="Generar factura">
             <i class="fas fa-file-invoice"></i>
           </button>
         </div>`,
      ]
    })

    return `
      <div class="view admin-view admin-rentals-view hidden">
        <div class="dashboard-header">
          <div class="dashboard-title">Historial de Alquileres</div>
          <div class="action-buttons">
            <button class="btn btn-secondary" onclick="filtrarAlquileres()">
              <i class="fas fa-filter"></i>
              <span>Filtrar</span>
            </button>
            <button class="btn btn-primary" onclick="exportarAlquileres()">
              <i class="fas fa-download"></i>
              <span>Exportar</span>
            </button>
          </div>
        </div>
        ${createTable(
          "Todos los Alquileres",
          ["ID", "Cliente", "Proveedor", "Herramienta", "Fecha Inicio", "Fecha Fin", "Estado", "Monto", "Acciones"],
          rentalData,
        )}
      </div>
    `
  } catch (error) {
    console.error("Error fetching rentals:", error)
    return `<div class="error-message">Error al cargar la lista de alquileres.</div>`
  }
}

async function createAdminReportsView() {
  try {
    const [tools, providers, reservas, facturas] = await Promise.all([
      apiService.getHerramientas(),
      apiService.getProveedores(),
      apiService.getReservas(),
      apiService.getFacturas(),
    ])

    const rentalsByCategory = {}
    if (Array.isArray(tools)) {
      tools.forEach((h) => {
        const categoria = h.categoria?.nombre || h.categoria || "Sin categoría"
        rentalsByCategory[categoria] = (rentalsByCategory[categoria] || 0) + 1
      })
    }

    const activeProvider = (Array.isArray(providers) ? providers : []).sort((a, b) => {
      const countA = (Array.isArray(reservas) ? reservas.filter((r) => r.proveedor?.id === a.id) : []).length
      const countB = (Array.isArray(reservas) ? reservas.filter((r) => r.proveedor?.id === b.id) : []).length
      return countB - countA
    })[0]

    const totalIngresos = facturas.reduce((sum, f) => sum + Number.parseFloat(f.total || f.monto || 0), 0)

    return `
      <div class="view admin-view admin-reports-view hidden">
        <div class="dashboard-header">
          <div class="dashboard-title">Reportes y Estadísticas</div>
          <div class="action-buttons">
            <button class="btn btn-secondary" onclick="seleccionarPeriodo()">
              <i class="fas fa-calendar"></i>
              <span>Periodo</span>
            </button>
            <button class="btn btn-primary" onclick="exportarReportes()">
              <i class="fas fa-download"></i>
              <span>Exportar</span>
            </button>
          </div>
        </div>
        <div class="stats-container">
          ${createStatCard("Categoría Más Popular", Object.keys(rentalsByCategory)[0] || "Ninguna", "fas fa-tools", "#11cdef", { text: "Mayor uso por categoría" })}
          ${createStatCard("Proveedor Más Activo", activeProvider?.nombre || "Ninguno", "fas fa-store", "#5e72e4", { text: "Mayor cantidad de alquileres" })}
          ${createStatCard("Ingresos Totales", `$${totalIngresos.toFixed(2)}`, "fas fa-dollar-sign", "#2dce89", { text: "Todas las facturas" })}
          ${createStatCard("Facturas Generadas", facturas.length.toString(), "fas fa-file-invoice", "#fb6340", { text: "Total de facturas" })}
        </div>
      </div>
    `
  } catch (error) {
    console.error("Error fetching reports:", error)
    return `<div class="error-message">Error al cargar reportes.</div>`
  }
}

async function createAdminSettingsView() {
  return `
    <div class="view admin-view admin-settings-view hidden">
      <div class="dashboard-header">
        <div class="dashboard-title">Configuración del Sistema</div>
        <div class="action-buttons">
          <button class="btn btn-secondary" onclick="exportarConfiguracion()">
            <i class="fas fa-download"></i>
            <span>Exportar Config</span>
          </button>
          <button class="btn btn-primary" onclick="guardarConfiguracion()">
            <i class="fas fa-save"></i>
            <span>Guardar Cambios</span>
          </button>
        </div>
      </div>
      
      <div class="settings-container">
        <div class="settings-section">
          <h3>Configuración General</h3>
          <div class="form-group">
            <label class="form-label">Nombre de la Plataforma</label>
            <input type="text" class="form-control" value="ConstructRent" id="platformName">
          </div>
          <div class="form-group">
            <label class="form-label">Email de Contacto</label>
            <input type="email" class="form-control" value="admin@constructrent.com" id="contactEmail">
          </div>
          <div class="form-group">
            <label class="form-label">Comisión de la Plataforma (%)</label>
            <input type="number" class="form-control" value="10" min="0" max="100" id="platformCommission">
          </div>
        </div>

        <div class="settings-section">
          <h3>Configuración de Pagos</h3>
          <div class="form-group">
            <label class="form-label">Métodos de Pago Habilitados</label>
            <div class="checkbox-group">
              <label><input type="checkbox" checked> Tarjeta de Crédito</label>
              <label><input type="checkbox" checked> Tarjeta de Débito</label>
              <label><input type="checkbox"> PayPal</label>
              <label><input type="checkbox"> Transferencia Bancaria</label>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Moneda por Defecto</label>
            <select class="form-control" id="defaultCurrency">
              <option value="USD" selected>Dólar Estadounidense (USD)</option>
              <option value="EUR">Euro (EUR)</option>
              <option value="COP">Peso Colombiano (COP)</option>
            </select>
          </div>
        </div>

        <div class="settings-section">
          <h3>Configuración de Notificaciones</h3>
          <div class="form-group">
            <label class="form-label">Notificaciones por Email</label>
            <div class="checkbox-group">
              <label><input type="checkbox" checked> Nuevas reservas</label>
              <label><input type="checkbox" checked> Pagos recibidos</label>
              <label><input type="checkbox"> Recordatorios de devolución</label>
              <label><input type="checkbox"> Reportes semanales</label>
            </div>
          </div>
        </div>

        <div class="settings-section">
          <h3>Configuración de Seguridad</h3>
          <div class="form-group">
            <label class="form-label">Tiempo de Sesión (minutos)</label>
            <input type="number" class="form-control" value="60" min="15" max="480" id="sessionTimeout">
          </div>
          <div class="form-group">
            <label class="form-label">Intentos de Login Máximos</label>
            <input type="number" class="form-control" value="5" min="3" max="10" id="maxLoginAttempts">
          </div>
        </div>
      </div>
    </div>
  `
}

// Funciones globales para el admin
window.verDetallesReserva = async (reservaId) => {
  try {
    const reserva = await apiService.getReservaById(reservaId)
    const modalHtml = `
      <div class="modal-overlay show" id="reservaDetallesModal">
        <div class="modal">
          <div class="modal-header">
            <div class="modal-title">Detalles de la Reserva #${reserva.id}</div>
            <button class="modal-close" onclick="document.getElementById('reservaDetallesModal').remove()">&times;</button>
          </div>
          <div class="modal-body">
            <p><strong>Cliente:</strong> ${reserva.cliente?.nombre || "No disponible"}</p>
            <p><strong>Herramienta:</strong> ${reserva.herramienta?.nombre || "No disponible"}</p>
            <p><strong>Fecha inicio:</strong> ${reserva.fechaInicio}</p>
            <p><strong>Fecha fin:</strong> ${reserva.fechaFin}</p>
            <p><strong>Estado:</strong> ${reserva.estado}</p>
            <p><strong>Costo Total:</strong> $${Number.parseFloat(reserva.costoTotal || 0).toFixed(2)}</p>
            <p><strong>Monto:</strong> $${Number.parseFloat(reserva.monto || 0).toFixed(2)}</p>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" onclick="document.getElementById('reservaDetallesModal').remove()">Cerrar</button>
          </div>
        </div>
      </div>
    `
    document.body.insertAdjacentHTML("beforeend", modalHtml)
  } catch (err) {
    console.error("Error al cargar detalles de reserva:", err)
    alert("No se pudieron obtener los detalles de la reserva.")
  }
}

window.editarReserva = async (reservaId) => {
  try {
    const reserva = await apiService.getReservaById(reservaId)
    const modalHtml = `
      <div class="modal-overlay show" id="editReservaModal">
        <div class="modal">
          <div class="modal-header">
            <div class="modal-title">Editar Reserva #${reserva.id}</div>
            <button class="modal-close" onclick="document.getElementById('editReservaModal').remove()">&times;</button>
          </div>
          <div class="modal-body">
            <form id="editReservaForm">
              <input type="hidden" name="id" value="${reserva.id}">
              <div class="form-group">
                <label class="form-label">Fecha Inicio</label>
                <input type="date" class="form-control" name="fechaInicio" value="${reserva.fechaInicio}" required>
              </div>
              <div class="form-group">
                <label class="form-label">Fecha Fin</label>
                <input type="date" class="form-control" name="fechaFin" value="${reserva.fechaFin}" required>
              </div>
              <div class="form-group">
                <label class="form-label">Estado</label>
                <select class="form-control" name="estado" required>
                  <option value="PENDIENTE" ${reserva.estado === "PENDIENTE" ? "selected" : ""}>Pendiente</option>
                  <option value="APROBADA" ${reserva.estado === "APROBADA" ? "selected" : ""}>Aprobada</option>
                  <option value="RECHAZADA" ${reserva.estado === "RECHAZADA" ? "selected" : ""}>Rechazada</option>
                  <option value="COMPLETADA" ${reserva.estado === "COMPLETADA" ? "selected" : ""}>Completada</option>
                  <option value="CANCELADA" ${reserva.estado === "CANCELADA" ? "selected" : ""}>Cancelada</option>
                </select>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" onclick="document.getElementById('editReservaModal').remove()">Cancelar</button>
            <button class="btn btn-primary" onclick="actualizarReserva()">Actualizar</button>
          </div>
        </div>
      </div>
    `
    document.body.insertAdjacentHTML("beforeend", modalHtml)
  } catch (error) {
    console.error("Error al cargar reserva para editar:", error)
    alert("No se pudo cargar la reserva para editar.")
  }
}

window.verDetallesUsuario = async (userId) => {
  try {
    const user = await apiService.getUsuarioById(userId)
    const modalHtml = `
      <div class="modal-overlay show" id="userDetallesModal">
        <div class="modal">
          <div class="modal-header">
            <div class="modal-title">Detalles del Usuario</div>
            <button class="modal-close" onclick="document.getElementById('userDetallesModal').remove()">&times;</button>
          </div>
          <div class="modal-body">
            <p><strong>Nombre:</strong> ${user.nombre}</p>
            <p><strong>Email:</strong> ${user.email}</p>
            <p><strong>Teléfono:</strong> ${user.telefono || "No especificado"}</p>
            <p><strong>Dirección:</strong> ${user.direccion || "No especificada"}</p>
            <p><strong>Rol:</strong> ${user.rol}</p>
            <p><strong>Estado:</strong> ${user.activo ? "Activo" : "Inactivo"}</p>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" onclick="document.getElementById('userDetallesModal').remove()">Cerrar</button>
          </div>
        </div>
      </div>
    `
    document.body.insertAdjacentHTML("beforeend", modalHtml)
  } catch (err) {
    console.error("Error al cargar detalles del usuario:", err)
    alert("No se pudieron obtener los detalles del usuario.")
  }
}

// ✅ SOLUCIONADO: Usa el nuevo endpoint específico para cambiar estado
window.cambiarEstadoUsuario = async (userId, nuevoEstado) => {
  const accion = nuevoEstado ? "activar" : "desactivar"
  if (confirm(`¿Estás seguro de que quieres ${accion} este usuario?`)) {
    try {
      await apiService.changeUserStatus(userId, nuevoEstado)
      alert(`Usuario ${accion === "activar" ? "activado" : "desactivado"} correctamente.`)
      location.reload()
    } catch (err) {
      console.error(`Error al ${accion} usuario:`, err)
      alert(`No se pudo ${accion} el usuario: ${err.message}`)
    }
  }
}

window.editarUsuario = async (userId) => {
  try {
    const user = await apiService.getUsuarioById(userId)
    const modalHtml = `
      <div class="modal-overlay show" id="editUserModal">
        <div class="modal">
          <div class="modal-header">
            <div class="modal-title">Editar Usuario</div>
            <button class="modal-close" onclick="document.getElementById('editUserModal').remove()">&times;</button>
          </div>
          <div class="modal-body">
            <form id="editUserForm">
              <input type="hidden" name="id" value="${user.id}">
              <div class="form-group">
                <label class="form-label">Nombre</label>
                <input type="text" class="form-control" name="nombre" value="${user.nombre}" required>
              </div>
              <div class="form-group">
                <label class="form-label">Email</label>
                <input type="email" class="form-control" name="email" value="${user.email}" required>
              </div>
              <div class="form-group">
                <label class="form-label">Teléfono</label>
                <input type="text" class="form-control" name="telefono" value="${user.telefono || ""}">
              </div>
              <div class="form-group">
                <label class="form-label">Dirección</label>
                <input type="text" class="form-control" name="direccion" value="${user.direccion || ""}">
              </div>
              <div class="form-group">
                <label class="form-label">Rol</label>
                <select class="form-control" name="rol" required>
                  <option value="CLIENTE" ${user.rol === "CLIENTE" ? "selected" : ""}>Cliente</option>
                  <option value="PROVEEDOR" ${user.rol === "PROVEEDOR" ? "selected" : ""}>Proveedor</option>
                  <option value="ADMIN" ${user.rol === "ADMIN" ? "selected" : ""}>Administrador</option>
                </select>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" onclick="document.getElementById('editUserModal').remove()">Cancelar</button>
            <button class="btn btn-primary" onclick="actualizarUsuario()">Actualizar</button>
          </div>
        </div>
      </div>
    `
    document.body.insertAdjacentHTML("beforeend", modalHtml)
  } catch (error) {
    console.error("Error al cargar usuario para editar:", error)
    alert("No se pudo cargar el usuario para editar.")
  }
}

window.actualizarUsuario = async () => {
  const form = document.getElementById("editUserForm")
  if (!form) {
    alert("Formulario no encontrado")
    return
  }

  const formData = new FormData(form)

  // Validaciones
  const email = formData.get("email")
  if (!email || !email.includes("@")) {
    alert("Por favor ingresa un email válido")
    return
  }

  const usuario = {
    nombre: formData.get("nombre").trim(),
    email: email.trim(),
    telefono: formData.get("telefono")?.trim() || null,
    direccion: formData.get("direccion")?.trim() || null,
    rol: formData.get("rol"),
    activo: true, // Mantener activo por defecto
  }

  try {
    const id = Number.parseInt(formData.get("id"))
    await apiService.updateUsuario(id, usuario)
    alert("Usuario actualizado correctamente.")
    document.getElementById("editUserModal").remove()
    location.reload()
  } catch (error) {
    console.error("Error al actualizar usuario:", error)
    alert(`Error al actualizar el usuario: ${error.message}`)
  }
}

export async function createAdminViews() {
  try {
    const dashboard = await createAdminDashboardView()
    const users = await createAdminUsersView()
    const rentals = await createAdminRentalsView()
    const reports = await createAdminReportsView()
    const settings = await createAdminSettingsView()

    return `${dashboard}${users}${rentals}${reports}${settings}`
  } catch (error) {
    console.error("Error creating admin views:", error)
    return `<div class="error-message">Error al cargar las vistas de administrador.</div>`
  }
}
