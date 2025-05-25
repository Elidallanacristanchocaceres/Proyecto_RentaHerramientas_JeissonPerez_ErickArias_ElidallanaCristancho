export function createAddToolModal() {
  return `
    <div class="modal-overlay" id="addToolModal">
      <div class="modal">
        <div class="modal-header">
          <div class="modal-title">Agregar Nueva Herramienta</div>
          <button class="modal-close" id="closeToolModal">&times;</button>
        </div>
        <div class="modal-body">
          <form id="addToolForm">
            <div class="form-group">
              <label class="form-label">Nombre de la Herramienta *</label>
              <input type="text" name="nombre" class="form-control" placeholder="Ej: Taladro Industrial DeWalt" required>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Categoría *</label>
                <select name="categoria" class="form-control" required>
                  <option value="">Seleccionar categoría</option>
                  <option value="Taladros">Taladros</option>
                  <option value="Sierras">Sierras</option>
                  <option value="Mezcladoras">Mezcladoras</option>
                  <option value="Andamios">Andamios</option>
                  <option value="Compresores">Compresores</option>
                  <option value="Generadores">Generadores</option>
                  <option value="Soldadoras">Soldadoras</option>
                  <option value="Otras">Otras</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Precio por Día *</label>
                <input type="number" name="costoPorDia" class="form-control" placeholder="Ej: 40.00" step="0.01" min="0.01" required>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Marca</label>
                <input type="text" name="marca" class="form-control" placeholder="Ej: DeWalt">
              </div>
              <div class="form-group">
                <label class="form-label">Modelo</label>
                <input type="text" name="modelo" class="form-control" placeholder="Ej: DCD771C2">
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Descripción</label>
              <textarea name="descripcion" class="form-control" placeholder="Descripción detallada de la herramienta..."></textarea>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Cantidad Disponible *</label>
                <input type="number" name="cantidadDisponible" class="form-control" value="1" min="1" required>
              </div>
              <div class="form-group">
                <label class="form-label">Estado</label>
                <select name="activa" class="form-control" required>
                  <option value="true">Activa</option>
                  <option value="false">Inactiva</option>
                </select>
              </div>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" id="cancelToolBtn">Cancelar</button>
          <button class="btn btn-primary" onclick="guardarHerramienta()">Guardar Herramienta</button>
        </div>
      </div>
    </div>
  `
}

export function createFacturaModal(reservaId) {
  const today = new Date().toISOString().split("T")[0]

  return `
    <div class="modal-overlay show" id="facturaModal">
      <div class="modal">
        <div class="modal-header">
          <div class="modal-title">Generar Factura</div>
          <button class="modal-close" onclick="document.getElementById('facturaModal').remove()">&times;</button>
        </div>
        <div class="modal-body">
          <form id="facturaForm">
            <div class="form-group">
              <label class="form-label">Monto *</label>
              <input type="number" class="form-control" name="monto" step="0.01" min="0.01" placeholder="Ej: 150.00" required>
            </div>
            <div class="form-group">
              <label class="form-label">Fecha de Emisión *</label>
              <input type="date" class="form-control" name="fechaEmision" value="${today}" required>
            </div>
            <div class="form-group">
              <label class="form-label">Estado</label>
              <select class="form-control" name="estado">
                <option value="Pendiente">Pendiente</option>
                <option value="Pagada">Pagada</option>
                <option value="Vencida">Vencida</option>
                <option value="Cancelada">Cancelada</option>
              </select>
            </div>
            <input type="hidden" name="reservaId" value="${reservaId}">
          </form>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="document.getElementById('facturaModal').remove()">Cancelar</button>
          <button class="btn btn-primary" onclick="crearFactura(${reservaId})">Crear Factura</button>
        </div>
      </div>
    </div>
  `
}

export function createToolDetailsModal(tool) {
  return `
    <div class="modal-overlay show" id="toolDetailsModal">
      <div class="modal">
        <div class="modal-header">
          <div class="modal-title">${tool.nombre}</div>
          <button class="modal-close" onclick="document.getElementById('toolDetailsModal').remove()">&times;</button>
        </div>
        <div class="modal-body">
          <div class="tool-details-content">
            <p><strong>Marca:</strong> ${tool.marca || "No especificada"}</p>
            <p><strong>Modelo:</strong> ${tool.modelo || "No especificado"}</p>
            <p><strong>Categoría:</strong> ${tool.categoria || "Sin categoría"}</p>
            <p><strong>Precio por día:</strong> $${Number.parseFloat(tool.costoPorDia || 0).toFixed(2)}</p>
            <p><strong>Cantidad disponible:</strong> ${tool.cantidadDisponible || 0}</p>
            <p><strong>Estado:</strong> ${tool.activa ? "Activa" : "Inactiva"}</p>
            <p><strong>Descripción:</strong> ${tool.descripcion || "Sin descripción"}</p>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="document.getElementById('toolDetailsModal').remove()">Cerrar</button>
          <button class="btn btn-primary" onclick="editarHerramientaModal(${tool.id})">Editar</button>
        </div>
      </div>
    </div>
  `
}

export function createEditToolModal(tool) {
  return `
    <div class="modal-overlay show" id="editToolModal">
      <div class="modal">
        <div class="modal-header">
          <div class="modal-title">Editar Herramienta</div>
          <button class="modal-close" onclick="document.getElementById('editToolModal').remove()">&times;</button>
        </div>
        <div class="modal-body">
          <form id="editToolForm">
            <input type="hidden" name="id" value="${tool.id}">
            <div class="form-group">
              <label class="form-label">Nombre de la Herramienta *</label>
              <input type="text" name="nombre" class="form-control" value="${tool.nombre}" required>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Categoría *</label>
                <select name="categoria" class="form-control" required>
                  <option value="Taladros" ${tool.categoria === "Taladros" ? "selected" : ""}>Taladros</option>
                  <option value="Sierras" ${tool.categoria === "Sierras" ? "selected" : ""}>Sierras</option>
                  <option value="Mezcladoras" ${tool.categoria === "Mezcladoras" ? "selected" : ""}>Mezcladoras</option>
                  <option value="Andamios" ${tool.categoria === "Andamios" ? "selected" : ""}>Andamios</option>
                  <option value="Compresores" ${tool.categoria === "Compresores" ? "selected" : ""}>Compresores</option>
                  <option value="Generadores" ${tool.categoria === "Generadores" ? "selected" : ""}>Generadores</option>
                  <option value="Soldadoras" ${tool.categoria === "Soldadoras" ? "selected" : ""}>Soldadoras</option>
                  <option value="Otras" ${tool.categoria === "Otras" ? "selected" : ""}>Otras</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Precio por Día *</label>
                <input type="number" name="costoPorDia" class="form-control" value="${tool.costoPorDia}" step="0.01" min="0.01" required>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Marca</label>
                <input type="text" name="marca" class="form-control" value="${tool.marca || ""}">
              </div>
              <div class="form-group">
                <label class="form-label">Modelo</label>
                <input type="text" name="modelo" class="form-control" value="${tool.modelo || ""}">
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Descripción</label>
              <textarea name="descripcion" class="form-control">${tool.descripcion || ""}</textarea>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Cantidad Disponible *</label>
                <input type="number" name="cantidadDisponible" class="form-control" value="${tool.cantidadDisponible}" min="0" required>
              </div>
              <div class="form-group">
                <label class="form-label">Estado</label>
                <select name="activa" class="form-control" required>
                  <option value="true" ${tool.activa ? "selected" : ""}>Activa</option>
                  <option value="false" ${!tool.activa ? "selected" : ""}>Inactiva</option>
                </select>
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
}

export function createReservaModal(herramientaId) {
  const today = new Date().toISOString().split("T")[0]
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const tomorrowStr = tomorrow.toISOString().split("T")[0]

  return `
    <div class="modal-overlay show" id="reservaModal">
      <div class="modal">
        <div class="modal-header">
          <div class="modal-title">Crear Reserva</div>
          <button class="modal-close" onclick="document.getElementById('reservaModal').remove()">&times;</button>
        </div>
        <div class="modal-body">
          <form id="reservaForm">
            <div class="form-group">
              <label class="form-label">Fecha de Inicio *</label>
              <input type="date" class="form-control" name="fechaInicio" value="${today}" min="${today}" required>
            </div>
            <div class="form-group">
              <label class="form-label">Fecha de Fin *</label>
              <input type="date" class="form-control" name="fechaFin" value="${tomorrowStr}" min="${tomorrowStr}" required>
            </div>
            <div class="form-group">
              <label class="form-label">Cantidad</label>
              <input type="number" class="form-control" name="cantidad" value="1" min="1" required>
            </div>
            <input type="hidden" name="herramientaId" value="${herramientaId}">
            <input type="hidden" name="clienteId" value="1">
          </form>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="document.getElementById('reservaModal').remove()">Cancelar</button>
          <button class="btn btn-primary" onclick="crearReserva()">Crear Reserva</button>
        </div>
      </div>
    </div>
  `
}

export function createEditReservaModal(reserva) {
  return `
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
}

export function createUserModal(user = null) {
  const isEdit = user !== null
  const title = isEdit ? "Editar Usuario" : "Agregar Usuario"
  const buttonText = isEdit ? "Actualizar Usuario" : "Crear Usuario"
  const buttonAction = isEdit ? "actualizarUsuario()" : "crearUsuario()"

  return `
    <div class="modal-overlay show" id="userModal">
      <div class="modal">
        <div class="modal-header">
          <div class="modal-title">${title}</div>
          <button class="modal-close" onclick="document.getElementById('userModal').remove()">&times;</button>
        </div>
        <div class="modal-body">
          <form id="userForm">
            ${isEdit ? `<input type="hidden" name="id" value="${user.id}">` : ""}
            <div class="form-group">
              <label class="form-label">Nombre Completo *</label>
              <input type="text" class="form-control" name="nombre" value="${user?.nombre || ""}" required>
            </div>
            <div class="form-group">
              <label class="form-label">Email *</label>
              <input type="email" class="form-control" name="email" value="${user?.email || ""}" required>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Teléfono</label>
                <input type="tel" class="form-control" name="telefono" value="${user?.telefono || ""}">
              </div>
              <div class="form-group">
                <label class="form-label">Rol *</label>
                <select class="form-control" name="rol" required>
                  <option value="CLIENTE" ${user?.rol === "CLIENTE" ? "selected" : ""}>Cliente</option>
                  <option value="PROVEEDOR" ${user?.rol === "PROVEEDOR" ? "selected" : ""}>Proveedor</option>
                  <option value="ADMIN" ${user?.rol === "ADMIN" ? "selected" : ""}>Administrador</option>
                </select>
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Dirección</label>
              <textarea class="form-control" name="direccion">${user?.direccion || ""}</textarea>
            </div>
            ${
              !isEdit
                ? `
            <div class="form-group">
              <label class="form-label">Contraseña *</label>
              <input type="password" class="form-control" name="password" required>
            </div>
            `
                : ""
            }
            <div class="form-group">
              <label class="form-label">Estado</label>
              <select class="form-control" name="activo">
                <option value="true" ${user?.activo !== false ? "selected" : ""}>Activo</option>
                <option value="false" ${user?.activo === false ? "selected" : ""}>Inactivo</option>
              </select>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="document.getElementById('userModal').remove()">Cancelar</button>
          <button class="btn btn-primary" onclick="${buttonAction}">${buttonText}</button>
        </div>
      </div>
    </div>
  `
}

// Funciones globales para cerrar modales
window.cerrarModalFactura = () => {
  const modal = document.getElementById("facturaModal")
  if (modal) modal.remove()
}

window.cerrarModalDetalles = () => {
  const modal = document.getElementById("toolDetailsModal")
  if (modal) modal.remove()
}

window.cerrarModalEditar = () => {
  const modal = document.getElementById("editToolModal")
  if (modal) modal.remove()
}

window.cerrarModalReserva = () => {
  const modal = document.getElementById("reservaModal")
  if (modal) modal.remove()
}

window.cerrarModalUsuario = () => {
  const modal = document.getElementById("userModal")
  if (modal) modal.remove()
}
