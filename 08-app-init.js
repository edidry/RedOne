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

  if (folioUrl) {
    if (tieneSesionPin24hValida()) {
      cambiarRol('tecnico');
      cargarOrdenParaEditar(folioUrl, true);
    } else {
      abrirModalPin({ modo: 'tecnico', folioQRPendiente: folioUrl, alIniciar: true });
    }
  } else {
    if (tieneSesionPin24hValida()) {
      cambiarRol('tecnico');
    } else {
      abrirModalPin({ modo: 'tecnico', alIniciar: true });
    }
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
