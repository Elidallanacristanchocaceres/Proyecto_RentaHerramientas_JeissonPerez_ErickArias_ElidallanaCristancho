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
              <label class="form-label">Nombre de la Herramienta</label>
              <input type="text" name="nombre" class="form-control" placeholder="Ej: Taladro Industrial DeWalt" required>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Categoría</label>
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
                <label class="form-label">Precio por Día</label>
                <input type="number" name="costoPorDia" class="form-control" placeholder="Ej: 40.00" step="0.01" required>
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
                <label class="form-label">Cantidad Disponible</label>
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
  return `
    <div class="modal-overlay show" id="facturaModal">
      <div class="modal">
        <div class="modal-header">
          <div class="modal-title">Generar Factura</div>
          <button class="modal-close" onclick="cerrarModalFactura()">&times;</button>
        </div>
        <div class="modal-body">
          <form id="facturaForm">
            <div class="form-group">
              <label class="form-label">Monto</label>
              <input type="number" class="form-control" id="facturaMonto" name="monto" placeholder="Ej: 150.00" step="0.01" required>
            </div>
            <div class="form-group">
              <label class="form-label">Fecha de Emisión</label>
              <input type="date" class="form-control" id="facturaFecha" name="fechaEmision" value="${new Date().toISOString().split("T")[0]}" required>
            </div>
            <div class="form-group">
              <label class="form-label">Estado</label>
              <select class="form-control" name="estado" required>
                <option value="Pendiente">Pendiente</option>
                <option value="Pagada" selected>Pagada</option>
                <option value="Cancelada">Cancelada</option>
              </select>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="cerrarModalFactura()">Cancelar</button>
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
          <button class="modal-close" onclick="cerrarModalDetalles()">&times;</button>
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
          <button class="btn btn-secondary" onclick="cerrarModalDetalles()">Cerrar</button>
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
          <button class="modal-close" onclick="cerrarModalEditar()">&times;</button>
        </div>
        <div class="modal-body">
          <form id="editToolForm">
            <input type="hidden" name="id" value="${tool.id}">
            <div class="form-group">
              <label class="form-label">Nombre de la Herramienta</label>
              <input type="text" name="nombre" class="form-control" value="${tool.nombre}" required>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Categoría</label>
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
                <label class="form-label">Precio por Día</label>
                <input type="number" name="costoPorDia" class="form-control" value="${tool.costoPorDia}" step="0.01" required>
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
                <label class="form-label">Cantidad Disponible</label>
                <input type="number" name="cantidadDisponible" class="form-control" value="${tool.cantidadDisponible}" min="1" required>
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
          <button class="btn btn-secondary" onclick="cerrarModalEditar()">Cancelar</button>
          <button class="btn btn-primary" onclick="actualizarHerramienta()">Actualizar Herramienta</button>
        </div>
      </div>
    </div>
  `
}

// Funciones globales para manejar modales
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
