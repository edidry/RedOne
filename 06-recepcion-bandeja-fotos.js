// =========================================================================
// MÓDULO 06: RECEPCIÓN, BANDEJA DE EQUIPOS, FOTOS Y GUARDADO DE ÓRDENES
// =========================================================================

// =========================================================================
// ORIGEN Y TEMA DINÁMICO
// =========================================================================
function seleccionarOrigen(origen) {
  if (rolActual === 'tienda' && tiendaAutenticadaActual && origen !== tiendaAutenticadaActual) {
    origen = tiendaAutenticadaActual;
  }

  origenActual = origen;
  const esTienda = origen !== 'RedOne';
  const cfgTienda = obtenerConfigTienda(origen);
  const tema = obtenerTemaPorOrigen(origen);

  document.getElementById('app-body').className = `${tema.bodyBg} text-slate-100 min-h-screen font-sans transition-colors duration-300`;
  document.getElementById('app-header').className = `${tema.headerBg} border-b px-5 py-3 flex flex-wrap items-center justify-between gap-3 no-print transition-colors duration-300`;

  ['card-origen', 'seccion-cliente-directo', 'card-equipo', 'card-fotos', 'card-preview', 'tarjeta-costos'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.className = `${tema.cardBg} border rounded-2xl p-5 shadow-xl transition-colors duration-300 ${id === 'card-preview' ? 'sticky top-6' : ''} ${id === 'tarjeta-costos' && rolActual === 'tienda' ? 'hidden' : ''}`;
  });

  document.querySelectorAll('.titulo-seccion').forEach(h2 => {
    h2.className = `titulo-seccion text-sm font-semibold uppercase tracking-wider ${tema.titleText} mb-4 flex items-center gap-2 transition-colors duration-300`;
  });
  const lblTarjOrigen = document.getElementById('lbl-tarjeta-origen');
  if (lblTarjOrigen) lblTarjOrigen.parentElement.className = `titulo-seccion text-sm font-semibold uppercase tracking-wider ${tema.titleText} flex items-center gap-2 transition-colors duration-300`;

  const btnGuardar = document.getElementById('btn-guardar');
  if (btnGuardar) btnGuardar.className = tema.btnSave;

  document.querySelectorAll('.condicion-chk').forEach(chk => {
    chk.className = `condicion-chk ${tema.chkAccent}`;
  });

  const bloqueadoPorTienda = (rolActual === 'tienda');
  document.querySelectorAll('.origen-btn').forEach(btn => {
    const idBtn = btn.id.replace('btn-origen-', '');
    const paletaBtn = obtenerTemaPorOrigen(idBtn);
    const esActivo = (idBtn === origen);
    btn.className = esActivo
      ? tema.btnActive
      : `origen-btn bg-slate-950 text-slate-300 border border-slate-800 rounded-xl py-2.5 px-3 text-xs font-semibold transition flex flex-col items-center gap-1 ${bloqueadoPorTienda ? 'opacity-40 cursor-not-allowed' : 'hover:border-slate-600'}`;
    btn.disabled = bloqueadoPorTienda && !esActivo;
  });

  const seccionTienda = document.getElementById('seccion-tienda');
  const seccionCliente = document.getElementById('seccion-cliente-directo');
  const camposExtraMostrador = document.getElementById('campos-extra-mostrador');
  const bloqueAnticipo = document.getElementById('bloque-anticipo-mostrador');

  const contenidoTicket = document.getElementById('contenido-ticket-cliente');
  const contenidoEtiqueta = document.getElementById('contenido-etiqueta-trasera');
  const areaImpresion = document.getElementById('area-impresion');
  const selectorAncho = document.getElementById('selector-ancho-ticket');
  const lblVistaPrevia = document.getElementById('lbl-vista-previa');
  const lblBtnImprimir = document.getElementById('lbl-btn-imprimir');
  const lblBtnWhatsapp = document.getElementById('lbl-btn-whatsapp');
  const optFinalOrden = document.getElementById('opt-estatus-final-orden');

  if (esTienda) {
    seccionTienda.classList.remove('hidden');
    seccionTienda.className = tema.tiendaCardBorder;
    document.getElementById('titulo-card-tienda').className = `text-sm font-semibold uppercase tracking-wider ${tema.titleText} flex items-center gap-2 transition-colors duration-300`;

    seccionCliente.classList.add('hidden');
    camposExtraMostrador.classList.add('hidden');
    bloqueAnticipo.classList.add('hidden');

    document.getElementById('lbl-titulo-tienda').textContent = origen;
    const badgeWa = document.getElementById('badge-wa-tienda');
    if (cfgTienda.whatsapp) {
      badgeWa.textContent = `WA: ${cfgTienda.whatsapp}`;
      badgeWa.className = 'text-[11px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-2.5 py-0.5 rounded-full';
    } else {
      badgeWa.textContent = 'Sin WA config.';
      badgeWa.className = 'text-[11px] bg-amber-950 text-amber-300 border border-amber-700 px-2.5 py-0.5 rounded-full';
    }

    // Cambio 7: En tiendas aliadas el estatus final es "Entregado"
    if (optFinalOrden) {
      optFinalOrden.value = 'Entregado';
      optFinalOrden.textContent = 'Entregado';
    }

    contenidoTicket.classList.add('hidden');
    contenidoEtiqueta.classList.remove('hidden');
    selectorAncho.classList.add('hidden');
    areaImpresion.className = 'etiqueta-trasera bg-white text-black p-2 rounded shadow-md font-mono leading-snug';
    lblVistaPrevia.textContent = `Etiqueta Trasera (${origen})`;
    lblBtnImprimir.textContent = `Imprimir Etiqueta (${origen})`;
    lblBtnWhatsapp.textContent = `Avisar a ${origen} por WhatsApp`;
  } else {
    seccionTienda.classList.add('hidden');
    seccionCliente.classList.remove('hidden');
    if (rolActual === 'tecnico') {
      camposExtraMostrador.classList.remove('hidden');
      bloqueAnticipo.classList.remove('hidden');
    }

    if (optFinalOrden) {
      optFinalOrden.value = 'Entregado y Pagado';
      optFinalOrden.textContent = 'Entregado y Pagado';
    }

    contenidoTicket.classList.remove('hidden');
    contenidoEtiqueta.classList.add('hidden');
    selectorAncho.classList.remove('hidden');
    cambiarAnchoTicket(anchoActual);
    lblVistaPrevia.textContent = 'Vista Previa del Ticket';
    lblBtnImprimir.textContent = 'Imprimir Ticket';
    lblBtnWhatsapp.textContent = 'Enviar Nota por WhatsApp';
  }

  const folioActual = folioEditandoId || obtenerSiguienteFolio();
  document.getElementById('ruta-drive-preview').textContent = `Carpeta Drive: RedOne / ${origen} / ${folioActual}`;
  actualizarVista();
}

// =========================================================================
// CAMBIO 5: CATEGORÍA DE RECEPCIÓN (INCLUYE "OTROS" SIN CONFLICTO)
// =========================================================================
function seleccionarCategoriaRecepcion(cat) {
  categoriaRecepcionActual = cat;
  ['Celular', 'Laptop / PC', 'Impresora', 'Otros'].forEach(c => {
    const btn = document.getElementById(`rec-cat-${c}`);
    if (!btn) return;
    if (c === cat) {
      btn.className = 'rec-cat-btn bg-red-600 text-white border border-red-400 rounded-xl py-2 px-3 text-xs font-bold transition flex items-center justify-center gap-1.5 shadow';
    } else {
      btn.className = 'rec-cat-btn bg-slate-950 text-slate-300 border border-slate-800 hover:border-slate-600 rounded-xl py-2 px-3 text-xs font-semibold transition flex items-center justify-center gap-1.5';
    }
  });
  document.getElementById('bloque-recepcion-otros').classList.toggle('hidden', cat !== 'Otros');
  actualizarVista();
}

function ponerAtajoOtroEquipo(texto) {
  document.getElementById('recepcion-otro-equipo').value = texto;
  actualizarVista();
}

// =========================================================================
// TIPO DE REPARACIÓN RÁPIDA Y GARANTÍA EN RECEPCIÓN
// =========================================================================
function seleccionarTipoReparacion(tipo) {
  tipoReparacionActual = tipo;

  const btnIncell = document.getElementById('btn-rep-incell');
  const btnOled = document.getElementById('btn-rep-oled');
  const btnOtro = document.getElementById('btn-rep-otro');
  const bloqueManual = document.getElementById('bloque-reparacion-manual');

  const baseInactivo = 'rep-btn bg-slate-950 text-slate-300 border border-slate-800 rounded-xl p-3 text-left transition flex items-start gap-2.5';

  btnIncell.className = baseInactivo + ' hover:border-cyan-500/60';
  btnOled.className = baseInactivo + ' hover:border-emerald-500/60';
  btnOtro.className = baseInactivo + ' hover:border-amber-500/60';
  bloqueManual.classList.add('hidden');

  if (tipo === 'Pantalla Incell') {
    btnIncell.className = 'rep-btn bg-cyan-500/15 text-cyan-200 border-2 border-cyan-500 rounded-xl p-3 text-left transition flex items-start gap-2.5 shadow-md';
  } else if (tipo === 'Pantalla OLED') {
    btnOled.className = 'rep-btn bg-emerald-500/15 text-emerald-200 border-2 border-emerald-500 rounded-xl p-3 text-left transition flex items-start gap-2.5 shadow-md';
  } else {
    btnOtro.className = 'rep-btn bg-amber-500/15 text-amber-200 border-2 border-amber-500 rounded-xl p-3 text-left transition flex items-start gap-2.5 shadow-md';
    bloqueManual.classList.remove('hidden');
  }

  actualizarVista();
}

function ponerAtajoManual(texto) {
  document.getElementById('reparacion-manual').value = texto;
  actualizarVista();
}

function seleccionarGarantiaOrden(tipo) {
  document.getElementById('garantia-tipo').value = tipo;
  const b100 = document.getElementById('btn-gar-100');
  const b50 = document.getElementById('btn-gar-50');
  const b0 = document.getElementById('btn-gar-0');
  const badge = document.getElementById('badge-garantia-recepcion');
  const det = document.getElementById('lbl-detalle-garantia-recepcion');

  b100.className = 'gar-btn bg-slate-900 text-slate-300 border border-slate-700 hover:border-emerald-500/60 rounded-xl p-2.5 text-left transition';
  b50.className = 'gar-btn bg-slate-900 text-slate-300 border border-slate-700 hover:border-amber-500/60 rounded-xl p-2.5 text-left transition';
  b0.className = 'gar-btn bg-slate-900 text-slate-300 border border-slate-700 hover:border-rose-500/60 rounded-xl p-2.5 text-left transition';

  if (tipo === '50') {
    b50.className = 'gar-btn bg-amber-500/20 text-amber-200 border-2 border-amber-400 rounded-xl p-2.5 text-left transition';
    badge.textContent = 'Garantía al 50%';
    badge.className = 'text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40';
    det.textContent = 'Garantía reducida al 50%: en caso de falla cubierta, el cliente cubre el 50% del valor de reposición.';
  } else if (tipo === '0') {
    b0.className = 'gar-btn bg-rose-500/20 text-rose-200 border-2 border-rose-400 rounded-xl p-2.5 text-left transition';
    badge.textContent = 'Sin Garantía (0%)';
    badge.className = 'text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40';
    det.textContent = 'Servicio ingresado sin garantía (0%): no aplica cobertura de reposición posterior.';
  } else {
    b100.className = 'gar-btn bg-emerald-500/20 text-emerald-200 border-2 border-emerald-400 rounded-xl p-2.5 text-left transition';
    badge.textContent = 'Garantía 100% (30 días)';
    badge.className = 'text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40';
    det.textContent = 'Garantía del 100% por 30 días naturales contra defectos de fábrica o falla de refacción (no cubre golpes, presión, humedad ni sellos rotos).';
  }

  actualizarVista();
}

function obtenerTextoServicioFinal() {
  let base = '';
  if (tipoReparacionActual === 'Otro servicio') {
    base = document.getElementById('reparacion-manual').value.trim() || 'Otra reparación';
  } else {
    base = tipoReparacionActual;
  }
  const obs = document.getElementById('falla').value.trim();
  return obs ? `${base} (${obs})` : base;
}

function obtenerTextoCategoriaEquipo() {
  if (categoriaRecepcionActual === 'Otros') {
    const det = document.getElementById('recepcion-otro-equipo').value.trim();
    return det ? `Otros - ${det}` : 'Otros';
  }
  return categoriaRecepcionActual;
}

// =========================================================================
// CONTADORES Y BANDEJA (CON ESTATUS "ENTREGADO" - CAMBIO 7)
// =========================================================================
function actualizarContadores() {
  const visibles = rolActual === 'tienda' && tiendaAutenticadaActual
    ? ordenes.filter(o => o.origen === tiendaAutenticadaActual)
    : ordenes;

  document.getElementById('contador-bandeja').textContent = ordenes.length;
  document.getElementById('header-folio').textContent = folioEditandoId || obtenerSiguienteFolio();

  const porEnviarTaller = visibles.filter(o => o.estatus === 'Pendiente de revisar').length;
  const porRecibirTaller = visibles.filter(o =>
    o.estatus === 'En reparación / Esperando pieza' || o.estatus === 'Listo para entregar'
  ).length;

  const elRec = document.getElementById('contador-tienda-recibir');
  const elEnt = document.getElementById('contador-tienda-entregar');
  if (elRec) elRec.textContent = porEnviarTaller;
  if (elEnt) elEnt.textContent = porRecibirTaller;

  actualizarContadorCortes();
}

function actualizarContadorCortes() {
  const pendientesCorte = ordenes.filter(o =>
    o.origen !== 'RedOne' &&
    (o.estatus === 'Entregado' || o.estatus === 'Entregado y Pagado') &&
    !o.pagadoCorte
  ).length;
  const el = document.getElementById('contador-cortes-pendientes');
  if (el) el.textContent = pendientesCorte;
}

function renderizarBandeja() {
  const contadores = document.getElementById('resumen-contadores');
  const estatusLista = [
    'Pendiente de revisar',
    'En reparación / Esperando pieza',
    'Listo para entregar',
    'Entregado',
    'Entregado y Pagado'
  ];

  contadores.innerHTML = estatusLista.map(est => {
    const cant = ordenes.filter(o => o.estatus === est).length;
    return `
      <div class="bg-slate-900 border border-slate-800 rounded-xl p-3.5">
        <p class="text-[11px] text-slate-400 truncate">${est}</p>
        <p class="text-xl font-bold text-white mt-0.5">${cant}</p>
      </div>
    `;
  }).join('');

  const consulta = document.getElementById('input-buscador').value.toLowerCase().trim();
  const filtroTienda = document.getElementById('filtro-tienda').value;
  const filtroEst = document.getElementById('filtro-estatus').value;

  const filtradas = ordenes.filter(o => {
    const coincideTienda = (filtroTienda === 'TODAS') || (o.origen === filtroTienda);
    const coincideEst = (filtroEst === 'TODOS') || (o.estatus === filtroEst);
    const coincideTexto = !consulta ||
      String(o.id || '').toLowerCase().includes(consulta) ||
      String(o.folioTienda || '').toLowerCase().includes(consulta) ||
      String(o.cliente || '').toLowerCase().includes(consulta) ||
      String(o.marca || '').toLowerCase().includes(consulta) ||
      String(o.modelo || '').toLowerCase().includes(consulta) ||
      String(o.categoriaEquipo || '').toLowerCase().includes(consulta) ||
      String(o.equipoOtroDetalle || '').toLowerCase().includes(consulta) ||
      String(o.tipoReparacion || '').toLowerCase().includes(consulta) ||
      String(o.origen || '').toLowerCase().includes(consulta);
    return coincideTienda && coincideEst && coincideTexto;
  });

  const grid = document.getElementById('lista-ordenes-grid');
  if (filtradas.length === 0) {
    grid.innerHTML = `<div class="col-span-full text-center py-10 text-slate-500 text-sm">No se encontraron órdenes con ese filtro.</div>`;
    return;
  }

  grid.innerHTML = filtradas.map(o => {
    const esTienda = o.origen !== 'RedOne';
    const tema = obtenerTemaPorOrigen(o.origen);
    const badgeOrigen = `<span class="text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${tema.badgeBandeja}">${o.origen}${o.folioTienda ? ` #${o.folioTienda}` : ''}</span>`;

    const esIncell = String(o.tipoReparacion || '').toLowerCase().includes('incell');
    const esOled = String(o.tipoReparacion || '').toLowerCase().includes('oled');
    let badgeRep = `<span class="inline-block text-[11px] font-semibold px-2.5 py-0.5 rounded-md bg-amber-500/15 text-amber-300 border border-amber-500/30 mt-1"><i class="fa-solid fa-wrench mr-1"></i>${o.tipoReparacion || 'Reparación'}</span>`;
    if (esIncell) {
      badgeRep = `<span class="inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 mt-1"><i class="fa-solid fa-mobile-screen mr-1"></i>${o.tipoReparacion}</span>`;
    } else if (esOled) {
      badgeRep = `<span class="inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 mt-1"><i class="fa-solid fa-gem mr-1"></i>${o.tipoReparacion}</span>`;
    }

    const gTipo = o.garantiaTipo || '100';
    const badgeGar = gTipo === '50'
      ? `<span class="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">Garantía 50%</span>`
      : (gTipo === '0'
        ? `<span class="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40">Sin garantía</span>`
        : `<span class="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">Garantía 100%</span>`);

    const estatusFinalOpcion = esTienda ? 'Entregado' : 'Entregado y Pagado';
    const etiquetaFinalOpcion = esTienda ? 'Entregado' : 'Entregado y Pagado';
    const valorEstatusSelect = (esTienda && o.estatus === 'Entregado y Pagado') ? 'Entregado' : o.estatus;

    const catTexto = o.categoriaEquipo === 'Otros' && o.equipoOtroDetalle
      ? `Otros: ${o.equipoOtroDetalle}`
      : (o.categoriaEquipo || 'Celular');

    return `
      <div class="bg-slate-950/90 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 flex flex-col justify-between gap-4 transition">
        <div class="space-y-2.5">
          <div class="flex items-center justify-between gap-2">
            <span class="text-xs font-mono font-bold text-white bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-700">${o.id}</span>
            ${badgeOrigen}
          </div>

          <div>
            <div class="flex items-center justify-between gap-2">
              <span class="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">${catTexto}</span>
              ${badgeGar}
            </div>
            <h3 class="text-sm font-bold text-white mt-0.5">${o.marca} ${o.modelo}</h3>
            <p class="text-xs text-slate-400">${esTienda ? `Recibió: ${o.encargadoTienda || o.cliente}` : `Cliente: ${o.cliente}`}</p>
            ${badgeRep}
          </div>

          <div class="bg-slate-900/90 rounded-xl p-2.5 border border-slate-800/80 text-xs space-y-1">
            <div class="flex justify-between">
              <span class="text-slate-400">Total:</span>
              <strong class="text-white">$${Number(o.costo || 0).toLocaleString('es-MX')} MXN</strong>
            </div>
            <div class="flex justify-between text-[11px]">
              <span class="text-slate-500">Pieza: $${Number(o.costoPieza || 0).toLocaleString('es-MX')} · M.O.: $${Number(o.manoObra || 0).toLocaleString('es-MX')}</span>
              <span class="text-amber-400 font-semibold">Resta: $${Number(o.saldo || 0).toLocaleString('es-MX')}</span>
            </div>
            ${esTienda && (o.estatus === 'Entregado' || o.estatus === 'Entregado y Pagado') ? `
              <div class="flex justify-between text-[10px] pt-1 border-t border-slate-800">
                <span class="text-slate-400">Liquidación Corte:</span>
                <strong class="${o.pagadoCorte ? 'text-emerald-400' : 'text-amber-300'}">${o.pagadoCorte ? 'Pagado' : 'Pendiente de pago'}</strong>
              </div>
            ` : ''}
          </div>
        </div>

        <div class="space-y-2 pt-2 border-t border-slate-800/80">
          <select onchange="cambiarEstatusRapido('${o.id}', this.value)"
            class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-red-500">
            <option value="Pendiente de revisar" ${valorEstatusSelect === 'Pendiente de revisar' ? 'selected' : ''}>Pendiente de revisar</option>
            <option value="En reparación / Esperando pieza" ${valorEstatusSelect === 'En reparación / Esperando pieza' ? 'selected' : ''}>En reparación / Esperando pieza</option>
            <option value="Listo para entregar" ${valorEstatusSelect === 'Listo para entregar' ? 'selected' : ''}>Listo para entregar</option>
            <option value="${estatusFinalOpcion}" ${valorEstatusSelect === 'Entregado' || valorEstatusSelect === 'Entregado y Pagado' ? 'selected' : ''}>${etiquetaFinalOpcion}</option>
          </select>

          <div class="grid grid-cols-2 gap-2">
            <button type="button" onclick="cargarOrdenParaEditar('${o.id}')"
              class="bg-red-600 hover:bg-red-500 text-white text-xs font-semibold py-2 px-3 rounded-xl transition flex items-center justify-center gap-1.5">
              <i class="fa-solid fa-pen-to-square"></i> Abrir / Editar
            </button>
            <button type="button" onclick="eliminarOrden('${o.id}')"
              class="bg-slate-900 hover:bg-rose-950 text-slate-400 hover:text-rose-400 border border-slate-800 text-xs font-semibold py-2 px-3 rounded-xl transition flex items-center justify-center gap-1">
              <i class="fa-solid fa-trash"></i> Borrar
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function cambiarEstatusRapido(id, nuevoEstatus) {
  const idx = ordenes.findIndex(o => o.id === id);
  if (idx === -1) return;
  ordenes[idx].estatus = nuevoEstatus;
  if (nuevoEstatus === 'Entregado y Pagado') {
    ordenes[idx].saldo = 0;
    ordenes[idx].pagadoCorte = true;
  } else if (nuevoEstatus === 'Entregado' && ordenes[idx].origen !== 'RedOne') {
    ordenes[idx].pagadoCorte = false;
  }
  localStorage.setItem('redone_ordenes_v3', JSON.stringify(ordenes));
  actualizarContadores();
  renderizarBandeja();
  renderizarDashboard();
  renderizarVistaCortes();
}

function cargarOrdenParaEditar(id, yaAutenticado = false) {
  if (rolActual !== 'tecnico' && !yaAutenticado) {
    if (tieneSesionPin24hValida()) {
      cambiarRol('tecnico');
    } else {
      abrirModalPin({ modo: 'tecnico', folioQRPendiente: id });
      return;
    }
  }

  const orden = ordenes.find(o => String(o.id || '').toUpperCase() === String(id || '').toUpperCase());
  if (!orden) {
    alert(`No se encontró ninguna orden con el folio "${id}".`);
    return;
  }

  folioEditandoId = orden.id;
  document.getElementById('banner-edicion').classList.remove('hidden');
  document.getElementById('lbl-folio-editando').textContent = orden.id;
  document.getElementById('lbl-btn-guardar').textContent = `Guardar Cambios (${orden.id})`;

  seleccionarOrigen(orden.origen || 'RedOne');
  seleccionarCategoriaRecepcion(orden.categoriaEquipo || 'Celular');
  document.getElementById('recepcion-otro-equipo').value = orden.equipoOtroDetalle || '';

  document.getElementById('folio-tienda').value = orden.folioTienda || '';
  document.getElementById('encargado-tienda').value = orden.encargadoTienda || '';
  document.getElementById('cliente').value = orden.origen === 'RedOne' ? (orden.cliente || '') : '';
  document.getElementById('telefono').value = orden.telefono || '';
  document.getElementById('marca').value = orden.marca || '';
  document.getElementById('modelo').value = orden.modelo || '';
  document.getElementById('clave').value = orden.clave || '';
  actualizarPreviewPatronInline();
  document.getElementById('imei').value = orden.imei || '';
  document.getElementById('accesorios').value = orden.accesorios || '';

  const repGuardada = orden.tipoReparacion || 'Pantalla Incell';
  if (repGuardada === 'Pantalla Incell' || repGuardada === 'Pantalla OLED') {
    seleccionarTipoReparacion(repGuardada);
    document.getElementById('reparacion-manual').value = '';
    document.getElementById('falla').value = orden.falla || '';
  } else {
    seleccionarTipoReparacion('Otro servicio');
    document.getElementById('reparacion-manual').value = repGuardada;
    document.getElementById('falla').value = '';
  }

  const conds = Array.isArray(orden.condiciones) ? orden.condiciones : [];
  document.querySelectorAll('.condicion-chk').forEach(chk => {
    chk.checked = conds.includes(chk.value);
  });
  document.getElementById('condicion-detalle').value = orden.condicionDetalle || '';

  fotosBase64 = Array.isArray(orden.fotos) ? [...orden.fotos] : [];
  renderizarGaleriaFotos();

  document.getElementById('costo-pieza').value = orden.costoPieza ?? 0;
  document.getElementById('mano-obra').value = orden.manoObra ?? (orden.costo || 0);
  document.getElementById('anticipo').value = orden.anticipo ?? 0;
  document.getElementById('estatus-orden').value = orden.estatus || 'Pendiente de revisar';
  document.getElementById('notas-tecnico').value = orden.notas || '';
  seleccionarGarantiaOrden(orden.garantiaTipo || '100');

  actualizarContadores();
  actualizarVista();
  cambiarPestana('registro');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function eliminarOrden(id) {
  if (!confirm(`¿Eliminar la orden ${id}?`)) return;
  ordenes = ordenes.filter(o => o.id !== id);
  if (folioEditandoId === id) {
    prepararNuevaOrden();
  }
  localStorage.setItem('redone_ordenes_v3', JSON.stringify(ordenes));
  actualizarContadores();
  renderizarBandeja();
  renderizarDashboard();
  renderizarVistaCortes();
}

function prepararNuevaOrden() {
  folioEditandoId = null;
  document.getElementById('banner-edicion').classList.add('hidden');
  document.getElementById('lbl-btn-guardar').textContent = 'Guardar Orden';
  document.getElementById('form-recepcion').reset();
  seleccionarCategoriaRecepcion('Celular');
  document.getElementById('recepcion-otro-equipo').value = '';
  fotosBase64 = [];
  renderizarGaleriaFotos();
  seleccionarTipoReparacion('Pantalla Incell');
  seleccionarGarantiaOrden('100');
  actualizarPreviewPatronInline();

  if (rolActual === 'tienda' && tiendaAutenticadaActual) {
    seleccionarOrigen(tiendaAutenticadaActual);
  } else {
    seleccionarOrigen('RedOne');
  }
  actualizarContadores();
  actualizarVista();
}

// =========================================================================
// FOTOS OPTIMIZADAS POR CANVAS
// =========================================================================
function comprimirImagenCanvas(file, maxLado = 900, calidad = 0.68) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        let w = img.width;
        let h = img.height;
        if (w > maxLado || h > maxLado) {
          if (w >= h) {
            h = Math.round((h * maxLado) / w);
            w = maxLado;
          } else {
            w = Math.round((w * maxLado) / h);
            h = maxLado;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg', calidad));
      };
      img.onerror = reject;
      img.src = ev.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function procesarFotos(event) {
  const files = Array.from(event.target.files || []);
  for (const file of files) {
    if (!file.type.startsWith('image/')) continue;
    try {
      const base64Comprimida = await comprimirImagenCanvas(file, 900, 0.68);
      fotosBase64.push(base64Comprimida);
      renderizarGaleriaFotos();
      actualizarVista();
    } catch (err) {
      console.error('Error al comprimir imagen:', err);
    }
  }
  event.target.value = '';
}

function eliminarFoto(index) {
  fotosBase64.splice(index, 1);
  renderizarGaleriaFotos();
  actualizarVista();
}

function renderizarGaleriaFotos() {
  const galeria = document.getElementById('galeria-fotos');
  const contador = document.getElementById('contador-fotos');
  contador.textContent = `${fotosBase64.length} foto(s) adjunta(s)`;

  galeria.innerHTML = fotosBase64.map((src, idx) => `
    <div class="relative group rounded-xl overflow-hidden border border-slate-700 aspect-square bg-slate-950">
      <img src="${src}" class="w-full h-full object-cover" alt="Evidencia ${idx + 1}">
      <button type="button" onclick="eliminarFoto(${idx})"
        class="absolute top-1.5 right-1.5 bg-rose-600 text-white w-6 h-6 rounded-full text-xs flex items-center justify-center shadow">
        <i class="fa-solid fa-xmark"></i>
      </button>
    </div>
  `).join('');
}

// =========================================================================
// GUARDAR ORDEN
// =========================================================================
function guardarOrden() {
  const esTienda = origenActual !== 'RedOne';
  const marca = document.getElementById('marca').value.trim() || 'Sin marca';
  const modelo = document.getElementById('modelo').value.trim() || 'Sin modelo';

  let cliente = '';
  let telefono = '';
  let folioTienda = '';
  let encargadoTienda = '';

  if (esTienda) {
    folioTienda = document.getElementById('folio-tienda').value.trim();
    encargadoTienda = document.getElementById('encargado-tienda').value.trim();
    cliente = origenActual;
  } else {
    cliente = document.getElementById('cliente').value.trim() || 'Cliente General';
    telefono = document.getElementById('telefono').value.trim();
  }

  const condiciones = Array.from(document.querySelectorAll('.condicion-chk:checked')).map(c => c.value);
  const condicionDetalle = document.getElementById('condicion-detalle').value.trim();
  if (condicionDetalle) condiciones.push(condicionDetalle);

  const costoPieza = parseFloat(document.getElementById('costo-pieza').value) || 0;
  const manoObra = parseFloat(document.getElementById('mano-obra').value) || 0;
  const costoTotal = costoPieza + manoObra;
  const anticipo = esTienda ? 0 : (parseFloat(document.getElementById('anticipo').value) || 0);
  const saldo = Math.max(0, costoTotal - anticipo);
  const garantiaTipo = document.getElementById('garantia-tipo').value || '100';

  let estatus = document.getElementById('estatus-orden').value;
  if (esTienda && estatus === 'Entregado y Pagado') {
    estatus = 'Entregado';
  }

  const ordenExistente = folioEditandoId ? ordenes.find(o => o.id === folioEditandoId) : null;

  const datosOrden = {
    id: folioEditandoId || obtenerSiguienteFolio(),
    fecha: ordenExistente ? ordenExistente.fecha : obtenerFechaHoraActual(),
    origen: origenActual,
    folioTienda,
    encargadoTienda,
    cliente,
    telefono,
    categoriaEquipo: categoriaRecepcionActual,
    equipoOtroDetalle: categoriaRecepcionActual === 'Otros' ? document.getElementById('recepcion-otro-equipo').value.trim() : '',
    marca,
    modelo,
    imei: esTienda ? '' : document.getElementById('imei').value.trim(),
    clave: document.getElementById('clave').value.trim() || 'Sin clave',
    accesorios: esTienda ? '' : document.getElementById('accesorios').value.trim(),
    tipoReparacion: obtenerTextoServicioFinal(),
    falla: tipoReparacionActual === 'Otro servicio' ? '' : document.getElementById('falla').value.trim(),
    condiciones,
    condicionDetalle,
    costoPieza,
    manoObra,
    costo: costoTotal,
    anticipo,
    saldo,
    garantiaTipo,
    estatus,
    pagadoCorte: ordenExistente ? Boolean(ordenExistente.pagadoCorte) : (estatus === 'Entregado y Pagado'),
    fechaPagoCorte: ordenExistente ? (ordenExistente.fechaPagoCorte || '') : '',
    notas: document.getElementById('notas-tecnico').value.trim(),
    fotos: [...fotosBase64]
  };

  const idxExistente = ordenes.findIndex(o => o.id === datosOrden.id);
  if (idxExistente >= 0) {
    ordenes[idxExistente] = datosOrden;
  } else {
    ordenes.unshift(datosOrden);
  }

  try {
    localStorage.setItem('redone_ordenes_v3', JSON.stringify(ordenes));
  } catch (e) {
    alert('Aviso: El almacenamiento local está casi lleno. Se guardó en memoria pero te recomendamos reducir fotos.');
  }

  folioEditandoId = datosOrden.id;
  document.getElementById('banner-edicion').classList.remove('hidden');
  document.getElementById('lbl-folio-editando').textContent = datosOrden.id;
  document.getElementById('lbl-btn-guardar').textContent = `Guardar Cambios (${datosOrden.id})`;

  actualizarContadores();
  renderizarBandeja();
  renderizarDashboard();
  renderizarVistaCortes();
  if (rolActual === 'tienda') renderizarVistaTienda();

  alert(`✅ Orden ${datosOrden.id} guardada correctamente.`);
}
