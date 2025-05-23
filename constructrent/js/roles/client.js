import { apiService } from '../services/apiService.js';
import { createStatCard } from '../components/cards.js';
import { createTable } from '../components/tables.js';

// === Función auxiliar para crear tarjetas de herramientas ===
function createToolCard(tool) {
  return `
    <div class="tool-card">
      <img src="${tool.imagenUrl || 'https://via.placeholder.com/300x180?text=Herramienta+no+disponible '}" alt="${tool.nombre}" />
      <div class="tool-info">
        <h3>${tool.nombre}</h3>
        <p><strong>Marca:</strong> ${tool.marca || 'Sin marca'}</p>
        <p><strong>Modelo:</strong> ${tool.modelo || 'Desconocido'}</p>
        <p><strong>Categoría:</strong> ${tool.categoria || 'Sin categoría'}</p>
        <p><strong>Precio:</strong> $${parseFloat(tool.costoPorDia || 0).toFixed(2)} / día</p>
        <p><strong>Cantidad disponible:</strong> ${tool.cantidadDisponible || 0}</p>
        <p><strong>Estado:</strong>
          <span class="status status-${tool.activa ? 'available' : 'maintenance'}">
            ${tool.activa ? 'Activa' : 'Inactiva'}
          </span>
        </p>
        <div class="actions">
          <button class="btn btn-secondary">
            <i class="fas fa-eye"></i> Ver detalles
          </button>
          <button class="btn btn-primary">
            <i class="fas fa-shopping-cart"></i> Alquilar
          </button>
        </div>
      </div>
    </div>
  `;
}

// === Vista de Dashboard de Cliente ===
async function createClientDashboardView() {
  try {
    const [rentals, tools, payments] = await Promise.all([
      apiService.getReservas(),
      apiService.getHerramientas(),
      apiService.getFacturas()
    ]);

    // Simulamos clienteId = 1 (ajustar según sesión)
    const activeRentals = rentals.filter(r => r.clienteId === 1 && r.estado === 'En Alquiler');
    const pendingPayments = payments.filter(p => p.estado === 'Pendiente');

    return `
      <div class="view client-view client-dashboard-view">
        <div class="dashboard-header">
          <div class="dashboard-title">Mi Panel</div>
          <div class="action-buttons">
            <button class="btn btn-primary">
              <i class="fas fa-search"></i>
              <span>Buscar Herramientas</span>
            </button>
          </div>
        </div>

        <div class="stats-container">
          ${createStatCard('Alquileres Activos', activeRentals.length.toString(), 'fas fa-clipboard-list', '#fb6340', { text: 'Última devolución: hace 2 semanas' })}
          ${createStatCard('Historial de Alquileres', rentals.length.toString(), 'fas fa-history', '#5e72e4', { text: 'Último: hace 3 semanas' })}
          ${createStatCard('Pagos Pendientes', pendingPayments.length.toString(), 'fas fa-file-invoice-dollar', '#f5365c', { text: 'Vence: 20/05/2023' })}
          ${createStatCard('Herramientas Favoritas', '5', 'fas fa-heart', '#2dce89', { text: 'Taladro Industrial añadido recientemente' })}
        </div>

        ${createTable('Mis Alquileres Activos', 
          ['ID', 'Herramienta', 'Proveedor', 'Fecha Inicio', 'Fecha Fin', 'Monto', 'Estado', 'Acciones'], 
          activeRentals.slice(0, 2).map(rental => [
            rental.id,
            rental.herramienta?.nombre || 'Herramienta no disponible',
            rental.proveedor?.nombre || 'Proveedor no encontrado',
            rental.fechaInicio || 'No especificada',
            rental.fechaFin || 'No especificada',
            `$${parseFloat(rental.precio || 0).toFixed(2)}`,
            `<span class="status status-rented">${rental.estado || 'En Alquiler'}</span>`,
            '<i class="fas fa-eye action-icon"></i> <i class="fas fa-undo action-icon"></i>'
          ])
        )}
      </div>
    `;
  } catch (error) {
    console.error('Error fetching client dashboard data:', error);
    return `<div>Error al cargar los datos del dashboard.</div>`;
  }
}

// === Vista de Explorar Herramientas ===
async function createClientExploreView() {
  try {
    const tools = await apiService.getHerramientas();

    const toolCards = tools.map(tool => createToolCard({
      nombre: tool.nombre,
      marca: tool.marca,
      modelo: tool.modelo,
      categoria: tool.categoria,
      costoPorDia: tool.costoPorDia,
      cantidadDisponible: tool.cantidadDisponible,
      activa: tool.activa,
      imagenUrl: tool.imagenUrl
    })).join('');

    return `
      <div class="view client-view client-explore-view hidden">
        <div class="dashboard-header">
          <div class="dashboard-title">Explorar Herramientas</div>
          <div class="action-buttons">
            <button class="btn btn-secondary">
              <i class="fas fa-filter"></i>
              <span>Filtrar</span>
            </button>
            <div class="search-box">
              <i class="fas fa-search"></i>
              <input type="text" placeholder="Buscar herramientas...">
            </div>
          </div>
        </div>

        <div class="tools-grid">
          ${toolCards}
        </div>
      </div>
    `;
  } catch (error) {
    console.error('Error fetching explore view:', error);
    return `<div>Error al cargar las herramientas.</div>`;
  }
}

// === Vista de Alquileres del Cliente ===
async function createClientRentalsView() {
  try {
    const rentals = await apiService.getReservas();
    const userRentals = rentals.filter(r => r.clienteId === 1); // Cambiar por ID real si es posible

    const activeRentals = userRentals.filter(r => r.estado === 'En Alquiler');
    const historyRentals = userRentals.filter(r => r.estado === 'Completado');

    return `
      <div class="view client-view client-rentals-view hidden">
        <div class="dashboard-header">
          <div class="dashboard-title">Mis Alquileres</div>
          <div class="action-buttons">
            <button class="btn btn-secondary">
              <i class="fas fa-filter"></i>
              <span>Filtrar</span>
            </button>
            <button class="btn btn-primary">
              <i class="fas fa-search"></i>
              <span>Buscar Herramientas</span>
            </button>
          </div>
        </div>

        ${createTable('Alquileres Activos', 
          ['ID', 'Herramienta', 'Proveedor', 'Fecha Inicio', 'Fecha Fin', 'Monto', 'Estado', 'Acciones'], 
          activeRentals.map(rental => [
            rental.id,
            rental.herramienta?.nombre || 'Herramienta no disponible',
            rental.proveedor?.nombre || 'Proveedor no encontrado',
            rental.fechaInicio || 'No especificada',
            rental.fechaFin || 'No especificada',
            `$${parseFloat(rental.precio || 0).toFixed(2)}`,
            `<span class="status status-rented">${rental.estado || 'En Alquiler'}</span>`,
            '<i class="fas fa-eye action-icon"></i> <i class="fas fa-undo action-icon"></i>'
          ])
        )}

        ${createTable('Historial de Alquileres', 
          ['ID', 'Herramienta', 'Proveedor', 'Fecha Inicio', 'Fecha Fin', 'Monto', 'Estado', 'Acciones'], 
          historyRentals.map(rental => [
            rental.id,
            rental.herramienta?.nombre || 'Herramienta no disponible',
            rental.proveedor?.nombre || 'Proveedor no encontrado',
            rental.fechaInicio || 'No especificada',
            rental.fechaFin || 'No especificada',
            `$${parseFloat(rental.precio || 0).toFixed(2)}`,
            `<span class="status status-available">${rental.estado || 'Completado'}</span>`,
            '<i class="fas fa-eye action-icon"></i> <i class="fas fa-file-invoice action-icon"></i>'
          ])
        )}
      </div>
    `;
  } catch (error) {
    console.error('Error fetching rentals:', error);
    return `<div>Error al cargar tus alquileres.</div>`;
  }
}

// === Vista de Pagos del Cliente ===
async function createClientPaymentsView() {
  try {
    const invoices = await apiService.getFacturas();
    const userInvoices = invoices.filter(i => i.clienteId === 1);

    const paidInvoices = userInvoices.filter(i => i.estado === 'Pagada');
    const pendingInvoices = userInvoices.filter(i => i.estado === 'Pendiente');

    const totalPaid = paidInvoices.reduce((sum, inv) => sum + parseFloat(inv.monto || 0), 0);
    const pendingAmount = pendingInvoices.length > 0 ? parseFloat(pendingInvoices[0].monto || 0) : 0;

    return `
      <div class="view client-view client-payments-view hidden">
        <div class="dashboard-header">
          <div class="dashboard-title">Mis Pagos</div>
          <div class="action-buttons">
            <button class="btn btn-secondary">
              <i class="fas fa-filter"></i>
              <span>Filtrar</span>
            </button>
            <button class="btn btn-primary">
              <i class="fas fa-download"></i>
              <span>Exportar</span>
            </button>
          </div>
        </div>

        <div class="stats-container">
          ${createStatCard('Total Pagado', `$${totalPaid.toFixed(2)}`, 'fas fa-dollar-sign', '#2dce89', { text: 'Últimos 12 meses' })}
          ${createStatCard('Pagos Pendientes', `$${pendingAmount.toFixed(2)}`, 'fas fa-file-invoice-dollar', '#f5365c', { text: 'Próximo vencimiento: 20/05/2023' })}
          ${createStatCard('Método de Pago', 'Visa', 'fas fa-credit-card', '#5e72e4', { text: 'Termina en 4582' })}
          ${createStatCard('Facturas Disponibles', userInvoices.length.toString(), 'fas fa-file-invoice', '#2dce89', { text: 'Descargables en PDF' })}
        </div>

        ${createTable('Historial de Pagos', 
          ['ID Factura', 'Herramienta', 'Proveedor', 'Fecha', 'Monto', 'Estado', 'Acciones'], 
          userInvoices.slice(0, 3).map(invoice => [
            `F-${invoice.id}`,
            invoice.reserva?.herramienta?.nombre || 'Herramienta no disponible',
            invoice.reserva?.proveedor?.nombre || 'Proveedor no encontrado',
            new Date().toLocaleDateString(),
            `$${parseFloat(invoice.monto || 0).toFixed(2)}`,
            `<span class="status status-${invoice.estado === 'Pagada' ? 'available' : 'rented'}">${invoice.estado || 'Desconocida'}</span>`,
            '<i class="fas fa-eye action-icon"></i> <i class="fas fa-download action-icon"></i>'
          ])
        )}
      </div>
    `;
  } catch (error) {
    console.error('Error fetching payments:', error);
    return `<div>Error al cargar tus pagos.</div>`;
  }
}

// === Función principal para crear todas las vistas del cliente ===
export async function createClientViews() {
  return `
    ${await createClientDashboardView()}
    ${await createClientExploreView()}
    ${await createClientRentalsView()}
    ${await createClientPaymentsView()}
  `;
}