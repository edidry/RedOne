// =========================================================================
// MÓDULO 08: INICIALIZACIÓN DE LA APLICACIÓN Y ARRANQUE DE SESIÓN
// =========================================================================

// =========================================================================
// INICIALIZACIÓN DE LA APLICACIÓN (CON VERIFICACIÓN DE SESIÓN 24H)
// =========================================================================
window.addEventListener('DOMContentLoaded', () => {
  sincronizarUITiendasDinamicas();
  if (typeof sincronizarDatalistEmpleados === 'function') {
    sincronizarDatalistEmpleados();
  }
  if (typeof aplicarConfiguracionNegocioEnTicket === 'function') {
    aplicarConfiguracionNegocioEnTicket();
  }
  aplicarEtiquetasPersonalizadas();
  seleccionarCategoriaRecepcion('Celular');
  seleccionarTipoReparacion('Pantalla Incell');
  seleccionarGarantiaOrden('100');
  actualizarBadgesTarifas();
  aplicarPresetDashboard('mes');
  document.getElementById('header-folio').textContent = obtenerSiguienteFolio();
  actualizarContadores();
  actualizarVista();
  calcularPresupuesto();
  renderizarVistaCortes();

  const params = new URLSearchParams(window.location.search);
  const folioUrl = params.get('folio');
  const mainApp = document.querySelector('main');
  const headerApp = document.querySelector('header');

  if (tieneSesionPin24hValida()) {
    if (headerApp) headerApp.classList.remove('hidden');
    if (mainApp) mainApp.classList.remove('hidden');
    cambiarRol('tecnico');
    if (folioUrl) {
      cargarOrdenParaEditar(folioUrl, true);
    }
  } else {
    if (headerApp) headerApp.classList.add('hidden');
    if (mainApp) mainApp.classList.add('hidden');
    abrirModalPin({
      modo: 'tecnico',
      folioQRPendiente: folioUrl || null,
      alIniciar: true
    });
  }

  if (typeof aplicarEtiquetasPersonalizadas === 'function') {
    aplicarEtiquetasPersonalizadas();
  }
});

window.addEventListener('load', () => {
  if (typeof aplicarEtiquetasPersonalizadas === 'function') {
    aplicarEtiquetasPersonalizadas();
  }
});
