// =========================================================================
// MÓDULO 09: PANEL CENTRAL DE CONFIGURACIÓN Y CONTROL GENERAL
// (Control General, Tarifas Base, Empleados, Tiendas, PINes, Inventario, Nombres)
// =========================================================================

let subtabConfigActual = 'general';

function cambiarSubtabConfig(subtab) {
  subtabConfigActual = subtab;
  const subtabs = ['general', 'empleados', 'tiendas', 'pines', 'inventario', 'nombres'];

  subtabs.forEach(st => {
    const btn = document.getElementById('cfg-tab-' + st);
    const panel = document.getElementById('cfg-panel-' + st);
    if (!btn || !panel) return;

    if (st === subtab) {
      btn.className = 'cfg-subtab px-3.5 py-2.5 rounded-xl bg-sky-600 text-white font-bold transition flex items-center gap-1.5 shadow';
      panel.classList.remove('hidden');
      if (['empleados', 'tiendas', 'inventario'].includes(st)) {
        panel.classList.add('grid');
      }
    } else {
      btn.className = 'cfg-subtab px-3.5 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 font-semibold transition flex items-center gap-1.5';
      panel.classList.add('hidden');
      panel.classList.remove('grid');
    }
  });

  refrescarPanelConfiguracion();
}

function refrescarPanelConfiguracion() {
  actualizarContadoresPanelConfig();
  cargarConfiguracionGeneralNegocioEnPanel();
  cargarValoresTarifasEnPanel();
  renderizarListaEmpleadosConfig();
  renderizarListaTiendasAdmin();
  renderizarPinesRapidosTiendas();
  renderizarInventarioConfig();
  renderizarCamposEtiquetasEnPanel();

  const inpMaestro = document.getElementById('admin-pin-maestro');
  if (inpMaestro) inpMaestro.value = pinMaestro;
}

function actualizarContadoresPanelConfig() {
  const cEmp = document.getElementById('cfg-count-empleados');
  const cTie = document.getElementById('cfg-count-tiendas');
  const cInv = document.getElementById('cfg-count-inventario');
  if (cEmp) cEmp.textContent = empleadosConfig.filter(e => e.estatus === 'Activo').length;
  if (cTie) cTie.textContent = tiendasConfig.length;
  if (cInv) cInv.textContent = inventarioTaller.length;
}

// =========================================================================
// 1. CONTROL GENERAL DEL TALLER Y TARIFAS BASE
// =========================================================================
function cargarConfiguracionGeneralNegocioEnPanel() {
  const elNombre = document.getElementById('cfg-negocio-nombre');
  const elSub = document.getElementById('cfg-negocio-subtitulo');
  const elDir = document.getElementById('cfg-negocio-direccion');
  const elTel = document.getElementById('cfg-negocio-telefono');
  const elGar = document.getElementById('cfg-negocio-garantia');

  if (elNombre) elNombre.value = configNegocio.nombre || 'RedOne';
  if (elSub) elSub.value = configNegocio.subtitulo || '';
  if (elDir) elDir.value = configNegocio.direccion || '';
  if (elTel) elTel.value = configNegocio.telefono || '';
  if (elGar) elGar.value = configNegocio.garantiaPie || '';
}

function guardarConfiguracionGeneralNegocio() {
  configNegocio = {
    nombre: (document.getElementById('cfg-negocio-nombre')?.value || 'RedOne').trim() || 'RedOne',
    subtitulo: (document.getElementById('cfg-negocio-subtitulo')?.value || '').trim(),
    direccion: (document.getElementById('cfg-negocio-direccion')?.value || '').trim(),
    telefono: (document.getElementById('cfg-negocio-telefono')?.value || '').replace(/\D/g, '').slice(0, 10),
    garantiaPie: (document.getElementById('cfg-negocio-garantia')?.value || '').trim()
  };
  localStorage.setItem('redone_config_negocio_v3', JSON.stringify(configNegocio));
  aplicarConfiguracionNegocioEnTicket();
  alert('✅ Datos generales del taller guardados correctamente.');
}

function aplicarConfiguracionNegocioEnTicket() {
  const tkSub = document.getElementById('tk-subtitulo-negocio');
  const tkDir = document.getElementById('tk-direccion-negocio');
  const tkGar = document.getElementById('tk-leyenda-garantia');

  if (tkSub && configNegocio.subtitulo) tkSub.textContent = configNegocio.subtitulo;
  if (tkDir && configNegocio.direccion) tkDir.textContent = configNegocio.direccion;
  if (tkGar && configNegocio.garantiaPie) tkGar.textContent = configNegocio.garantiaPie;
}

function cargarValoresTarifasEnPanel() {
  const mInc = document.getElementById('trf-margen-incell');
  if (!mInc) return;
  mInc.value = tarifasTaller.margenIncellPct ?? 30;
  document.getElementById('trf-margen-oled').value = tarifasTaller.margenOledPct ?? 20;
  document.getElementById('trf-android-baja').value = tarifasTaller.androidBaja;
  document.getElementById('trf-android-media').value = tarifasTaller.androidMedia;
  document.getElementById('trf-android-alta').value = tarifasTaller.androidAlta;
  document.getElementById('trf-iphone-home').value = tarifasTaller.iphoneHome;
  document.getElementById('trf-iphone-faceid').value = tarifasTaller.iphoneFaceid;
  document.getElementById('trf-iphone-pro').value = tarifasTaller.iphonePro;
  document.getElementById('trf-laptop-display').value = tarifasTaller.laptopDisplay;
  document.getElementById('trf-laptop-mantto').value = tarifasTaller.laptopMantto;
  document.getElementById('trf-imp-reset').value = tarifasTaller.impReset;
  document.getElementById('trf-desc-tienda').value = tarifasTaller.descTiendaPct;
}

function guardarTarifasDesdePanelConfig() {
  if (typeof guardarTarifasTaller === 'function') {
    guardarTarifasTaller();
  }
  alert('✅ Tarifas base de mano de obra y margen de garantía actualizadas.');
}

// =========================================================================
// 2. ALTA, BAJA Y EDICIÓN DE EMPLEADOS
// =========================================================================
function sincronizarDatalistEmpleados() {
  const dl = document.getElementById('lista-empleados-sugeridos');
  if (!dl) return;
  const activos = empleadosConfig.filter(e => e.estatus === 'Activo');
  dl.innerHTML = activos.map(e => `<option value="${e.nombre}">${e.puesto} (${e.sucursal})</option>`).join('');
}

function limpiarFormEmpleado() {
  document.getElementById('emp-id-edit').value = '';
  document.getElementById('emp-nombre').value = '';
  document.getElementById('emp-puesto').value = 'Auxiliar / Mostrador';
  document.getElementById('emp-sucursal').value = 'RedOne';
  document.getElementById('emp-telefono').value = '';
  document.getElementById('emp-pin').value = '';
  document.getElementById('emp-estatus').value = 'Activo';
  document.getElementById('titulo-form-empleado').innerHTML = '<i class="fa-solid fa-user-plus"></i> Dar de Alta Nuevo Empleado';
  document.getElementById('btn-guardar-empleado').innerHTML = '<i class="fa-solid fa-user-check"></i> Registrar Empleado';
  document.getElementById('btn-cancelar-edit-empleado').classList.add('hidden');
}

function guardarEmpleadoConfig() {
  const idEdit = document.getElementById('emp-id-edit').value.trim();
  const nombre = document.getElementById('emp-nombre').value.trim();
  const puesto = document.getElementById('emp-puesto').value;
  const sucursal = document.getElementById('emp-sucursal').value;
  const telefono = document.getElementById('emp-telefono').value.replace(/\D/g, '').slice(0, 10);
  const pin = document.getElementById('emp-pin').value.trim();
  const estatus = document.getElementById('emp-estatus').value;

  if (!nombre) {
    alert('Ingresa el nombre del empleado.');
    return;
  }

  if (idEdit) {
    const idx = empleadosConfig.findIndex(e => e.id === idEdit);
    if (idx >= 0) {
      empleadosConfig[idx] = { ...empleadosConfig[idx], nombre, puesto, sucursal, telefono, pin, estatus };
    }
  } else {
    empleadosConfig.push({
      id: 'emp-' + Date.now(),
      nombre,
      puesto,
      sucursal,
      telefono,
      pin,
      estatus
    });
  }

  localStorage.setItem('redone_empleados_config_v3', JSON.stringify(empleadosConfig));
  limpiarFormEmpleado();
  sincronizarDatalistEmpleados();
  renderizarListaEmpleadosConfig();
  actualizarContadoresPanelConfig();
}

function editarEmpleadoConfig(id) {
  const emp = empleadosConfig.find(e => e.id === id);
  if (!emp) return;
  document.getElementById('emp-id-edit').value = emp.id;
  document.getElementById('emp-nombre').value = emp.nombre;
  document.getElementById('emp-puesto').value = emp.puesto || 'Auxiliar / Mostrador';
  document.getElementById('emp-sucursal').value = emp.sucursal || 'RedOne';
  document.getElementById('emp-telefono').value = emp.telefono || '';
  document.getElementById('emp-pin').value = emp.pin || '';
  document.getElementById('emp-estatus').value = emp.estatus || 'Activo';

  document.getElementById('titulo-form-empleado').innerHTML = `<i class="fa-solid fa-user-pen"></i> Editando: ${emp.nombre}`;
  document.getElementById('btn-guardar-empleado').innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Guardar Cambios';
  document.getElementById('btn-cancelar-edit-empleado').classList.remove('hidden');
}

function alternarBajaEmpleadoConfig(id) {
  const emp = empleadosConfig.find(e => e.id === id);
  if (!emp) return;
  emp.estatus = emp.estatus === 'Activo' ? 'Baja' : 'Activo';
  localStorage.setItem('redone_empleados_config_v3', JSON.stringify(empleadosConfig));
  sincronizarDatalistEmpleados();
  renderizarListaEmpleadosConfig();
  actualizarContadoresPanelConfig();
}

function eliminarEmpleadoConfig(id) {
  const emp = empleadosConfig.find(e => e.id === id);
  if (!emp) return;
  if (!confirm(`¿Eliminar definitivamente el registro de "${emp.nombre}"?`)) return;
  empleadosConfig = empleadosConfig.filter(e => e.id !== id);
  localStorage.setItem('redone_empleados_config_v3', JSON.stringify(empleadosConfig));
  sincronizarDatalistEmpleados();
  renderizarListaEmpleadosConfig();
  actualizarContadoresPanelConfig();
}

function renderizarListaEmpleadosConfig() {
  const cont = document.getElementById('lista-empleados-config');
  if (!cont) return;
  const filtro = document.getElementById('filtro-estatus-empleados')?.value || 'TODOS';

  const filtrados = empleadosConfig.filter(e => filtro === 'TODOS' || e.estatus === filtro);
  if (filtrados.length === 0) {
    cont.innerHTML = `<p class="text-xs text-slate-500 text-center py-8 bg-slate-950/60 rounded-xl border border-slate-800">No hay empleados en esta categoría.</p>`;
    return;
  }

  cont.innerHTML = filtrados.map(e => {
    const esActivo = e.estatus === 'Activo';
    const badgeEst = esActivo
      ? '<span class="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">Activo</span>'
      : '<span class="text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-300 border border-rose-500/30">Baja</span>';

    return `
      <div class="bg-slate-950 border ${esActivo ? 'border-slate-800' : 'border-rose-900/40 opacity-75'} rounded-xl p-3 flex flex-wrap items-center justify-between gap-2">
        <div class="space-y-1">
          <div class="flex items-center gap-2 flex-wrap">
            <span class="text-xs font-bold text-white">${e.nombre}</span>
            ${badgeEst}
            <span class="text-[11px] text-sky-300 bg-sky-500/10 border border-sky-500/30 px-2 py-0.5 rounded">${e.sucursal}</span>
          </div>
          <div class="flex items-center gap-3 text-[11px] text-slate-400">
            <span><i class="fa-solid fa-id-badge mr-1"></i>${e.puesto}</span>
            ${e.pin ? `<span class="font-mono text-amber-300">PIN: ${e.pin}</span>` : ''}
            ${e.telefono ? `<span><i class="fa-brands fa-whatsapp text-emerald-400 mr-1"></i>${e.telefono}</span>` : ''}
          </div>
        </div>

        <div class="flex items-center gap-1.5">
          <button type="button" onclick="editarEmpleadoConfig('${e.id}')"
            class="text-xs bg-slate-800 hover:bg-sky-600 text-white px-2.5 py-1.5 rounded-lg transition" title="Editar empleado">
            <i class="fa-solid fa-pen"></i>
          </button>
          <button type="button" onclick="alternarBajaEmpleadoConfig('${e.id}')"
            class="text-xs bg-slate-800 hover:bg-amber-600 text-amber-300 hover:text-white px-2.5 py-1.5 rounded-lg transition"
            title="${esActivo ? 'Dar de baja' : 'Reactivar'}">
            <i class="fa-solid ${esActivo ? 'fa-user-slash' : 'fa-user-check'}"></i>
          </button>
          <button type="button" onclick="eliminarEmpleadoConfig('${e.id}')"
            class="text-xs bg-slate-800 hover:bg-rose-600 text-rose-300 hover:text-white px-2.5 py-1.5 rounded-lg transition" title="Eliminar">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      </div>
    `;
  }).join('');
}

// =========================================================================
// 3. EDICIÓN RÁPIDA DE PINES DE TIENDAS
// =========================================================================
function renderizarPinesRapidosTiendas() {
  const cont = document.getElementById('lista-pines-rapidos-tiendas');
  if (!cont) return;
  cont.innerHTML = tiendasConfig.map(t => {
    const paleta = PALETAS_COLOR[t.color] || PALETAS_COLOR.sky;
    return `
      <div class="bg-slate-950 border border-slate-800 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3">
        <span class="text-xs font-bold px-2.5 py-1 rounded-full border ${paleta.badgeBandeja}">
          <i class="fa-solid fa-store mr-1"></i> ${t.nombre}
        </span>
        <div class="flex items-center gap-2">
          <input type="text" id="pin-rapido-${t.id}" inputmode="numeric" maxlength="8" value="${t.pin}"
            class="w-28 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-center font-mono text-sm font-bold text-amber-300 focus:outline-none focus:border-amber-500">
          <button type="button" onclick="actualizarPinRapidoTienda('${t.id}')"
            class="bg-amber-600 hover:bg-amber-500 text-white font-bold px-3 py-1.5 rounded-lg text-xs transition">
            Guardar PIN
          </button>
        </div>
      </div>
    `;
  }).join('');
}

function actualizarPinRapidoTienda(idTienda) {
  const inp = document.getElementById('pin-rapido-' + idTienda);
  if (!inp) return;
  const nuevoPin = inp.value.trim();
  if (nuevoPin.length < 4) {
    alert('El PIN de la tienda debe tener al menos 4 dígitos.');
    return;
  }
  const idx = tiendasConfig.findIndex(t => t.id === idTienda);
  if (idx >= 0) {
    tiendasConfig[idx].pin = nuevoPin;
    localStorage.setItem('redone_tiendas_config_v3', JSON.stringify(tiendasConfig));
    renderizarListaTiendasAdmin();
    alert(`✅ PIN de "${tiendasConfig[idx].nombre}" actualizado.`);
  }
}

// =========================================================================
// 4. GESTIÓN DE INVENTARIO DE REFACCIONES E INSUMOS
// =========================================================================
function limpiarFormInventario() {
  document.getElementById('inv-id-edit').value = '';
  document.getElementById('inv-nombre').value = '';
  document.getElementById('inv-categoria').value = 'Pantallas';
  document.getElementById('inv-sku').value = '';
  document.getElementById('inv-stock').value = '1';
  document.getElementById('inv-minimo').value = '1';
  document.getElementById('inv-costo').value = '0';
  document.getElementById('inv-precio').value = '0';
  document.getElementById('titulo-form-inventario').innerHTML = '<i class="fa-solid fa-box-open"></i> Agregar Producto / Refacción';
  document.getElementById('btn-guardar-inv').innerHTML = '<i class="fa-solid fa-plus"></i> Guardar en Inventario';
  document.getElementById('btn-cancelar-edit-inv').classList.add('hidden');
}

function guardarItemInventario() {
  const idEdit = document.getElementById('inv-id-edit').value.trim();
  const nombre = document.getElementById('inv-nombre').value.trim();
  const categoria = document.getElementById('inv-categoria').value;
  const sku = document.getElementById('inv-sku').value.trim().toUpperCase();
  const stock = Math.max(0, parseInt(document.getElementById('inv-stock').value || '0', 10));
  const minimo = Math.max(0, parseInt(document.getElementById('inv-minimo').value || '0', 10));
  const costo = Math.max(0, parseFloat(document.getElementById('inv-costo').value || '0'));
  const precio = Math.max(0, parseFloat(document.getElementById('inv-precio').value || '0'));

  if (!nombre) {
    alert('Escribe el nombre o modelo de la refacción.');
    return;
  }

  if (idEdit) {
    const idx = inventarioTaller.findIndex(i => i.id === idEdit);
    if (idx >= 0) {
      inventarioTaller[idx] = { ...inventarioTaller[idx], nombre, categoria, sku, stock, minimo, costo, precio };
    }
  } else {
    inventarioTaller.push({
      id: 'inv-' + Date.now(),
      sku: sku || ('REF-' + String(inventarioTaller.length + 1).padStart(3, '0')),
      nombre,
      categoria,
      stock,
      minimo,
      costo,
      precio
    });
  }

  localStorage.setItem('redone_inventario_v3', JSON.stringify(inventarioTaller));
  limpiarFormInventario();
  renderizarInventarioConfig();
  actualizarContadoresPanelConfig();
}

function editarItemInventario(id) {
  const item = inventarioTaller.find(i => i.id === id);
  if (!item) return;
  document.getElementById('inv-id-edit').value = item.id;
  document.getElementById('inv-nombre').value = item.nombre;
  document.getElementById('inv-categoria').value = item.categoria || 'Pantallas';
  document.getElementById('inv-sku').value = item.sku || '';
  document.getElementById('inv-stock').value = item.stock;
  document.getElementById('inv-minimo').value = item.minimo;
  document.getElementById('inv-costo').value = item.costo;
  document.getElementById('inv-precio').value = item.precio;

  document.getElementById('titulo-form-inventario').innerHTML = `<i class="fa-solid fa-pen"></i> Editando Pieza`;
  document.getElementById('btn-guardar-inv').innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Actualizar Pieza';
  document.getElementById('btn-cancelar-edit-inv').classList.remove('hidden');
}

function ajustarStockInventario(id, delta) {
  const item = inventarioTaller.find(i => i.id === id);
  if (!item) return;
  item.stock = Math.max(0, Number(item.stock || 0) + delta);
  localStorage.setItem('redone_inventario_v3', JSON.stringify(inventarioTaller));
  renderizarInventarioConfig();
}

function eliminarItemInventario(id) {
  const item = inventarioTaller.find(i => i.id === id);
  if (!item) return;
  if (!confirm(`¿Eliminar "${item.nombre}" del inventario?`)) return;
  inventarioTaller = inventarioTaller.filter(i => i.id !== id);
  localStorage.setItem('redone_inventario_v3', JSON.stringify(inventarioTaller));
  renderizarInventarioConfig();
  actualizarContadoresPanelConfig();
}

function renderizarInventarioConfig() {
  const tbody = document.getElementById('tabla-inventario-config');
  if (!tbody) return;
  const q = (document.getElementById('buscador-inventario-cfg')?.value || '').toLowerCase().trim();

  let valorTotal = 0;
  inventarioTaller.forEach(i => {
    valorTotal += Number(i.stock || 0) * Number(i.costo || 0);
  });
  const badgeVal = document.getElementById('inv-valor-total-badge');
  if (badgeVal) badgeVal.textContent = `Valor Costo: $${valorTotal.toLocaleString('es-MX')} MXN`;

  const filtrados = inventarioTaller.filter(i =>
    !q || [i.nombre, i.sku, i.categoria].join(' ').toLowerCase().includes(q)
  );

  if (filtrados.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" class="p-6 text-center text-slate-500">No hay productos registrados con ese filtro.</td></tr>`;
    return;
  }

  tbody.innerHTML = filtrados.map(i => {
    const bajoStock = Number(i.stock) <= Number(i.minimo);
    return `
      <tr class="hover:bg-slate-800/40 transition">
        <td class="p-3">
          <span class="font-bold text-white block">${i.nombre}</span>
          <span class="font-mono text-[10px] text-slate-400">${i.sku || 'SIN-SKU'}</span>
        </td>
        <td class="p-3 text-slate-300">${i.categoria}</td>
        <td class="p-3 text-center">
          <div class="inline-flex items-center gap-1.5 bg-slate-950 border ${bajoStock ? 'border-rose-500/60' : 'border-slate-800'} rounded-lg px-2 py-1">
            <button type="button" onclick="ajustarStockInventario('${i.id}', -1)" class="text-slate-400 hover:text-white px-1 font-bold">-</button>
            <span class="font-mono font-black ${bajoStock ? 'text-rose-400' : 'text-emerald-400'} min-w-[20px]">${i.stock}</span>
            <button type="button" onclick="ajustarStockInventario('${i.id}', 1)" class="text-slate-400 hover:text-white px-1 font-bold">+</button>
          </div>
          ${bajoStock ? '<span class="block text-[9px] text-rose-400 font-bold mt-0.5">Stock bajo</span>' : ''}
        </td>
        <td class="p-3 text-right font-mono text-slate-300">$${Number(i.costo || 0).toLocaleString('es-MX')}</td>
        <td class="p-3 text-right font-mono font-bold text-sky-300">$${Number(i.precio || 0).toLocaleString('es-MX')}</td>
        <td class="p-3 text-right space-x-1">
          <button type="button" onclick="editarItemInventario('${i.id}')" class="bg-slate-800 hover:bg-sky-600 text-white px-2 py-1 rounded text-[11px]" title="Editar">
            <i class="fa-solid fa-pen"></i>
          </button>
          <button type="button" onclick="eliminarItemInventario('${i.id}')" class="bg-slate-800 hover:bg-rose-600 text-rose-300 hover:text-white px-2 py-1 rounded text-[11px]" title="Eliminar">
            <i class="fa-solid fa-trash"></i>
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

// =========================================================================
// 5. EXPORTAR E IMPORTAR RESPALDO COMPLETO DEL SISTEMA (.JSON)
// =========================================================================
function exportarRespaldoTotalJSON() {
  const respaldo = {
    version: 'RedOne-3.2',
    fechaExportacion: new Date().toISOString(),
    configNegocio,
    pinMaestro,
    tiendasConfig,
    empleadosConfig,
    inventarioTaller,
    tarifasTaller,
    etiquetasPersonalizadas,
    ordenes
  };

  const blob = new Blob([JSON.stringify(respaldo, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Respaldo_RedOne_${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function importarRespaldoTotalJSON(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const data = JSON.parse(e.target.result);
      if (!data || typeof data !== 'object') throw new Error('Archivo inválido');

      if (!confirm('¿Restaurar este respaldo? Se reemplazarán los datos actuales en este navegador.')) return;

      if (data.configNegocio) {
        configNegocio = { ...CONFIG_NEGOCIO_DEFAULT, ...data.configNegocio };
        localStorage.setItem('redone_config_negocio_v3', JSON.stringify(configNegocio));
      }
      if (data.pinMaestro) {
        pinMaestro = String(data.pinMaestro);
        localStorage.setItem('redone_pin_maestro_v3', pinMaestro);
      }
      if (Array.isArray(data.tiendasConfig)) {
        tiendasConfig = data.tiendasConfig;
        localStorage.setItem('redone_tiendas_config_v3', JSON.stringify(tiendasConfig));
      }
      if (Array.isArray(data.empleadosConfig)) {
        empleadosConfig = data.empleadosConfig;
        localStorage.setItem('redone_empleados_config_v3', JSON.stringify(empleadosConfig));
      }
      if (Array.isArray(data.inventarioTaller)) {
        inventarioTaller = data.inventarioTaller;
        localStorage.setItem('redone_inventario_v3', JSON.stringify(inventarioTaller));
      }
      if (data.tarifasTaller) {
        tarifasTaller = { ...TARIFAS_DEFAULT, ...data.tarifasTaller };
        localStorage.setItem('redone_tarifas_cotizador_v3', JSON.stringify(tarifasTaller));
      }
      if (data.etiquetasPersonalizadas) {
        etiquetasPersonalizadas = { ...ETIQUETAS_DEFAULT, ...data.etiquetasPersonalizadas };
        localStorage.setItem('redone_etiquetas_campos_v3_1', JSON.stringify(etiquetasPersonalizadas));
      }
      if (Array.isArray(data.ordenes)) {
        ordenes = data.ordenes;
        localStorage.setItem('redone_ordenes_v3', JSON.stringify(ordenes));
      }

      sincronizarUITiendasDinamicas();
      sincronizarDatalistEmpleados();
      aplicarEtiquetasPersonalizadas();
      aplicarConfiguracionNegocioEnTicket();
      refrescarPanelConfiguracion();
      actualizarContadores();
      renderizarDashboard();
      renderizarBandeja();
      renderizarVistaCortes();

      alert('✅ Respaldo restaurado exitosamente.');
    } catch (err) {
      alert('❌ No se pudo leer el archivo JSON de respaldo.');
    } finally {
      event.target.value = '';
    }
  };
  reader.readAsText(file);
}
