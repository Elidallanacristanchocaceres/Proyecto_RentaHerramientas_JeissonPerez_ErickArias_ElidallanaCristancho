import { apiService } from "../services/apiService.js"
import { createStatCard } from "../components/cards.js"
import { createTable } from "../components/tables.js"

async function createProviderDashboardView() {
  try {
    const [tools, rentals] = await Promise.all([apiService.getHerramientas(), apiService.getReservas()])

    const providerTools = tools.filter((tool) => tool.proveedorId === 1)
    const providerRentals = rentals.filter((r) => r.proveedorId === 1)

    const stats = {
      tools: {
        value: providerTools.length.toString(),
        change: { type: "positive", icon: "fas fa-arrow-up", text: "5% desde el mes pasado" },
      },
      rentals: {
        value: providerRentals.length.toString(),
        change: { type: "positive", icon: "fas fa-arrow-up", text: "12% desde el mes pasado" },
      },
      income: {
        value: `$${providerRentals.reduce((sum, r) => sum + Number.parseFloat(r.precio || 0), 0).toFixed(2)}`,
        change: { type: "positive", icon: "fas fa-arrow-up", text: "8% desde el mes pasado" },
      },
      occupation: {
        value: `${Math.min((providerRentals.length / Math.max(providerTools.length, 1)) * 100, 100).toFixed(0)}%`,
        change: { type: "positive", icon: "fas fa-arrow-up", text: "3% desde el mes pasado" },
      },
    }

    const recentRequests = providerRentals.slice(0, 3).map((rental) => [
      rental.id,
      rental.cliente?.nombre || "Cliente no disponible",
      rental.herramienta?.nombre || "Herramienta no disponible",
      new Date().toLocaleDateString(),
      rental.fechaInicio || "No especificada",
      rental.fechaFin || "No especificada",
      `<span class="status status-${rental.estado?.toLowerCase() || "unknown"}">${rental.estado || "Desconocido"}</span>`,
      `<div class="action-buttons-group">
         <button class="btn-icon" onclick="aprobarReserva(${rental.id})" title="Aprobar">
           <i class="fas fa-check-circle"></i>
         </button>
         <button class="btn-icon" onclick="rechazarReserva(${rental.id})" title="Rechazar">
           <i class="fas fa-times-circle"></i>
         </button>
       </div>`,
    ])

    return `
      <div class="view provider-view provider-dashboard-view">
        <div class="dashboard-header">
          <div class="dashboard-title">Panel de Proveedor</div>
          <div class="action-buttons">
            <button class="btn btn-secondary" onclick="exportarDatos()">
              <i class="fas fa-download"></i>
              <span>Exportar</span>
            </button>
            <button class="btn btn-primary" id="addToolBtn">
              <i class="fas fa-plus"></i>
              <span>Nueva Herramienta</span>
            </button>
          </div>
        </div>
        <div class="stats-container">
          ${createStatCard("Herramientas Totales", stats.tools.value, "fas fa-tools", "#11cdef", stats.tools.change)}
          ${createStatCard("Alquileres Activos", stats.rentals.value, "fas fa-clipboard-list", "#fb6340", stats.rentals.change)}
          ${createStatCard("Ingresos Mensuales", stats.income.value, "fas fa-dollar-sign", "#2dce89", stats.income.change)}
          ${createStatCard("Tasa de Ocupación", stats.occupation.value, "fas fa-percentage", "#5e72e4", stats.occupation.change)}
        </div>
        ${createTable("Solicitudes Recientes", ["ID", "Cliente", "Herramienta", "Fecha Solicitud", "Fecha Inicio", "Fecha Fin", "Estado", "Acciones"], recentRequests)}
      </div>
    `
  } catch (error) {
    console.error("Error fetching provider dashboard data:", error)
    return `<div class="error-message">Error al cargar los datos del dashboard.</div>`
  }
}

async function createProviderToolsView() {
  try {
    const tools = await apiService.getHerramientas()
    const myTools = tools.filter((tool) => tool.proveedorId === 1)

    const available = myTools.filter((t) => t.activa).length
    const rented = myTools.filter((t) => !t.activa).length

    const toolCards = myTools
      .slice(0, 6)
      .map(
        (tool) => `
      <div class="tool-card">
        <div class="tool-image">
          <img src="${tool.imagenUrl || "/placeholder.svg?height=180&width=300"}" alt="${tool.nombre}" />
        </div>
        <div class="tool-info">
          <h3>${tool.nombre}</h3>
          <p><strong>Categoría:</strong> ${tool.categoria || "Sin categoría"}</p>
          <p><strong>Precio:</strong> $${Number.parseFloat(tool.costoPorDia || 0).toFixed(2)} / día</p>
          <p><strong>Estado:</strong> 
            <span class="status status-${tool.activa ? "available" : "maintenance"}">
              ${tool.activa ? "Disponible" : "No disponible"}
            </span>
          </p>
          <div class="actions">
            <button class="btn btn-secondary" onclick="verDetallesHerramienta(${tool.id})">
              <i class="fas fa-eye"></i> Ver
            </button>
            <button class="btn btn-primary" onclick="editarHerramientaModal(${tool.id})">
              <i class="fas fa-edit"></i> Editar
            </button>
            <button class="btn btn-danger" onclick="eliminarHerramienta(${tool.id})">
              <i class="fas fa-trash"></i> Eliminar
            </button>
          </div>
        </div>
      </div>
    `,
      )
      .join("")

    return `
      <div class="view provider-view provider-tools-view hidden">
        <div class="dashboard-header">
          <div class="dashboard-title">Mis Herramientas</div>
          <div class="action-buttons">
            <button class="btn btn-secondary" onclick="filtrarHerramientas()">
              <i class="fas fa-filter"></i>
              <span>Filtrar</span>
            </button>
            <button class="btn btn-primary" id="addToolBtn2">
              <i class="fas fa-plus"></i>
              <span>Nueva Herramienta</span>
            </button>
          </div>
        </div>
        <div class="stats-container">
          ${createStatCard("Herramientas Disponibles", available.toString(), "fas fa-check-circle", "#11cdef", { text: `${Math.round((available / Math.max(myTools.length, 1)) * 100)}% del inventario` })}
          ${createStatCard("Herramientas No Disponibles", rented.toString(), "fas fa-clock", "#fb6340", { text: `${Math.round((rented / Math.max(myTools.length, 1)) * 100)}% del inventario` })}
          ${createStatCard("Categorías", [...new Set(myTools.map((t) => t.categoria))].length.toString(), "fas fa-tags", "#5e72e4", { type: "positive", icon: "fas fa-arrow-up", text: "1 nueva categoría" })}
          ${createStatCard("Ingresos Estimados", `$${myTools.reduce((sum, t) => sum + Number.parseFloat(t.costoPorDia || 0), 0).toFixed(2)}`, "fas fa-dollar-sign", "#2dce89", { text: "Por día completo" })}
        </div>
        <div class="tools-grid">
          ${toolCards}
        </div>
      </div>
    `
  } catch (error) {
    console.error("Error fetching tools:", error)
    return `<div class="error-message">Error al cargar tus herramientas.</div>`
  }
}

async function createProviderSettingsView() {
  return `
    <div class="view provider-view provider-settings-view hidden">
      <div class="dashboard-header">
        <div class="dashboard-title">Configuración de Proveedor</div>
        <div class="action-buttons">
          <button class="btn btn-secondary" onclick="exportarConfiguracion()">
            <i class="fas fa-download"></i>
            <span>Exportar</span>
          </button>
          <button class="btn btn-primary" onclick="guardarConfiguracionProveedor()">
            <i class="fas fa-save"></i>
            <span>Guardar</span>
          </button>
        </div>
      </div>
      
      <div class="settings-container">
        <div class="settings-section">
          <h3>Información del Negocio</h3>
          <div class="form-group">
            <label class="form-label">Nombre del Negocio</label>
            <input type="text" class="form-control" value="Mi Empresa de Herramientas" id="businessName">
          </div>
          <div class="form-group">
            <label class="form-label">Descripción</label>
            <textarea class="form-control" id="businessDescription">Proveedor de herramientas de construcción de alta calidad</textarea>
          </div>
          <div class="form-group">
            <label class="form-label">Dirección del Negocio</label>
            <input type="text" class="form-control" value="Calle 123 #45-67" id="businessAddress">
          </div>
        </div>

        <div class="settings-section">
          <h3>Configuración de Precios</h3>
          <div class="form-group">
            <label class="form-label">Descuento por Volumen (%)</label>
            <input type="number" class="form-control" value="5" min="0" max="50" id="volumeDiscount">
          </div>
          <div class="form-group">
            <label class="form-label">Precio Mínimo por Día</label>
            <input type="number" class="form-control" value="10" min="1" id="minimumPrice">
          </div>
        </div>

        <div class="settings-section">
          <h3>Horarios de Atención</h3>
          <div class="form-group">
            <label class="form-label">Lunes a Viernes</label>
            <div class="time-range">
              <input type="time" class="form-control" value="08:00" id="weekdayStart">
              <span>a</span>
              <input type="time" class="form-control" value="18:00" id="weekdayEnd">
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Sábados</label>
            <div class="time-range">
              <input type="time" class="form-control" value="09:00" id="saturdayStart">
              <span>a</span>
              <input type="time" class="form-control" value="15:00" id="saturdayEnd">
            </div>
          </div>
          <div class="form-group">
            <label><input type="checkbox" id="sundayOpen"> Abierto los domingos</label>
          </div>
        </div>

        <div class="settings-section">
          <h3>Políticas de Alquiler</h3>
          <div class="form-group">
            <label class="form-label">Tiempo Mínimo de Alquiler (días)</label>
            <input type="number" class="form-control" value="1" min="1" id="minimumRentalDays">
          </div>
          <div class="form-group">
            <label class="form-label">Depósito de Seguridad (%)</label>
            <input type="number" class="form-control" value="20" min="0" max="100" id="securityDeposit">
          </div>
        </div>
      </div>
    </div>
  `
}

// Funciones globales para el proveedor
window.aprobarReserva = async (reservaId) => {
  try {
    const reserva = await apiService.getReservaById(reservaId)
    const reservaActualizada = {
      ...reserva,
      estado: "Aprobada",
    }
    await apiService.updateReserva(reservaId, reservaActualizada)
    alert("Reserva aprobada correctamente.")
    location.reload()
  } catch (err) {
    console.error("Error al aprobar reserva:", err)
    alert(`No se pudo aprobar la reserva: ${err.message}`)
  }
}

window.rechazarReserva = async (reservaId) => {
  if (confirm("¿Estás seguro de que quieres rechazar esta reserva?")) {
    try {
      const reserva = await apiService.getReservaById(reservaId)
      const reservaActualizada = {
        ...reserva,
        estado: "Rechazada",
      }
      await apiService.updateReserva(reservaId, reservaActualizada)
      alert("Reserva rechazada.")
      location.reload()
    } catch (err) {
      console.error("Error al rechazar reserva:", err)
      alert(`No se pudo rechazar la reserva: ${err.message}`)
    }
  }
}

export async function createProviderViews() {
  const dashboard = await createProviderDashboardView()
  const tools = await createProviderToolsView()
  const settings = await createProviderSettingsView()

  return `${dashboard}${tools}${settings}`
}
