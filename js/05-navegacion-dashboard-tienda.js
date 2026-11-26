// =========================================================================
// MÓDULO 05: NAVEGACIÓN PRINCIPAL, DASHBOARD EJECUTIVO Y VISTA ENCARGADO TIENDA
// =========================================================================

// =========================================================================
// CAMBIO DE ROL (TÉCNICO vs TIENDA CON PIN INDEPENDIENTE)
// =========================================================================
function cambiarRol(nuevoRol, nombreTiendaForzada = null) {
  rolActual = nuevoRol;
  const btnTec = document.getElementById('btn-rol-tecnico');
  const btnTie = document.getElementById('btn-rol-tienda');
  const btnEmp = document.getElementById('btn-rol-empleado');
  const badgeRol = document.getElementById('badge-rol');
  const banner = document.getElementById('banner-modo-tienda');
  const tarjetaCostos = document.getElementById('tarjeta-costos');
  const tabDashboard = document.getElementById('tab-dashboard');
  const tabPresupuestos = document.getElementById('tab-presupuestos');
  const tabBandeja = document.getElementById('tab-bandeja');
  const tabCortes = document.getElementById('tab-cortes');
  const tabConfiguracion = document.getElementById('tab-configuracion');
  const tabTiendaRecibir = document.getElementById('tab-tienda-recibir');
  const tabTiendaEntregar = document.getElementById('tab-tienda-entregar');
  const lblTabRegistro = document.getElementById('lbl-tab-registro');

  const nomTec = typeof obtenerNombreRol === 'function' ? obtenerNombreRol('tecnico') : 'Técnico';
  const nomEmp = typeof obtenerNombreRol === 'function' ? obtenerNombreRol('empleado') : 'Empleado';
  const nomTie = typeof obtenerNombreRol === 'function' ? obtenerNombreRol('tienda') : 'Tienda';

  const spanBtnTec = btnTec?.querySelector('span');
  const spanBtnEmp = btnEmp?.querySelector('span');
  const spanBtnTie = btnTie?.querySelector('span');
  if (spanBtnTec) spanBtnTec.textContent = nomTec;
  if (spanBtnEmp) spanBtnEmp.textContent = nomEmp;
  if (spanBtnTie) spanBtnTie.textContent = nomTie;

  const estiloInactivoRol = 'px-3 py-2 rounded-xl text-slate-400 hover:text-white font-semibold transition flex items-center gap-1.5 min-h-[38px]';
  if (btnTec) btnTec.className = estiloInactivoRol;
  if (btnTie) btnTie.className = estiloInactivoRol;
  if (btnEmp) btnEmp.className = estiloInactivoRol;

  if (nuevoRol === 'tecnico') {
    tiendaAutenticadaActual = null;
    window.empleadoAutenticadoActual = null;
    if (btnTec) btnTec.className = 'px-3 py-2 rounded-xl bg-red-600 text-white font-bold transition flex items-center gap-1.5 min-h-[38px] shadow-md';
    badgeRol.textContent = `Vista ${nomTec}`;
    badgeRol.className = 'text-xs font-medium bg-red-600/20 text-red-400 border border-red-500/30 px-2.5 py-0.5 rounded-full';
    banner.classList.add('hidden');
    tarjetaCostos.classList.remove('hidden');

    tabDashboard.classList.remove('hidden');
    tabPresupuestos.classList.remove('hidden');
    tabBandeja.classList.remove('hidden');
    tabCortes.classList.remove('hidden');
    if (tabConfiguracion) tabConfiguracion.classList.remove('hidden');

    tabTiendaRecibir.classList.add('hidden');
    tabTiendaEntregar.classList.add('hidden');
    lblTabRegistro.textContent = 'Recepción';
    document.getElementById('lbl-tarjeta-origen').textContent = etiquetasPersonalizadas.origen || 'Origen del Equipo';

    prepararNuevaOrden();
    cambiarPestana('dashboard');
  } else if (nuevoRol === 'empleado') {
    tiendaAutenticadaActual = null;
    const emp = window.empleadoAutenticadoActual || null;
    const nombreEmp = nombreTiendaForzada || (emp ? emp.nombre : nomEmp);

    if (btnEmp) btnEmp.className = 'px-3 py-2 rounded-xl bg-emerald-600 text-white font-bold transition flex items-center gap-1.5 min-h-[38px] shadow-md';
    badgeRol.textContent = `${nomEmp}: ${nombreEmp}`;
    badgeRol.className = 'text-xs font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded-full';
    banner.classList.add('hidden');
    tarjetaCostos.classList.remove('hidden');

    tabPresupuestos.classList.remove('hidden');
    tabDashboard.classList.add('hidden');
    tabBandeja.classList.add('hidden');
    tabCortes.classList.add('hidden');
    if (tabConfiguracion) tabConfiguracion.classList.add('hidden');

    tabTiendaRecibir.classList.add('hidden');
    tabTiendaEntregar.classList.add('hidden');
    lblTabRegistro.textContent = 'Recepción';
    document.getElementById('lbl-tarjeta-origen').textContent = etiquetasPersonalizadas.origen || 'Origen del Equipo';

    prepararNuevaOrden();
    cambiarPestana('registro');
  } else {
    window.empleadoAutenticadoActual = null;
    const sucursal = nombreTiendaForzada || tiendaAutenticadaActual || tiendasConfig[0]?.nombre || 'Ixmicel 1';
    tiendaAutenticadaActual = sucursal;

    if (btnTie) btnTie.className = 'px-3 py-2 rounded-xl bg-sky-500 text-slate-950 font-bold transition flex items-center gap-1.5 min-h-[38px] shadow-md';
    badgeRol.textContent = `Vista ${nomTie}`;
    badgeRol.className = 'text-xs font-medium bg-sky-500/20 text-sky-400 border border-sky-500/30 px-2.5 py-0.5 rounded-full';
    banner.classList.remove('hidden');
    document.getElementById('banner-nombre-tienda').textContent = sucursal;
    tarjetaCostos.classList.add('hidden');

    tabDashboard.classList.add('hidden');
    tabPresupuestos.classList.add('hidden');
    tabBandeja.classList.add('hidden');
    tabCortes.classList.add('hidden');
    if (tabConfiguracion) tabConfiguracion.classList.add('hidden');

    tabTiendaRecibir.classList.remove('hidden');
    tabTiendaEntregar.classList.remove('hidden');
    lblTabRegistro.textContent = 'Registrar Equipo';
    document.getElementById('lbl-tarjeta-origen').textContent = 'Sucursal Autenticada';

    prepararNuevaOrden();
    seleccionarOrigen(sucursal, true);
    actualizarContadoresTienda();
    cambiarPestana('registro');
  }
}

// =========================================================================
// PESTAÑAS PRINCIPALES
// =========================================================================
let vistaTiendaSubmodo = 'recibir';

function cambiarPestana(pestana) {
  if (rolActual === 'empleado') {
    const permitidasEmpleado = ['registro', 'presupuestos'];
    if (!permitidasEmpleado.includes(pestana)) {
      pestana = 'registro';
    }
  } else if (rolActual === 'tienda') {
    const permitidasTienda = ['registro', 'tienda-recibir', 'tienda-entregar'];
    if (!permitidasTienda.includes(pestana)) {
      pestana = 'registro';
    }
  } else {
    if (pestana === 'tienda-recibir' || pestana === 'tienda-entregar') {
      pestana = 'bandeja';
    }
  }

  const vistaDashboard = document.getElementById('vista-dashboard');
  const vistaRegistro = document.getElementById('vista-registro');
  const vistaBandeja = document.getElementById('vista-bandeja');
  const vistaPresupuestos = document.getElementById('vista-presupuestos');
  const vistaCortes = document.getElementById('vista-cortes');
  const vistaConfiguracion = document.getElementById('vista-configuracion');
  const vistaTiendaSeg = document.getElementById('vista-tienda-seguimiento');

  const tabDashboard = document.getElementById('tab-dashboard');
  const tabRegistro = document.getElementById('tab-registro');
  const tabBandeja = document.getElementById('tab-bandeja');
  const tabPresupuestos = document.getElementById('tab-presupuestos');
  const tabCortes = document.getElementById('tab-cortes');
  const tabConfiguracion = document.getElementById('tab-configuracion');
  const tabTiendaRecibir = document.getElementById('tab-tienda-recibir');
  const tabTiendaEntregar = document.getElementById('tab-tienda-entregar');

  vistaDashboard.classList.add('hidden');
  vistaRegistro.classList.add('hidden');
  vistaBandeja.classList.add('hidden');
  vistaPresupuestos.classList.add('hidden');
  vistaCortes.classList.add('hidden');
  if (vistaConfiguracion) vistaConfiguracion.classList.add('hidden');
  vistaTiendaSeg.classList.add('hidden');

  tabDashboard.className = 'px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold transition flex items-center gap-1.5 min-h-[38px] shadow-sm';
  tabRegistro.className = 'px-4 py-2.5 rounded-xl bg-red-600/20 hover:bg-red-600/30 text-white border-2 border-red-500/70 font-extrabold transition flex items-center gap-2 min-h-[42px] shadow-md shadow-red-600/15';
  tabBandeja.className = 'px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold transition flex items-center gap-1.5 min-h-[38px] shadow-sm';
  tabPresupuestos.className = 'px-4 py-2.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-white border-2 border-emerald-500/70 font-extrabold transition flex items-center gap-2 min-h-[42px] shadow-md shadow-emerald-600/15';
  tabCortes.className = 'px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold transition flex items-center gap-1.5 min-h-[38px] shadow-sm';
  if (tabConfiguracion) {
    tabConfiguracion.className = 'px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-sky-300 border border-sky-500/40 font-bold transition flex items-center gap-1.5 min-h-[38px] shadow-sm';
  }
  tabTiendaRecibir.className = 'px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-amber-500/40 font-bold transition flex items-center gap-1.5 min-h-[40px] shadow-sm';
  tabTiendaEntregar.className = 'px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-emerald-500/40 font-bold transition flex items-center gap-1.5 min-h-[40px] shadow-sm';

  if (rolActual === 'empleado') {
    tabDashboard.classList.add('hidden');
    tabBandeja.classList.add('hidden');
    tabCortes.classList.add('hidden');
    if (tabConfiguracion) tabConfiguracion.classList.add('hidden');
    tabTiendaRecibir.classList.add('hidden');
    tabTiendaEntregar.classList.add('hidden');
  } else if (rolActual === 'tienda') {
    tabDashboard.classList.add('hidden');
    tabPresupuestos.classList.add('hidden');
    tabBandeja.classList.add('hidden');
    tabCortes.classList.add('hidden');
    if (tabConfiguracion) tabConfiguracion.classList.add('hidden');
  } else {
    tabTiendaRecibir.classList.add('hidden');
    tabTiendaEntregar.classList.add('hidden');
  }

  if (pestana === 'dashboard') {
    vistaDashboard.classList.remove('hidden');
    tabDashboard.className = 'px-3 py-2 rounded-xl bg-slate-800 text-white border border-slate-500 font-bold transition flex items-center gap-1.5 min-h-[38px] shadow';
    renderizarDashboard();
  } else if (pestana === 'registro') {
    vistaRegistro.classList.remove('hidden');
    tabRegistro.className = 'px-4 py-2.5 rounded-xl bg-red-600 text-white border-2 border-red-400 font-extrabold transition flex items-center gap-2 min-h-[42px] shadow-lg shadow-red-600/35';
    actualizarVista();
  } else if (pestana === 'presupuestos') {
    vistaPresupuestos.classList.remove('hidden');
    tabPresupuestos.className = 'px-4 py-2.5 rounded-xl bg-emerald-600 text-white border-2 border-emerald-400 font-extrabold transition flex items-center gap-2 min-h-[42px] shadow-lg shadow-emerald-600/35';
    calcularPresupuesto();
  } else if (pestana === 'cortes') {
    vistaCortes.classList.remove('hidden');
    tabCortes.className = 'px-3 py-2 rounded-xl bg-sky-600 text-white border border-sky-400 font-bold transition flex items-center gap-1.5 min-h-[38px] shadow';
    renderizarVistaCortes();
  } else if (pestana === 'configuracion') {
    if (vistaConfiguracion) vistaConfiguracion.classList.remove('hidden');
    if (tabConfiguracion) {
      tabConfiguracion.className = 'px-3.5 py-2 rounded-xl bg-sky-600 text-white border border-sky-400 font-bold transition flex items-center gap-1.5 min-h-[38px] shadow-lg shadow-sky-600/25';
    }
    if (typeof refrescarPanelConfiguracion === 'function') {
      refrescarPanelConfiguracion();
    }
  } else if (pestana === 'tienda-recibir') {
    vistaTiendaSubmodo = 'recibir';
    vistaTiendaSeg.classList.remove('hidden');
    tabTiendaRecibir.className = 'px-3.5 py-2 rounded-xl bg-amber-600 text-white border border-amber-400 font-bold transition flex items-center gap-1.5 min-h-[40px] shadow-lg shadow-amber-600/25';
    renderizarVistaTienda();
  } else if (pestana === 'tienda-entregar') {
    vistaTiendaSubmodo = 'entregar';
    vistaTiendaSeg.classList.remove('hidden');
    tabTiendaEntregar.className = 'px-3.5 py-2 rounded-xl bg-emerald-600 text-white border border-emerald-400 font-bold transition flex items-center gap-1.5 min-h-[40px] shadow-lg shadow-emerald-600/25';
    renderizarVistaTienda();
  } else {
    vistaBandeja.classList.remove('hidden');
    tabBandeja.className = 'px-3 py-2 rounded-xl bg-slate-800 text-white border border-slate-500 font-bold transition flex items-center gap-1.5 min-h-[38px] shadow';
    renderizarBandeja();
  }
}

// =========================================================================
// RENDERIZADO DE VISTAS EXCLUSIVAS PARA TIENDA ALIADA AUTENTICADA
// =========================================================================
function actualizarContadoresTienda() {
  const sucursal = tiendaAutenticadaActual || origenActual;
  const deEstaTienda = ordenes.filter(o => String(o.origen || '').toLowerCase() === String(sucursal).toLowerCase());

  const enTaller = deEstaTienda.filter(o => o.estatus === 'Pendiente de revisar' || o.estatus === 'En reparación / Esperando pieza');
  const listos = deEstaTienda.filter(o => o.estatus === 'Listo para entregar');

  const cRec = document.getElementById('contador-tienda-recibir');
  const cEnt = document.getElementById('contador-tienda-entregar');
  if (cRec) cRec.textContent = enTaller.length;
  if (cEnt) cEnt.textContent = listos.length;
}

function alternarHistorialTienda() {
  const grid = document.getElementById('grid-historial-entregados-tienda');
  const ico = document.getElementById('icono-toggle-hist-tienda');
  if (grid.classList.contains('hidden')) {
    grid.classList.remove('hidden');
    grid.classList.add('grid');
    ico.className = 'fa-solid fa-chevron-up text-slate-400';
  } else {
    grid.classList.add('hidden');
    grid.classList.remove('grid');
    ico.className = 'fa-solid fa-chevron-down text-slate-400';
  }
}

function renderizarVistaTienda() {
  const sucursal = tiendaAutenticadaActual || origenActual;
  actualizarContadoresTienda();

  const texto = (document.getElementById('input-buscador-tienda')?.value || '').toLowerCase().trim();
  const badgeTipo = document.getElementById('badge-vista-tienda-tipo');
  const titulo = document.getElementById('titulo-vista-tienda-seguimiento');
  const desc = document.getElementById('desc-vista-tienda-seguimiento');
  const grid = document.getElementById('grid-ordenes-tienda');
  const bloqueHist = document.getElementById('bloque-historial-entregados-tienda');
  const gridHist = document.getElementById('grid-historial-entregados-tienda');

  const deEstaTienda = ordenes.filter(o => {
    const mismaSucursal = String(o.origen || '').toLowerCase() === String(sucursal).toLowerCase();
    if (!mismaSucursal) return false;
    if (!texto) return true;
    return [o.id, o.folioTienda, o.marca, o.modelo, o.encargadoTienda, o.falla]
      .join(' ').toLowerCase().includes(texto);
  });

  if (vistaTiendaSubmodo === 'recibir') {
    badgeTipo.textContent = 'Por Enviar al Taller / En Taller';
    badgeTipo.className = 'text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30';
    titulo.textContent = `Equipos de ${sucursal} Enviados a Taller (En Proceso)`;
    desc.textContent = `Listado exclusivo de ${sucursal}: equipos pendientes de revisar o actualmente en reparación en laboratorio.`;
    bloqueHist.classList.add('hidden');

    const lista = deEstaTienda.filter(o => o.estatus === 'Pendiente de revisar' || o.estatus === 'En reparación / Esperando pieza');
    if (lista.length === 0) {
      grid.innerHTML = `<div class="col-span-full text-center py-12 text-slate-500 text-sm bg-slate-950/60 rounded-2xl border border-slate-800">
        No hay equipos de <strong>${sucursal}</strong> pendientes o en reparación en este momento.
      </div>`;
      return;
    }

    grid.innerHTML = lista.map(o => crearTarjetaSoloLecturaTienda(o, 'en_taller')).join('');
  } else {
    badgeTipo.textContent = 'Por Recibir del Taller / Listos';
    badgeTipo.className = 'text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30';
    titulo.textContent = `Equipos de ${sucursal} Listos para Recibir del Taller`;
    desc.textContent = `Equipos de ${sucursal} ya reparados y listos para recibir en sucursal y entregar al cliente.`;

    const listos = deEstaTienda.filter(o => o.estatus === 'Listo para entregar');
    const entregados = deEstaTienda.filter(o => o.estatus === 'Entregado' || o.estatus === 'Entregado y Pagado');

    if (listos.length === 0) {
      grid.innerHTML = `<div class="col-span-full text-center py-12 text-slate-500 text-sm bg-slate-950/60 rounded-2xl border border-slate-800">
        No hay equipos de <strong>${sucursal}</strong> marcados como "Listo para entregar" en este momento.
      </div>`;
    } else {
      grid.innerHTML = listos.map(o => crearTarjetaSoloLecturaTienda(o, 'listo')).join('');
    }

    if (entregados.length > 0) {
      bloqueHist.classList.remove('hidden');
      document.getElementById('contador-tienda-entregados-hist').textContent = entregados.length;
      gridHist.innerHTML = entregados.map(o => crearTarjetaSoloLecturaTienda(o, 'entregado')).join('');
    } else {
      bloqueHist.classList.add('hidden');
    }
  }
}

function crearTarjetaSoloLecturaTienda(o, modoVisual) {
  const esListo = modoVisual === 'listo';
  const esEntregado = modoVisual === 'entregado';
  const bordeCard = esListo
    ? 'border-emerald-500/50 bg-emerald-950/15'
    : esEntregado
      ? 'border-slate-800 bg-slate-950/60 opacity-85'
      : 'border-amber-500/40 bg-slate-950';

  const badgeEstado = esListo
    ? '<span class="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"><i class="fa-solid fa-circle-check mr-1"></i>Listo para entregar</span>'
    : esEntregado
      ? `<span class="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">${o.estatus}</span>`
      : `<span class="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">${o.estatus}</span>`;

  const servicio = obtenerEtiquetaServicioOrden(o);
  const monto = Number(o.costo || 0);

  return `
    <div class="${bordeCard} border rounded-2xl p-4 flex flex-col justify-between gap-3 transition">
      <div class="space-y-2">
        <div class="flex items-center justify-between gap-2">
          <span class="font-mono text-xs font-black text-sky-400">${o.id} ${o.folioTienda ? `· Nota #${o.folioTienda}` : ''}</span>
          <span class="text-[11px] text-slate-400">${o.fecha}</span>
        </div>

        <div>
          <h3 class="text-sm font-bold text-white">${o.marca} ${o.modelo}</h3>
          <p class="text-xs text-slate-400">Recibió en tienda: <strong class="text-slate-200">${o.encargadoTienda || '---'}</strong></p>
        </div>

        <div class="bg-slate-900/90 border border-slate-800 rounded-xl p-2.5 space-y-1 text-xs">
          <p class="text-slate-200 font-semibold">${servicio}</p>
          ${o.falla ? `<p class="text-[11px] text-slate-400">${o.falla}</p>` : ''}
        </div>
      </div>

      <div class="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
        ${badgeEstado}
        <span class="text-sm font-black ${monto > 0 ? 'text-white' : 'text-slate-400'}">
          ${monto > 0 ? '$' + monto.toLocaleString('es-MX') + ' MXN' : 'Por cotizar'}
        </span>
      </div>
    </div>
  `;
}

// =========================================================================
// DASHBOARD EJECUTIVO CON FILTRO DE RANGO DE FECHAS
// =========================================================================
function aplicarPresetDashboard(preset) {
  const hoy = new Date();
  const yyyy = hoy.getFullYear();
  const mm = String(hoy.getMonth() + 1).padStart(2, '0');
  const dd = String(hoy.getDate()).padStart(2, '0');
  const ultimoDiaMes = new Date(yyyy, hoy.getMonth() + 1, 0).getDate();

  const inpDesde = document.getElementById('dash-fecha-desde');
  const inpHasta = document.getElementById('dash-fecha-hasta');

  document.getElementById('btn-dash-mes').className = 'px-3 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 font-semibold transition';
  document.getElementById('btn-dash-anio').className = 'px-3 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 font-semibold transition';
  document.getElementById('btn-dash-todo').className = 'px-3 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 font-semibold transition';

  if (preset === 'mes') {
    inpDesde.value = `${yyyy}-${mm}-01`;
    inpHasta.value = `${yyyy}-${mm}-${String(ultimoDiaMes).padStart(2, '0')}`;
    document.getElementById('btn-dash-mes').className = 'px-3 py-1.5 rounded-lg bg-sky-600 text-white font-bold transition';
  } else if (preset === 'anio') {
    inpDesde.value = `${yyyy}-01-01`;
    inpHasta.value = `${yyyy}-${mm}-${dd}`;
    document.getElementById('btn-dash-anio').className = 'px-3 py-1.5 rounded-lg bg-sky-600 text-white font-bold transition';
  } else {
    inpDesde.value = '';
    inpHasta.value = '';
    document.getElementById('btn-dash-todo').className = 'px-3 py-1.5 rounded-lg bg-sky-600 text-white font-bold transition';
  }

  renderizarDashboard();
}

function limpiarRangoFechasDashboard() {
  aplicarPresetDashboard('todo');
}

function extraerFechaISOOrden(fechaStr) {
  const m = String(fechaStr || '').match(/(\d{4}-\d{2}-\d{2})/);
  return m ? m[1] : '';
}

function renderizarDashboard() {
  const desde = document.getElementById('dash-fecha-desde')?.value || '';
  const hasta = document.getElementById('dash-fecha-hasta')?.value || '';

  const lblPeriodo = document.getElementById('dash-periodo-etiqueta');
  if (lblPeriodo) {
    if (desde && hasta) lblPeriodo.textContent = `Periodo: ${desde} al ${hasta}`;
    else if (desde) lblPeriodo.textContent = `Desde: ${desde}`;
    else if (hasta) lblPeriodo.textContent = `Hasta: ${hasta}`;
    else lblPeriodo.textContent = 'Todo el historial';
  }

  const pendientes = ordenes.filter(o => o.estatus === 'Pendiente de revisar' || o.estatus === 'En reparación / Esperando pieza').length;
  const listos = ordenes.filter(o => o.estatus === 'Listo para entregar').length;

  const ordenesPeriodo = ordenes.filter(o => {
    const fIso = extraerFechaISOOrden(o.fecha);
    if (!fIso) return (!desde && !hasta);
    if (desde && fIso < desde) return false;
    if (hasta && fIso > hasta) return false;
    return true;
  });

  let ingresosPeriodo = 0;
  let costoPiezasPeriodo = 0;
  let utilidadPeriodo = 0;

  const sucursalesSet = new Set(['RedOne', ...tiendasConfig.map(t => t.nombre)]);
  ordenesPeriodo.forEach(o => {
    if (o.origen) sucursalesSet.add(o.origen);
  });

  const ingresosPorTienda = {};
  const conteoPorTienda = {};
  sucursalesSet.forEach(s => {
    ingresosPorTienda[s] = 0;
    conteoPorTienda[s] = 0;
  });

  const conteoModelos = {};

  ordenesPeriodo.forEach(o => {
    const costo = Number(o.costo || 0);
    const pieza = Number(o.costoPieza || 0);
    const mo = o.manoObra !== undefined ? Number(o.manoObra) : Math.max(0, costo - pieza);

    ingresosPeriodo += costo;
    costoPiezasPeriodo += pieza;
    utilidadPeriodo += mo;

    const origenKey = o.origen || 'RedOne';
    ingresosPorTienda[origenKey] = (ingresosPorTienda[origenKey] || 0) + costo;
    conteoPorTienda[origenKey] = (conteoPorTienda[origenKey] || 0) + 1;

    const nombreEquipo = `${o.marca || ''} ${o.modelo || ''}`.trim();
    if (nombreEquipo) {
      conteoModelos[nombreEquipo] = (conteoModelos[nombreEquipo] || 0) + 1;
    }
  });

  document.getElementById('kpi-pendientes').textContent = pendientes;
  document.getElementById('kpi-listos').textContent = listos;
  document.getElementById('kpi-ingresos-mes').textContent = '$' + ingresosPeriodo.toLocaleString('es-MX') + ' MXN';
  document.getElementById('kpi-ordenes-mes').textContent = `${ordenesPeriodo.length} orden(es) · Refacciones: $${costoPiezasPeriodo.toLocaleString('es-MX')}`;
  document.getElementById('kpi-utilidad-mes').textContent = '$' + utilidadPeriodo.toLocaleString('es-MX') + ' MXN';

  const listaTiendas = Object.keys(ingresosPorTienda);
  const maxIngreso = Math.max(1, ...Object.values(ingresosPorTienda));
  let tiendaLider = '---';
  let maxValLider = -1;

  listaTiendas.forEach(t => {
    if (ingresosPorTienda[t] > maxValLider && ingresosPorTienda[t] > 0) {
      maxValLider = ingresosPorTienda[t];
      tiendaLider = `${t} ($${ingresosPorTienda[t].toLocaleString('es-MX')})`;
    }
  });
  document.getElementById('dash-tienda-lider').textContent = `Líder: ${tiendaLider}`;

  const contBarras = document.getElementById('dash-barras-tiendas');
  contBarras.innerHTML = listaTiendas.map(t => {
    const monto = ingresosPorTienda[t];
    const cant = conteoPorTienda[t];
    const pct = Math.round((monto / maxIngreso) * 100);
    const paleta = obtenerTemaPorOrigen(t);
    return `
      <div class="space-y-1">
        <div class="flex items-center justify-between text-xs">
          <span class="font-bold text-slate-200 flex items-center gap-1.5">
            <i class="fa-solid ${t === 'RedOne' ? 'fa-wrench' : 'fa-store'} ${paleta.iconText}"></i> ${t}
            <span class="text-[11px] font-normal text-slate-400">(${cant} eq.)</span>
          </span>
          <span class="font-mono font-bold text-white">$${monto.toLocaleString('es-MX')} MXN</span>
        </div>
        <div class="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
          <div class="${paleta.barBg} h-full rounded-full transition-all duration-500" style="width: ${pct}%"></div>
        </div>
      </div>
    `;
  }).join('');

  const topModelos = Object.entries(conteoModelos)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const contTop = document.getElementById('dash-top-modelos');
  if (topModelos.length === 0) {
    contTop.innerHTML = `<p class="text-xs text-slate-500 text-center py-6">Aún no hay equipos en el periodo seleccionado.</p>`;
  } else {
    contTop.innerHTML = topModelos.map(([modelo, veces], idx) => {
      const medalla = idx === 0 ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'bg-slate-950 text-slate-300 border-slate-800';
      return `
        <div class="flex items-center justify-between bg-slate-950/90 border border-slate-800 rounded-xl px-3.5 py-2.5">
          <div class="flex items-center gap-2.5">
            <span class="w-6 h-6 rounded-lg border ${medalla} text-xs font-black flex items-center justify-center">${idx + 1}</span>
            <span class="text-xs font-bold text-white">${modelo}</span>
          </div>
          <span class="text-xs font-semibold text-red-400 bg-red-500/10 border border-red-500/20 px-2.5 py-0.5 rounded-full">
            ${veces} ${veces === 1 ? 'equipo' : 'equipos'}
          </span>
        </div>
      `;
    }).join('');
  }
}
