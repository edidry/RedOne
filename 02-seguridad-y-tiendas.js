// =========================================================================
// MÓDULO 02: AUTENTICACIÓN POR PIN (24H) Y ADMINISTRACIÓN DE TIENDAS
// =========================================================================

function abrirModalPin({ modo = 'tecnico', tiendaDestino = null, empleadoDestino = null, folioQRPendiente = null, alIniciar = false } = {}) {
  contextoPinPendiente = { modo, tiendaDestino, empleadoDestino, folioQRPendiente, alIniciar };

  const modal = document.getElementById('modal-pin');
  const titulo = document.getElementById('pin-titulo');
  const subtitulo = document.getElementById('pin-subtitulo');
  const selectWrap = document.getElementById('pin-selector-tienda-wrap');
  const selectTienda = document.getElementById('pin-select-tienda');
  const wrapRecordar = document.getElementById('wrap-recordar-pin');
  const btnIrTienda = document.getElementById('btn-pin-ir-tienda');
  const btnIrEmpleado = document.getElementById('btn-pin-ir-empleado');
  const btnCancelar = document.getElementById('btn-pin-cancelar');
  const secAcciones = document.getElementById('pin-acciones-secundarias');
  const iconBox = document.getElementById('pin-icono-box');
  const btnConfirmar = document.getElementById('btn-confirmar-pin');

  const nomTec = typeof obtenerNombreRol === 'function' ? obtenerNombreRol('tecnico') : 'Técnico';
  const nomEmp = typeof obtenerNombreRol === 'function' ? obtenerNombreRol('empleado') : 'Empleado';
  const nomTie = typeof obtenerNombreRol === 'function' ? obtenerNombreRol('tienda') : 'Tienda';

  if (btnIrTienda) btnIrTienda.innerHTML = `<i class="fa-solid fa-store text-sky-400"></i> Soy ${nomTie}`;
  if (btnIrEmpleado) btnIrEmpleado.innerHTML = `<i class="fa-solid fa-user-check text-emerald-400"></i> Soy ${nomEmp}`;

  document.getElementById('pin-error-msg').classList.add('hidden');
  const inputPin = document.getElementById('input-pin-acceso');
  inputPin.value = '';

  if (modo === 'tecnico') {
    iconBox.className = 'w-14 h-14 rounded-2xl bg-red-600/20 border border-red-500/40 text-red-400 flex items-center justify-center mx-auto text-2xl shadow-lg';
    iconBox.innerHTML = '<i class="fa-solid fa-shield-halved"></i>';
    titulo.textContent = `Acceso a Vista ${nomTec}`;
    subtitulo.textContent = folioQRPendiente
      ? `Ingresa el PIN maestro para abrir la orden ${folioQRPendiente} en modo ${nomTec}.`
      : 'Ingresa el PIN maestro para desbloquear el Dashboard Ejecutivo y control de taller.';
    selectWrap.classList.add('hidden');
    wrapRecordar.classList.remove('hidden');
    btnConfirmar.className = 'w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3 rounded-xl text-sm shadow-lg shadow-red-600/25 transition flex items-center justify-center gap-2';

    if (alIniciar) {
      secAcciones.className = 'grid grid-cols-2 gap-2 pt-1';
      if (btnIrTienda) btnIrTienda.classList.remove('hidden');
      if (btnIrEmpleado) btnIrEmpleado.classList.remove('hidden');
      btnCancelar.classList.add('hidden');
    } else {
      secAcciones.className = 'grid grid-cols-1 gap-2 pt-1';
      if (btnIrTienda) btnIrTienda.classList.add('hidden');
      if (btnIrEmpleado) btnIrEmpleado.classList.add('hidden');
      btnCancelar.classList.remove('hidden');
    }
  } else if (modo === 'empleado') {
    const activos = (Array.isArray(empleadosConfig) ? empleadosConfig : []).filter(e => e.estatus === 'Activo' && e.pin);
    iconBox.className = 'w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 flex items-center justify-center mx-auto text-2xl shadow-lg';
    iconBox.innerHTML = '<i class="fa-solid fa-user-check"></i>';
    titulo.textContent = `Acceso Modo ${nomEmp}`;
    wrapRecordar.classList.add('hidden');
    btnConfirmar.className = 'w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl text-sm shadow-lg shadow-emerald-600/25 transition flex items-center justify-center gap-2';

    if (activos.length === 0) {
      selectTienda.innerHTML = `<option value="">Sin perfiles activos con PIN</option>`;
    } else {
      selectTienda.innerHTML = activos.map(e =>
        `<option value="${e.id}" ${empleadoDestino === e.id ? 'selected' : ''}>${e.nombre} (${e.puesto} · ${e.sucursal})</option>`
      ).join('');
    }
    selectWrap.classList.remove('hidden');
    actualizarSubtituloPinTienda();

    secAcciones.className = 'grid grid-cols-1 gap-2 pt-1';
    if (btnIrTienda) btnIrTienda.classList.add('hidden');
    if (btnIrEmpleado) btnIrEmpleado.classList.add('hidden');
    btnCancelar.classList.remove('hidden');
  } else {
    iconBox.className = 'w-14 h-14 rounded-2xl bg-sky-500/20 border border-sky-400/40 text-sky-400 flex items-center justify-center mx-auto text-2xl shadow-lg';
    iconBox.innerHTML = '<i class="fa-solid fa-store"></i>';
    titulo.textContent = `Acceso Encargado de ${nomTie}`;
    wrapRecordar.classList.add('hidden');
    btnConfirmar.className = 'w-full bg-sky-600 hover:bg-sky-500 text-white font-bold py-3 rounded-xl text-sm shadow-lg shadow-sky-600/25 transition flex items-center justify-center gap-2';

    selectTienda.innerHTML = tiendasConfig.map(t =>
      `<option value="${t.nombre}" ${tiendaDestino === t.nombre ? 'selected' : ''}>${t.nombre}</option>`
    ).join('');
    selectWrap.classList.remove('hidden');
    actualizarSubtituloPinTienda();

    secAcciones.className = 'grid grid-cols-1 gap-2 pt-1';
    if (btnIrTienda) btnIrTienda.classList.add('hidden');
    if (btnIrEmpleado) btnIrEmpleado.classList.add('hidden');
    btnCancelar.classList.remove('hidden');
  }

  modal.classList.remove('hidden');
  setTimeout(() => inputPin.focus(), 80);
}

function actualizarSubtituloPinTienda() {
  const sel = document.getElementById('pin-select-tienda').value;
  const nomEmp = typeof obtenerNombreRol === 'function' ? obtenerNombreRol('empleado') : 'Empleado';
  if (contextoPinPendiente.modo === 'empleado') {
    const emp = (Array.isArray(empleadosConfig) ? empleadosConfig : []).find(e => e.id === sel);
    document.getElementById('pin-subtitulo').textContent = emp
      ? `Ingresa el PIN personal de "${emp.nombre}" para acceder a Recepción y Cotizador.`
      : `Selecciona un perfil de ${nomEmp} activo e ingresa su PIN personal.`;
    return;
  }
  document.getElementById('pin-subtitulo').textContent = `Ingresa el PIN exclusivo de "${sel}" para acceder únicamente a los equipos de esta sucursal.`;
}

function cerrarModalPin() {
  if (contextoPinPendiente.alIniciar) return;
  document.getElementById('modal-pin').classList.add('hidden');
}

function entrarModoTiendaDesdeLogin() {
  const primeraTienda = tiendasConfig[0]?.nombre || 'Ixmicel 1';
  abrirModalPin({ modo: 'tienda', tiendaDestino: primeraTienda, alIniciar: contextoPinPendiente.alIniciar });
}

function entrarModoEmpleadoDesdeLogin() {
  const primerEmp = (Array.isArray(empleadosConfig) ? empleadosConfig : []).find(e => e.estatus === 'Activo' && e.pin);
  abrirModalPin({ modo: 'empleado', empleadoDestino: primerEmp?.id || null, alIniciar: contextoPinPendiente.alIniciar });
}

function confirmarPinAcceso() {
  const pinIngresado = document.getElementById('input-pin-acceso').value.trim();
  const errEl = document.getElementById('pin-error-msg');

  if (contextoPinPendiente.modo === 'tecnico') {
    if (pinIngresado === pinMaestro) {
      if (document.getElementById('chk-recordar-pin-24h').checked) {
        guardarSesionPin24h();
      }
      contextoPinPendiente.alIniciar = false;
      window.empleadoAutenticadoActual = null;
      document.getElementById('modal-pin').classList.add('hidden');
      cambiarRol('tecnico');
      if (contextoPinPendiente.folioQRPendiente) {
        const folio = contextoPinPendiente.folioQRPendiente;
        contextoPinPendiente.folioQRPendiente = null;
        cargarOrdenParaEditar(folio, true);
      }
    } else {
      errEl.textContent = 'PIN maestro incorrecto.';
      errEl.classList.remove('hidden');
      document.getElementById('input-pin-acceso').select();
    }
  } else if (contextoPinPendiente.modo === 'empleado') {
    const empId = document.getElementById('pin-select-tienda').value;
    const emp = (Array.isArray(empleadosConfig) ? empleadosConfig : []).find(e => e.id === empId && e.estatus === 'Activo');
    if (emp && emp.pin && pinIngresado === String(emp.pin)) {
      contextoPinPendiente.alIniciar = false;
      tiendaAutenticadaActual = null;
      window.empleadoAutenticadoActual = emp;
      document.getElementById('modal-pin').classList.add('hidden');
      cambiarRol('empleado', emp.nombre);
    } else {
      errEl.textContent = emp ? `PIN incorrecto para ${emp.nombre}.` : 'Selecciona un empleado activo con PIN configurado.';
      errEl.classList.remove('hidden');
      document.getElementById('input-pin-acceso').select();
    }
  } else {
    const tiendaElegida = document.getElementById('pin-select-tienda').value;
    const cfg = obtenerConfigTienda(tiendaElegida);
    if (pinIngresado === String(cfg.pin)) {
      contextoPinPendiente.alIniciar = false;
      window.empleadoAutenticadoActual = null;
      document.getElementById('modal-pin').classList.add('hidden');
      tiendaAutenticadaActual = cfg.nombre;
      cambiarRol('tienda', cfg.nombre);
    } else {
      errEl.textContent = `PIN incorrecto para la tienda ${tiendaElegida}.`;
      errEl.classList.remove('hidden');
      document.getElementById('input-pin-acceso').select();
    }
  }
}

function solicitarCambioATecnico() {
  if (rolActual === 'tecnico') {
    cambiarPestana('dashboard');
    return;
  }
  if (tieneSesionPin24hValida()) {
    cambiarRol('tecnico');
  } else {
    abrirModalPin({ modo: 'tecnico' });
  }
}

function solicitarCambioATienda(forzarSelector = false) {
  if (rolActual === 'tienda' && !forzarSelector) {
    cambiarPestana('registro');
    return;
  }
  const destino = (tiendaAutenticadaActual && !forzarSelector)
    ? tiendaAutenticadaActual
    : (tiendasConfig[0]?.nombre || 'Ixmicel 1');
  abrirModalPin({ modo: 'tienda', tiendaDestino: destino });
}

function solicitarCambioAEmpleado(forzarSelector = false) {
  if (rolActual === 'empleado' && !forzarSelector) {
    cambiarPestana('registro');
    return;
  }
  const activos = (Array.isArray(empleadosConfig) ? empleadosConfig : []).filter(e => e.estatus === 'Activo' && e.pin);
  const destino = (window.empleadoAutenticadoActual && !forzarSelector)
    ? window.empleadoAutenticadoActual.id
    : (activos[0]?.id || null);
  abrirModalPin({ modo: 'empleado', empleadoDestino: destino });
}

// =========================================================================
// ADMINISTRACIÓN DE TIENDAS ALIADAS Y PINES (INTEGRADA EN PANEL CONFIG)
// =========================================================================
function abrirModalAdminTiendas() {
  if (rolActual !== 'tecnico') {
    abrirModalPin({ modo: 'tecnico' });
    return;
  }
  cambiarPestana('configuracion');
  if (typeof cambiarSubtabConfig === 'function') {
    cambiarSubtabConfig('tiendas');
  }
}

function guardarPinMaestro() {
  const nuevo = document.getElementById('admin-pin-maestro').value.trim();
  if (nuevo.length < 4) {
    alert('El PIN maestro debe tener al menos 4 dígitos.');
    return;
  }
  pinMaestro = nuevo;
  localStorage.setItem('redone_pin_maestro_v3', pinMaestro);
  alert('✅ PIN maestro actualizado correctamente.');
}

function limpiarFormTiendaAdmin() {
  document.getElementById('admin-tienda-id-edit').value = '';
  document.getElementById('admin-tienda-nombre').value = '';
  document.getElementById('admin-tienda-color').value = 'sky';
  document.getElementById('admin-tienda-wa').value = '';
  document.getElementById('admin-tienda-pin').value = '';
  document.getElementById('titulo-form-tienda-admin').innerHTML = '<i class="fa-solid fa-store"></i> Dar de Alta Nueva Tienda Aliada';
  document.getElementById('btn-guardar-tienda-admin').innerHTML = '<i class="fa-solid fa-plus"></i> Guardar Tienda Aliada';
  document.getElementById('btn-cancelar-edicion-tienda').classList.add('hidden');
}

function editarTiendaAdmin(id) {
  const t = tiendasConfig.find(item => item.id === id);
  if (!t) return;
  document.getElementById('admin-tienda-id-edit').value = t.id;
  document.getElementById('admin-tienda-nombre').value = t.nombre;
  document.getElementById('admin-tienda-color').value = t.color || 'sky';
  document.getElementById('admin-tienda-wa').value = t.whatsapp || '';
  document.getElementById('admin-tienda-pin').value = t.pin || '';
  document.getElementById('titulo-form-tienda-admin').innerHTML = `<i class="fa-solid fa-pen"></i> Editando Tienda: ${t.nombre}`;
  document.getElementById('btn-guardar-tienda-admin').innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Guardar Cambios de Tienda';
  document.getElementById('btn-cancelar-edicion-tienda').classList.remove('hidden');
}

function eliminarTiendaAdmin(id) {
  if (tiendasConfig.length <= 1) {
    alert('Debe existir al menos una tienda aliada configurada.');
    return;
  }
  const t = tiendasConfig.find(item => item.id === id);
  if (!t) return;
  if (!confirm(`¿Dar de baja y eliminar la tienda aliada "${t.nombre}"? Sus órdenes históricas conservarán el nombre en el registro.`)) return;
  tiendasConfig = tiendasConfig.filter(item => item.id !== id);
  localStorage.setItem('redone_tiendas_config_v3', JSON.stringify(tiendasConfig));
  sincronizarUITiendasDinamicas();
  renderizarListaTiendasAdmin();
  if (typeof renderizarPinesRapidosTiendas === 'function') renderizarPinesRapidosTiendas();
  if (typeof actualizarContadoresPanelConfig === 'function') actualizarContadoresPanelConfig();
}

function guardarTiendaAliada() {
  const idEdit = document.getElementById('admin-tienda-id-edit').value.trim();
  const nombre = document.getElementById('admin-tienda-nombre').value.trim();
  const color = document.getElementById('admin-tienda-color').value;
  const whatsapp = document.getElementById('admin-tienda-wa').value.replace(/\D/g, '').slice(0, 10);
  const pin = document.getElementById('admin-tienda-pin').value.trim();

  if (!nombre || nombre.toLowerCase() === 'redone') {
    alert('Ingresa un nombre válido para la tienda aliada (distinto a RedOne).');
    return;
  }
  if (pin.length < 4) {
    alert('El PIN exclusivo de la tienda debe tener al menos 4 dígitos.');
    return;
  }

  const duplicada = tiendasConfig.find(t => t.nombre.toLowerCase() === nombre.toLowerCase() && t.id !== idEdit);
  if (duplicada) {
    alert('Ya existe otra tienda con ese mismo nombre.');
    return;
  }

  if (idEdit) {
    const idx = tiendasConfig.findIndex(t => t.id === idEdit);
    if (idx >= 0) {
      const nombreAnterior = tiendasConfig[idx].nombre;
      tiendasConfig[idx] = { ...tiendasConfig[idx], nombre, color, whatsapp, pin };
      if (origenActual === nombreAnterior) origenActual = nombre;
    }
  } else {
    const nuevoId = 'tienda-' + Date.now();
    tiendasConfig.push({ id: nuevoId, nombre, color, whatsapp, pin });
  }

  localStorage.setItem('redone_tiendas_config_v3', JSON.stringify(tiendasConfig));
  limpiarFormTiendaAdmin();
  sincronizarUITiendasDinamicas();
  renderizarListaTiendasAdmin();
  if (typeof renderizarPinesRapidosTiendas === 'function') renderizarPinesRapidosTiendas();
  if (typeof actualizarContadoresPanelConfig === 'function') actualizarContadoresPanelConfig();
}

function renderizarListaTiendasAdmin() {
  const cont = document.getElementById('lista-tiendas-admin');
  if (!cont) return;
  cont.innerHTML = tiendasConfig.map(t => {
    const paleta = PALETAS_COLOR[t.color] || PALETAS_COLOR.sky;
    return `
      <div class="bg-slate-950 border border-slate-800 rounded-xl p-3 flex flex-wrap items-center justify-between gap-2">
        <div class="flex items-center gap-2.5 flex-wrap">
          <span class="text-xs font-bold px-2.5 py-1 rounded-full border ${paleta.badgeBandeja}">
            <i class="fa-solid fa-store mr-1"></i> ${t.nombre}
          </span>
          <span class="text-xs text-slate-300 font-mono bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
            PIN: <strong class="text-amber-300">${t.pin}</strong>
          </span>
          <span class="text-xs text-slate-400">
            ${t.whatsapp ? `<i class="fa-brands fa-whatsapp text-emerald-400 mr-1"></i>${t.whatsapp}` : 'Sin WhatsApp'}
          </span>
        </div>
        <div class="flex items-center gap-1.5">
          <button type="button" onclick="editarTiendaAdmin('${t.id}')"
            class="text-xs bg-slate-800 hover:bg-sky-600 text-white px-2.5 py-1.5 rounded-lg transition">
            <i class="fa-solid fa-pen"></i> Editar
          </button>
          <button type="button" onclick="eliminarTiendaAdmin('${t.id}')"
            class="text-xs bg-slate-800 hover:bg-rose-600 text-rose-300 hover:text-white px-2.5 py-1.5 rounded-lg transition" title="Dar de baja tienda">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      </div>
    `;
  }).join('');
}

function sincronizarUITiendasDinamicas() {
  const contOrigen = document.getElementById('contenedor-botones-origen');
  if (contOrigen) {
    let htmlBotones = `
      <button type="button" onclick="seleccionarOrigen('RedOne')" id="btn-origen-RedOne"
        class="origen-btn bg-red-600 text-white border border-red-500 rounded-xl py-2.5 px-3 text-xs font-semibold shadow-md transition flex flex-col items-center gap-1">
        <i class="fa-solid fa-wrench text-sm"></i>
        <span>RedOne</span>
      </button>
    `;
    tiendasConfig.forEach(t => {
      const paleta = PALETAS_COLOR[t.color] || PALETAS_COLOR.sky;
      htmlBotones += `
        <button type="button" onclick="seleccionarOrigen('${t.nombre.replace(/'/g, "\'")}')" id="btn-origen-${t.nombre}"
          class="origen-btn bg-slate-950 text-slate-300 border border-slate-800 hover:border-slate-600 rounded-xl py-2.5 px-3 text-xs font-semibold transition flex flex-col items-center gap-1">
          <i class="fa-solid fa-store ${paleta.iconText} text-sm"></i>
          <span>${t.nombre}</span>
        </button>
      `;
    });
    contOrigen.innerHTML = htmlBotones;
  }

  const filtroBandeja = document.getElementById('filtro-tienda');
  if (filtroBandeja) {
    const valPrev = filtroBandeja.value;
    filtroBandeja.innerHTML = `<option value="TODAS">Todas las tiendas</option><option value="RedOne">RedOne (Directo)</option>` +
      tiendasConfig.map(t => `<option value="${t.nombre}">${t.nombre}</option>`).join('');
    if ([...filtroBandeja.options].some(o => o.value === valPrev)) filtroBandeja.value = valPrev;
  }

  const filtroCorte = document.getElementById('corte-filtro-tienda');
  if (filtroCorte) {
    const valPrev = filtroCorte.value;
    filtroCorte.innerHTML = `<option value="TODAS">Todas las tiendas aliadas</option>` +
      tiendasConfig.map(t => `<option value="${t.nombre}">${t.nombre}</option>`).join('');
    if ([...filtroCorte.options].some(o => o.value === valPrev)) filtroCorte.value = valPrev;
  }

  const cotSucursal = document.getElementById('cot-sucursal-destino');
  if (cotSucursal) {
    const valPrev = cotSucursal.value;
    cotSucursal.innerHTML = tiendasConfig.map(t => `<option value="${t.nombre}">${t.nombre}</option>`).join('');
    if ([...cotSucursal.options].some(o => o.value === valPrev)) cotSucursal.value = valPrev;
  }

  const empSucursal = document.getElementById('emp-sucursal');
  if (empSucursal) {
    const valPrev = empSucursal.value;
    empSucursal.innerHTML = `<option value="RedOne">RedOne (Taller Matriz)</option>` +
      tiendasConfig.map(t => `<option value="${t.nombre}">${t.nombre}</option>`).join('');
    if ([...empSucursal.options].some(o => o.value === valPrev)) empSucursal.value = valPrev;
  }

  seleccionarOrigen(origenActual, true);
  renderizarDashboard();
  renderizarBandeja();
  renderizarVistaCortes();
}
