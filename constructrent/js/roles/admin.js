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
      `$${Number.parseFloat(rental.precio || 0).toFixed(2)}`,
      `<button class="btn-icon" onclick="verDetallesReserva(${rental.id})" title="Ver detalles">
         <i class="fas fa-eye"></i>
       </button>
       <button class="btn-icon" onclick="editarReserva(${rental.id})" title="Editar">
         <i class="fas fa-edit"></i>
       </button>`,
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
          ${createStatCard("Ingresos del Mes", "$" + rentals.reduce((sum, r) => sum + Number.parseFloat(r.precio || 0), 0).toFixed(2), "fas fa-dollar-sign", "#2dce89", { type: "positive", icon: "fas fa-arrow-up", text: "15% desde el mes pasado" })}
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
      `<button class="btn-icon" onclick="verDetallesUsuario(${user.id})" title="Ver detalles">
         <i class="fas fa-eye"></i>
       </button>
       <button class="btn-icon" onclick="editarUsuario(${user.id})" title="Editar">
         <i class="fas fa-edit"></i>
       </button>
       <button class="btn-icon" onclick="eliminarUsuario(${user.id})" title="Eliminar">
         <i class="fas fa-trash"></i>
       </button>`,
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
      const provider = providers.find((p) => p.id === rental.proveedorId) || { nombre: "Proveedor no encontrado" }
      return [
        rental.id,
        rental.cliente?.nombre || "Cliente no disponible",
        provider.nombre,
        rental.herramienta?.nombre || "Herramienta no disponible",
        rental.fechaInicio || "No especificada",
        rental.fechaFin || "No especificada",
        `<span class="status status-${rental.estado?.toLowerCase() || "unknown"}">${rental.estado || "Desconocido"}</span>`,
        `$${Number.parseFloat(rental.precio || 0).toFixed(2)}`,
        `<button class="btn-icon" onclick="verDetallesReserva(${rental.id})" title="Ver detalles">
           <i class="fas fa-eye"></i>
         </button>
         <button class="btn-icon" onclick="editarReserva(${rental.id})" title="Editar">
           <i class="fas fa-edit"></i>
         </button>
         <button class="btn-icon" onclick="abrirModalFactura(${rental.id})" title="Generar factura">
           <i class="fas fa-file-invoice"></i>
         </button>`,
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
        const categoria = h.categoria || "Sin categoría"
        rentalsByCategory[categoria] = (rentalsByCategory[categoria] || 0) + 1
      })
    }

    const activeProvider = (Array.isArray(providers) ? providers : []).sort((a, b) => {
      const countA = (Array.isArray(reservas) ? reservas.filter((r) => r.proveedorId === a.id) : []).length
      const countB = (Array.isArray(reservas) ? reservas.filter((r) => r.proveedorId === b.id) : []).length
      return countB - countA
    })[0]

    const totalIngresos = facturas.reduce((sum, f) => sum + Number.parseFloat(f.monto || 0), 0)

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
    const nuevaFechaFin = prompt("Nueva fecha de fin (YYYY-MM-DD):", reserva.fechaFin)
    if (nuevaFechaFin && nuevaFechaFin !== reserva.fechaFin) {
      reserva.fechaFin = nuevaFechaFin
      await apiService.updateReserva(reservaId, reserva)
      alert("Reserva actualizada correctamente.")
      location.reload()
    }
  } catch (err) {
    console.error("Error al editar reserva:", err)
    alert("No se pudo editar la reserva.")
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

window.eliminarUsuario = async (userId) => {
  if (confirm("¿Estás seguro de que quieres eliminar este usuario?")) {
    try {
      await apiService.deleteUsuario(userId)
      alert("Usuario eliminado correctamente.")
      location.reload()
    } catch (err) {
      console.error("Error al eliminar usuario:", err)
      alert("No se pudo eliminar el usuario.")
    }
  }
}

export async function createAdminViews() {
  try {
    const dashboard = await createAdminDashboardView()
    const users = await createAdminUsersView()
    const rentals = await createAdminRentalsView()
    const reports = await createAdminReportsView()

    return `${dashboard}${users}${rentals}${reports}`
  } catch (error) {
    console.error("Error creating admin views:", error)
    return `<div class="error-message">Error al cargar las vistas de administrador.</div>`
  }
}
