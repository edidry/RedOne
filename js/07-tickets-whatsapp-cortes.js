// =========================================================================
// 07 - TICKETS TÉRMICOS, WHATSAPP Y CORTES POR TIENDA
// =========================================================================

// === RENDERIZADO Y VISTAS PREVIAS DE TICKETS / ETIQUETAS ===

function obtenerDatosOrdenTicket(folio) {
    return ordenes.find(o => o.folio === folio) || null;
}

function abrirModalTicket(folio) {
    const o = obtenerDatosOrdenTicket(folio);
    if (!o) return;
    ticketActualFolio = folio;
    const modal = document.getElementById('modal-ticket');
    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }
    cambiarTipoTicket('cliente');
}

function cerrarModalTicket() {
    const modal = document.getElementById('modal-ticket');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
    ticketActualFolio = null;
}

function cambiarTipoTicket(tipo) {
    tipoTicketActual = tipo;
    const btnCliente = document.getElementById('btn-ticket-cliente');
    const btnEtiqueta = document.getElementById('btn-ticket-etiqueta');
    if (btnCliente && btnEtiqueta) {
        if (tipo === 'cliente') {
            btnCliente.className = 'flex-1 py-2 px-3 rounded-lg font-bold text-xs bg-red-600 text-white shadow';
            btnEtiqueta.className = 'flex-1 py-2 px-3 rounded-lg font-bold text-xs bg-slate-100 text-slate-600 hover:bg-slate-200';
        } else {
            btnEtiqueta.className = 'flex-1 py-2 px-3 rounded-lg font-bold text-xs bg-red-600 text-white shadow';
            btnCliente.className = 'flex-1 py-2 px-3 rounded-lg font-bold text-xs bg-slate-100 text-slate-600 hover:bg-slate-200';
        }
    }
    renderizarVistaPreviaTicket();
}

function cambiarAnchoTicket(ancho) {
    anchoTicketActual = ancho;
    const btn58 = document.getElementById('btn-ancho-58');
    const btn80 = document.getElementById('btn-ancho-80');
    if (btn58 && btn80) {
        if (ancho === '58mm') {
            btn58.className = 'px-2.5 py-1 rounded text-[11px] font-bold bg-slate-800 text-white';
            btn80.className = 'px-2.5 py-1 rounded text-[11px] font-bold bg-slate-100 text-slate-600';
        } else {
            btn80.className = 'px-2.5 py-1 rounded text-[11px] font-bold bg-slate-800 text-white';
            btn58.className = 'px-2.5 py-1 rounded text-[11px] font-bold bg-slate-100 text-slate-600';
        }
    }
    renderizarVistaPreviaTicket();
}

function renderizarVistaPreviaTicket() {
    const contenedor = document.getElementById('ticket-preview-container');
    if (!contenedor || !ticketActualFolio) return;
    const o = obtenerDatosOrdenTicket(ticketActualFolio);
    if (!o) return;

    const anchoPx = anchoTicketActual === '58mm' ? '220px' : '300px';
    const nombreTaller = configTaller.nombre || 'RedOne';
    const telTaller = configTaller.telefono || '';
    const dirTaller = configTaller.direccion || '';
    const politicas = configTaller.politicas || 'Garantía de 30 días en refacciones y mano de obra. No aplica en equipos mojados o golpeados.';
    const costo = parseFloat(o.costo) || 0;
    const abono = parseFloat(o.abono) || 0;
    const saldo = Math.max(0, costo - abono);

    if (tipoTicketActual === 'etiqueta') {
        contenedor.innerHTML = `
            <div id="area-impresion-ticket" style="width:${anchoPx}; margin:0 auto; background:#fff; color:#000; font-family:monospace; padding:8px; border:1px dashed #94a3b8; font-size:11px; line-height:1.25;">
                <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #000; padding-bottom:4px; margin-bottom:4px;">
                    <strong style="font-size:14px;">${o.folio}</strong>
                    <span style="font-size:10px; font-weight:bold;">${o.tienda || 'Taller'}</span>
                </div>
                <div style="font-weight:bold; font-size:12px; margin-bottom:2px;">${o.marca || ''} ${o.modelo || ''}</div>
                <div style="margin-bottom:2px;"><strong>Cli:</strong> ${o.cliente || 'Mostrador'}</div>
                <div style="margin-bottom:2px;"><strong>Falla:</strong> ${o.falla || ''}</div>
                <div style="margin-bottom:4px;"><strong>Clave/Patrón:</strong> ${o.clave || 'Sin clave'}</div>
                <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px dashed #000; padding-top:4px;">
                    <div>
                        <div>Total: $${costo.toFixed(0)}</div>
                        <div>Resta: <strong>$${saldo.toFixed(0)}</strong></div>
                        <div style="font-size:9px;">${o.fecha || ''}</div>
                    </div>
                    <div id="ticket-qr-target" style="width:56px; height:56px;"></div>
                </div>
            </div>
        `;
    } else {
        contenedor.innerHTML = `
            <div id="area-impresion-ticket" style="width:${anchoPx}; margin:0 auto; background:#fff; color:#000; font-family:monospace; padding:10px; border:1px dashed #94a3b8; font-size:11px; line-height:1.3;">
                <div style="text-align:center; border-bottom:1px dashed #000; padding-bottom:6px; margin-bottom:6px;">
                    <div style="font-weight:bold; font-size:15px; letter-spacing:0.5px;">${nombreTaller}</div>
                    ${dirTaller ? `<div style="font-size:10px;">${dirTaller}</div>` : ''}
                    ${telTaller ? `<div style="font-size:10px;">Tel: ${telTaller}</div>` : ''}
                    <div style="margin-top:4px; font-weight:bold; font-size:12px;">ORDEN: ${o.folio}</div>
                    <div style="font-size:10px;">Fecha: ${o.fecha || ''} | Suc: ${o.tienda || 'Taller'}</div>
                </div>
                <div style="margin-bottom:6px; border-bottom:1px dashed #000; padding-bottom:6px;">
                    <div><strong>Cliente:</strong> ${o.cliente || 'Mostrador'}</div>
                    ${o.telefono ? `<div><strong>Tel:</strong> ${o.telefono}</div>` : ''}
                    <div><strong>Equipo:</strong> ${o.marca || ''} ${o.modelo || ''}</div>
                    ${o.imei ? `<div><strong>IMEI/SN:</strong> ${o.imei}</div>` : ''}
                    <div><strong>Falla:</strong> ${o.falla || ''}</div>
                    ${o.observaciones ? `<div><strong>Obs:</strong> ${o.observaciones}</div>` : ''}
                    ${o.accesorios ? `<div><strong>Acc:</strong> ${o.accesorios}</div>` : ''}
                </div>
                <div style="margin-bottom:6px; border-bottom:1px dashed #000; padding-bottom:6px;">
                    <div style="display:flex; justify-content:space-between;"><span>Costo Estimado:</span><strong>$${costo.toFixed(2)}</strong></div>
                    <div style="display:flex; justify-content:space-between;"><span>Anticipo / Abono:</span><span>$${abono.toFixed(2)}</span></div>
                    <div style="display:flex; justify-content:space-between; font-size:12px; margin-top:2px;"><span>SALDO PENDIENTE:</span><strong>$${saldo.toFixed(2)}</strong></div>
                </div>
                <div style="display:flex; flex-direction:column; align-items:center; margin-bottom:6px;">
                    <div id="ticket-qr-target" style="width:76px; height:76px; margin-bottom:4px;"></div>
                    <span style="font-size:9px;">Escanea para seguimiento</span>
                </div>
                <div style="font-size:9px; text-align:justify; border-top:1px dashed #000; padding-top:4px;">
                    ${politicas}
                </div>
            </div>
        `;
    }

    generarQREnElemento('ticket-qr-target', o.folio, tipoTicketActual === 'etiqueta' ? 56 : 76);
}

function generarQREnElemento(elementId, texto, size = 76) {
    const el = document.getElementById(elementId);
    if (!el) return;
    el.innerHTML = '';
    if (typeof QRCode !== 'undefined') {
        try {
            new QRCode(el, {
                text: String(texto),
                width: size,
                height: size,
                colorDark: '#000000',
                colorLight: '#ffffff',
                correctLevel: QRCode.CorrectLevel.M
            });
        } catch (e) {
            el.innerHTML = `<div style="border:1px solid #000; width:${size}px; height:${size}px; display:flex; align-items:center; justify-content:center; font-size:9px; text-align:center;">${texto}</div>`;
        }
    } else {
        el.innerHTML = `<div style="border:1px solid #000; width:${size}px; height:${size}px; display:flex; align-items:center; justify-content:center; font-size:9px; text-align:center;">${texto}</div>`;
    }
}

function imprimirTicketActual() {
    const area = document.getElementById('area-impresion-ticket');
    if (!area) return;
    const ventana = window.open('', '_blank', 'width=400,height=600');
    if (!ventana) {
        alert('Por favor permite las ventanas emergentes para imprimir el ticket.');
        return;
    }
    ventana.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Imprimir ${ticketActualFolio || 'Ticket'}</title>
            <style>
                @page { margin: 2mm; }
                body { margin: 0; padding: 0; background: #fff; }
            </style>
        </head>
        <body>
            ${area.outerHTML}
            <script>
                window.onload = function() {
                    setTimeout(function() {
                        window.print();
                        window.close();
                    }, 250);
                };
            <\/script>
        </body>
        </html>
    `);
    ventana.document.close();
}

// === ENVÍOS POR WHATSAPP ===

function limpiarTelefonoWhatsApp(tel) {
    if (!tel) return '';
    let limpio = String(tel).replace(/\D/g, '');
    if (limpio.length === 10) {
        limpio = '52' + limpio;
    }
    return limpio;
}

function enviarWhatsAppOrden(folio, tipoMensaje = 'recepcion') {
    const o = obtenerDatosOrdenTicket(folio) || ordenes.find(item => item.id === folio || item.folio === folio);
    if (!o) return;

    const origenOrden = o.origen || o.tienda || 'RedOne';
    const esTienda = origenOrden !== 'RedOne' && origenOrden !== 'Taller';
    const cfgTienda = esTienda && typeof obtenerConfigTienda === 'function' ? obtenerConfigTienda(origenOrden) : null;
    const telCrudo = o.telefono || cfgTienda?.whatsapp || '';
    const tel = limpiarTelefonoWhatsApp(telCrudo);

    if (!tel) {
        alert('Esta orden no tiene un número de teléfono válido registrado.');
        return;
    }

    const nombreTaller = (typeof configNegocio !== 'undefined' && configNegocio?.nombre)
        ? configNegocio.nombre
        : (typeof configTaller !== 'undefined' && configTaller?.nombre ? configTaller.nombre : 'RedOne');

    const folioReal = o.id || o.folio || '';
    const equipoTexto = `${o.marca || ''} ${o.modelo || ''}`.trim() || 'Equipo';
    const fallaTexto = o.falla || o.tipoReparacion || 'Servicio técnico';
    const costo = parseFloat(o.costo) || 0;
    const abono = parseFloat(o.anticipo ?? o.abono) || 0;
    const saldo = Math.max(0, costo - abono);
    const garantiaTexto = o.garantiaTipo === '50'
        ? '50% de garantía (descuento aplicado)'
        : '100% contra defectos de fábrica (no aplica por golpes ni humedad)';

    const datosVariables = {
        cliente: o.cliente || 'Cliente',
        taller: nombreTaller,
        tienda: origenOrden,
        folio: folioReal,
        folioTienda: o.folioTienda || 'S/N',
        encargado: o.encargadoTienda || 'Mostrador',
        equipo: equipoTexto,
        falla: fallaTexto,
        total: `$${costo.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN`,
        anticipo: `$${abono.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN`,
        saldo: `$${saldo.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN`,
        garantia: garantiaTexto
    };

    let msg = '';
    if (tipoMensaje === 'listo') {
        msg = typeof renderizarPlantillaWA === 'function'
            ? renderizarPlantillaWA('equipoListo', datosVariables)
            : `Hola *${datosVariables.cliente}*, tu equipo *${equipoTexto}* (${folioReal}) está listo.`;
    } else if (tipoMensaje === 'cotizacion') {
        msg = `Hola *${datosVariables.cliente}*, te compartimos la actualización de diagnóstico desde *${nombreTaller}* 🔧:\n\n` +
              `• Folio: *${folioReal}*\n` +
              `• Equipo: *${equipoTexto}*\n` +
              `• Falla/Servicio: ${fallaTexto}\n` +
              `• *Costo total estimado: ${datosVariables.total}*\n\n` +
              `Quedamos atentos a tu confirmación para proceder.`;
    } else if (esTienda) {
        msg = typeof renderizarPlantillaWA === 'function'
            ? renderizarPlantillaWA('recepcionTienda', datosVariables)
            : `Hola *${origenOrden}*, recibimos en *${nombreTaller}* el equipo *${equipoTexto}* (${folioReal}).`;
    } else {
        msg = typeof renderizarPlantillaWA === 'function'
            ? renderizarPlantillaWA('recepcionCliente', datosVariables)
            : `Hola *${datosVariables.cliente}*, registramos tu orden *${folioReal}* en *${nombreTaller}*.`;
    }

    const url = `https://wa.me/${tel}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
}

function enviarWhatsAppCotizacionRapida(datos) {
    const tel = limpiarTelefonoWhatsApp(datos.telefono);
    const nombreTaller = configTaller.nombre || 'RedOne';
    const msg = `Hola${datos.cliente ? ' *' + datos.cliente + '*' : ''}, te compartimos tu cotización de *${nombreTaller}* 🛠️:\n\n` +
                `• *Equipo:* ${datos.equipo || 'Dispositivo'}\n` +
                `• *Servicio:* ${datos.servicio || 'Reparación'}\n` +
                `• *Total estimado:* $${(parseFloat(datos.total) || 0).toFixed(2)}\n` +
                (datos.notas ? `• *Notas:* ${datos.notas}\n` : '') +
                `\n¿Gustas que agendemos tu reparación?`;

    const url = tel
        ? `https://wa.me/${tel}?text=${encodeURIComponent(msg)}`
        : `https://wa.me/?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
}

// === MÓDULO DE CORTES POR TIENDA Y LIQUIDACIONES ===

function renderizarVistaCortes() {
    const selectTienda = document.getElementById('filtro-corte-tienda');
    const selectEstadoPago = document.getElementById('filtro-corte-estado-pago');
    const inputDesde = document.getElementById('filtro-corte-desde');
    const inputHasta = document.getElementById('filtro-corte-hasta');
    const tbody = document.getElementById('tabla-cortes-body');

    if (!tbody) return;

    // Poblar selector de tiendas si está vacío o desactualizado
    if (selectTienda) {
        const valorPrevio = selectTienda.value;
        const nombresTiendas = ['TODAS', 'Taller', ...tiendasAliadas.map(t => t.nombre)];
        const opcionesUnicas = [...new Set(nombresTiendas)];
        selectTienda.innerHTML = opcionesUnicas.map(nombre =>
            `<option value="${nombre}">${nombre === 'TODAS' ? 'Todas las Sucursales / Tiendas' : nombre}</option>`
        ).join('');
        if (opcionesUnicas.includes(valorPrevio)) {
            selectTienda.value = valorPrevio;
        }
    }

    const filtroTienda = selectTienda ? selectTienda.value : 'TODAS';
    const filtroPago = selectEstadoPago ? selectEstadoPago.value : 'TODOS';
    const fechaDesde = inputDesde ? inputDesde.value : '';
    const fechaHasta = inputHasta ? inputHasta.value : '';

    // Filtrar órdenes válidas para corte (entregadas o listas, excluyendo canceladas)
    const ordenesFiltradas = ordenes.filter(o => {
        if (o.estado === 'Cancelado') return false;
        const sucursalOrden = o.tienda || 'Taller';
        if (filtroTienda !== 'TODAS' && sucursalOrden !== filtroTienda) return false;

        const estaPagado = Boolean(o.pagadoCorte);
        if (filtroPago === 'PENDIENTES' && estaPagado) return false;
        if (filtroPago === 'PAGADOS' && !estaPagado) return false;

        if (fechaDesde && o.fecha && o.fecha < fechaDesde) return false;
        if (fechaHasta && o.fecha && o.fecha > fechaHasta) return false;

        return true;
    });

    let totalBruto = 0;
    let totalComisionTienda = 0;
    let totalNetoTaller = 0;
    let totalPendienteCobro = 0;

    if (ordenesFiltradas.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="text-center py-8 text-slate-400 text-xs">
                    No hay órdenes registradas con los filtros seleccionados.
                </td>
            </tr>
        `;
    } else {
        tbody.innerHTML = ordenesFiltradas.map(o => {
            const costo = parseFloat(o.costo) || 0;
            const sucursal = o.tienda || 'Taller';
            const tiendaObj = tiendasAliadas.find(t => t.nombre === sucursal);
            const pctComision = tiendaObj ? (parseFloat(tiendaObj.comision) || 0) : 0;
            const comisionMonto = costo * (pctComision / 100);
            const netoTaller = costo - comisionMonto;
            const estaPagado = Boolean(o.pagadoCorte);
            const seleccionado = foliosCorteSeleccionados.has(o.folio);

            totalBruto += costo;
            totalComisionTienda += comisionMonto;
            totalNetoTaller += netoTaller;
            if (!estaPagado) {
                totalPendienteCobro += netoTaller;
            }

            return `
                <tr class="border-b border-slate-100 hover:bg-slate-50 transition-colors ${estaPagado ? 'bg-emerald-50/30' : ''}">
                    <td class="py-2.5 px-3 text-center">
                        <input type="checkbox"
                            class="rounded border-slate-300 text-red-600 focus:ring-red-500 cursor-pointer"
                            ${seleccionado ? 'checked' : ''}
                            onchange="toggleSeleccionCorte('${o.folio}', this.checked)">
                    </td>
                    <td class="py-2.5 px-3 font-mono font-bold text-xs text-slate-800">${o.folio}</td>
                    <td class="py-2.5 px-3 text-xs text-slate-600">${o.fecha || '-'}</td>
                    <td class="py-2.5 px-3">
                        <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">${sucursal}</span>
                    </td>
                    <td class="py-2.5 px-3 text-xs">
                        <div class="font-semibold text-slate-800">${o.marca || ''} ${o.modelo || ''}</div>
                        <div class="text-[11px] text-slate-500 truncate max-w-[180px]">${o.falla || ''}</div>
                    </td>
                    <td class="py-2.5 px-3 text-right font-mono text-xs font-semibold text-slate-700">$${costo.toFixed(2)}</td>
                    <td class="py-2.5 px-3 text-right font-mono text-xs font-bold text-slate-900">
                        $${netoTaller.toFixed(2)}
                        ${pctComision > 0 ? `<div class="text-[10px] text-amber-600 font-normal">-${pctComision}% ($${comisionMonto.toFixed(0)})</div>` : ''}
                    </td>
                    <td class="py-2.5 px-3 text-center">
                        ${estaPagado
                            ? `<span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">Liquidado</span>
                               ${o.fechaPagoCorte ? `<p class="text-[10px] text-slate-500">Pagado: ${o.fechaPagoCorte}</p>` : ''}`
                            : `<span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700">Pendiente</span>`
                        }
                    </td>
                </tr>
            `;
        }).join('');
    }

    // Actualizar tarjetas de resumen del corte
    const elBruto = document.getElementById('corte-total-bruto');
    const elComision = document.getElementById('corte-total-comision');
    const elNeto = document.getElementById('corte-total-neto');
    const elPendiente = document.getElementById('corte-total-pendiente');

    if (elBruto) elBruto.textContent = `$${totalBruto.toFixed(2)}`;
    if (elComision) elComision.textContent = `$${totalComisionTienda.toFixed(2)}`;
    if (elNeto) elNeto.textContent = `$${totalNetoTaller.toFixed(2)}`;
    if (elPendiente) elPendiente.textContent = `$${totalPendienteCobro.toFixed(2)}`;
}

function toggleSeleccionCorte(folio, checked) {
    if (checked) {
        foliosCorteSeleccionados.add(folio);
    } else {
        foliosCorteSeleccionados.delete(folio);
    }
    const contador = document.getElementById('corte-contador-seleccionados');
    if (contador) {
        contador.textContent = foliosCorteSeleccionados.size;
    }
}

function seleccionarTodosCorte(checked) {
    const checkboxes = document.querySelectorAll('#tabla-cortes-body input[type="checkbox"]');
    checkboxes.forEach(cb => {
        cb.checked = checked;
        const match = cb.getAttribute('onchange')?.match(/'([^']+)'/);
        if (match && match[1]) {
            if (checked) {
                foliosCorteSeleccionados.add(match[1]);
            } else {
                foliosCorteSeleccionados.delete(match[1]);
            }
        }
    });
    const contador = document.getElementById('corte-contador-seleccionados');
    if (contador) {
        contador.textContent = foliosCorteSeleccionados.size;
    }
}

function marcarSeleccionadosComoPagados() {
    if (foliosCorteSeleccionados.size === 0) {
        alert('Selecciona al menos una orden de la lista para marcarla como liquidada.');
        return;
    }
    const hoy = new Date().toISOString().split('T')[0];
    let actualizados = 0;

    ordenes.forEach(o => {
        if (foliosCorteSeleccionados.has(o.folio)) {
            o.pagadoCorte = true;
            o.fechaPagoCorte = hoy;
            actualizados++;
        }
    });

    if (actualizados > 0) {
        if (typeof guardarDatosLocales === 'function') {
            guardarDatosLocales();
        } else {
            localStorage.setItem('redone_ordenes', JSON.stringify(ordenes));
        }
        foliosCorteSeleccionados.clear();
        const contador = document.getElementById('corte-contador-seleccionados');
        if (contador) contador.textContent = '0';
        renderizarVistaCortes();
        if (typeof actualizarDashboard === 'function') {
            actualizarDashboard();
        }
    }
}

function exportarCorteExcelCSV() {
    const selectTienda = document.getElementById('filtro-corte-tienda');
    const filtroTienda = selectTienda ? selectTienda.value : 'TODAS';

    const filas = [
        ['Folio', 'Fecha', 'Sucursal', 'Cliente', 'Equipo', 'Falla', 'Costo Total', 'Comision Tienda', 'Neto Taller', 'Estado Corte', 'Fecha Pago']
    ];

    ordenes.forEach(o => {
        if (o.estado === 'Cancelado') return;
        const sucursal = o.tienda || 'Taller';
        if (filtroTienda !== 'TODAS' && sucursal !== filtroTienda) return;

        const costo = parseFloat(o.costo) || 0;
        const tiendaObj = tiendasAliadas.find(t => t.nombre === sucursal);
        const pct = tiendaObj ? (parseFloat(tiendaObj.comision) || 0) : 0;
        const comision = costo * (pct / 100);
        const neto = costo - comision;

        filas.push([
            o.folio,
            o.fecha || '',
            sucursal,
            `"${(o.cliente || '').replace(/"/g, '""')}"`,
            `"${((o.marca || '') + ' ' + (o.modelo || '')).trim().replace(/"/g, '""')}"`,
            `"${(o.falla || '').replace(/"/g, '""')}"`,
            costo.toFixed(2),
            comision.toFixed(2),
            neto.toFixed(2),
            o.pagadoCorte ? 'Liquidado' : 'Pendiente',
            o.fechaPagoCorte || ''
        ]);
    });

    const csvContent = '\uFEFF' + filas.map(e => e.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Corte_${filtroTienda}_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

function imprimirReporteCortePDF() {
    const tabla = document.getElementById('tabla-cortes-body');
    const selectTienda = document.getElementById('filtro-corte-tienda');
    if (!tabla) return;

    const sucursal = selectTienda ? selectTienda.value : 'TODAS';
    const nombreTaller = configTaller.nombre || 'RedOne';
    const bruto = document.getElementById('corte-total-bruto')?.textContent || '$0.00';
    const comision = document.getElementById('corte-total-comision')?.textContent || '$0.00';
    const neto = document.getElementById('corte-total-neto')?.textContent || '$0.00';
    const pendiente = document.getElementById('corte-total-pendiente')?.textContent || '$0.00';

    const ventana = window.open('', '_blank', 'width=850,height=700');
    if (!ventana) {
        alert('Permite las ventanas emergentes para generar el reporte de corte.');
        return;
    }

    ventana.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Reporte de Corte - ${sucursal}</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 24px; color: #1e293b; font-size: 12px; }
                h1 { margin: 0 0 4px 0; font-size: 20px; }
                .meta { color: #64748b; margin-bottom: 16px; }
                .resumen { display: flex; gap: 16px; margin-bottom: 20px; }
                .card { border: 1px solid #cbd5e1; border-radius: 8px; padding: 10px 14px; flex: 1; }
                .card span { display: block; font-size: 10px; color: #64748b; text-transform: uppercase; }
                .card strong { font-size: 16px; }
                table { width: 100%; border-collapse: collapse; margin-top: 10px; }
                th, td { border-bottom: 1px solid #e2e8f0; padding: 8px 6px; text-align: left; }
                th { background: #f8fafc; font-size: 11px; text-transform: uppercase; }
                input[type="checkbox"] { display: none; }
            </style>
        </head>
        <body>
            <h1>${nombreTaller} — Reporte de Corte</h1>
            <div class="meta">Sucursal: <strong>${sucursal}</strong> | Fecha de emisión: ${new Date().toLocaleDateString()}</div>
            <div class="resumen">
                <div class="card"><span>Total Bruto</span><strong>${bruto}</strong></div>
                <div class="card"><span>Comisión Tienda</span><strong>${comision}</strong></div>
                <div class="card"><span>Neto Taller</span><strong>${neto}</strong></div>
                <div class="card"><span>Pendiente por Cobrar</span><strong>${pendiente}</strong></div>
            </div>
            <table>
                <thead>
                    <tr>
                        <th></th>
                        <th>Folio</th>
                        <th>Fecha</th>
                        <th>Sucursal</th>
                        <th>Equipo / Falla</th>
                        <th>Bruto</th>
                        <th>Neto Taller</th>
                        <th>Estado</th>
                    </tr>
                </thead>
                <tbody>
                    ${tabla.innerHTML}
                </tbody>
            </table>
            <script>
                window.onload = function() {
                    setTimeout(function() {
                        window.print();
                    }, 300);
                };
            <\/script>
        </body>
        </html>
    `);
    ventana.document.close();
}
