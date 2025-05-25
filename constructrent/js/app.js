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
  // Verificar autenticación
  if (!localStorage.getItem("isAuthenticated")) {
    window.location.href = "login.html"
    return
  }

  // Cargar datos del usuario
  loadUserData()

  // Obtener rol de la URL o localStorage
  const urlParams = new URLSearchParams(window.location.search)
  const roleParam = urlParams.get("role")
  const storedRole = localStorage.getItem("userRole")

  // Establecer rol actual
  appState.currentRole = roleParam || storedRole || "client"

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

  if (appState.currentRole === "admin") {
    contentHTML = await createAdminViews()
  } else if (appState.currentRole === "provider") {
    contentHTML = await createProviderViews()
  } else if (appState.currentRole === "client") {
    contentHTML = await createClientViews()
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
  const formData = new FormData(form)

  const herramienta = {
    nombre: formData.get("nombre"),
    categoria: formData.get("categoria"),
    costoPorDia: Number.parseFloat(formData.get("costoPorDia")),
    marca: formData.get("marca"),
    modelo: formData.get("modelo"),
    descripcion: formData.get("descripcion"),
    cantidadDisponible: Number.parseInt(formData.get("cantidadDisponible")),
    activa: formData.get("activa") === "true",
    proveedorId: 1, // Cambiar por ID del proveedor logueado
  }

  try {
    await apiService.createHerramienta(herramienta)
    alert("Herramienta agregada correctamente.")
    document.getElementById("addToolModal").classList.remove("show")
    location.reload()
  } catch (error) {
    console.error("Error al guardar herramienta:", error)
    alert("Error al guardar la herramienta.")
  }
}

window.actualizarHerramienta = async () => {
  const form = document.getElementById("editToolForm")
  const formData = new FormData(form)

  const herramienta = {
    id: Number.parseInt(formData.get("id")),
    nombre: formData.get("nombre"),
    categoria: formData.get("categoria"),
    costoPorDia: Number.parseFloat(formData.get("costoPorDia")),
    marca: formData.get("marca"),
    modelo: formData.get("modelo"),
    descripcion: formData.get("descripcion"),
    cantidadDisponible: Number.parseInt(formData.get("cantidadDisponible")),
    activa: formData.get("activa") === "true",
    proveedorId: 1,
  }

  try {
    await apiService.updateHerramienta(herramienta.id, herramienta)
    alert("Herramienta actualizada correctamente.")
    document.getElementById("editToolModal").remove()
    location.reload()
  } catch (error) {
    console.error("Error al actualizar herramienta:", error)
    alert("Error al actualizar la herramienta.")
  }
}

// Funciones globales para facturas
window.abrirModalFactura = (reservaId) => {
  const modal = createFacturaModal(reservaId)
  document.body.insertAdjacentHTML("beforeend", modal)
}

window.crearFactura = async (reservaId) => {
  const form = document.getElementById("facturaForm")
  const formData = new FormData(form)

  const factura = {
    monto: Number.parseFloat(formData.get("monto")),
    fechaEmision: formData.get("fechaEmision"),
    estado: formData.get("estado"),
    reservaId: reservaId,
  }

  try {
    await apiService.generateFactura(factura)
    alert("Factura creada exitosamente")
    document.getElementById("facturaModal").remove()
    location.reload()
  } catch (error) {
    console.error("Error creando factura:", error)
    alert("Error al crear la factura.")
  }
}

// Función para exportar facturas
window.exportarFacturas = async () => {
  try {
    const facturas = await apiService.getFacturas()

    const csv = [
      ["ID", "Monto", "Estado", "Fecha Emisión", "ID Reserva"],
      ...facturas.map((f) => [
        f.id || "",
        f.monto ? `$${Number.parseFloat(f.monto).toFixed(2)}` : "$0.00",
        f.estado || "Desconocido",
        f.fechaEmision || "",
        f.reservaId || "",
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

// Funciones globales para reservas
window.verDetallesReserva = async (reservaId) => {
  try {
    const reserva = await apiService.getReservaById(reservaId)

    const modalHtml = `
      <div class="modal-overlay" id="reservaDetallesModal">
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

window.editarReserva = async (reservaId) => {
  try {
    const reserva = await apiService.getReservaById(reservaId)

    const modalHtml = `
      <div class="modal-overlay" id="editReservaModal">
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
                  <option value="Pendiente" ${reserva.estado === "Pendiente" ? "selected" : ""}>Pendiente</option>
                  <option value="En Alquiler" ${reserva.estado === "En Alquiler" ? "selected" : ""}>En Alquiler</option>
                  <option value="Completado" ${reserva.estado === "Completado" ? "selected" : ""}>Completado</option>
                  <option value="Cancelado" ${reserva.estado === "Cancelado" ? "selected" : ""}>Cancelado</option>
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

window.actualizarReserva = async () => {
  const form = document.getElementById("editReservaForm")
  const formData = new FormData(form)

  const reserva = {
    id: Number.parseInt(formData.get("id")),
    fechaInicio: formData.get("fechaInicio"),
    fechaFin: formData.get("fechaFin"),
    estado: formData.get("estado"),
  }

  try {
    await apiService.updateReserva(reserva.id, reserva)
    alert("Reserva actualizada correctamente.")
    document.getElementById("editReservaModal").remove()
    location.reload()
  } catch (error) {
    console.error("Error al actualizar reserva:", error)
    alert("Error al actualizar la reserva.")
  }
}

// Funciones globales para herramientas
window.verDetallesHerramienta = async (herramientaId) => {
  try {
    const herramienta = await apiService.getHerramientaById(herramientaId)

    const modalHtml = `
      <div class="modal-overlay" id="herramientaDetallesModal">
        <div class="modal">
          <div class="modal-header">
            <div class="modal-title">${herramienta.nombre}</div>
            <button class="modal-close" onclick="document.getElementById('herramientaDetallesModal').remove()">&times;</button>
          </div>
          <div class="modal-body">
            <p><strong>Marca:</strong> ${herramienta.marca || "No especificada"}</p>
            <p><strong>Modelo:</strong> ${herramienta.modelo || "No especificado"}</p>
            <p><strong>Categoría:</strong> ${herramienta.categoria || "Sin categoría"}</p>
            <p><strong>Precio por día:</strong> $${Number.parseFloat(herramienta.costoPorDia || 0).toFixed(2)}</p>
            <p><strong>Cantidad disponible:</strong> ${herramienta.cantidadDisponible || 0}</p>
            <p><strong>Descripción:</strong> ${herramienta.descripcion || "Sin descripción"}</p>
            <p><strong>Estado:</strong> ${herramienta.activa ? "Activa" : "Inactiva"}</p>
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

window.editarHerramientaModal = async (herramientaId) => {
  try {
    const herramienta = await apiService.getHerramientaById(herramientaId)

    // Cerrar modal anterior si existe
    const modalAnterior = document.getElementById("herramientaDetallesModal")
    if (modalAnterior) modalAnterior.remove()

    const modalHtml = `
      <div class="modal-overlay" id="editToolModal">
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
      estado: "Pendiente",
    }

    await apiService.createReserva(reserva)
    alert("Reserva creada correctamente.")
    location.reload()
  } catch (error) {
    console.error("Error al alquilar herramienta:", error)
    alert("Error al crear la reserva.")
  }
}

// Inicializar la aplicación cuando el DOM esté cargado
document.addEventListener("DOMContentLoaded", initApp)
