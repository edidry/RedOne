// =========================================================================
// MÓDULO 04: COTIZADOR, EXTRAS DINÁMICOS Y TARIFAS BASE
// =========================================================================

// =========================================================================
// EXTRAS DINÁMICOS MÚLTIPLES EN PRESUPUESTOS
// =========================================================================
function agregarExtraPresupuesto(nombre = '', pieza = 0, mo = 250) {
  const id = 'ext-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
  extrasPresupuesto.push({
    id,
    nombre: nombre || 'Cambio de tapa trasera',
    pieza: Number(pieza) || 0,
    mo: Number(mo) || 0
  });
  renderizarExtrasDinamicos();
  calcularPresupuesto();
}

function eliminarExtraPresupuesto(id) {
  extrasPresupuesto = extrasPresupuesto.filter(e => e.id !== id);
  renderizarExtrasDinamicos();
  calcularPresupuesto();
}

function actualizarCampoExtra(id, campo, valor) {
  const item = extrasPresupuesto.find(e => e.id === id);
  if (!item) return;
  if (campo === 'nombre') {
    item.nombre = valor;
  } else {
    item[campo] = parseFloat(valor) || 0;
  }
  calcularPresupuesto();
}

function aplicarAtajoAExtra(id, nombre, pieza, mo) {
  const item = extrasPresupuesto.find(e => e.id === id);
  if (!item) return;
  item.nombre = nombre;
  item.pieza = pieza;
  item.mo = mo;
  renderizarExtrasDinamicos();
  calcularPresupuesto();
}

function renderizarExtrasDinamicos() {
  const cont = document.getElementById('contenedor-extras-dinamicos');
  const lblBtn = document.getElementById('lbl-btn-agregar-extra');

  if (extrasPresupuesto.length === 0) {
    lblBtn.textContent = 'Agregar Extra';
    cont.innerHTML = '';
    return;
  }

  lblBtn.textContent = `Agregar Otro Extra (${extrasPresupuesto.length})`;

  cont.innerHTML = extrasPresupuesto.map((ext, idx) => `
    <div class="bg-slate-950/90 border border-amber-500/40 rounded-xl p-3 space-y-2.5">
      <div class="flex items-center justify-between">
        <span class="text-xs font-bold text-amber-300">
          <i class="fa-solid fa-wrench mr-1"></i> Extra #${idx + 1}
        </span>
        <button type="button" onclick="eliminarExtraPresupuesto('${ext.id}')"
          class="text-[11px] bg-rose-500/15 hover:bg-rose-600 text-rose-300 hover:text-white px-2.5 py-1 rounded-lg border border-rose-500/30 transition flex items-center gap-1">
          <i class="fa-solid fa-trash-can"></i> Quitar
        </button>
      </div>

      <div class="flex flex-wrap gap-1.5">
        <button type="button" onclick="aplicarAtajoAExtra('${ext.id}', 'Cambio de tapa trasera', 180, 200)" class="text-[10px] bg-slate-900 hover:bg-amber-600/30 text-amber-200 px-2 py-0.5 rounded border border-amber-500/30">Tapa trasera</button>
        <button type="button" onclick="aplicarAtajoAExtra('${ext.id}', 'Cambio de centro de carga', 90, 250)" class="text-[10px] bg-slate-900 hover:bg-amber-600/30 text-amber-200 px-2 py-0.5 rounded border border-amber-500/30">Centro carga</button>
        <button type="button" onclick="aplicarAtajoAExtra('${ext.id}', 'Cambio de botón / flex', 80, 220)" class="text-[10px] bg-slate-900 hover:bg-amber-600/30 text-amber-200 px-2 py-0.5 rounded border border-amber-500/30">Botón / Flex</button>
        <button type="button" onclick="aplicarAtajoAExtra('${ext.id}', 'Cambio de batería', 250, 250)" class="text-[10px] bg-slate-900 hover:bg-amber-600/30 text-amber-200 px-2 py-0.5 rounded border border-amber-500/30">Batería</button>
        <button type="button" onclick="aplicarAtajoAExtra('${ext.id}', 'Limpieza y mantenimiento general', 0, 250)" class="text-[10px] bg-slate-900 hover:bg-amber-600/30 text-amber-200 px-2 py-0.5 rounded border border-amber-500/30">Limpieza</button>
        <button type="button" onclick="aplicarAtajoAExtra('${ext.id}', 'Cambio de bocina / altavoz', 100, 220)" class="text-[10px] bg-slate-900 hover:bg-amber-600/30 text-amber-200 px-2 py-0.5 rounded border border-amber-500/30">Bocina</button>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <div>
          <label class="block text-[10px] text-amber-200/80 mb-1">Concepto / Servicio *</label>
          <input type="text" value="${ext.nombre.replace(/"/g, '&quot;')}" oninput="actualizarCampoExtra('${ext.id}', 'nombre', this.value)"
            class="w-full bg-slate-900 border border-amber-700/60 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-white focus:outline-none focus:border-amber-400">
        </div>
        <div>
          <label class="block text-[10px] text-amber-200/80 mb-1">Costo Refacción ($)</label>
          <input type="number" min="0" value="${ext.pieza}" oninput="actualizarCampoExtra('${ext.id}', 'pieza', this.value)"
            class="w-full bg-slate-900 border border-amber-700/60 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-white focus:outline-none focus:border-amber-400">
        </div>
        <div>
          <label class="block text-[10px] text-amber-200/80 mb-1">Mano de Obra ($)</label>
          <input type="number" min="0" value="${ext.mo}" oninput="actualizarCampoExtra('${ext.id}', 'mo', this.value)"
            class="w-full bg-slate-900 border border-amber-700/60 rounded-lg px-2.5 py-1.5 text-xs font-bold text-amber-300 focus:outline-none focus:border-amber-400">
        </div>
      </div>
    </div>
  `).join('');
}

// =========================================================================
// LÓGICA DEL MÓDULO DE PRESUPUESTOS (CAMBIOS 2, 3, 4 Y 5)
// =========================================================================
function actualizarEtiquetasTarifas() {
  document.getElementById('badge-mo-baja').textContent = `+$${tarifasTaller.androidBaja} M.O.`;
  document.getElementById('badge-mo-media').textContent = `+$${tarifasTaller.androidMedia} M.O.`;
  document.getElementById('badge-mo-alta').textContent = `+$${tarifasTaller.androidAlta} M.O.`;
  document.getElementById('badge-mo-ip-home').textContent = `+$${Number(tarifasTaller.iphoneHome).toLocaleString('es-MX')} M.O.`;
  document.getElementById('badge-mo-ip-faceid').textContent = `+$${Number(tarifasTaller.iphoneFaceid).toLocaleString('es-MX')} M.O.`;
  document.getElementById('badge-mo-ip-pro').textContent = `+$${Number(tarifasTaller.iphonePro).toLocaleString('es-MX')} M.O.`;
  document.getElementById('lbl-porc-tienda').textContent = descuentoTiendaPctActual;
}

function sincronizarDescuentoTiendaManual(val) {
  let num = parseFloat(val);
  if (isNaN(num)) num = 0;
  num = Math.max(0, Math.min(100, num));
  descuentoTiendaPctActual = num;
  document.getElementById('cot-descuento-tienda-manual').value = num;
  document.getElementById('lbl-porc-tienda').textContent = num;
  calcularPresupuesto();
}

function setPresetDescuentoTienda(pct) {
  sincronizarDescuentoTiendaManual(pct);
}

function seleccionarCategoriaPresupuesto(cat) {
  catPresupuestoActual = cat;

  ['celular', 'laptop', 'impresora', 'otros'].forEach(c => {
    const btn = document.getElementById(`cat-pres-${c}`);
    if (c === cat) {
      btn.className = 'bg-emerald-600 text-white border border-emerald-400 rounded-xl py-3 px-2.5 text-xs font-bold shadow-md transition flex flex-col items-center gap-1.5';
    } else {
      btn.className = 'bg-slate-950 text-slate-300 border border-slate-800 hover:border-slate-600 rounded-xl py-3 px-2.5 text-xs font-semibold transition flex flex-col items-center gap-1.5';
    }
  });

  document.getElementById('bloque-cot-celular').classList.toggle('hidden', cat !== 'celular');
  document.getElementById('bloque-cot-laptop').classList.toggle('hidden', cat !== 'laptop');
  document.getElementById('bloque-cot-impresora').classList.toggle('hidden', cat !== 'impresora');
  document.getElementById('bloque-cot-otros').classList.toggle('hidden', cat !== 'otros');
  document.getElementById('caja-mo-celular').classList.toggle('hidden', cat !== 'celular');

  if (cat === 'celular') {
    actualizarManoObraCelularSugerida();
  }
  calcularPresupuesto();
}

function seleccionarModoReparacionCelular(modo) {
  modoReparacionCelular = modo;
  const btnPant = document.getElementById('btn-modo-cel-pantalla');
  const btnRef = document.getElementById('btn-modo-cel-refaccion');

  if (modo === 'pantalla') {
    btnPant.className = 'bg-emerald-500/15 text-emerald-200 border-2 border-emerald-400 rounded-xl p-3 text-left transition flex items-center gap-3';
    btnRef.className = 'bg-slate-950 text-slate-300 border border-slate-800 hover:border-amber-400/60 rounded-xl p-3 text-left transition flex items-center gap-3';
    document.getElementById('subpanel-cel-pantalla').classList.remove('hidden');
    document.getElementById('subpanel-cel-refaccion').classList.add('hidden');
  } else {
    btnRef.className = 'bg-amber-500/15 text-amber-200 border-2 border-amber-400 rounded-xl p-3 text-left transition flex items-center gap-3';
    btnPant.className = 'bg-slate-950 text-slate-300 border border-slate-800 hover:border-emerald-400/60 rounded-xl p-3 text-left transition flex items-center gap-3';
    document.getElementById('subpanel-cel-refaccion').classList.remove('hidden');
    document.getElementById('subpanel-cel-pantalla').classList.add('hidden');
  }
  calcularPresupuesto();
}

function seleccionarSubtipoRefaccion(nombre, botonEl) {
  document.getElementById('cot-ref-nombre').value = nombre;
  document.querySelectorAll('.ref-sub-btn').forEach(btn => {
    btn.className = 'ref-sub-btn bg-slate-900 text-slate-300 border border-slate-800 hover:border-amber-500/50 rounded-lg p-2 text-left transition text-xs font-semibold';
  });
  if (botonEl) {
    botonEl.className = 'ref-sub-btn bg-amber-600 text-white border border-amber-400 rounded-lg p-2 text-left transition text-xs font-bold';
  }
  calcularPresupuesto();
}

function seleccionarMargenIncell(pct) {
  margenIncellPct = pct;
  [0, 20, 25, 30, 50].forEach(val => {
    const btn = document.getElementById(`mrg-incell-${val}`);
    if (btn) {
      btn.className = val === pct
        ? 'mrg-incell-btn bg-cyan-600 text-white border border-cyan-400 rounded-md py-1 text-[11px] font-bold transition shadow'
        : 'mrg-incell-btn bg-slate-900 text-slate-300 border border-slate-700 rounded-md py-1 text-[11px] font-semibold transition';
    }
  });
  document.querySelectorAll('.sync-margen-incell').forEach(el => el.textContent = pct);
  calcularPresupuesto();
}

function seleccionarMargenOled(pct) {
  margenOledPct = pct;
  [0, 20, 25, 30, 50].forEach(val => {
    const btn = document.getElementById(`mrg-oled-${val}`);
    if (btn) {
      btn.className = val === pct
        ? 'mrg-oled-btn bg-emerald-600 text-white border border-emerald-400 rounded-md py-1 text-[11px] font-bold transition shadow'
        : 'mrg-oled-btn bg-slate-900 text-slate-300 border border-slate-700 rounded-md py-1 text-[11px] font-semibold transition';
    }
  });
  document.querySelectorAll('.sync-margen-oled').forEach(el => el.textContent = pct);
  calcularPresupuesto();
}

function seleccionarMargenRefaccion(pct) {
  margenRefaccionPct = pct;
  [0, 20, 25, 30, 50].forEach(val => {
    const btn = document.getElementById(`mrg-ref-${val}`);
    if (btn) {
      btn.className = val === pct
        ? 'mrg-ref-btn bg-amber-600 text-white border border-amber-400 rounded-lg py-1.5 text-xs font-bold transition shadow'
        : 'mrg-ref-btn bg-slate-900 text-slate-300 border border-slate-700 rounded-lg py-1.5 text-xs font-semibold transition';
    }
  });
  calcularPresupuesto();
}

function seleccionarDescuentoCliente(pct) {
  descuentoClientePct = pct;
  [0, 10, 20, 30, 40].forEach(val => {
    const btn = document.getElementById(`desc-btn-${val}`);
    if (btn) {
      if (val === pct) {
        btn.className = val >= 20
          ? 'desc-btn bg-amber-500 text-slate-950 border border-amber-300 rounded-lg py-1.5 text-xs font-black transition shadow'
          : 'desc-btn bg-emerald-600 text-white border border-emerald-400 rounded-lg py-1.5 text-xs font-bold transition shadow';
      } else {
        btn.className = val >= 20
          ? 'desc-btn bg-slate-900 text-amber-300 border border-slate-700 rounded-lg py-1.5 text-xs font-semibold transition'
          : 'desc-btn bg-slate-900 text-slate-300 border border-slate-700 rounded-lg py-1.5 text-xs font-semibold transition';
      }
    }
  });

  const esGarantia50 = (pct >= 20);
  const alerta = document.getElementById('alerta-garantia-reducida');
  const badge = document.getElementById('badge-garantia-actual');
  const boxResumen = document.getElementById('box-garantia-resumen');

  if (esGarantia50) {
    alerta.classList.remove('hidden');
    badge.innerHTML = '<i class="fa-solid fa-triangle-exclamation mr-1"></i> Garantía al 50% (Descuento aplicado)';
    badge.className = 'text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40';
    boxResumen.className = 'bg-amber-950/35 border border-amber-500/50 rounded-xl p-3 text-[11px] text-amber-200 space-y-1';
    document.getElementById('lbl-titulo-garantia-resumen').innerHTML = '<i class="fa-solid fa-triangle-exclamation text-amber-400"></i> Aviso de Garantía al 50% por Descuento Aplicado';
    document.getElementById('lbl-texto-garantia-resumen').textContent = 'A partir de este momento, el cliente gozará solo del 50% de garantía en caso de que falle la pieza o servicio. El cliente cubre el 50% del costo de reposición y no aplica garantía del 100%.';
  } else {
    alerta.classList.add('hidden');
    badge.innerHTML = '<i class="fa-solid fa-certificate mr-1"></i> Garantía al 100%';
    badge.className = 'text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40';
    boxResumen.className = 'bg-emerald-950/30 border border-emerald-500/40 rounded-xl p-3 text-[11px] text-emerald-200 space-y-1';
    document.getElementById('lbl-titulo-garantia-resumen').innerHTML = '<i class="fa-solid fa-shield-halved text-emerald-400"></i> Garantía del 100% Incluida';
    document.getElementById('lbl-texto-garantia-resumen').textContent = 'Cubre defectos de fábrica o falla de la pieza sin costo adicional. (No aplica por golpes, humedad o presión).';
  }

  calcularPresupuesto();
}

function seleccionarTipoClienteCot(tipo) {
  tipoClienteCot = tipo;
  const esTienda = (tipo === 'tienda');

  document.getElementById('btn-tarifa-publico').className = !esTienda
    ? 'px-3 py-1 rounded-lg bg-emerald-600 text-white font-semibold transition'
    : 'px-3 py-1 rounded-lg text-slate-400 hover:text-white font-semibold transition';

  document.getElementById('btn-tarifa-tienda').className = esTienda
    ? 'px-3 py-1 rounded-lg bg-sky-500 text-slate-950 font-bold transition'
    : 'px-3 py-1 rounded-lg text-slate-400 hover:text-white font-semibold transition';

  document.getElementById('bloque-selector-sucursal-cot').classList.toggle('hidden', !esTienda);
  document.getElementById('lbl-cot-cliente').textContent = esTienda
    ? 'Encargado de Tienda que recibe'
    : (etiquetasPersonalizadas.cotCliente || 'Nombre Cliente Directo');
  document.getElementById('cot-cliente').placeholder = esTienda
    ? 'Ej. Carlos M. (Encargado)'
    : 'Opcional (ej. Luis)';

  const badge = document.getElementById('badge-tipo-tarifa-resumen');
  if (esTienda) {
    const suc = document.getElementById('cot-sucursal-destino')?.value || '';
    badge.textContent = `${suc || 'Tienda'} (-${descuentoTiendaPctActual}% base)`;
    badge.className = 'text-[11px] font-bold px-2.5 py-1 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/40';
  } else {
    badge.textContent = 'Precio Público';
    badge.className = 'text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30';
  }
  calcularPresupuesto();
}

function seleccionarPlataformaCelular(plat) {
  plataformaCelular = plat;
  const btnAnd = document.getElementById('btn-plat-android');
  const btnIp = document.getElementById('btn-plat-iphone');

  if (plat === 'android') {
    btnAnd.className = 'bg-cyan-500/15 text-cyan-200 border-2 border-cyan-400 rounded-xl p-3 text-left transition flex items-center gap-3';
    btnIp.className = 'bg-slate-950 text-slate-300 border border-slate-800 hover:border-amber-400/60 rounded-xl p-3 text-left transition flex items-center gap-3';
    document.getElementById('selector-gama-android').classList.remove('hidden');
    document.getElementById('selector-perfil-iphone').classList.add('hidden');
  } else {
    btnIp.className = 'bg-amber-500/15 text-amber-200 border-2 border-amber-400 rounded-xl p-3 text-left transition flex items-center gap-3';
    btnAnd.className = 'bg-slate-950 text-slate-300 border border-slate-800 hover:border-cyan-400/60 rounded-xl p-3 text-left transition flex items-center gap-3';
    document.getElementById('selector-perfil-iphone').classList.remove('hidden');
    document.getElementById('selector-gama-android').classList.add('hidden');
    if (!document.getElementById('cot-marca').value) {
      document.getElementById('cot-marca').value = 'Apple / iPhone';
    }
  }
  actualizarManoObraCelularSugerida();
  calcularPresupuesto();
}

function seleccionarGamaAndroid(gama) {
  gamaAndroid = gama;
  ['baja', 'media', 'alta'].forEach(g => {
    const el = document.getElementById(`gama-android-${g}`);
    el.className = g === gama
      ? 'gama-btn bg-cyan-600 text-white border border-cyan-400 rounded-lg p-2.5 text-left transition'
      : 'gama-btn bg-slate-900 text-slate-300 border border-slate-800 hover:border-cyan-500/50 rounded-lg p-2.5 text-left transition';
  });
  actualizarManoObraCelularSugerida();
  calcularPresupuesto();
}

function seleccionarPerfilIphone(perfil) {
  perfilIphone = perfil;
  ['home', 'faceid', 'pro'].forEach(p => {
    const el = document.getElementById(`perfil-iphone-${p}`);
    el.className = p === perfil
      ? 'iphone-btn bg-amber-600 text-white border border-amber-400 rounded-lg p-2.5 text-left transition flex flex-col justify-between'
      : 'iphone-btn bg-slate-900 text-slate-300 border border-slate-800 hover:border-amber-500/50 rounded-lg p-2.5 text-left transition flex flex-col justify-between';
  });
  actualizarManoObraCelularSugerida();
  calcularPresupuesto();
}

function actualizarManoObraCelularSugerida() {
  let mo = 350;
  if (plataformaCelular === 'android') {
    if (gamaAndroid === 'baja') mo = tarifasTaller.androidBaja;
    else if (gamaAndroid === 'media') mo = tarifasTaller.androidMedia;
    else mo = tarifasTaller.androidAlta;
  } else {
    if (perfilIphone === 'home') mo = tarifasTaller.iphoneHome;
    else if (perfilIphone === 'faceid') mo = tarifasTaller.iphoneFaceid;
    else mo = tarifasTaller.iphonePro;
  }
  document.getElementById('cot-mo-manual').value = mo;
}

function alternarDobleOpcionPantalla() {
  const doble = document.getElementById('cot-doble-opcion').checked;
  document.getElementById('caja-costo-incell').classList.toggle('hidden', !doble);
  document.getElementById('grid-pantallas-independientes').className = doble
    ? 'grid grid-cols-1 md:grid-cols-2 gap-3'
    : 'grid grid-cols-1 gap-3';
  document.getElementById('lbl-costo-pieza-principal').innerHTML = doble
    ? '<i class="fa-solid fa-gem"></i> Opción 2: OLED ($)'
    : '<i class="fa-solid fa-mobile-screen-button"></i> Pantalla Única ($)';
  document.getElementById('lbl-margen-pieza-principal').textContent = doble
    ? '% Extra Fondo de Garantía (OLED):'
    : '% Extra Fondo de Garantía (Pantalla):';
  calcularPresupuesto();
}

function seleccionarServicioLaptop(srv) {
  servicioLaptop = srv;
  ['display', 'mantto', 'gamer', 'upgrade', 'software'].forEach(s => {
    const btn = document.getElementById(`srv-lap-${s}`);
    if (btn) {
      btn.className = s === srv
        ? 'lap-srv-btn bg-sky-600 text-white border border-sky-400 rounded-xl p-2.5 text-left transition'
        : 'lap-srv-btn bg-slate-950 text-slate-300 border border-slate-800 hover:border-sky-500/50 rounded-xl p-2.5 text-left transition';
    }
  });

  document.getElementById('bloque-software-laptop').classList.toggle('hidden', srv !== 'software');

  if (srv === 'display') document.getElementById('cot-lap-mo').value = tarifasTaller.laptopDisplay;
  else if (srv === 'mantto') document.getElementById('cot-lap-mo').value = tarifasTaller.laptopMantto;
  else if (srv === 'gamer') document.getElementById('cot-lap-mo').value = tarifasTaller.laptopMantto + 250;
  else if (srv === 'software') {
    document.getElementById('cot-lap-pieza').value = 0;
    document.getElementById('cot-lap-mo').value = 300;
  } else {
    document.getElementById('cot-lap-mo').value = 350;
  }

  calcularPresupuesto();
}

function setSoftwareLaptop(texto) {
  document.getElementById('cot-lap-software-desc').value = texto;
  calcularPresupuesto();
}

function seleccionarServicioImpresora(srv) {
  servicioImpresora = srv;
  ['reset', 'caja', 'cabezal', 'otro'].forEach(s => {
    const btn = document.getElementById(`srv-imp-${s}`);
    btn.className = s === srv
      ? 'imp-srv-btn bg-amber-600 text-white border border-amber-400 rounded-xl p-2.5 text-left transition'
      : 'imp-srv-btn bg-slate-950 text-slate-300 border border-slate-800 hover:border-amber-500/50 rounded-xl p-2.5 text-left transition';
  });

  if (srv === 'reset') {
    document.getElementById('cot-imp-pieza').value = 0;
    document.getElementById('cot-imp-mo').value = tarifasTaller.impReset;
    document.getElementById('cot-imp-desc').value = 'Reset de almohadillas por software';
  } else if (srv === 'caja') {
    document.getElementById('cot-imp-pieza').value = 120;
    document.getElementById('cot-imp-mo').value = tarifasTaller.impReset + 150;
    document.getElementById('cot-imp-desc').value = 'Reset + Adaptación de caja/manguera externa';
  } else if (srv === 'cabezal') {
    document.getElementById('cot-imp-pieza').value = 80;
    document.getElementById('cot-imp-mo').value = 480;
    document.getElementById('cot-imp-desc').value = 'Mantenimiento y destape de cabezales';
  } else {
    document.getElementById('cot-imp-pieza').value = 0;
    document.getElementById('cot-imp-mo').value = 350;
    document.getElementById('cot-imp-desc').value = 'Servicio técnico especializado';
  }
  calcularPresupuesto();
}

function setAtajoCotOtros(concepto, pieza, mo) {
  document.getElementById('cot-otros-concepto').value = concepto;
  document.getElementById('cot-otros-pieza').value = pieza;
  document.getElementById('cot-otros-mo').value = mo;
  calcularPresupuesto();
}

function alternarModoMostradorCotizador() {
  ocultarCostosMostrador = !ocultarCostosMostrador;
  aplicarVisibilidadCostosCotizador();
}

function aplicarVisibilidadCostosCotizador() {
  const ocultar = ocultarCostosMostrador || (rolActual === 'tienda');
  document.querySelectorAll('.desglose-interno').forEach(el => {
    el.classList.toggle('hidden', ocultar);
  });
  const lbl = document.getElementById('lbl-modo-mostrador');
  if (lbl) lbl.textContent = ocultarCostosMostrador ? 'Mostrar Costos' : 'Ocultar Costos';
}

function calcularResumenExtras(factorTienda, factorDescuento) {
  let totalPiezas = 0;
  let totalMo = 0;
  let totalCobrar = 0;
  const detalles = extrasPresupuesto.map(ext => {
    const baseExtra = ext.pieza + ext.mo;
    const conTienda = baseExtra * factorTienda;
    const finalItem = Math.round((conTienda * factorDescuento) / 10) * 10;
    totalPiezas += ext.pieza;
    totalMo += ext.mo;
    totalCobrar += finalItem;
    return {
      nombre: ext.nombre.trim() || 'Servicio Extra',
      pieza: ext.pieza,
      mo: ext.mo,
      total: finalItem
    };
  });
  return { totalPiezas, totalMo, totalCobrar, detalles };
}

function calcularPresupuesto() {
  const factorTienda = tipoClienteCot === 'tienda' ? Math.max(0, 1 - (descuentoTiendaPctActual / 100)) : 1;
  const factorDescuento = 1 - (descuentoClientePct / 100);
  const factorTotal = factorTienda * factorDescuento;
  const tiempoEntrega = document.getElementById('cot-tiempo-entrega').value;
  document.getElementById('res-tiempo-entrega').textContent = tiempoEntrega;

  if (tipoClienteCot === 'tienda') {
    const suc = document.getElementById('cot-sucursal-destino')?.value || '';
    document.getElementById('badge-tipo-tarifa-resumen').textContent = `${suc || 'Tienda'} (-${descuentoTiendaPctActual}% base)`;
  }

  const cardIncell = document.getElementById('card-precio-incell');
  const cardExtras = document.getElementById('card-precio-extras-multiples');
  const btnConvIncell = document.getElementById('btn-convertir-incell');
  const botonesConv = document.getElementById('botones-convertir-orden');
  const botonesConvExtra = document.getElementById('botones-convertir-extra');
  const tachadoIncell = document.getElementById('res-tachado-incell');
  const tachadoPrincipal = document.getElementById('res-tachado-principal');

  cardExtras.classList.add('hidden');
  botonesConvExtra.classList.add('hidden');
  botonesConvExtra.classList.remove('grid');

  if (catPresupuestoActual === 'celular') {
    const moBase = parseFloat(document.getElementById('cot-mo-manual').value) || 0;
    const nombreNivelIphone = perfilIphone === 'home' ? 'Nivel 1 (Entrada)' : (perfilIphone === 'faceid' ? 'Nivel 2 (Estándar/Pro)' : 'Nivel 3 (Pro Max)');
    const etiquetaPlat = plataformaCelular === 'android' ? `Android (${gamaAndroid.toUpperCase()})` : `iPhone (${nombreNivelIphone})`;
    document.getElementById('lbl-resumen-equipo').textContent = `Celular ${etiquetaPlat}`;

    const extrasRes = calcularResumenExtras(factorTienda, factorDescuento);
    const hayExtras = extrasRes.detalles.length > 0;

    if (modoReparacionCelular === 'pantalla') {
      const doble = document.getElementById('cot-doble-opcion').checked;
      const costoIncell = parseFloat(document.getElementById('cot-costo-incell').value) || 0;
      const costoOled = parseFloat(document.getElementById('cot-costo-oled').value) || 0;
      const envio = parseFloat(document.getElementById('cot-envio').value) || 0;

      const fondoOled = Math.round(costoOled * (margenOledPct / 100));
      const basePrincipal = costoOled + envio + fondoOled + moBase;
      const totalPrincipalSinDesc = Math.round((basePrincipal * factorTienda) / 10) * 10;
      const totalPrincipal = Math.round((totalPrincipalSinDesc * factorDescuento) / 10) * 10;
      const anticipoPrincipal = Math.round((totalPrincipal * 0.5) / 10) * 10;

      document.getElementById('lbl-titulo-card-principal').innerHTML = doble
        ? '<i class="fa-solid fa-gem"></i> Opción 2: Pantalla OLED / Original'
        : '<i class="fa-solid fa-mobile-screen-button"></i> Pantalla Única';
      document.getElementById('badge-calidad-principal').textContent = doble ? 'Recomendada' : 'Cotizada';
      document.querySelectorAll('.sync-margen-principal').forEach(el => el.textContent = margenOledPct);

      document.getElementById('res-total-principal').textContent = `$${totalPrincipal.toLocaleString('es-MX')} MXN`;
      document.getElementById('res-anticipo-principal').textContent = `$${anticipoPrincipal.toLocaleString('es-MX')}`;
      if (descuentoClientePct > 0) {
        tachadoPrincipal.textContent = `$${totalPrincipalSinDesc.toLocaleString('es-MX')}`;
        tachadoPrincipal.classList.remove('hidden');
      } else {
        tachadoPrincipal.classList.add('hidden');
      }

      document.getElementById('int-costo-principal').textContent = `$${(costoOled + envio).toLocaleString('es-MX')}`;
      document.getElementById('int-fondo-principal').textContent = `$${fondoOled.toLocaleString('es-MX')}`;
      document.getElementById('int-mo-principal').textContent = `$${moBase.toLocaleString('es-MX')}`;
      document.getElementById('int-ganancia-principal').textContent = `$${(totalPrincipal - (costoOled + envio)).toLocaleString('es-MX')}`;

      document.getElementById('lbl-btn-convertir-principal').textContent = doble ? 'Crear Orden OLED' : 'Crear Orden Pantalla';

      let totalIncellFinal = 0;
      if (doble) {
        cardIncell.classList.remove('hidden');
        btnConvIncell.classList.remove('hidden');
        botonesConv.className = 'grid grid-cols-1 sm:grid-cols-2 gap-2';

        const fondoIncell = Math.round(costoIncell * (margenIncellPct / 100));
        const baseIncell = costoIncell + envio + fondoIncell + moBase;
        const totalIncellSinDesc = Math.round((baseIncell * factorTienda) / 10) * 10;
        totalIncellFinal = Math.round((totalIncellSinDesc * factorDescuento) / 10) * 10;
        const anticipoIncell = Math.round((totalIncellFinal * 0.5) / 10) * 10;

        document.getElementById('res-total-incell').textContent = `$${totalIncellFinal.toLocaleString('es-MX')} MXN`;
        document.getElementById('res-anticipo-incell').textContent = `$${anticipoIncell.toLocaleString('es-MX')}`;
        if (descuentoClientePct > 0) {
          tachadoIncell.textContent = `$${totalIncellSinDesc.toLocaleString('es-MX')}`;
          tachadoIncell.classList.remove('hidden');
        } else {
          tachadoIncell.classList.add('hidden');
        }
        document.getElementById('int-costo-incell').textContent = `$${(costoIncell + envio).toLocaleString('es-MX')}`;
        document.getElementById('int-fondo-incell').textContent = `$${fondoIncell.toLocaleString('es-MX')}`;
        document.getElementById('int-mo-incell').textContent = `$${moBase.toLocaleString('es-MX')}`;
        document.getElementById('int-ganancia-incell').textContent = `$${(totalIncellFinal - (costoIncell + envio)).toLocaleString('es-MX')}`;
      } else {
        cardIncell.classList.add('hidden');
        btnConvIncell.classList.add('hidden');
        botonesConv.className = 'grid grid-cols-1 gap-2';
      }

      if (hayExtras) {
        cardExtras.classList.remove('hidden');
        botonesConvExtra.classList.remove('hidden');
        botonesConvExtra.classList.add('grid');

        document.getElementById('res-count-extras').textContent = extrasRes.detalles.length;
        document.getElementById('res-lista-extras-detalle').innerHTML = extrasRes.detalles.map(d =>
          `<div class="flex justify-between text-amber-200"><span>• ${d.nombre}</span><strong>$${d.total.toLocaleString('es-MX')}</strong></div>`
        ).join('');

        const anticipoExtras = Math.round((extrasRes.totalCobrar * 0.5) / 10) * 10;
        document.getElementById('res-total-extras').textContent = `$${extrasRes.totalCobrar.toLocaleString('es-MX')} MXN`;
        document.getElementById('res-anticipo-extras').textContent = `$${anticipoExtras.toLocaleString('es-MX')}`;

        const filaComboIncell = document.getElementById('fila-combo-incell');
        if (doble) {
          filaComboIncell.classList.remove('hidden');
          document.getElementById('res-combo-incell').textContent = `$${(totalIncellFinal + extrasRes.totalCobrar).toLocaleString('es-MX')} MXN`;
        } else {
          filaComboIncell.classList.add('hidden');
        }

        const comboPrincipal = totalPrincipal + extrasRes.totalCobrar;
        document.getElementById('lbl-combo-principal').textContent = doble ? 'Combo OLED + Todos los Extras:' : 'Combo Pantalla + Todos los Extras:';
        document.getElementById('res-combo-principal').textContent = `$${comboPrincipal.toLocaleString('es-MX')} MXN`;
        document.getElementById('lbl-btn-convertir-combo').textContent = doble ? 'Orden OLED + Extras' : 'Orden Pantalla + Extras';

        document.getElementById('int-costo-extras').textContent = `$${extrasRes.totalPiezas.toLocaleString('es-MX')}`;
        document.getElementById('int-mo-extras').textContent = `$${extrasRes.totalMo.toLocaleString('es-MX')}`;
        document.getElementById('int-ganancia-extras').textContent = `$${(extrasRes.totalCobrar - extrasRes.totalPiezas).toLocaleString('es-MX')}`;
        document.getElementById('int-ganancia-combo').textContent = `$${((comboPrincipal) - (costoOled + envio + extrasRes.totalPiezas)).toLocaleString('es-MX')}`;
      }

    } else {
      cardIncell.classList.add('hidden');
      btnConvIncell.classList.add('hidden');
      botonesConv.className = 'grid grid-cols-1 gap-2';

      const nombreRef = document.getElementById('cot-ref-nombre').value.trim() || 'Refacción / Reparación';
      const costoRef = parseFloat(document.getElementById('cot-ref-costo').value) || 0;
      const envioRef = parseFloat(document.getElementById('cot-ref-envio').value) || 0;
      const fondoRef = Math.round(costoRef * (margenRefaccionPct / 100));

      const baseRef = costoRef + envioRef + fondoRef + moBase;
      const totalRefSinDesc = Math.round((baseRef * factorTienda) / 10) * 10;
      const totalRef = Math.round((totalRefSinDesc * factorDescuento) / 10) * 10;
      const anticipoRef = Math.round((totalRef * 0.5) / 10) * 10;

      document.getElementById('lbl-titulo-card-principal').innerHTML = `<i class="fa-solid fa-wrench"></i> ${nombreRef}`;
      document.getElementById('badge-calidad-principal').textContent = etiquetaPlat;
      document.querySelectorAll('.sync-margen-principal').forEach(el => el.textContent = margenRefaccionPct);

      document.getElementById('res-total-principal').textContent = `$${totalRef.toLocaleString('es-MX')} MXN`;
      document.getElementById('res-anticipo-principal').textContent = `$${anticipoRef.toLocaleString('es-MX')}`;
      if (descuentoClientePct > 0) {
        tachadoPrincipal.textContent = `$${totalRefSinDesc.toLocaleString('es-MX')}`;
        tachadoPrincipal.classList.remove('hidden');
      } else {
        tachadoPrincipal.classList.add('hidden');
      }

      document.getElementById('int-costo-principal').textContent = `$${(costoRef + envioRef).toLocaleString('es-MX')}`;
      document.getElementById('int-fondo-principal').textContent = `$${fondoRef.toLocaleString('es-MX')}`;
      document.getElementById('int-mo-principal').textContent = `$${moBase.toLocaleString('es-MX')}`;
      document.getElementById('int-ganancia-principal').textContent = `$${(totalRef - (costoRef + envioRef)).toLocaleString('es-MX')}`;
      document.getElementById('lbl-btn-convertir-principal').textContent = `Crear Orden (${nombreRef})`;

      if (hayExtras) {
        cardExtras.classList.remove('hidden');
        botonesConvExtra.classList.remove('hidden');
        botonesConvExtra.classList.add('grid');
        document.getElementById('fila-combo-incell').classList.add('hidden');

        document.getElementById('res-count-extras').textContent = extrasRes.detalles.length;
        document.getElementById('res-lista-extras-detalle').innerHTML = extrasRes.detalles.map(d =>
          `<div class="flex justify-between text-amber-200"><span>• ${d.nombre}</span><strong>$${d.total.toLocaleString('es-MX')}</strong></div>`
        ).join('');

        const anticipoExtras = Math.round((extrasRes.totalCobrar * 0.5) / 10) * 10;
        document.getElementById('res-total-extras').textContent = `$${extrasRes.totalCobrar.toLocaleString('es-MX')} MXN`;
        document.getElementById('res-anticipo-extras').textContent = `$${anticipoExtras.toLocaleString('es-MX')}`;

        const comboRef = totalRef + extrasRes.totalCobrar;
        document.getElementById('lbl-combo-principal').textContent = `Combo ${nombreRef} + Extras:`;
        document.getElementById('res-combo-principal').textContent = `$${comboRef.toLocaleString('es-MX')} MXN`;
        document.getElementById('lbl-btn-convertir-combo').textContent = `Orden ${nombreRef} + Extras`;

        document.getElementById('int-costo-extras').textContent = `$${extrasRes.totalPiezas.toLocaleString('es-MX')}`;
        document.getElementById('int-mo-extras').textContent = `$${extrasRes.totalMo.toLocaleString('es-MX')}`;
        document.getElementById('int-ganancia-extras').textContent = `$${(extrasRes.totalCobrar - extrasRes.totalPiezas).toLocaleString('es-MX')}`;
        document.getElementById('int-ganancia-combo').textContent = `$${(comboRef - (costoRef + envioRef + extrasRes.totalPiezas)).toLocaleString('es-MX')}`;
      }
    }

  } else if (catPresupuestoActual === 'laptop') {
    cardIncell.classList.add('hidden');
    btnConvIncell.classList.add('hidden');
    botonesConv.className = 'grid grid-cols-1 gap-2';

    const pieza = parseFloat(document.getElementById('cot-lap-pieza').value) || 0;
    const envio = parseFloat(document.getElementById('cot-lap-envio').value) || 0;
    const mo = parseFloat(document.getElementById('cot-lap-mo').value) || 0;
    const descSoft = document.getElementById('cot-lap-software-desc')?.value.trim() || 'Instalación de software';

    const titulosSrv = {
      display: 'Cambio de Display Laptop',
      mantto: 'Mantenimiento Preventivo Laptop',
      gamer: 'Servicio Laptop Gamer',
      upgrade: 'Upgrade SSD / RAM / OS',
      software: descSoft
    };
    const tituloSrv = titulosSrv[servicioLaptop] || 'Servicio Laptop';

    document.getElementById('lbl-resumen-equipo').textContent = `Laptop / PC — ${tituloSrv}`;
    document.getElementById('lbl-titulo-card-principal').innerHTML = `<i class="fa-solid fa-laptop"></i> ${tituloSrv}`;
    document.getElementById('badge-calidad-principal').textContent = 'Servicio Laptop';
    document.querySelectorAll('.sync-margen-principal').forEach(el => el.textContent = '0');

    const baseLap = pieza + envio + mo;
    const totalSinDesc = Math.round((baseLap * factorTienda) / 10) * 10;
    const totalFinal = Math.round((totalSinDesc * factorDescuento) / 10) * 10;
    const anticipo = Math.round((totalFinal * 0.5) / 10) * 10;

    document.getElementById('res-total-principal').textContent = `$${totalFinal.toLocaleString('es-MX')} MXN`;
    document.getElementById('res-anticipo-principal').textContent = `$${anticipo.toLocaleString('es-MX')}`;
    if (descuentoClientePct > 0) {
      tachadoPrincipal.textContent = `$${totalSinDesc.toLocaleString('es-MX')}`;
      tachadoPrincipal.classList.remove('hidden');
    } else {
      tachadoPrincipal.classList.add('hidden');
    }

    document.getElementById('int-costo-principal').textContent = `$${(pieza + envio).toLocaleString('es-MX')}`;
    document.getElementById('int-fondo-principal').textContent = '$0';
    document.getElementById('int-mo-principal').textContent = `$${mo.toLocaleString('es-MX')}`;
    document.getElementById('int-ganancia-principal').textContent = `$${(totalFinal - (pieza + envio)).toLocaleString('es-MX')}`;
    document.getElementById('lbl-btn-convertir-principal').textContent = 'Crear Orden Laptop';

  } else if (catPresupuestoActual === 'impresora') {
    cardIncell.classList.add('hidden');
    btnConvIncell.classList.add('hidden');
    botonesConv.className = 'grid grid-cols-1 gap-2';

    const pieza = parseFloat(document.getElementById('cot-imp-pieza').value) || 0;
    const mo = parseFloat(document.getElementById('cot-imp-mo').value) || 0;
    const desc = document.getElementById('cot-imp-desc').value.trim() || 'Servicio Impresora';

    document.getElementById('lbl-resumen-equipo').textContent = `Impresora — ${desc}`;
    document.getElementById('lbl-titulo-card-principal').innerHTML = `<i class="fa-solid fa-print"></i> ${desc}`;
    document.getElementById('badge-calidad-principal').textContent = 'Servicio Impresora';
    document.querySelectorAll('.sync-margen-principal').forEach(el => el.textContent = '0');

    const baseImp = pieza + mo;
    const totalSinDesc = Math.round((baseImp * factorTienda) / 10) * 10;
    const totalFinal = Math.round((totalSinDesc * factorDescuento) / 10) * 10;
    const anticipo = Math.round((totalFinal * 0.5) / 10) * 10;

    document.getElementById('res-total-principal').textContent = `$${totalFinal.toLocaleString('es-MX')} MXN`;
    document.getElementById('res-anticipo-principal').textContent = `$${anticipo.toLocaleString('es-MX')}`;
    if (descuentoClientePct > 0) {
      tachadoPrincipal.textContent = `$${totalSinDesc.toLocaleString('es-MX')}`;
      tachadoPrincipal.classList.remove('hidden');
    } else {
      tachadoPrincipal.classList.add('hidden');
    }

    document.getElementById('int-costo-principal').textContent = `$${pieza.toLocaleString('es-MX')}`;
    document.getElementById('int-fondo-principal').textContent = '$0';
    document.getElementById('int-mo-principal').textContent = `$${mo.toLocaleString('es-MX')}`;
    document.getElementById('int-ganancia-principal').textContent = `$${(totalFinal - pieza).toLocaleString('es-MX')}`;
    document.getElementById('lbl-btn-convertir-principal').textContent = 'Crear Orden Impresora';

  } else if (catPresupuestoActual === 'otros') {
    cardIncell.classList.add('hidden');
    btnConvIncell.classList.add('hidden');
    botonesConv.className = 'grid grid-cols-1 gap-2';

    const concepto = document.getElementById('cot-otros-concepto').value.trim() || 'Equipo / Servicio diverso';
    const pieza = parseFloat(document.getElementById('cot-otros-pieza').value) || 0;
    const mo = parseFloat(document.getElementById('cot-otros-mo').value) || 0;

    document.getElementById('lbl-resumen-equipo').textContent = `Otros — ${concepto}`;
    document.getElementById('lbl-titulo-card-principal').innerHTML = `<i class="fa-solid fa-cubes"></i> ${concepto}`;
    document.getElementById('badge-calidad-principal').textContent = 'Categoría Otros';
    document.querySelectorAll('.sync-margen-principal').forEach(el => el.textContent = '0');

    const baseOtros = pieza + mo;
    const totalSinDesc = Math.round((baseOtros * factorTienda) / 10) * 10;
    const totalFinal = Math.round((totalSinDesc * factorDescuento) / 10) * 10;
    const anticipo = Math.round((totalFinal * 0.5) / 10) * 10;

    document.getElementById('res-total-principal').textContent = `$${totalFinal.toLocaleString('es-MX')} MXN`;
    document.getElementById('res-anticipo-principal').textContent = `$${anticipo.toLocaleString('es-MX')}`;
    if (descuentoClientePct > 0) {
      tachadoPrincipal.textContent = `$${totalSinDesc.toLocaleString('es-MX')}`;
      tachadoPrincipal.classList.remove('hidden');
    } else {
      tachadoPrincipal.classList.add('hidden');
    }

    document.getElementById('int-costo-principal').textContent = `$${pieza.toLocaleString('es-MX')}`;
    document.getElementById('int-fondo-principal').textContent = '$0';
    document.getElementById('int-mo-principal').textContent = `$${mo.toLocaleString('es-MX')}`;
    document.getElementById('int-ganancia-principal').textContent = `$${(totalFinal - pieza).toLocaleString('es-MX')}`;
    document.getElementById('lbl-btn-convertir-principal').textContent = 'Crear Orden (Otros)';
  }
}

function construirMensajeWhatsAppPresupuesto() {
  const marca = document.getElementById('cot-marca').value.trim();
  const modelo = document.getElementById('cot-modelo').value.trim();
  const cliente = document.getElementById('cot-cliente').value.trim();
  const entrega = document.getElementById('cot-tiempo-entrega').value;
  const equipoTexto = `${marca} ${modelo}`.trim() || 'su equipo';
  const esTienda = tipoClienteCot === 'tienda';
  const sucDestino = document.getElementById('cot-sucursal-destino')?.value || 'Tienda Aliada';
  const nombreTaller = (typeof configNegocio !== 'undefined' && configNegocio?.nombre)
    ? configNegocio.nombre.toUpperCase()
    : 'REDONE';

  const extrasRes = calcularResumenExtras(
    esTienda ? Math.max(0, 1 - (descuentoTiendaPctActual / 100)) : 1,
    1 - (descuentoClientePct / 100)
  );

  const saludoCliente = cliente ? `Hola ${cliente}, ` : '';

  let bloqueDescuentos = '';
  if (esTienda) bloqueDescuentos += `• Tarifa: *${sucDestino}* (-${descuentoTiendaPctActual}% base)\n`;
  if (descuentoClientePct > 0) bloqueDescuentos += `• Descuento aplicado: *-${descuentoClientePct}%*\n`;
  bloqueDescuentos = bloqueDescuentos.trim();

  let bloqueOpciones = '';
  if (catPresupuestoActual === 'celular' && modoReparacionCelular === 'pantalla') {
    const doble = document.getElementById('cot-doble-opcion').checked;
    const totalPrin = document.getElementById('res-total-principal').textContent;
    const antPrin = document.getElementById('res-anticipo-principal').textContent;

    if (doble) {
      const totalInc = document.getElementById('res-total-incell').textContent;
      const antInc = document.getElementById('res-anticipo-incell').textContent;
      bloqueOpciones = `*Opción 1 — Pantalla INCELL:* ${totalInc} (Anticipo: ${antInc})\n*Opción 2 — Pantalla OLED:* ${totalPrin} (Anticipo: ${antPrin})`;
    } else {
      bloqueOpciones = `*Cambio de Pantalla:* ${totalPrin} (Anticipo: ${antPrin})`;
    }
  } else {
    const concepto = document.getElementById('lbl-titulo-card-principal').textContent.trim();
    const totalPrin = document.getElementById('res-total-principal').textContent;
    const antPrin = document.getElementById('res-anticipo-principal').textContent;
    bloqueOpciones = `*${concepto}:* ${totalPrin} (Anticipo: ${antPrin})`;
  }

  let bloqueExtras = '';
  if (extrasRes.detalles.length > 0) {
    bloqueExtras = `*Servicios Extras:*`;
    extrasRes.detalles.forEach(d => {
      bloqueExtras += `\n- ${d.nombre}: $${d.total.toLocaleString('es-MX')} MXN`;
    });
    bloqueExtras += `\n*Total Extras:* $${extrasRes.totalCobrar.toLocaleString('es-MX')} MXN`;
    const comboPrin = document.getElementById('res-combo-principal').textContent;
    bloqueExtras += `\n*Combo Total:* ${comboPrin}`;
  }

  const garantiaTexto = descuentoClientePct >= 20
    ? '50% por descuento: A partir de este momento, el cliente gozará solo del 50% de garantía en caso de que falle la pieza o servicio (cubre el 50% en reposición; no cubre golpes ni humedad).'
    : '100% contra defectos de fábrica (no cubre golpes ni humedad).';

  if (typeof renderizarPlantillaWA === 'function') {
    const msgRenderizado = renderizarPlantillaWA('cotizacion', {
      taller: nombreTaller,
      cliente: cliente || 'Cliente',
      saludoCliente,
      equipo: equipoTexto,
      bloqueDescuentos,
      bloqueOpciones,
      bloqueExtras,
      tiempoEntrega: entrega,
      garantia: garantiaTexto
    });
    return msgRenderizado.replace(/\n{3,}/g, '\n\n').trim();
  }

  let msg = `*${nombreTaller} — PRESUPUESTO DE REPARACIÓN*\n${saludoCliente}le compartimos la cotización para *${equipoTexto}*:\n`;
  if (bloqueDescuentos) msg += `${bloqueDescuentos}\n`;
  msg += `\n${bloqueOpciones}`;
  if (bloqueExtras) msg += `\n\n${bloqueExtras}`;
  msg += `\n\n• *Tiempo estimado:* ${entrega}\n• *Garantía:* ${garantiaTexto}\n\n¿Desea agendar o confirmar su reparación?`;
  return msg;
}

function enviarCotizacionWhatsApp() {
  const msg = construirMensajeWhatsAppPresupuesto();
  let telefonoDestino = '';
  if (tipoClienteCot === 'tienda') {
    const suc = document.getElementById('cot-sucursal-destino')?.value || '';
    const cfg = obtenerConfigTienda(suc);
    telefonoDestino = cfg.whatsapp || '';
  }
  const url = telefonoDestino
    ? `https://wa.me/52${telefonoDestino}?text=${encodeURIComponent(msg)}`
    : `https://wa.me/?text=${encodeURIComponent(msg)}`;
  window.open(url, '_blank');
}

function convertirPresupuestoAOrden(opcionElegida) {
  prepararNuevaOrden();
  const esTienda = tipoClienteCot === 'tienda';
  const origenDestino = esTienda ? (document.getElementById('cot-sucursal-destino')?.value || tiendasConfig[0]?.nombre || 'Ixmicel 1') : 'RedOne';
  seleccionarOrigen(origenDestino);

  if (catPresupuestoActual === 'celular') {
    seleccionarCategoriaRecepcion('Celular');
  } else if (catPresupuestoActual === 'laptop') {
    seleccionarCategoriaRecepcion('Laptop / PC');
  } else if (catPresupuestoActual === 'impresora') {
    seleccionarCategoriaRecepcion('Impresora');
  } else {
    seleccionarCategoriaRecepcion('Otros');
    document.getElementById('recepcion-otro-equipo').value = document.getElementById('cot-otros-concepto').value.trim();
  }

  const marca = document.getElementById('cot-marca').value.trim();
  const modelo = document.getElementById('cot-modelo').value.trim();
  const nombrePersona = document.getElementById('cot-cliente').value.trim();
  document.getElementById('marca').value = marca;
  document.getElementById('modelo').value = modelo;
  if (esTienda) {
    document.getElementById('encargado-tienda').value = nombrePersona;
  } else {
    document.getElementById('cliente').value = nombrePersona;
  }

  const factorTienda = esTienda ? Math.max(0, 1 - (descuentoTiendaPctActual / 100)) : 1;
  const factorDescuento = 1 - (descuentoClientePct / 100);
  const extrasRes = calcularResumenExtras(factorTienda, factorDescuento);

  let piezaReal = 0;
  let totalCobrar = 0;
  let descripcionServicio = '';

  if (catPresupuestoActual === 'celular') {
    const moBase = parseFloat(document.getElementById('cot-mo-manual').value) || 0;
    if (modoReparacionCelular === 'pantalla') {
      const doble = document.getElementById('cot-doble-opcion').checked;
      const costoIncell = parseFloat(document.getElementById('cot-costo-incell').value) || 0;
      const costoOled = parseFloat(document.getElementById('cot-costo-oled').value) || 0;
      const envio = parseFloat(document.getElementById('cot-envio').value) || 0;

      if (opcionElegida === 'incell') {
        piezaReal = costoIncell + envio;
        totalCobrar = parseInt(document.getElementById('res-total-incell').textContent.replace(/\D/g, ''), 10) || 0;
        seleccionarTipoReparacion('Pantalla Incell');
        descripcionServicio = 'Pantalla Incell';
      } else if (opcionElegida === 'extra') {
        piezaReal = extrasRes.totalPiezas;
        totalCobrar = extrasRes.totalCobrar;
        seleccionarTipoReparacion('Otro servicio');
        document.getElementById('reparacion-manual').value = extrasRes.detalles.map(d => d.nombre).join(' + ');
        descripcionServicio = document.getElementById('reparacion-manual').value;
      } else if (opcionElegida === 'combo') {
        piezaReal = costoOled + envio + extrasRes.totalPiezas;
        totalCobrar = parseInt(document.getElementById('res-combo-principal').textContent.replace(/\D/g, ''), 10) || 0;
        seleccionarTipoReparacion(doble ? 'Pantalla OLED' : 'Otro servicio');
        descripcionServicio = `${doble ? 'Pantalla OLED' : 'Pantalla'} + ${extrasRes.detalles.map(d => d.nombre).join(' + ')}`;
      } else {
        piezaReal = costoOled + envio;
        totalCobrar = parseInt(document.getElementById('res-total-principal').textContent.replace(/\D/g, ''), 10) || 0;
        seleccionarTipoReparacion(doble ? 'Pantalla OLED' : 'Otro servicio');
        descripcionServicio = doble ? 'Pantalla OLED' : 'Cambio de pantalla';
      }
      if (!descripcionServicio) descripcionServicio = 'Cambio de pantalla';
      document.getElementById('costo-pieza').value = Math.round(piezaReal);
      document.getElementById('mano-obra').value = Math.max(0, Math.round(totalCobrar - piezaReal));
    } else {
      const nombreRef = document.getElementById('cot-ref-nombre').value.trim() || 'Refacción';
      const costoRef = parseFloat(document.getElementById('cot-ref-costo').value) || 0;
      const envioRef = parseFloat(document.getElementById('cot-ref-envio').value) || 0;
      seleccionarTipoReparacion('Otro servicio');
      if (opcionElegida === 'combo') {
        piezaReal = costoRef + envioRef + extrasRes.totalPiezas;
        totalCobrar = parseInt(document.getElementById('res-combo-principal').textContent.replace(/\D/g, ''), 10) || 0;
        document.getElementById('reparacion-manual').value = `${nombreRef} + ${extrasRes.detalles.map(d => d.nombre).join(' + ')}`;
      } else if (opcionElegida === 'extra') {
        piezaReal = extrasRes.totalPiezas;
        totalCobrar = extrasRes.totalCobrar;
        document.getElementById('reparacion-manual').value = extrasRes.detalles.map(d => d.nombre).join(' + ');
      } else {
        piezaReal = costoRef + envioRef;
        totalCobrar = parseInt(document.getElementById('res-total-principal').textContent.replace(/\D/g, ''), 10) || 0;
        document.getElementById('reparacion-manual').value = nombreRef;
      }
      document.getElementById('costo-pieza').value = Math.round(piezaReal);
      document.getElementById('mano-obra').value = Math.max(0, Math.round(totalCobrar - piezaReal));
    }
  } else {
    seleccionarTipoReparacion('Otro servicio');
    let p = 0, mo = 0, txt = '';
    if (catPresupuestoActual === 'laptop') {
      p = (parseFloat(document.getElementById('cot-lap-pieza').value) || 0) + (parseFloat(document.getElementById('cot-lap-envio').value) || 0);
      mo = parseFloat(document.getElementById('cot-lap-mo').value) || 0;
      txt = servicioLaptop === 'software'
        ? (document.getElementById('cot-lap-software-desc').value.trim() || 'Instalación de software')
        : document.getElementById('lbl-titulo-card-principal').textContent.trim();
    } else if (catPresupuestoActual === 'impresora') {
      p = parseFloat(document.getElementById('cot-imp-pieza').value) || 0;
      mo = parseFloat(document.getElementById('cot-imp-mo').value) || 0;
      txt = document.getElementById('cot-imp-desc').value.trim() || 'Servicio Impresora';
    } else {
      p = parseFloat(document.getElementById('cot-otros-pieza').value) || 0;
      mo = parseFloat(document.getElementById('cot-otros-mo').value) || 0;
      txt = document.getElementById('cot-otros-concepto').value.trim() || 'Equipo / Servicio diverso';
    }
    totalCobrar = parseInt(document.getElementById('res-total-principal').textContent.replace(/\D/g, ''), 10) || (p + mo);
    document.getElementById('reparacion-manual').value = txt;
    document.getElementById('costo-pieza').value = Math.round(p);
    document.getElementById('mano-obra').value = Math.max(0, Math.round(totalCobrar - p));
  }

  if (descuentoClientePct >= 20) {
    seleccionarGarantiaOrden('50');
    document.getElementById('notas-tecnico').value = `Descuento ${descuentoClientePct}% -> Garantía al 50%.`;
  } else {
    seleccionarGarantiaOrden('100');
  actualizarPreviewPatronInline();
  }

  actualizarVista();
  cambiarPestana('registro');
}

// Modal Tarifas
function abrirModalTarifas() {
  if (rolActual !== 'tecnico') {
    abrirModalPin({ modo: 'tecnico' });
    return;
  }
  document.getElementById('trf-margen-incell').value = tarifasTaller.margenIncellPct ?? 30;
  document.getElementById('trf-margen-oled').value = tarifasTaller.margenOledPct ?? 20;
  document.getElementById('trf-desc-tienda').value = tarifasTaller.descTiendaPct ?? 15;
  document.getElementById('trf-android-baja').value = tarifasTaller.androidBaja;
  document.getElementById('trf-android-media').value = tarifasTaller.androidMedia;
  document.getElementById('trf-android-alta').value = tarifasTaller.androidAlta;
  document.getElementById('trf-iphone-home').value = tarifasTaller.iphoneHome;
  document.getElementById('trf-iphone-faceid').value = tarifasTaller.iphoneFaceid;
  document.getElementById('trf-iphone-pro').value = tarifasTaller.iphonePro;
  document.getElementById('trf-laptop-display').value = tarifasTaller.laptopDisplay;
  document.getElementById('trf-laptop-mantto').value = tarifasTaller.laptopMantto;
  document.getElementById('trf-imp-reset').value = tarifasTaller.impReset;
  document.getElementById('modal-tarifas').classList.remove('hidden');
}

function cerrarModalTarifas() {
  document.getElementById('modal-tarifas').classList.add('hidden');
}

function guardarTarifasPersonalizadas() {
  tarifasTaller = {
    margenIncellPct: Math.max(0, Math.min(100, parseFloat(document.getElementById('trf-margen-incell').value) || 0)),
    margenOledPct: Math.max(0, Math.min(100, parseFloat(document.getElementById('trf-margen-oled').value) || 0)),
    descTiendaPct: Math.max(0, Math.min(100, parseFloat(document.getElementById('trf-desc-tienda').value) || 0)),
    androidBaja: parseFloat(document.getElementById('trf-android-baja').value) || 0,
    androidMedia: parseFloat(document.getElementById('trf-android-media').value) || 0,
    androidAlta: parseFloat(document.getElementById('trf-android-alta').value) || 0,
    iphoneHome: parseFloat(document.getElementById('trf-iphone-home').value) || 0,
    iphoneFaceid: parseFloat(document.getElementById('trf-iphone-faceid').value) || 0,
    iphonePro: parseFloat(document.getElementById('trf-iphone-pro').value) || 0,
    laptopDisplay: parseFloat(document.getElementById('trf-laptop-display').value) || 0,
    laptopMantto: parseFloat(document.getElementById('trf-laptop-mantto').value) || 0,
    impReset: parseFloat(document.getElementById('trf-imp-reset').value) || 0
  };
  localStorage.setItem('redone_tarifas_cotizador_v3', JSON.stringify(tarifasTaller));
  descuentoTiendaPctActual = tarifasTaller.descTiendaPct;
  sincronizarDescuentoTiendaManual(descuentoTiendaPctActual);
  actualizarEtiquetasTarifas();
  seleccionarMargenIncell(tarifasTaller.margenIncellPct);
  seleccionarMargenOled(tarifasTaller.margenOledPct);
  if (catPresupuestoActual === 'celular') {
    actualizarManoObraCelularSugerida();
  } else if (catPresupuestoActual === 'laptop') {
    seleccionarServicioLaptop(servicioLaptop);
  } else if (catPresupuestoActual === 'impresora') {
    seleccionarServicioImpresora(servicioImpresora);
  }
  calcularPresupuesto();
  cerrarModalTarifas();
}

function restaurarTarifasDefault() {
  tarifasTaller = { ...TARIFAS_DEFAULT };
  localStorage.setItem('redone_tarifas_cotizador_v3', JSON.stringify(tarifasTaller));
  descuentoTiendaPctActual = tarifasTaller.descTiendaPct;
  sincronizarDescuentoTiendaManual(descuentoTiendaPctActual);
  actualizarEtiquetasTarifas();
  seleccionarMargenIncell(tarifasTaller.margenIncellPct);
  seleccionarMargenOled(tarifasTaller.margenOledPct);
  if (catPresupuestoActual === 'celular') actualizarManoObraCelularSugerida();
  calcularPresupuesto();
  abrirModalTarifas();
}
