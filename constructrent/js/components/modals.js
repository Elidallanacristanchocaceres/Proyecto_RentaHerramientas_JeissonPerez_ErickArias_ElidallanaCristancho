/**
 * Componentes de Modales
 */

export function createAddToolModal() {
  return `
    <div class="modal-overlay" id="addToolModal">
      <div class="modal">
        <div class="modal-header">
          <div class="modal-title">Agregar Nueva Herramienta</div>
          <button class="modal-close" id="closeToolModal">&times;</button>
        </div>
        <div class="modal-body">
          <div class="form-container">
            <div class="form-group">
              <label class="form-label">Nombre de la Herramienta</label>
              <input type="text" class="form-control" placeholder="Ej: Taladro Industrial DeWalt">
            </div>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Categoría</label>
                <select class="form-control">
                  <option>Taladros</option>
                  <option>Sierras</option>
                  <option>Mezcladoras</option>
                  <option>Andamios</option>
                  <option>Compresores</option>
                  <option>Generadores</option>
                  <option>Soldadoras</option>
                  <option>Otras</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Precio por Día</label>
                <input type="number" class="form-control" placeholder="Ej: 40.00">
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Descripción</label>
              <textarea class="form-control" placeholder="Descripción detallada de la herramienta..."></textarea>
            </div>
            <div class="form-group">
              <label class="form-label">Imagen</label>
              <input type="file" class="form-control">
            </div>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Estado</label>
                <select class="form-control">
                  <option>Disponible</option>
                  <option>En Mantenimiento</option>
                  <option>No Disponible</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Cantidad</label>
                <input type="number" class="form-control" value="1">
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" id="cancelToolBtn">Cancelar</button>
          <button class="btn btn-primary">Guardar Herramienta</button>
        </div>
      </div>
    </div>
  `;
}