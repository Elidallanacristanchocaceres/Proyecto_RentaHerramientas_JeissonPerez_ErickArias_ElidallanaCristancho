import { apiService } from "../services/apiService.js"
import { createStatCard, createToolCard } from "../components/cards.js"
import { createTable } from "../components/tables.js"

async function createClientDashboardView() {
  try {
    const [rentals, tools, facturas] = await Promise.all([
      apiService.getReservas(),
      apiService.getHerramientas(),
      apiService.getFacturas(),
    ])

    const clienteId = Number.parseInt(localStorage.getItem("userId")) || 1
    const activeRentals = rentals.filter((r) => r.clienteId === clienteId && r.estado === "En Alquiler")
    const pendingPayments = facturas.filter((f) => f.estado === "Pendiente")

    return `
      <div class="view client-view client-dashboard-view">
        <div class="dashboard-header">
          <div class="dashboard-title">Mi Panel</div>
          <div class="action-buttons">
            <button class="btn btn-primary" onclick="navegarAExplorar()">
              <i class="fas fa-search"></i>
              <span>Buscar Herramientas</span>
            </button>
          </div>
        </div>

        <div class="stats-container">
          ${createStatCard("Alquileres Activos", activeRentals.length.toString(), "fas fa-clipboard-list", "#fb6340", { text: "Última devolución: hace 2 semanas" })}
          ${createStatCard("Historial de Alquileres", rentals.filter((r) => r.clienteId === clienteId).length.toString(), "fas fa-history", "#5e72e4", { text: "Último: hace 3 semanas" })}
          ${createStatCard("Pagos Pendientes", pendingPayments.length.toString(), "fas fa-file-invoice-dollar", "#f5365c", { text: "Vence: 20/05/2023" })}
          ${createStatCard("Herramientas Favoritas", "5", "fas fa-heart", "#2dce89", { text: "Taladro Industrial añadido recientemente" })}
        </div>

        ${createTable(
          "Mis Alquileres Activos",
          ["ID", "Herramienta", "Proveedor", "Fecha Inicio", "Fecha Fin", "Monto", "Estado", "Acciones"],
          activeRentals.slice(0, 3).map((rental) => [
            rental.id,
            rental.herramienta?.nombre || "Herramienta no disponible",
            rental.proveedor?.nombre || "Proveedor no encontrado",
            rental.fechaInicio || "No especificada",
            rental.fechaFin || "No especificada",
            `$${Number.parseFloat(rental.precio || 0).toFixed(2)}`,
            `<span class="status status-rented">${rental.estado || "En Alquiler"}</span>`,
            `<button class="btn-icon" onclick="verDetallesReserva(${rental.id})" title="Ver detalles">
           <i class="fas fa-eye"></i>
         </button>
         <button class="btn-icon" onclick="devolverHerramienta(${rental.id})" title="Devolver">
           <i class="fas fa-undo"></i>
         </button>`,
          ]),
        )}
      </div>
    `
  } catch (error) {
    console.error("Error fetching client dashboard data:", error)
    return `<div class="error-message">Error al cargar los datos del dashboard.</div>`
  }
}

async function createClientExploreView() {
  try {
    const tools = await apiService.getHerramientas()
    const availableTools = tools.filter((tool) => tool.activa && tool.cantidadDisponible > 0)

    const toolCards = availableTools.map((tool) => createToolCard(tool)).join("")

    return `
      <div class="view client-view client-explore-view hidden">
        <div class="dashboard-header">
          <div class="dashboard-title">Explorar Herramientas</div>
          <div class="action-buttons">
            <button class="btn btn-secondary" onclick="filtrarHerramientas()">
              <i class="fas fa-filter"></i>
              <span>Filtrar</span>
            </button>
            <div class="search-box">
              <i class="fas fa-search"></i>
              <input type="text" placeholder="Buscar herramientas..." onkeyup="buscarHerramientas(this)">
            </div>
          </div>
        </div>

        <div class="tools-grid" id="toolsGrid">
          ${toolCards}
        </div>
      </div>
    `
  } catch (error) {
    console.error("Error fetching explore view:", error)
    return `<div class="error-message">Error al cargar las herramientas.</div>`
  }
}

async function createClientRentalsView() {
  try {
    const rentals = await apiService.getReservas()
    const clienteId = Number.parseInt(localStorage.getItem("userId")) || 1
    const userRentals = rentals.filter((r) => r.clienteId === clienteId)

    const activeRentals = userRentals.filter((r) => r.estado === "En Alquiler" || r.estado === "Aprobada")
    const historyRentals = userRentals.filter((r) => r.estado === "Completado")

    return `
      <div class="view client-view client-rentals-view hidden">
        <div class="dashboard-header">
          <div class="dashboard-title">Mis Alquileres</div>
          <div class="action-buttons">
            <button class="btn btn-secondary" onclick="filtrarAlquileres()">
              <i class="fas fa-filter"></i>
              <span>Filtrar</span>
            </button>
            <button class="btn btn-primary" onclick="navegarAExplorar()">
              <i class="fas fa-search"></i>
              <span>Buscar Herramientas</span>
            </button>
          </div>
        </div>

        ${createTable(
          "Alquileres Activos",
          ["ID", "Herramienta", "Proveedor", "Fecha Inicio", "Fecha Fin", "Monto", "Estado", "Acciones"],
          activeRentals.map((rental) => [
            rental.id,
            rental.herramienta?.nombre || "Herramienta no disponible",
            rental.proveedor?.nombre || "Proveedor no encontrado",
            rental.fechaInicio || "No especificada",
            rental.fechaFin || "No especificada",
            `$${Number.parseFloat(rental.precio || 0).toFixed(2)}`,
            `<span class="status status-rented">${rental.estado || "En Alquiler"}</span>`,
            `<button class="btn-icon" onclick="verDetallesReserva(${rental.id})" title="Ver detalles">
           <i class="fas fa-eye"></i>
         </button>
         <button class="btn-icon" onclick="devolverHerramienta(${rental.id})" title="Devolver">
           <i class="fas fa-undo"></i>
         </button>`,
          ]),
        )}

        ${createTable(
          "Historial de Alquileres",
          ["ID", "Herramienta", "Proveedor", "Fecha Inicio", "Fecha Fin", "Monto", "Estado", "Acciones"],
          historyRentals.map((rental) => [
            rental.id,
            rental.herramienta?.nombre || "Herramienta no disponible",
            rental.proveedor?.nombre || "Proveedor no encontrado",
            rental.fechaInicio || "No especificada",
            rental.fechaFin || "No especificada",
            `$${Number.parseFloat(rental.precio || 0).toFixed(2)}`,
            `<span class="status status-available">${rental.estado || "Completado"}</span>`,
            `<button class="btn-icon" onclick="verDetallesReserva(${rental.id})" title="Ver detalles">
           <i class="fas fa-eye"></i>
         </button>
         <button class="btn-icon" onclick="abrirModalFactura(${rental.id})" title="Ver factura">
           <i class="fas fa-file-invoice"></i>
         </button>`,
          ]),
        )}
      </div>
    `
  } catch (error) {
    console.error("Error fetching rentals:", error)
    return `<div class="error-message">Error al cargar tus alquileres.</div>`
  }
}

async function createClientPaymentsView() {
  try {
    const facturas = await apiService.getFacturas()
    const clienteId = Number.parseInt(localStorage.getItem("userId")) || 1
    const userInvoices = facturas.filter((f) => f.clienteId === clienteId)

    const paidInvoices = userInvoices.filter((f) => f.estado === "Pagada")
    const pendingInvoices = userInvoices.filter((f) => f.estado === "Pendiente")

    const totalPaid = paidInvoices.reduce((sum, inv) => sum + Number.parseFloat(inv.monto || 0), 0)
    const pendingAmount = pendingInvoices.reduce((sum, inv) => sum + Number.parseFloat(inv.monto || 0), 0)

    return `
      <div class="view client-view client-payments-view hidden">
        <div class="dashboard-header">
          <div class="dashboard-title">Mis Pagos</div>
          <div class="action-buttons">
            <button class="btn btn-secondary" onclick="filtrarPagos()">
              <i class="fas fa-filter"></i>
              <span>Filtrar</span>
            </button>
            <button class="btn btn-primary" id="exportInvoicesBtn">
              <i class="fas fa-download"></i>
              <span>Exportar</span>
            </button>
          </div>
        </div>

        <div class="stats-container">
          ${createStatCard("Total Pagado", `$${totalPaid.toFixed(2)}`, "fas fa-dollar-sign", "#2dce89", { text: "Últimos 12 meses" })}
          ${createStatCard("Pagos Pendientes", `$${pendingAmount.toFixed(2)}`, "fas fa-file-invoice-dollar", "#f5365c", { text: "Próximo vencimiento: 20/05/2023" })}
          ${createStatCard("Método de Pago", "Visa", "fas fa-credit-card", "#5e72e4", { text: "Termina en 4582" })}
          ${createStatCard("Facturas Disponibles", userInvoices.length.toString(), "fas fa-file-invoice", "#2dce89", { text: "Descargables en PDF" })}
        </div>

        ${createTable(
          "Historial de Pagos",
          ["ID Factura", "Herramienta", "Fecha", "Monto", "Estado", "Acciones"],
          userInvoices.slice(0, 5).map((invoice) => [
            `F-${invoice.id}`,
            invoice.reserva?.herramienta?.nombre || "Herramienta no disponible",
            invoice.fechaEmision || new Date().toLocaleDateString(),
            `$${Number.parseFloat(invoice.monto || 0).toFixed(2)}`,
            `<span class="status status-${invoice.estado?.toLowerCase() || "pendiente"}">${invoice.estado || "Desconocida"}</span>`,
            `<button class="btn-icon" onclick="verFactura(${invoice.id})" title="Ver factura">
           <i class="fas fa-eye"></i>
         </button>
         <button class="btn-icon" onclick="descargarFactura(${invoice.id})" title="Descargar">
           <i class="fas fa-download"></i>
         </button>`,
          ]),
        )}
      </div>
    `
  } catch (error) {
    console.error("Error fetching payments:", error)
    return `<div class="error-message">Error al cargar tus pagos.</div>`
  }
}

// Funciones globales para el cliente
window.verDetallesHerramienta = async (id) => {
  try {
    const tool = await apiService.getHerramientaById(id)
    const modalHtml = `
      <div class="modal-overlay show" id="toolDetailsModal">
        <div class="modal">
          <div class="modal-header">
            <div class="modal-title">${tool.nombre}</div>
            <button class="modal-close" onclick="document.getElementById('toolDetailsModal').remove()">&times;</button>
          </div>
          <div class="modal-body">
            <p><strong>Marca:</strong> ${tool.marca || "No especificada"}</p>
            <p><strong>Modelo:</strong> ${tool.modelo || "No especificado"}</p>
            <p><strong>Categoría:</strong> ${tool.categoria || "Sin categoría"}</p>
            <p><strong>Precio por día:</strong> $${Number.parseFloat(tool.costoPorDia || 0).toFixed(2)}</p>
            <p><strong>Cantidad disponible:</strong> ${tool.cantidadDisponible || 0}</p>
            <p><strong>Descripción:</strong> ${tool.descripcion || "Sin descripción"}</p>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" onclick="document.getElementById('toolDetailsModal').remove()">Cerrar</button>
            <button class="btn btn-primary" onclick="alquilarHerramienta(${tool.id})">Alquilar</button>
          </div>
        </div>
      </div>
    `
    document.body.insertAdjacentHTML("beforeend", modalHtml)
  } catch (e) {
    console.error("No se pudo obtener detalles:", e)
    alert("No se pudieron cargar los detalles de la herramienta.")
  }
}

window.alquilarHerramienta = async (herramientaId) => {
  try {
    const clienteId = Number.parseInt(localStorage.getItem("userId")) || 1
    const hoy = new Date().toISOString().split("T")[0]
    const manana = new Date()
    manana.setDate(manana.getDate() + 1)
    const fechaFin = manana.toISOString().split("T")[0]

    const reserva = {
      herramientaId,
      clienteId,
      fechaInicio: hoy,
      fechaFin: fechaFin,
      estado: "Pendiente",
    }

    await apiService.createReserva(reserva)
    alert("Reserva creada correctamente. Esperando aprobación del proveedor.")

    // Cerrar modal si está abierto
    const modal = document.getElementById("toolDetailsModal")
    if (modal) modal.remove()
  } catch (err) {
    console.error("Error al alquilar herramienta:", err)
    alert("No se pudo crear la reserva. Inténtalo de nuevo.")
  }
}

window.devolverHerramienta = async (reservaId) => {
  if (confirm("¿Estás seguro de que quieres devolver esta herramienta?")) {
    try {
      const reserva = await apiService.getReservaById(reservaId)
      reserva.estado = "Completado"
      await apiService.updateReserva(reservaId, reserva)
      alert("Herramienta devuelta correctamente.")
      location.reload()
    } catch (err) {
      console.error("Error al devolver herramienta:", err)
      alert("No se pudo procesar la devolución.")
    }
  }
}

window.navegarAExplorar = () => {
  // Cambiar a la vista de explorar
  document.querySelectorAll(".nav-item").forEach((item) => {
    item.classList.remove("active")
  })
  document.querySelector('[data-view="client-explore"]').classList.add("active")

  document.querySelectorAll(".view").forEach((view) => {
    view.classList.add("hidden")
  })
  document.querySelector(".client-explore-view").classList.remove("hidden")
}

window.buscarHerramientas = (input) => {
  const filter = input.value.toLowerCase()
  const toolCards = document.querySelectorAll(".tool-card")

  toolCards.forEach((card) => {
    const text = card.textContent.toLowerCase()
    card.style.display = text.includes(filter) ? "" : "none"
  })
}

export async function createClientViews() {
  return `
    ${await createClientDashboardView()}
    ${await createClientExploreView()}
    ${await createClientRentalsView()}
    ${await createClientPaymentsView()}
  `
}
