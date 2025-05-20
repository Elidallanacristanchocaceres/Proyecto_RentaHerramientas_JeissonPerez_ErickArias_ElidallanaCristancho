/**
 * Componentes de Tablas
 */

function createTable(title, headers, rows, searchable = true) {
  return `
    <div class="table-container">
      <div class="table-header">
        <div class="table-title">${title}</div>
        ${searchable ? `
          <div class="table-actions">
            <div class="search-box">
              <i class="fas fa-search"></i>
              <input type="text" placeholder="Buscar...">
            </div>
          </div>
        ` : ''}
      </div>
      <div class="table-responsive">
        <table>
          <thead>
            <tr>
              ${headers.map(header => `<th>${header}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${rows.map(row => `
              <tr>
                ${row.map(cell => `<td>${cell}</td>`).join('')}
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}