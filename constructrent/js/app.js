import { createAdminViews } from "./roles/admin.js"
import { createProviderViews } from "./roles/provider.js"
import { createClientViews } from "./roles/client.js"
import { createHeader, createNotificationsPanel } from "./components/header.js"
import { createSidebar } from "./components/sidebar.js"
import { createAddToolModal, createFacturaModal } from "./components/modals.js"
import { apiService } from "./services/apiService.js"

const DEFAULT_USER_DATA = {
  name: "Usuario",
  initials: "US",
  notifications: 0,
}

const appState = {
  currentRole: "admin",
  user: DEFAULT_USER_DATA,
}

function initApp() {
  // Verificar autenticación más robusta
  const isAuthenticated = localStorage.getItem("isAuthenticated")
  const token = localStorage.getItem("authToken") || localStorage.getItem("token")

  if (!isAuthenticated || !token) {
    console.log("No hay autenticación válida, redirigiendo al login")
    localStorage.clear()
    window.location.href = "login.html"
    return
  }

  console.log("Usuario autenticado, cargando aplicación...")

  // Cargar datos del usuario
  loadUserData()

  // Obtener rol de la URL o localStorage
  const urlParams = new URLSearchParams(window.location.search)
  const roleParam = urlParams.get("role")
  const storedRole = localStorage.getItem("userRole")

  // Establecer rol actual
  appState.currentRole = roleParam || storedRole || "client"
  console.log("Rol actual:", appState.currentRole)

  // Renderizar la aplicación
  renderApp()
}

// Función para cargar datos del usuario
function loadUserData() {
  const storedUserData = localStorage.getItem("userData")

  if (storedUserData) {
    try {
      const userData = JSON.parse(storedUserData)
      appState.user = {
        ...DEFAULT_USER_DATA,
        ...userData,
      }
    } catch (e) {
      console.error("Error al cargar datos del usuario:", e)
    }
  }
}

// Función para renderizar la aplicación
async function renderApp() {
  const appContainer = document.getElementById("app")

  let contentHTML = ""

  try {
    if (appState.currentRole === "admin") {
      contentHTML = await createAdminViews()
    } else if (appState.currentRole === "provider") {
      contentHTML = await createProviderViews()
    } else if (appState.currentRole === "client") {
      contentHTML = await createClientViews()
    } else {
      // Fallback por defecto
      contentHTML = await createClientViews()
    }
  } catch (error) {
    console.error("Error loading views:", error)
    contentHTML = `
      <div class="error-message">
        <h3>Error al cargar la aplicación</h3>
        <p>Hubo un problema cargando el contenido. Por favor, recarga la página.</p>
        <button class="btn btn-primary" onclick="location.reload()">Recargar</button>
      </div>
    `
  }

  appContainer.innerHTML = `
    <div class="container">
      ${createHeader(appState.user)}
      ${createNotificationsPanel()}
      
      <div class="main-content">
        ${createSidebar(appState.currentRole)}
        
        <div class="content">
          ${contentHTML}
        </div>
      </div>
      
      ${createAddToolModal()}
    </div>
  `

  setupEvents()
}

// Función para configurar eventos
function setupEvents() {
  // Eventos para los elementos de navegación
  const navItems = document.querySelectorAll(".nav-item")
  navItems.forEach((item) => {
    item.addEventListener("click", handleNavItemClick)
  })

  // Evento para notificaciones
  const notificationsToggle = document.getElementById("notificationsToggle")
  const notificationsPanel = document.getElementById("notificationsPanel")

  if (notificationsToggle && notificationsPanel) {
    notificationsToggle.addEventListener("click", (e) => {
      e.stopPropagation()
      notificationsPanel.classList.toggle("show")
    })

    // Cerrar panel al hacer clic fuera
    document.addEventListener("click", (e) => {
      if (!notificationsPanel.contains(e.target) && e.target !== notificationsToggle) {
        notificationsPanel.classList.remove("show")
      }
    })
  }

  // Evento para cerrar sesión
  const logoutBtn = document.getElementById("logoutBtn")
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.clear()
      window.location.href = "login.html"
    })
  }

  // Configurar eventos de modales
  setupModalEvents()
}

// Función para manejar clic en items de navegación
function handleNavItemClick(e) {
  const navItem = e.currentTarget
  const viewName = navItem.getAttribute("data-view")

  // Remover clase activa de todos los items
  document.querySelectorAll(".nav-item").forEach((item) => {
    item.classList.remove("active")
  })

  // Agregar clase activa al item clickeado
  navItem.classList.add("active")

  // Ocultar todas las vistas
  document.querySelectorAll(".view").forEach((view) => {
    view.classList.add("hidden")
  })

  // Mostrar la vista correspondiente
  const viewToShow = document.querySelector(`.${viewName}-view`)
  if (viewToShow) {
    viewToShow.classList.remove("hidden")
  }
}

// Función para configurar eventos de modales
function setupModalEvents() {
  // Modal de agregar herramienta
  const addToolModal = document.getElementById("addToolModal")
  const addToolBtns = document.querySelectorAll("#addToolBtn, #addToolBtn2")
  const closeToolModal = document.getElementById("closeToolModal")
  const cancelToolBtn = document.getElementById("cancelToolBtn")

  addToolBtns.forEach((btn) => {
    if (btn && addToolModal) {
      btn.addEventListener("click", () => {
        addToolModal.classList.add("show")
      })
    }
  })

  if (closeToolModal && addToolModal) {
    closeToolModal.addEventListener("click", () => {
      addToolModal.classList.remove("show")
    })
  }

  if (cancelToolBtn && addToolModal) {
    cancelToolBtn.addEventListener("click", () => {
      addToolModal.classList.remove("show")
    })
  }

  // Cerrar modal al hacer clic fuera
  window.addEventListener("click", (e) => {
    if (e.target === addToolModal) {
      addToolModal.classList.remove("show")
    }
  })
}

// Funciones globales para manejar herramientas
window.guardarHerramienta = async () => {
  const form = document.getElementById("addToolForm")
  if (!form) {
    alert("Formulario no encontrado")
    return
  }

  const formData = new FormData(form)

  // Validaciones
  const nombre = formData.get("nombre")
  const categoria = formData.get("categoria")
  const costoPorDia = formData.get("costoPorDia")

  if (!nombre || !categoria || !costoPorDia) {
    alert("Por favor completa todos los campos requeridos")
    return
  }

  if (Number.parseFloat(costoPorDia) <= 0) {
    alert("El precio por día debe ser mayor a 0")
    return
  }

  const herramienta = {
    nombre: nombre.trim(),
    categoria: categoria,
    costoPorDia: Number.parseFloat(costoPorDia),
    marca: formData.get("marca")?.trim() || "",
    modelo: formData.get("modelo")?.trim() || "",
    descripcion: formData.get("descripcion")?.trim() || "",
    cantidadDisponible: Number.parseInt(formData.get("cantidadDisponible")) || 1,
    activa: formData.get("activa") === "true",
    proveedorId: 1, // Cambiar por ID del proveedor logueado
  }

  try {
    await apiService.createHerramienta(herramienta)
    alert("Herramienta agregada correctamente.")

    // Cerrar modal y limpiar formulario
    const modal = document.getElementById("addToolModal")
    if (modal) {
      modal.classList.remove("show")
      form.reset()
    }

    location.reload()
  } catch (error) {
    console.error("Error al guardar herramienta:", error)
    alert(`Error al guardar la herramienta: ${error.message}`)
  }
}

window.actualizarHerramienta = async () => {
  const form = document.getElementById("editToolForm")
  if (!form) {
    alert("Formulario no encontrado")
    return
  }

  const formData = new FormData(form)

  // Validar datos requeridos
  const nombre = formData.get("nombre")
  const categoria = formData.get("categoria")
  const costoPorDia = formData.get("costoPorDia")

  if (!nombre || !categoria || !costoPorDia) {
    alert("Por favor completa todos los campos requeridos")
    return
  }

  const herramienta = {
    id: Number.parseInt(formData.get("id")),
    nombre: nombre.trim(),
    categoria: categoria,
    costoPorDia: Number.parseFloat(costoPorDia),
    marca: formData.get("marca")?.trim() || "",
    modelo: formData.get("modelo")?.trim() || "",
    descripcion: formData.get("descripcion")?.trim() || "",
    cantidadDisponible: Number.parseInt(formData.get("cantidadDisponible")) || 1,
    activa: formData.get("activa") === "true",
    proveedorId: 1,
  }

  try {
    await apiService.updateHerramienta(herramienta.id, herramienta)
    alert("Herramienta actualizada correctamente.")

    // Cerrar modal
    const modal = document.getElementById("editToolModal")
    if (modal) modal.remove()

    location.reload()
  } catch (error) {
    console.error("Error al actualizar herramienta:", error)
    alert(`Error al actualizar la herramienta: ${error.message}`)
  }
}

// Funciones globales para facturas
window.abrirModalFactura = (reservaId) => {
  const modal = createFacturaModal(reservaId)
  document.body.insertAdjacentHTML("beforeend", modal)
}

window.crearFactura = async (reservaId) => {
  const form = document.getElementById("facturaForm")
  if (!form) {
    alert("Formulario no encontrado")
    return
  }

  const formData = new FormData(form)
  const monto = formData.get("monto")
  const fechaEmision = formData.get("fechaEmision")
  const estado = formData.get("estado")

  // Validaciones
  if (!monto || Number.parseFloat(monto) <= 0) {
    alert("Por favor ingresa un monto válido")
    return
  }

  if (!fechaEmision) {
    alert("Por favor selecciona una fecha de emisión")
    return
  }

  const factura = {
    monto: Number.parseFloat(monto),
    fechaEmision: fechaEmision,
    estado: estado || "Pendiente",
    reservaId: reservaId,
  }

  try {
    await apiService.createFactura(factura)
    alert("Factura creada exitosamente")

    // Cerrar modal
    const modal = document.getElementById("facturaModal")
    if (modal) modal.remove()

    location.reload()
  } catch (error) {
    console.error("Error creando factura:", error)
    alert(`Error al crear la factura: ${error.message}`)
  }
}

// CORREGIDO: Función para actualizar reserva con estructura completa
window.actualizarReserva = async () => {
  const form = document.getElementById("editReservaForm")
  if (!form) {
    alert("Formulario no encontrado")
    return
  }

  const formData = new FormData(form)
  const id = Number.parseInt(formData.get("id"))

  // Validar fechas
  const fechaInicio = formData.get("fechaInicio")
  const fechaFin = formData.get("fechaFin")

  if (!fechaInicio || !fechaFin) {
    alert("Por favor completa todas las fechas")
    return
  }

  if (new Date(fechaInicio) >= new Date(fechaFin)) {
    alert("La fecha de fin debe ser posterior a la fecha de inicio")
    return
  }

  const reservaData = {
    fechaInicio: fechaInicio,
    fechaFin: fechaFin,
    estado: formData.get("estado"),
  }

  try {
    await apiService.updateReserva(id, reservaData)
    alert("Reserva actualizada correctamente.")
    document.getElementById("editReservaModal").remove()
    location.reload()
  } catch (error) {
    console.error("Error al actualizar reserva:", error)
    alert(`Error al actualizar la reserva: ${error.message}`)
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
                <label class="form-label">Fecha Inicio *</label>
                <input type="date" class="form-control" name="fechaInicio" value="${reserva.fechaInicio}" required>
              </div>
              <div class="form-group">
                <label class="form-label">Fecha Fin *</label>
                <input type="date" class="form-control" name="fechaFin" value="${reserva.fechaFin}" required>
              </div>
              <div class="form-group">
                <label class="form-label">Estado *</label>
                <select class="form-control" name="estado" required>
                  <option value="PENDIENTE" ${reserva.estado === "PENDIENTE" ? "selected" : ""}>Pendiente</option>
                  <option value="APROBADA" ${reserva.estado === "APROBADA" ? "selected" : ""}>Aprobada</option>
                  <option value="RECHAZADA" ${reserva.estado === "RECHAZADA" ? "selected" : ""}>Rechazada</option>
                  <option value="COMPLETADA" ${reserva.estado === "COMPLETADA" ? "selected" : ""}>Completada</option>
                  <option value="CANCELADA" ${reserva.estado === "CANCELADA" ? "selected" : ""}>Cancelada</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Cliente</label>
                <input type="text" class="form-control" value="${reserva.cliente?.nombre || "No disponible"}" readonly>
              </div>
              <div class="form-group">
                <label class="form-label">Herramienta</label>
                <input type="text" class="form-control" value="${reserva.herramienta?.nombre || "No disponible"}" readonly>
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
            <p><strong>Costo Total:</strong> $${reserva.costoTotal?.toFixed(2) || "0.00"}</p>
            <p><strong>Monto:</strong> $${reserva.monto?.toFixed(2) || "0.00"}</p>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" onclick="document.getElementById('reservaDetallesModal').remove()">Cerrar</button>
            <button class="btn btn-primary" onclick="abrirModalFactura(${reserva.id})">Generar Factura</button>
          </div>
        </div>
      </div>
    `

    document.body.insertAdjacentHTML("beforeend", modalHtml)
  } catch (error) {
    console.error("Error al cargar detalles de reserva:", error)
    alert("No se pudieron obtener los detalles de la reserva.")
  }
}

window.editarHerramientaModal = async (herramientaId) => {
  try {
    const herramienta = await apiService.getHerramientaById(herramientaId)

    // Cerrar modal anterior si existe
    const modalAnterior = document.getElementById("herramientaDetallesModal")
    if (modalAnterior) modalAnterior.remove()

    const modalHtml = `
      <div class="modal-overlay show" id="editToolModal">
        <div class="modal">
          <div class="modal-header">
            <div class="modal-title">Editar Herramienta</div>
            <button class="modal-close" onclick="document.getElementById('editToolModal').remove()">&times;</button>
          </div>
          <div class="modal-body">
            <form id="editToolForm">
              <input type="hidden" name="id" value="${herramienta.id}">
              <div class="form-group">
                <label class="form-label">Nombre de la Herramienta</label>
                <input type="text" class="form-control" name="nombre" value="${herramienta.nombre}" required>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Categoría</label>
                  <select class="form-control" name="categoria" required>
                    <option value="Taladros" ${herramienta.categoria === "Taladros" ? "selected" : ""}>Taladros</option>
                    <option value="Sierras" ${herramienta.categoria === "Sierras" ? "selected" : ""}>Sierras</option>
                    <option value="Mezcladoras" ${herramienta.categoria === "Mezcladoras" ? "selected" : ""}>Mezcladoras</option>
                    <option value="Andamios" ${herramienta.categoria === "Andamios" ? "selected" : ""}>Andamios</option>
                    <option value="Compresores" ${herramienta.categoria === "Compresores" ? "selected" : ""}>Compresores</option>
                    <option value="Generadores" ${herramienta.categoria === "Generadores" ? "selected" : ""}>Generadores</option>
                    <option value="Soldadoras" ${herramienta.categoria === "Soldadoras" ? "selected" : ""}>Soldadoras</option>
                    <option value="Otras" ${herramienta.categoria === "Otras" ? "selected" : ""}>Otras</option>
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label">Precio por Día</label>
                  <input type="number" class="form-control" name="costoPorDia" value="${herramienta.costoPorDia}" step="0.01" required>
                </div>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Marca</label>
                  <input type="text" class="form-control" name="marca" value="${herramienta.marca || ""}">
                </div>
                <div class="form-group">
                  <label class="form-label">Modelo</label>
                  <input type="text" class="form-control" name="modelo" value="${herramienta.modelo || ""}">
                </div>
              </div>
              <div class="form-group">
                <label class="form-label">Descripción</label>
                <textarea class="form-control" name="descripcion">${herramienta.descripcion || ""}</textarea>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Estado</label>
                  <select class="form-control" name="activa" required>
                    <option value="true" ${herramienta.activa ? "selected" : ""}>Activa</option>
                    <option value="false" ${!herramienta.activa ? "selected" : ""}>Inactiva</option>
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label">Cantidad</label>
                  <input type="number" class="form-control" name="cantidadDisponible" value="${herramienta.cantidadDisponible || 1}" min="0" required>
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" onclick="document.getElementById('editToolModal').remove()">Cancelar</button>
            <button class="btn btn-primary" onclick="actualizarHerramienta()">Actualizar Herramienta</button>
          </div>
        </div>
      </div>
    `

    document.body.insertAdjacentHTML("beforeend", modalHtml)
  } catch (error) {
    console.error("Error al cargar herramienta para editar:", error)
    alert("No se pudo cargar la herramienta para editar.")
  }
}

window.verDetallesHerramienta = async (herramientaId) => {
  try {
    const herramienta = await apiService.getHerramientaById(herramientaId)

    const modalHtml = `
      <div class="modal-overlay show" id="herramientaDetallesModal">
        <div class="modal">
          <div class="modal-header">
            <div class="modal-title">${herramienta.nombre}</div>
            <button class="modal-close" onclick="document.getElementById('herramientaDetallesModal').remove()">&times;</button>
          </div>
          <div class="modal-body">
            <p><strong>Marca:</strong> ${herramienta.marca || "No especificada"}</p>
            <p><strong>Modelo:</strong> ${herramienta.modelo || "No especificado"}</p>
            <p><strong>Categoría:</strong> ${herramienta.categoria?.nombre || herramienta.categoria || "Sin categoría"}</p>
            <p><strong>Precio por día:</strong> $${Number.parseFloat(herramienta.costoPorDia || 0).toFixed(2)}</p>
            <p><strong>Cantidad disponible:</strong> ${herramienta.cantidadDisponible || 0}</p>
            <p><strong>Descripción:</strong> ${herramienta.descripcion || "Sin descripción"}</p>
            <p><strong>Estado:</strong> ${herramienta.activa ? "Activa" : "Inactiva"}</p>
            <p><strong>Proveedor:</strong> ${herramienta.proveedor?.nombre || "No especificado"}</p>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" onclick="document.getElementById('herramientaDetallesModal').remove()">Cerrar</button>
            <button class="btn btn-primary" onclick="editarHerramientaModal(${herramienta.id})">Editar</button>
          </div>
        </div>
      </div>
    `

    document.body.insertAdjacentHTML("beforeend", modalHtml)
  } catch (error) {
    console.error("Error al cargar detalles de herramienta:", error)
    alert("No se pudieron obtener los detalles de la herramienta.")
  }
}

window.eliminarHerramienta = async (herramientaId) => {
  if (!confirm("¿Estás seguro de que quieres eliminar esta herramienta? Esta acción no se puede deshacer.")) {
    return
  }

  try {
    await apiService.deleteHerramienta(herramientaId)
    alert("Herramienta eliminada correctamente.")
    location.reload()
  } catch (error) {
    console.error("Error al eliminar herramienta:", error)
    alert(`No se pudo eliminar la herramienta: ${error.message}`)
  }
}

window.descargarFactura = async (facturaId) => {
  try {
    const factura = await apiService.getFacturaById(facturaId)
    const csvContent = [
      ["Campo", "Valor"],
      ["ID Factura", factura.id],
      ["Folio", factura.folio || "N/A"],
      ["Subtotal", `$${Number.parseFloat(factura.subtotal || 0).toFixed(2)}`],
      ["IVA", `$${Number.parseFloat(factura.iva || 0).toFixed(2)}`],
      ["Total", `$${Number.parseFloat(factura.total || 0).toFixed(2)}`],
      ["Fecha Emisión", factura.fechaEmision || "No especificada"],
      ["RFC Emisor", factura.rfcEmisor || "N/A"],
      ["RFC Receptor", factura.rfcReceptor || "N/A"],
      ["ID Reserva", factura.reserva?.id || "No especificada"],
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.setAttribute("download", `factura-${facturaId}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error("Error al descargar factura:", error)
    alert(`Error al descargar la factura: ${error.message}`)
  }
}

window.exportarFacturas = async () => {
  try {
    const facturas = await apiService.getFacturas()

    const csv = [
      ["ID", "Folio", "Subtotal", "IVA", "Total", "Fecha Emisión", "ID Reserva"],
      ...facturas.map((f) => [
        f.id || "",
        f.folio || "",
        f.subtotal ? `$${Number.parseFloat(f.subtotal).toFixed(2)}` : "$0.00",
        f.iva ? `$${Number.parseFloat(f.iva).toFixed(2)}` : "$0.00",
        f.total ? `$${Number.parseFloat(f.total).toFixed(2)}` : "$0.00",
        f.fechaEmision || "",
        f.reserva?.id || "",
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)

    const link = document.createElement("a")
    link.href = url
    link.setAttribute("download", "facturas.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } catch (error) {
    console.error("Error exportando facturas:", error)
    alert("No se pudieron exportar las facturas.")
  }
}

// Inicializar la aplicación cuando el DOM esté cargado
document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    window.location.href = 'login.html';
    return;
  }
  
  // Inicializar la aplicación solo si está autenticado
  initApp();
});