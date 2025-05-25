export function createTable(title, headers, rows, searchable = true) {
  return `
    <div class="table-container">
      <div class="table-header">
        <div class="table-title">${title}</div>
        ${
          searchable
            ? `
          <div class="table-actions">
            <div class="search-box">
              <i class="fas fa-search"></i>
              <input type="text" placeholder="Buscar..." onkeyup="filterTable(this)">
            </div>
          </div>
        `
            : ""
        }
      </div>
      <div class="table-responsive">
        <table>
          <thead>
            <tr>
              ${headers.map((header) => `<th>${header}</th>`).join("")}
            </tr>
          </thead>
          <tbody>
            ${rows
              .map(
                (row) => `
              <tr>
                ${row.map((cell) => `<td>${cell}</td>`).join("")}
              </tr>
            `,
              )
              .join("")}
          </tbody>
        </table>
      </div>
    </div>
  `
}

// Función global para filtrar tablas
window.filterTable = (input) => {
  const filter = input.value.toLowerCase()
  const table = input.closest(".table-container").querySelector("table")
  const rows = table.querySelectorAll("tbody tr")

  rows.forEach((row) => {
    const text = row.textContent.toLowerCase()
    row.style.display = text.includes(filter) ? "" : "none"
  })
}
