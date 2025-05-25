import { apiService } from "../services/apiService.js"
import { createStatCard } from "../components/cards.js"
import { createTable } from "../components/tables.js"
import { createEditToolModal } from "../components/modals.js"

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
      `<button class="btn-icon" onclick="aprobarReserva(${rental.id})" title="Aprobar">
         <i class="fas fa-check-circle"></i>
       </button>
       <button class="btn-icon" onclick="rechazarReserva(${rental.id})" title="Rechazar">
         <i class="fas fa-times-circle"></i>
       </button>`,
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
            <button class="btn btn-primary" onclick="editarHerramienta(${tool.id})">
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

async function createProviderRentalsView() {
  try {
    const [rentals, tools] = await Promise.all([apiService.getReservas(), apiService.getHerramientas()])

    const providerRentals = rentals.filter((r) => r.proveedorId === 1)

    const pending = providerRentals.filter((r) => r.estado === "Pendiente").length
    const active = providerRentals.filter((r) => r.estado === "En Alquiler").length
    const completed = providerRentals.filter((r) => r.estado === "Completado").length

    const rentalRows = providerRentals.slice(0, 5).map((rental) => {
      const tool = tools.find((t) => t.id === rental.herramientaId) || { nombre: "Herramienta no encontrada" }
      return [
        rental.id,
        rental.cliente?.nombre || "Cliente no disponible",
        tool.nombre,
        new Date().toLocaleDateString(),
        rental.fechaInicio || "No especificada",
        rental.fechaFin || "No especificada",
        `<span class="status status-${rental.estado?.toLowerCase() || "unknown"}">${rental.estado || "Desconocido"}</span>`,
        `<button class="btn-icon" onclick="aprobarReserva(${rental.id})" title="Aprobar">
           <i class="fas fa-check-circle"></i>
         </button>
         <button class="btn-icon" onclick="rechazarReserva(${rental.id})" title="Rechazar">
           <i class="fas fa-times-circle"></i>
         </button>
         <button class="btn-icon" onclick="abrirModalFactura(${rental.id})" title="Generar factura">
           <i class="fas fa-file-invoice"></i>
         </button>`,
      ]
    })

    return `
      <div class="view provider-view provider-rentals-view hidden">
        <div class="dashboard-header">
          <div class="dashboard-title">Gestión de Reservas</div>
          <div class="action-buttons">
            <button class="btn btn-secondary" onclick="filtrarReservas()">
              <i class="fas fa-filter"></i>
              <span>Filtrar</span>
            </button>
            <button class="btn btn-primary" onclick="exportarReservas()">
              <i class="fas fa-download"></i>
              <span>Exportar</span>
            </button>
          </div>
        </div>
        <div class="stats-container">
          ${createStatCard("Solicitudes Nuevas", pending.toString(), "fas fa-bell", "#5e72e4", { type: "positive", icon: "fas fa-arrow-up", text: "3 más que ayer" })}
          ${createStatCard("Alquileres Activos", active.toString(), "fas fa-clipboard-list", "#fb6340", { type: "positive", icon: "fas fa-arrow-up", text: "5 más que ayer" })}
          ${createStatCard("Completados", completed.toString(), "fas fa-check-circle", "#2dce89", { text: "Total completados" })}
          ${createStatCard("Reportes Pendientes", "0", "fas fa-exclamation-triangle", "#f5365c", { type: "negative", icon: "fas fa-arrow-up", text: "0 nuevos" })}
        </div>
        ${createTable("Solicitudes de Alquiler", ["ID", "Cliente", "Herramienta", "Fecha Solicitud", "Fecha Inicio", "Fecha Fin", "Estado", "Acciones"], rentalRows)}
      </div>
    `
  } catch (error) {
    console.error("Error fetching rentals:", error)
    return `<div class="error-message">Error al cargar las reservas.</div>`
  }
}

async function createProviderBillingView() {
  try {
    const [rentals, facturas] = await Promise.all([apiService.getReservas(), apiService.getFacturas()])

    const providerRentals = rentals.filter((r) => r.proveedorId === 1)
    const totalIncome = providerRentals.reduce((sum, r) => sum + Number.parseFloat(r.precio || 0), 0)
    const monthlyIncome = totalIncome * 0.08

    const invoiceRows = facturas.slice(0, 5).map((factura) => [
      `F-${factura.id}`,
      factura.reserva?.cliente?.nombre || "Cliente no disponible",
      factura.fechaEmision || new Date().toLocaleDateString(),
      factura.reserva?.herramienta?.nombre || "Herramienta no disponible",
      `$${Number.parseFloat(factura.monto || 0).toFixed(2)}`,
      `<span class="status status-${factura.estado?.toLowerCase() || "pendiente"}">${factura.estado || "Pendiente"}</span>`,
      `<button class="btn-icon" onclick="verFactura(${factura.id})" title="Ver factura">
         <i class="fas fa-eye"></i>
       </button>
       <button class="btn-icon" onclick="descargarFactura(${factura.id})" title="Descargar">
         <i class="fas fa-download"></i>
       </button>`,
    ])

    return `
      <div class="view provider-view provider-billing-view hidden">
        <div class="dashboard-header">
          <div class="dashboard-title">Facturación</div>
          <div class="action-buttons">
            <button class="btn btn-secondary" onclick="filtrarFacturas()">
              <i class="fas fa-filter"></i>
              <span>Filtrar</span>
            </button>
            <button class="btn btn-primary" onclick="exportarFacturas()">
              <i class="fas fa-download"></i>
              <span>Exportar</span>
            </button>
          </div>
        </div>
        <div class="stats-container">
          ${createStatCard("Ingresos Totales", `$${totalIncome.toFixed(2)}`, "fas fa-dollar-sign", "#2dce89", { type: "positive", icon: "fas fa-arrow-up", text: "12% desde el año pasado" })}
          ${createStatCard("Ingresos Mensuales", `$${monthlyIncome.toFixed(2)}`, "fas fa-chart-line", "#2dce89", { type: "positive", icon: "fas fa-arrow-up", text: "8% desde el mes pasado" })}
          ${createStatCard("Facturas Pendientes", facturas.filter((f) => f.estado === "Pendiente").length.toString(), "fas fa-file-invoice-dollar", "#fb6340", { text: "Por cobrar" })}
          ${createStatCard("Comisión Plataforma", `$${(monthlyIncome * 0.1).toFixed(2)}`, "fas fa-percentage", "#5e72e4", { text: "10% de los ingresos" })}
        </div>
        ${createTable("Facturas Recientes", ["ID Factura", "Cliente", "Fecha", "Herramienta", "Monto", "Estado", "Acciones"], invoiceRows)}
      </div>
    `
  } catch (error) {
    console.error("Error fetching billing data:", error)
    return `<div class="error-message">Error al cargar la facturación.</div>`
  }
}

// Funciones globales para el proveedor
window.editarHerramienta = async (herramientaId) => {
  try {
    const herramienta = await apiService.getHerramientaById(herramientaId)
    const modal = createEditToolModal(herramienta)
    document.body.insertAdjacentHTML("beforeend", modal)
  } catch (e) {
    console.error("Error al cargar herramienta para editar:", e)
    alert("No se pudo cargar la herramienta para editar.")
  }
}

window.eliminarHerramienta = async (herramientaId) => {
  if (confirm("¿Estás seguro de que quieres eliminar esta herramienta?")) {
    try {
      await apiService.deleteHerramienta(herramientaId)
      alert("Herramienta eliminada correctamente.")
      location.reload()
    } catch (e) {
      console.error("Error al eliminar herramienta:", e)
      alert("No se pudo eliminar la herramienta.")
    }
  }
}

window.aprobarReserva = async (reservaId) => {
  try {
    const reserva = await apiService.getReservaById(reservaId)
    reserva.estado = "Aprobada"
    await apiService.updateReserva(reservaId, reserva)
    alert("Reserva aprobada correctamente.")
    location.reload()
  } catch (err) {
    console.error("Error al aprobar reserva:", err)
    alert("No se pudo aprobar la reserva.")
  }
}

window.rechazarReserva = async (reservaId) => {
  if (confirm("¿Estás seguro de que quieres rechazar esta reserva?")) {
    try {
      const reserva = await apiService.getReservaById(reservaId)
      reserva.estado = "Rechazada"
      await apiService.updateReserva(reservaId, reserva)
      alert("Reserva rechazada.")
      location.reload()
    } catch (err) {
      console.error("Error al rechazar reserva:", err)
      alert("No se pudo rechazar la reserva.")
    }
  }
}

window.verFactura = async (facturaId) => {
  try {
    const factura = await apiService.getFacturaById(facturaId)
    const modalHtml = `
      <div class="modal-overlay show" id="facturaDetallesModal">
        <div class="modal">
          <div class="modal-header">
            <div class="modal-title">Factura #${factura.id}</div>
            <button class="modal-close" onclick="document.getElementById('facturaDetallesModal').remove()">&times;</button>
          </div>
          <div class="modal-body">
            <p><strong>Monto:</strong> $${Number.parseFloat(factura.monto || 0).toFixed(2)}</p>
            <p><strong>Estado:</strong> ${factura.estado}</p>
            <p><strong>Fecha de emisión:</strong> ${factura.fechaEmision}</p>
            <p><strong>Reserva ID:</strong> ${factura.reservaId}</p>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" onclick="document.getElementById('facturaDetallesModal').remove()">Cerrar</button>
          </div>
        </div>
      </div>
    `
    document.body.insertAdjacentHTML("beforeend", modalHtml)
  } catch (err) {
    console.error("Error al cargar factura:", err)
    alert("No se pudo cargar la factura.")
  }
}

export async function createProviderViews() {
  return `
    ${await createProviderDashboardView()}
    ${await createProviderToolsView()}
    ${await createProviderRentalsView()}
    ${await createProviderBillingView()}
  `
}
