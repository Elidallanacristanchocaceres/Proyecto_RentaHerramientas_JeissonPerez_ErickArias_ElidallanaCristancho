/**
 * Componentes de Tarjetas Estadísticas
 */

function createStatCard(title, value, icon, color, change = null) {
  return `
    <div class="stat-card">
      <div class="stat-header">
        <div class="stat-title">${title}</div>
        <div class="stat-icon" style="${color ? `background-color: ${color}` : ''}">
          <i class="${icon}"></i>
        </div>
      </div>
      <div class="stat-value">${value}</div>
      ${change ? `
        <div class="stat-change ${change.type || ''}">
          ${change.icon ? `<i class="${change.icon}"></i>` : ''}
          <span>${change.text}</span>
        </div>
      ` : ''}
    </div>
  `;
}

function createToolCard(tool) {
  return `
    <div class="tool-card">
      <div class="tool-image">
        <img src="${tool.image}" alt="${tool.name}">
        <div class="tool-status-badge status-${tool.status.toLowerCase()}">${tool.statusText}</div>
      </div>
      <div class="tool-details">
        <div class="tool-name">${tool.name}</div>
        <div class="tool-category"><i class="fas fa-tag"></i> ${tool.category}</div>
        <div class="tool-price">${tool.price}</div>
        <div class="tool-description">${tool.description}</div>
        <div class="tool-actions">
          ${tool.actions.map(action => `
            <button class="btn ${action.class}">
              <i class="${action.icon}"></i> ${action.text || ''}
            </button>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}