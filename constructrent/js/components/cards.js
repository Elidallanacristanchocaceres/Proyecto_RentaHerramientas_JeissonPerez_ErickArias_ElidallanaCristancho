export function createStatCard(title, value, icon, color, change = null) {
  return `
    <div class="stat-card">
      <div class="stat-header">
        <div class="stat-title">${title}</div>
        <div class="stat-icon" style="${color ? `background-color: ${color}` : ""}">
          <i class="${icon}"></i>
        </div>
      </div>
      <div class="stat-value">${value}</div>
      ${
        change
          ? `
        <div class="stat-change ${change.type || ""}">
          ${change.icon ? `<i class="${change.icon}"></i>` : ""}
          <span>${change.text}</span>
        </div>
      `
          : ""
      }
    </div>
  `
}

export function createToolCard(tool) {
  return `
    <div class="tool-card">
      <div class="tool-image">
        <img src="${tool.imagenUrl || "/placeholder.svg?height=180&width=300"}" alt="${tool.nombre}">
        <div class="tool-status-badge status-${tool.activa ? "available" : "maintenance"}">
          ${tool.activa ? "Disponible" : "No disponible"}
        </div>
      </div>
      <div class="tool-details">
        <div class="tool-name">${tool.nombre}</div>
        <div class="tool-category"><i class="fas fa-tag"></i> ${tool.categoria || "Sin categoría"}</div>
        <div class="tool-price">$${Number.parseFloat(tool.costoPorDia || 0).toFixed(2)} / día</div>
        <div class="tool-description">${tool.descripcion || "Sin descripción"}</div>
        <div class="tool-actions">
          <button class="btn btn-secondary" onclick="verDetallesHerramienta(${tool.id})">
            <i class="fas fa-eye"></i> Ver detalles
          </button>
          <button class="btn btn-primary" onclick="alquilarHerramienta(${tool.id})">
            <i class="fas fa-shopping-cart"></i> Alquilar
          </button>
        </div>
      </div>
    </div>
  `
}
