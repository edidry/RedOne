// =========================================================================
// MÓDULO 07: TICKETS, CÓDIGOS QR IMPRESOS, WHATSAPP Y CORTES POR TIENDA
// =========================================================================

// =========================================================================
// VISTA PREVIA, QR Y WHATSAPP (CAMBIO 8: COSTO EN ETIQUETA Y WA DE TIENDA)
// =========================================================================
let anchoActual = 58;
function cambiarAnchoTicket(mm) {
  anchoActual = mm;
  const ticket = document.getElementById('area-impresion');
  const btn58 = document.getElementById('btn-58');
  const btn80 = document.getElementById('btn-80');

  if (origenActual !== 'RedOne') return;

  if (mm === 58) {
    ticket.classList.remove('ticket-80');
    ticket.classList.add('ticket-58');
    btn58.className = 'px-2.5 py-1 rounded bg-red-600 text-white font-medium';
    btn80.className = 'px-2.5 py-1 rounded text-slate-400 hover:text-white';
  } else {
    ticket.classList.remove('ticket-58');
    ticket.classList.add('ticket-80');
    btn80.className = 'px-2.5 py-1 rounded bg-red-600 text-white font-medium';
    btn58.className = 'px-2.5 py-1 rounded text-slate-400 hover:text-white';
  }
  renderizarCodigosQR();
}

function obtenerFechaHoraActual() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const hh = String(now.getHours()).padStart(2, '0');
  const min = String(now.getMinutes()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
}

function construirUrlOrdenQR(folio) {
  const baseUrl = window.location.href.split('?')[0].split('#')[0];
  return `${baseUrl}?orden=${encodeURIComponent(folio)}`;
}

function renderizarCodigosQR() {
  const folio = folioEditandoId || obtenerSiguienteFolio();
  const urlQR = construirUrlOrdenQR(folio);

  const contMostrador = document.getElementById('qr-ticket-mostrador');
  if (contMostrador && typeof QRCode !== 'undefined') {
    contMostrador.innerHTML = '';
    const tamTicket = anchoActual === 80 ? 96 : 78;
    new QRCode(contMostrador, {
      text: urlQR,
      width: tamTicket,
      height: tamTicket,
      colorDark: '#000000',
      colorLight: '#ffffff',
      correctLevel: QRCode.CorrectLevel.M
    });
  }

  const contTienda = document.getElementById('qr-etiqueta-tienda');
  if (contTienda && typeof QRCode !== 'undefined') {
    contTienda.innerHTML = '';
    new QRCode(contTienda, {
      text: urlQR,
      width: 66,
      height: 66,
      colorDark: '#000000',
      colorLight: '#ffffff',
      correctLevel: QRCode.CorrectLevel.M
    });
  }
}

function actualizarVista() {
  const folio = folioEditandoId || obtenerSiguienteFolio();
  document.getElementById('header-folio').textContent = folio;
  document.getElementById('ruta-drive-preview').textContent = `Carpeta Drive: RedOne / ${origenActual} / ${folio}`;

  const ordenAct = folioEditandoId ? ordenes.find(o => o.id === folioEditandoId) : null;
  const fechaTexto = ordenAct ? ordenAct.fecha : obtenerFechaHoraActual();

  const costoPieza = parseFloat(document.getElementById('costo-pieza').value) || 0;
  const manoObra = parseFloat(document.getElementById('mano-obra').value) || 0;
  const costoTotal = costoPieza + manoObra;
  const anticipo = parseFloat(document.getElementById('anticipo').value) || 0;
  const saldo = Math.max(0, costoTotal - anticipo);

  document.getElementById('total-calculado').value = `$${costoTotal.toLocaleString('es-MX')} MXN`;
  document.getElementById('saldo').value = `$${saldo.toLocaleString('es-MX')} MXN`;

  const cliente = document.getElementById('cliente').value.trim() || '---';
  const telefono = document.getElementById('telefono').value.trim() || '---';
  const folioTienda = document.getElementById('folio-tienda').value.trim() || '---';
  const encargado = document.getElementById('encargado-tienda').value.trim() || '---';

  const catEquipoTexto = obtenerTextoCategoriaEquipo();
  const marca = document.getElementById('marca').value.trim() || '---';
  const modelo = document.getElementById('modelo').value.trim() || '---';
  const imei = document.getElementById('imei').value.trim() || '---';
  const clave = document.getElementById('clave').value.trim() || 'Sin clave';
  const accesorios = document.getElementById('accesorios').value.trim() || 'Ninguno';
  const servicioTexto = obtenerTextoServicioFinal();

  const checks = Array.from(document.querySelectorAll('.condicion-chk:checked')).map(c => c.value);
  const detalle = document.getElementById('condicion-detalle').value.trim();
  if (detalle) checks.push(detalle);
  const condicionesTexto = checks.length ? checks.join(', ') : 'Sin observaciones';

  const gTipo = document.getElementById('garantia-tipo').value || '100';
  const tkGarTit = document.getElementById('tk-garantia-titulo');
  const tkGarDet = document.getElementById('tk-garantia-detalle');
  if (gTipo === '50') {
    tkGarTit.textContent = '50% EN REPOSICIÓN';
    tkGarDet.textContent = 'En caso de falla cubierta, el cliente cubre el 50% de reposición. No cubre golpes, presión ni humedad.';
  } else if (gTipo === '0') {
    tkGarTit.textContent = 'SIN GARANTÍA (0%)';
    tkGarDet.textContent = 'Servicio ingresado sin garantía de reposición posterior.';
  } else {
    tkGarTit.textContent = '100% (30 DÍAS)';
    tkGarDet.textContent = 'Cubre defectos de fábrica por 30 días naturales. No aplica por golpes, presión o humedad.';
  }

  document.querySelectorAll('.sync-folio-rn').forEach(el => el.textContent = folio);
  document.querySelectorAll('.sync-fecha').forEach(el => el.textContent = fechaTexto);
  document.querySelectorAll('.sync-categoria-equipo').forEach(el => el.textContent = catEquipoTexto.toUpperCase());
  document.querySelectorAll('.sync-marca').forEach(el => el.textContent = marca);
  document.querySelectorAll('.sync-modelo').forEach(el => el.textContent = modelo);
  document.querySelectorAll('.sync-clave').forEach(el => el.textContent = clave);
  document.querySelectorAll('.sync-servicio-resumen').forEach(el => el.textContent = servicioTexto.toUpperCase());
  document.querySelectorAll('.sync-condiciones').forEach(el => el.textContent = condicionesTexto);
  document.querySelectorAll('.sync-fotos').forEach(el => el.textContent = fotosBase64.length);

  document.getElementById('tk-cliente').textContent = cliente;
  document.getElementById('tk-telefono').textContent = telefono;
  document.getElementById('tk-imei').textContent = imei;
  document.getElementById('tk-accesorios').textContent = accesorios;
  document.getElementById('tk-costo').textContent = `$${costoTotal.toLocaleString('es-MX')} MXN`;
  document.getElementById('tk-anticipo').textContent = `$${anticipo.toLocaleString('es-MX')} MXN`;
  document.getElementById('tk-saldo').textContent = `$${saldo.toLocaleString('es-MX')} MXN`;

  document.querySelectorAll('.sync-tienda-nombre').forEach(el => el.textContent = origenActual.toUpperCase());
  document.querySelectorAll('.sync-folio-tienda').forEach(el => el.textContent = folioTienda);
  document.querySelectorAll('.sync-encargado').forEach(el => el.textContent = encargado);
  const etqCosto = document.getElementById('etq-costo-tienda');
  if (etqCosto) etqCosto.textContent = `$${costoTotal.toLocaleString('es-MX')} MXN`;

  renderizarCodigosQR();
}

function enviarWhatsApp() {
  const folio = folioEditandoId || obtenerSiguienteFolio();
  const catEquipoTexto = obtenerTextoCategoriaEquipo();
  const marca = document.getElementById('marca').value.trim() || 'Equipo';
  const modelo = document.getElementById('modelo').value.trim() || '';
  const servicioTexto = obtenerTextoServicioFinal();
  const costoPieza = parseFloat(document.getElementById('costo-pieza').value) || 0;
  const manoObra = parseFloat(document.getElementById('mano-obra').value) || 0;
  const costoTotal = costoPieza + manoObra;
  const estatus = document.getElementById('estatus-orden').value;
  const gTipo = document.getElementById('garantia-tipo').value || '100';
  const textoGar = gTipo === '50' ? '50% en reposición' : (gTipo === '0' ? 'No aplica (0%)' : '100% (30 días)');

  if (origenActual !== 'RedOne') {
    const cfgTienda = obtenerConfigTienda(origenActual);
    const telTienda = cfgTienda.whatsapp || '';
    const folioTienda = document.getElementById('folio-tienda').value.trim() || 'S/F';
    const encargado = document.getElementById('encargado-tienda').value.trim() || 'Encargado';

    const mensajeTienda =
      `*REDONE - AVISO TIENDA ALIADA (${origenActual.toUpperCase()})*\n` +
      `• *Folio RedOne:* ${folio}\n` +
      `• *Folio ${origenActual}:* #${folioTienda}\n` +
      `• *Recibió:* ${encargado}\n` +
      `• *Categoría:* ${catEquipoTexto}\n` +
      `• *Equipo:* ${marca} ${modelo}\n` +
      `• *Clave/Patrón:* ${document.getElementById('clave').value.trim() || 'Sin clave'}\n` +
      `• *Reparación:* ${servicioTexto}\n` +
      `• *Estatus:* ${estatus}\n` +
      `• *Monto a cobrar:* *$${costoTotal.toLocaleString('es-MX')} MXN*\n` +
      `• *Garantía:* ${textoGar}\n` +
      `• *Fotos de evidencia:* ${fotosBase64.length}`;

    const urlTienda = telTienda
      ? `https://wa.me/52${telTienda}?text=${encodeURIComponent(mensajeTienda)}`
      : `https://wa.me/?text=${encodeURIComponent(mensajeTienda)}`;
    window.open(urlTienda, '_blank');
    return;
  }

  const cliente = document.getElementById('cliente').value.trim() || 'Cliente';
  const telefono = document.getElementById('telefono').value.replace(/\D/g, '');
  const anticipo = parseFloat(document.getElementById('anticipo').value) || 0;
  const saldo = Math.max(0, costoTotal - anticipo);

  const mensajeCliente =
    `*REDONE - NOTA DE RECEPCIÓN*\n` +
    `Hola *${cliente}*, registramos tu equipo:\n` +
    `• *Folio:* ${folio}\n` +
    `• *Categoría:* ${catEquipoTexto}\n` +
    `• *Equipo:* ${marca} ${modelo}\n` +
    `• *Clave/Patrón:* ${document.getElementById('clave').value.trim() || 'Sin clave'}\n` +
    `• *Servicio:* ${servicioTexto}\n` +
    `• *Estatus:* ${estatus}\n` +
    `• *Total:* $${costoTotal.toLocaleString('es-MX')} MXN\n` +
    `• *Anticipo:* $${anticipo.toLocaleString('es-MX')} MXN\n` +
    `• *Saldo restante:* *$${saldo.toLocaleString('es-MX')} MXN*\n` +
    `• *Garantía:* ${textoGar}\n` +
    `• *Fotos adjuntas:* ${fotosBase64.length}`;

  const urlCliente = telefono.length >= 10
    ? `https://wa.me/52${telefono.slice(-10)}?text=${encodeURIComponent(mensajeCliente)}`
    : `https://wa.me/?text=${encodeURIComponent(mensajeCliente)}`;
  window.open(urlCliente, '_blank');
}

// =========================================================================
// CAMBIOS 9 Y 10: CORTES POR TIENDA, MARCAR COMO PAGADOS Y PDF / EXCEL CSV
// =========================================================================
let seleccionadosCorteIds = new Set();

function obtenerPendientesCorteFiltrados() {
  const tiendaSel = document.getElementById('corte-filtro-tienda')?.value || 'TODAS';
  return ordenes.filter(o =>
    o.origen !== 'RedOne' &&
    (o.estatus === 'Entregado' || o.estatus === 'Entregado y Pagado') &&
    !o.pagadoCorte &&
    (tiendaSel === 'TODAS' || o.origen === tiendaSel)
  );
}

function renderizarVistaCortes() {
  const tbody = document.getElementById('corte-tabla-body');
  const pendientes = obtenerPendientesCorteFiltrados();

  const idsValidos = new Set(pendientes.map(o => o.id));
  seleccionadosCorteIds = new Set([...seleccionadosCorteIds].filter(id => idsValidos.has(id)));

  let totalAdeudo = 0;
  let montoSeleccionado = 0;

  if (pendientes.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="p-8 text-center text-slate-400">
          <i class="fa-solid fa-circle-check text-emerald-400 text-xl mb-1 block"></i>
          No hay equipos entregados pendientes de pago para el filtro seleccionado.
        </td>
      </tr>`;
  } else {
    tbody.innerHTML = pendientes.map(o => {
      const monto = Number(o.costo) || 0;
      totalAdeudo += monto;
      const checked = seleccionadosCorteIds.has(o.id);
      if (checked) montoSeleccionado += monto;
      const tema = obtenerTemaPorOrigen(o.origen);

      return `
        <tr class="hover:bg-slate-800/40 transition">
          <td class="p-3">
            <input type="checkbox" ${checked ? 'checked' : ''} onchange="toggleSeleccionCorte('${o.id}', this.checked)" class="accent-sky-500 w-4 h-4 cursor-pointer">
          </td>
          <td class="p-3 font-mono font-bold text-white">
            ${o.id}
            ${o.folioTienda ? `<span class="block text-[10px] text-sky-300 font-sans">Nota #${o.folioTienda}</span>` : ''}
          </td>
          <td class="p-3">
            <span class="text-[11px] font-bold px-2 py-0.5 rounded-full border ${tema.badgeBandeja}">${o.origen}</span>
          </td>
          <td class="p-3 font-semibold text-slate-200">${o.marca} ${o.modelo}</td>
          <td class="p-3 text-slate-300">${o.tipoReparacion || ''}</td>
          <td class="p-3 text-slate-400 text-[11px]">${o.fecha || ''}</td>
          <td class="p-3 text-right font-mono font-bold text-amber-300">$${monto.toLocaleString('es-MX')} MXN</td>
        </tr>
      `;
    }).join('');
  }

  document.getElementById('corte-total-adeudo').textContent = `$${totalAdeudo.toLocaleString('es-MX')} MXN`;
  document.getElementById('corte-count-seleccionados').textContent = seleccionadosCorteIds.size;
  document.getElementById('corte-monto-seleccionado').textContent = `$${montoSeleccionado.toLocaleString('es-MX')} MXN`;

  const chkTodos = document.getElementById('chk-corte-todos');
  if (chkTodos) {
    chkTodos.checked = pendientes.length > 0 && seleccionadosCorteIds.size === pendientes.length;
  }

  const tiendaSel = document.getElementById('corte-filtro-tienda')?.value || 'TODAS';
  const pagados = ordenes.filter(o =>
    o.origen !== 'RedOne' &&
    o.pagadoCorte &&
    (tiendaSel === 'TODAS' || o.origen === tiendaSel)
  );

  const contPagados = document.getElementById('corte-lista-pagados');
  if (pagados.length === 0) {
    contPagados.innerHTML = `<p class="col-span-full text-xs text-slate-500">Sin liquidaciones registradas en este filtro.</p>`;
  } else {
    contPagados.innerHTML = pagados.map(o => `
      <div class="bg-slate-950/70 border border-emerald-900/40 rounded-xl p-3 flex items-center justify-between gap-2 text-xs">
        <div>
          <span class="font-mono font-bold text-emerald-300">${o.id}</span>
          <span class="text-slate-400">· ${o.origen}</span>
          <p class="font-semibold text-white mt-0.5">${o.marca} ${o.modelo}</p>
          ${o.fechaPagoCorte ? `<p class="text-[10px] text-slate-500">Pagado: ${o.fechaPagoCorte}</p>` : ''}
        </div>
        <span class="font-mono font-bold text-emerald-400">$${Number(o.costo || 0).toLocaleString('es-MX')} MXN</span>
      </div>
    `).join('');
  }

  actualizarContadorCortes();
}

function toggleSeleccionCorte(id, checked) {
  if (checked) seleccionadosCorteIds.add(id);
  else seleccionadosCorteIds.delete(id);
  renderizarVistaCortes();
}

function alternarSeleccionTodosCorte(checked) {
  const pendientes = obtenerPendientesCorteFiltrados();
  seleccionadosCorteIds.clear();
  if (checked) {
    pendientes.forEach(o => seleccionadosCorteIds.add(o.id));
  }
  renderizarVistaCortes();
}

function marcarSeleccionadosComoPagados() {
  if (seleccionadosCorteIds.size === 0) {
    alert('Selecciona al menos un equipo entregado para marcarlo como pagado.');
    return;
  }

  const montoSel = ordenes
    .filter(o => seleccionadosCorteIds.has(o.id))
    .reduce((acc, o) => acc + (Number(o.costo) || 0), 0);

  if (!confirm(`¿Marcar ${seleccionadosCorteIds.size} equipo(s) como PAGADOS por un total de $${montoSel.toLocaleString('es-MX')} MXN?`)) {
    return;
  }

  const fechaLiquidacion = obtenerFechaHoraActual();
  ordenes = ordenes.map(o => {
    if (seleccionadosCorteIds.has(o.id)) {
      return {
        ...o,
        estatus: 'Entregado y Pagado',
        saldo: 0,
        pagadoCorte: true,
        fechaPagoCorte: fechaLiquidacion
      };
    }
    return o;
  });

  seleccionadosCorteIds.clear();
  localStorage.setItem('redone_ordenes_v3', JSON.stringify(ordenes));
  actualizarContadores();
  renderizarBandeja();
  renderizarDashboard();
  renderizarVistaCortes();
  alert('✅ Lote marcado como pagado correctamente.');
}

function exportarCorteExcelCSV() {
  const pendientes = obtenerPendientesCorteFiltrados();
  if (pendientes.length === 0) {
    alert('No hay adeudos pendientes para exportar en este filtro.');
    return;
  }

  const tiendaSel = document.getElementById('corte-filtro-tienda')?.value || 'TODAS';
  const encabezados = ['Folio RedOne', 'Nota Tienda', 'Tienda', 'Marca', 'Modelo', 'Reparacion', 'Fecha', 'Monto MXN'];
  let total = 0;

  const filas = pendientes.map(o => {
    const monto = Number(o.costo) || 0;
    total += monto;
    return [
      o.id,
      o.folioTienda || '',
      o.origen || '',
      o.marca || '',
      o.modelo || '',
      `"${String(o.tipoReparacion || '').replace(/"/g, '""')}"`,
      o.fecha || '',
      monto
    ].join(',');
  });

  filas.push(['', '', '', '', '', '', 'TOTAL ADEUDADO MXN', total].join(','));

  const csvContent = '\uFEFF' + [encabezados.join(','), ...filas].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const sufijo = tiendaSel === 'TODAS' ? 'Todas_Tiendas' : tiendaSel.replace(/\s+/g, '_');
  a.href = url;
  a.download = `Corte_RedOne_${sufijo}_${obtenerFechaHoraActual().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function imprimirReporteCortePDF() {
  const pendientes = obtenerPendientesCorteFiltrados();
  if (pendientes.length === 0) {
    alert('No hay adeudos pendientes para generar el reporte PDF.');
    return;
  }

  const tiendaSel = document.getElementById('corte-filtro-tienda')?.value || 'TODAS';
  const total = pendientes.reduce((acc, o) => acc + (Number(o.costo) || 0), 0);

  document.getElementById('pdf-corte-subtitulo').textContent = `Tienda: ${tiendaSel === 'TODAS' ? 'Todas las tiendas aliadas' : tiendaSel}`;
  document.getElementById('pdf-corte-fecha').textContent = obtenerFechaHoraActual();
  document.getElementById('pdf-corte-total').textContent = `$${total.toLocaleString('es-MX')} MXN`;

  document.getElementById('pdf-corte-tbody').innerHTML = pendientes.map(o => `
    <tr class="border-b border-gray-200">
      <td class="py-1.5 px-2 font-mono font-bold">${o.id}</td>
      <td class="py-1.5 px-2">${o.folioTienda || '-'}</td>
      <td class="py-1.5 px-2">${o.origen}</td>
      <td class="py-1.5 px-2">${o.marca} ${o.modelo}</td>
      <td class="py-1.5 px-2">${o.tipoReparacion || ''}</td>
      <td class="py-1.5 px-2 text-right font-bold">$${Number(o.costo || 0).toLocaleString('es-MX')} MXN</td>
    </tr>
  `).join('');

  const areaPdf = document.getElementById('area-impresion-reporte');
  areaPdf.classList.remove('hidden');
  areaPdf.classList.add('imprimiendo-reporte');
  window.print();
  areaPdf.classList.remove('imprimiendo-reporte');
  areaPdf.classList.add('hidden');
}
