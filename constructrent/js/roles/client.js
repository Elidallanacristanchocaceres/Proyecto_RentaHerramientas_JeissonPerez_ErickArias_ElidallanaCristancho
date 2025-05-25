import { apiService } from "../services/apiService.js"
import { createStatCard } from "../components/cards.js"
import { createTable } from "../components/tables.js"

function createToolCard(tool) {
  return `
    <div class="tool-card">
      <div class="tool-image">
        <img src="${tool.imagenUrl || "/placeholder.svg?height=180&width=300"}" alt="${tool.nombre}" />
        <div class="tool-status-badge status-${tool.activa ? "available" : "maintenance"}">
          ${tool.activa ? "Disponible" : "No disponible"}
        </div>
      </div>
      <div class="tool-info">
        <h3>${tool.nombre}</h3>
        <p><strong>Marca:</strong> ${tool.marca || "Sin marca"}</p>
        <p><strong>Modelo:</strong> ${tool.modelo || "Desconocido"}</p>
        <p><strong>Categoría:</strong> ${tool.categoria?.nombre || tool.categoria || "Sin categoría"}</p>
        <p><strong>Precio:</strong> $${Number.parseFloat(tool.costoPorDia || 0).toFixed(2)} / día</p>
        <p><strong>Cantidad disponible:</strong> ${tool.cantidadDisponible || 0}</p>
        <div class="actions">
          <button class="btn btn-secondary" onclick="verDetallesHerramienta(${tool.id})">
            <i class="fas fa-eye"></i> Ver detalles
          </button>
          <button class="btn btn-primary" onclick="alquilarHerramienta(${tool.id})" ${!tool.activa || tool.cantidadDisponible <= 0 ? "disabled" : ""}>
            <i class="fas fa-shopping-cart"></i> Alquilar
          </button>
        </div>
      </div>
    </div>
  `
}

async function createClientDashboardView() {
  try {
    const [tools, myRentals] = await Promise.all([apiService.getHerramientas(), apiService.getReservas()])

    // Filtrar herramientas disponibles
    const availableTools = tools.filter((tool) => tool.activa && tool.cantidadDisponible > 0)

    // Filtrar mis alquileres (asumiendo clienteId = 1 por ahora)
    const clientRentals = myRentals.filter((rental) => rental.cliente?.id === 1)

    // Estadísticas
    const activeRentals = clientRentals.filter((r) => r.estado === "APROBADA" || r.estado === "EN_ALQUILER").length
    const totalSpent = clientRentals.reduce((sum, r) => sum + Number.parseFloat(r.costoTotal || r.monto || 0), 0)
    const pendingRentals = clientRentals.filter((r) => r.estado === "PENDIENTE").length

    // Herramientas destacadas (primeras 6 disponibles)
    const featuredTools = availableTools
      .slice(0, 6)
      .map((tool) => createToolCard(tool))
      .join("")

    return `
      <div class="view client-view client-dashboard-view">
        <div class="dashboard-header">
          <div class="dashboard-title">Panel Principal</div>
          <div class="action-buttons">
            <button class="btn btn-secondary" onclick="buscarHerramientas()">
              <i class="fas fa-search"></i>
              <span>Buscar</span>
            </button>
            <button class="btn btn-primary" onclick="verCatalogo()">
              <i class="fas fa-tools"></i>
              <span>Ver Catálogo</span>
            </button>
          </div>
        </div>
        
        <div class="stats-container">
          ${createStatCard("Alquileres Activos", activeRentals.toString(), "fas fa-clipboard-list", "#fb6340", { text: "Alquileres en curso" })}
          ${createStatCard("Total Gastado", `$${totalSpent.toFixed(2)}`, "fas fa-dollar-sign", "#2dce89", { text: "Gasto total histórico" })}
          ${createStatCard("Solicitudes Pendientes", pendingRentals.toString(), "fas fa-clock", "#11cdef", { text: "Esperando aprobación" })}
          ${createStatCard("Herramientas Disponibles", availableTools.length.toString(), "fas fa-tools", "#5e72e4", { text: "Listas para alquilar" })}
        </div>

        <div class="section">
          <h2>Herramientas Destacadas</h2>
          <div class="tools-grid">
            ${featuredTools || "<p>No hay herramientas disponibles en este momento.</p>"}
          </div>
        </div>
      </div>
    `
  } catch (error) {
    console.error("Error fetching client dashboard data:", error)
    return `
      <div class="view client-view client-dashboard-view">
        <div class="error-message">
          <h3>Error al cargar el panel</h3>
          <p>No se pudieron cargar los datos del dashboard. Por favor, intenta recargar la página.</p>
          <button class="btn btn-primary" onclick="location.reload()">Recargar</button>
        </div>
      </div>
    `
  }
}

async function createClientExploreView() {
  try {
    const [tools, categories] = await Promise.all([apiService.getHerramientas(), apiService.getCategorias()])

    const availableTools = tools.filter((tool) => tool.activa && tool.cantidadDisponible > 0)
    const toolCards = availableTools.map((tool) => createToolCard(tool)).join("")

    const categoryOptions = categories
      .map((cat) => `<option value="${cat.nombre || cat}">${cat.nombre || cat}</option>`)
      .join("")

    return `
      <div class="view client-view client-explore-view hidden">
        <div class="dashboard-header">
          <div class="dashboard-title">Explorar Herramientas</div>
          <div class="action-buttons">
            <button class="btn btn-secondary" onclick="filtrarHerramientas()">
              <i class="fas fa-filter"></i>
              <span>Filtros</span>
            </button>
            <button class="btn btn-primary" onclick="ordenarHerramientas()">
              <i class="fas fa-sort"></i>
              <span>Ordenar</span>
            </button>
          </div>
        </div>

        <div class="filters-section">
          <div class="filter-group">
            <label>Categoría:</label>
            <select id="categoryFilter" onchange="aplicarFiltros()">
              <option value="">Todas las categorías</option>
              ${categoryOptions}
            </select>
          </div>
          <div class="filter-group">
            <label>Precio máximo por día:</label>
            <input type="number" id="priceFilter" placeholder="$0.00" onchange="aplicarFiltros()">
          </div>
          <div class="filter-group">
            <label>Buscar:</label>
            <input type="text" id="searchFilter" placeholder="Nombre de herramienta..." onkeyup="aplicarFiltros()">
          </div>
        </div>

        <div class="tools-grid" id="toolsGrid">
          ${toolCards || "<p>No hay herramientas disponibles.</p>"}
        </div>
      </div>
    `
  } catch (error) {
    console.error("Error fetching explore data:", error)
    return `
      <div class="view client-view client-explore-view hidden">
        <div class="error-message">Error al cargar las herramientas.</div>
      </div>
    `
  }
}

async function createClientRentalsView() {
  try {
    const rentals = await apiService.getReservas()
    const myRentals = rentals.filter((rental) => rental.cliente?.id === 1) // Cambiar por cliente autenticado

    const rentalData = myRentals.map((rental) => [
      rental.id,
      rental.herramienta?.nombre || "Herramienta no disponible",
      rental.fechaInicio || "No especificada",
      rental.fechaFin || "No especificada",
      `<span class="status status-${rental.estado?.toLowerCase() || "unknown"}">${rental.estado || "Desconocido"}</span>`,
      `$${Number.parseFloat(rental.costoTotal || rental.monto || 0).toFixed(2)}`,
      `<div class="action-buttons-group">
         <button class="btn-icon" onclick="verDetallesReserva(${rental.id})" title="Ver detalles">
           <i class="fas fa-eye"></i>
         </button>
         ${
           rental.estado === "PENDIENTE"
             ? `<button class="btn-icon" onclick="cancelarReserva(${rental.id})" title="Cancelar">
           <i class="fas fa-times"></i>
         </button>`
             : ""
         }
       </div>`,
    ])

    return `
      <div class="view client-view client-rentals-view hidden">
        <div class="dashboard-header">
          <div class="dashboard-title">Mis Alquileres</div>
          <div class="action-buttons">
            <button class="btn btn-secondary" onclick="filtrarMisAlquileres()">
              <i class="fas fa-filter"></i>
              <span>Filtrar</span>
            </button>
            <button class="btn btn-primary" onclick="exportarMisAlquileres()">
              <i class="fas fa-download"></i>
              <span>Exportar</span>
            </button>
          </div>
        </div>
        ${createTable("Historial de Alquileres", ["ID", "Herramienta", "Fecha Inicio", "Fecha Fin", "Estado", "Costo", "Acciones"], rentalData)}
      </div>
    `
  } catch (error) {
    console.error("Error fetching rentals:", error)
    return `
      <div class="view client-view client-rentals-view hidden">
        <div class="error-message">Error al cargar tus alquileres.</div>
      </div>
    `
  }
}

async function createClientPaymentsView() {
  try {
    const payments = await apiService.getPagos()
    const myPayments = payments.filter((payment) => payment.cliente?.id === 1) // Cambiar por cliente autenticado

    const paymentData = myPayments.map((payment) => [
      payment.id,
      payment.reserva?.id || "N/A",
      payment.fechaPago || "No especificada",
      `$${Number.parseFloat(payment.monto || 0).toFixed(2)}`,
      payment.metodoPago || "No especificado",
      `<span class="status status-${payment.estado?.toLowerCase() || "unknown"}">${payment.estado || "Desconocido"}</span>`,
      `<button class="btn-icon" onclick="verDetallePago(${payment.id})" title="Ver detalles">
         <i class="fas fa-eye"></i>
       </button>`,
    ])

    return `
      <div class="view client-view client-payments-view hidden">
        <div class="dashboard-header">
          <div class="dashboard-title">Historial de Pagos</div>
          <div class="action-buttons">
            <button class="btn btn-secondary" onclick="filtrarPagos()">
              <i class="fas fa-filter"></i>
              <span>Filtrar</span>
            </button>
            <button class="btn btn-primary" onclick="exportarPagos()">
              <i class="fas fa-download"></i>
              <span>Exportar</span>
            </button>
          </div>
        </div>
        ${createTable("Pagos Realizados", ["ID", "Reserva", "Fecha", "Monto", "Método", "Estado", "Acciones"], paymentData)}
      </div>
    `
  } catch (error) {
    console.error("Error fetching payments:", error)
    return `
      <div class="view client-view client-payments-view hidden">
        <div class="error-message">Error al cargar el historial de pagos.</div>
      </div>
    `
  }
}

async function createClientSettingsView() {
  return `
    <div class="view client-view client-settings-view hidden">
      <div class="dashboard-header">
        <div class="dashboard-title">Configuración</div>
        <div class="action-buttons">
          <button class="btn btn-secondary" onclick="exportarDatos()">
            <i class="fas fa-download"></i>
            <span>Exportar</span>
          </button>
          <button class="btn btn-primary" onclick="guardarConfiguracionCliente()">
            <i class="fas fa-save"></i>
            <span>Guardar</span>
          </button>
        </div>
      </div>
      
      <div class="settings-container">
        <div class="settings-section">
          <h3>Información Personal</h3>
          <div class="form-group">
            <label class="form-label">Nombre Completo</label>
            <input type="text" class="form-control" value="Juan Pérez" id="fullName">
          </div>
          <div class="form-group">
            <label class="form-label">Email</label>
            <input type="email" class="form-control" value="juan@email.com" id="email">
          </div>
          <div class="form-group">
            <label class="form-label">Teléfono</label>
            <input type="tel" class="form-control" value="+57 300 123 4567" id="phone">
          </div>
          <div class="form-group">
            <label class="form-label">Dirección</label>
            <input type="text" class="form-control" value="Calle 123 #45-67" id="address">
          </div>
        </div>

        <div class="settings-section">
          <h3>Preferencias de Notificación</h3>
          <div class="form-group">
            <label class="form-label">Recibir notificaciones por:</label>
            <div class="checkbox-group">
              <label><input type="checkbox" checked> Email</label>
              <label><input type="checkbox" checked> SMS</label>
              <label><input type="checkbox"> WhatsApp</label>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Tipos de notificación:</label>
            <div class="checkbox-group">
              <label><input type="checkbox" checked> Confirmación de reservas</label>
              <label><input type="checkbox" checked> Recordatorios de devolución</label>
              <label><input type="checkbox"> Ofertas especiales</label>
              <label><input type="checkbox"> Nuevas herramientas</label>
            </div>
          </div>
        </div>

        <div class="settings-section">
          <h3>Métodos de Pago</h3>
          <div class="payment-methods">
            <div class="payment-method">
              <div class="payment-info">
                <i class="fas fa-credit-card"></i>
                <span>Visa **** 4582</span>
              </div>
              <button class="btn btn-secondary">Editar</button>
            </div>
            <button class="btn btn-primary">
              <i class="fas fa-plus"></i> Agregar método de pago
            </button>
          </div>
        </div>

        <div class="settings-section">
          <h3>Seguridad</h3>
          <div class="form-group">
            <button class="btn btn-secondary">
              <i class="fas fa-key"></i> Cambiar contraseña
            </button>
          </div>
          <div class="form-group">
            <label><input type="checkbox"> Habilitar autenticación de dos factores</label>
          </div>
        </div>
      </div>
    </div>
  `
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
            <p><strong>Categoría:</strong> ${tool.categoria?.nombre || tool.categoria || "Sin categoría"}</p>
            <p><strong>Precio por día:</strong> $${Number.parseFloat(tool.costoPorDia || 0).toFixed(2)}</p>
            <p><strong>Cantidad disponible:</strong> ${tool.cantidadDisponible || 0}</p>
            <p><strong>Descripción:</strong> ${tool.descripcion || "Sin descripción"}</p>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" onclick="document.getElementById('toolDetailsModal').remove()">Cerrar</button>
            <button class="btn btn-primary" onclick="alquilarHerramienta(${tool.id})" ${!tool.activa || tool.cantidadDisponible <= 0 ? "disabled" : ""}>Alquilar</button>
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
    const clienteId = 1 // Cambiar por cliente autenticado
    const hoy = new Date().toISOString().split("T")[0]
    const manana = new Date()
    manana.setDate(manana.getDate() + 1)
    const fechaFin = manana.toISOString().split("T")[0]

    const reserva = {
      herramientaId: herramientaId,
      clienteId: clienteId,
      fechaInicio: hoy,
      fechaFin: fechaFin,
      estado: "PENDIENTE",
    }

    await apiService.createReserva(reserva)
    alert("Reserva creada correctamente. Esperando aprobación del proveedor.")

    // Cerrar modal si está abierto
    const modal = document.getElementById("toolDetailsModal")
    if (modal) modal.remove()

    location.reload()
  } catch (err) {
    console.error("Error al alquilar herramienta:", err)
    alert(`No se pudo crear la reserva: ${err.message}`)
  }
}

window.cancelarReserva = async (reservaId) => {
  if (confirm("¿Estás seguro de que quieres cancelar esta reserva?")) {
    try {
      await apiService.updateReserva(reservaId, { estado: "CANCELADA" })
      alert("Reserva cancelada correctamente.")
      location.reload()
    } catch (err) {
      console.error("Error al cancelar reserva:", err)
      alert(`No se pudo cancelar la reserva: ${err.message}`)
    }
  }
}

export async function createClientViews() {
  try {
    const dashboard = await createClientDashboardView()
    const explore = await createClientExploreView()
    const rentals = await createClientRentalsView()
    const payments = await createClientPaymentsView()
    const settings = await createClientSettingsView()

    return `${dashboard}${explore}${rentals}${payments}${settings}`
  } catch (error) {
    console.error("Error creating client views:", error)
    return `<div class="error-message">Error al cargar las vistas del cliente.</div>`
  }
}
