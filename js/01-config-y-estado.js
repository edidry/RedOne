// =========================================================================
// MÓDULO 01: CONFIGURACIÓN, ETIQUETAS, PALETAS DE COLOR Y ESTADO GLOBAL
// =========================================================================

// =========================================================================
// CONFIGURACIÓN DE SEGURIDAD, PINES Y TIENDAS ALIADAS DINÁMICAS
// =========================================================================
const PIN_MAESTRO_DEFAULT = '1234';
const TIENDAS_DEFAULT = [
  { id: 'ixmicel-1', nombre: 'Ixmicel 1', color: 'sky', whatsapp: '', pin: '1111' },
  { id: 'ixmicel-2', nombre: 'Ixmicel 2', color: 'purple', whatsapp: '', pin: '2222' },
  { id: 'smartcell', nombre: 'SmartCell', color: 'amber', whatsapp: '', pin: '3333' }
];

let pinMaestro = localStorage.getItem('redone_pin_maestro_v3') || PIN_MAESTRO_DEFAULT;
let tiendasConfig = JSON.parse(localStorage.getItem('redone_tiendas_config_v3'));
if (!tiendasConfig || !Array.isArray(tiendasConfig) || tiendasConfig.length === 0) {
  const telsPrevios = JSON.parse(localStorage.getItem('redone_telefonos_tiendas')) || {};
  tiendasConfig = TIENDAS_DEFAULT.map(t => ({
    ...t,
    whatsapp: telsPrevios[t.nombre] || ''
  }));
  localStorage.setItem('redone_tiendas_config_v3', JSON.stringify(tiendasConfig));
}

// =========================================================================
// DATOS GENERALES DEL NEGOCIO (CONFIGURABLES DESDE PANEL)
// =========================================================================
const CONFIG_NEGOCIO_DEFAULT = {
  nombre: 'RedOne',
  subtitulo: 'Servicio Técnico Especializado',
  direccion: 'Ixmiquilpan, Hidalgo',
  telefono: '',
  garantiaPie: 'Después de 30 días de notificado, RedOne no se hace responsable por equipos olvidados. Equipos mojados o apagados no tienen garantía de encendido.'
};

let configNegocio = {
  ...CONFIG_NEGOCIO_DEFAULT,
  ...(JSON.parse(localStorage.getItem('redone_config_negocio_v3')) || {})
};

// =========================================================================
// EMPLEADOS E INVENTARIO (GESTIONADOS DESDE PANEL DE CONFIGURACIÓN)
// =========================================================================
const EMPLEADOS_DEFAULT = [
  { id: 'emp-1', nombre: 'Daniela', puesto: 'Auxiliar / Mostrador', sucursal: 'RedOne', telefono: '', pin: '1010', estatus: 'Activo' },
  { id: 'emp-2', nombre: 'Carlos M.', puesto: 'Encargado de Tienda', sucursal: 'Ixmicel 1', telefono: '', pin: '1111', estatus: 'Activo' },
  { id: 'emp-3', nombre: 'Valeria R.', puesto: 'Encargado de Tienda', sucursal: 'Ixmicel 2', telefono: '', pin: '2222', estatus: 'Activo' },
  { id: 'emp-4', nombre: 'Luis G.', puesto: 'Encargado de Tienda', sucursal: 'SmartCell', telefono: '', pin: '3333', estatus: 'Activo' }
];

let empleadosConfig = JSON.parse(localStorage.getItem('redone_empleados_config_v3'));
if (!empleadosConfig || !Array.isArray(empleadosConfig)) {
  empleadosConfig = EMPLEADOS_DEFAULT.map(e => ({ ...e }));
  localStorage.setItem('redone_empleados_config_v3', JSON.stringify(empleadosConfig));
}

const INVENTARIO_DEFAULT = [
  { id: 'inv-1', sku: 'PANT-A14-INC', nombre: 'Pantalla Samsung Galaxy A14 Incell', categoria: 'Pantallas', stock: 3, minimo: 2, costo: 350, precio: 700 },
  { id: 'inv-2', sku: 'PANT-RN12-OLED', nombre: 'Pantalla Redmi Note 12 OLED', categoria: 'Pantallas', stock: 2, minimo: 1, costo: 780, precio: 1280 },
  { id: 'inv-3', sku: 'CC-TIPO-C', nombre: 'Centro de Carga Tipo C Universal', categoria: 'Centros de Carga', stock: 10, minimo: 4, costo: 35, precio: 350 },
  { id: 'inv-4', sku: 'HIDRO-HD', nombre: 'Lámina Hidrogel HD Transparente', categoria: 'Hidrogel / Accesorios', stock: 15, minimo: 5, costo: 22, precio: 150 }
];

let inventarioTaller = JSON.parse(localStorage.getItem('redone_inventario_v3'));
if (!inventarioTaller || !Array.isArray(inventarioTaller)) {
  inventarioTaller = INVENTARIO_DEFAULT.map(i => ({ ...i }));
  localStorage.setItem('redone_inventario_v3', JSON.stringify(inventarioTaller));
}

// =========================================================================
// ETIQUETAS / NOMBRES DE CAMPOS EDITABLES EN LOCALSTORAGE
// =========================================================================
const ETIQUETAS_DEFAULT = {
  rolTecnico: 'Técnico',
  rolEmpleado: 'Empleado',
  rolTienda: 'Tienda',
  origen: 'Origen del Equipo',
  folioTienda: 'Folio de la Tienda *',
  encargadoTienda: 'Encargado / Empleado que recibió *',
  cliente: 'Nombre completo del cliente *',
  telefono: 'Teléfono / WhatsApp (10 dígitos) *',
  tipoEquipo: 'Categoría del Equipo Recibido *',
  especificacionOtros: 'Especifica manualmente qué equipo "Otro" llegó a reparación *',
  marca: 'Marca *',
  modelo: 'Modelo *',
  clave: 'Contraseña / PIN',
  imei: 'IMEI / Serie',
  accesorios: 'Accesorios recibidos',
  tipoReparacion: '¿Qué reparación se va a realizar? *',
  falla: 'Observación adicional de la falla / garantía (opcional)',
  condiciones: 'Condiciones físicas en que se recibe *',
  costoPieza: 'Costo Pieza(s) ($ MXN)',
  manoObra: 'Tu Mano de Obra ($ MXN)',
  totalServicio: 'Total ($ MXN)',
  estatusOrden: 'Estatus de Reparación',
  notasTecnico: 'Notas técnicas / Diagnóstico interno',
  garantiaAplicable: 'Política de Garantía Aplicable *',
  anticipo: 'Anticipo recibido ($ MXN)',
  saldoRestante: 'Saldo Restante ($ MXN)',
  sucursalDestino: 'Sucursal Destino de Tienda Aliada *',
  descuentoTiendaManual: 'Descuento a Tienda Aliada (0% al 100% sobre costo base)',
  cotCliente: 'Nombre Cliente Directo',
  cotMarca: 'Marca *',
  cotModelo: 'Modelo *',
  descuentoCliente: 'Descuento Especial al Cliente (Todas las categorías)'
};

function cargarEtiquetasDesdeStorage() {
  try {
    const raw = localStorage.getItem('redone_etiquetas_campos_v3_1');
    const parsed = raw ? JSON.parse(raw) : {};
    return { ...ETIQUETAS_DEFAULT, ...(parsed && typeof parsed === 'object' ? parsed : {}) };
  } catch (e) {
    return { ...ETIQUETAS_DEFAULT };
  }
}

let etiquetasPersonalizadas = cargarEtiquetasDesdeStorage();

function obtenerNombreRol(rol) {
  etiquetasPersonalizadas = cargarEtiquetasDesdeStorage();
  if (rol === 'tecnico') return etiquetasPersonalizadas.rolTecnico || ETIQUETAS_DEFAULT.rolTecnico;
  if (rol === 'empleado') return etiquetasPersonalizadas.rolEmpleado || ETIQUETAS_DEFAULT.rolEmpleado;
  if (rol === 'tienda') return etiquetasPersonalizadas.rolTienda || ETIQUETAS_DEFAULT.rolTienda;
  return rol || '';
}

function aplicarEtiquetasPersonalizadas() {
  etiquetasPersonalizadas = cargarEtiquetasDesdeStorage();

  document.querySelectorAll('[data-campo-label]').forEach(el => {
    const claveCampo = el.getAttribute('data-campo-label');
    if (etiquetasPersonalizadas[claveCampo]) {
      el.textContent = etiquetasPersonalizadas[claveCampo];
    }
  });

  const nomTec = obtenerNombreRol('tecnico');
  const nomEmp = obtenerNombreRol('empleado');
  const nomTie = obtenerNombreRol('tienda');

  const spanBtnTec = document.querySelector('#btn-rol-tecnico span');
  if (spanBtnTec) spanBtnTec.textContent = nomTec;

  const spanBtnEmp = document.querySelector('#btn-rol-empleado span');
  if (spanBtnEmp) spanBtnEmp.textContent = nomEmp;

  const spanBtnTie = document.querySelector('#btn-rol-tienda span');
  if (spanBtnTie) spanBtnTie.textContent = nomTie;

  const btnPinTie = document.getElementById('btn-pin-ir-tienda');
  if (btnPinTie) btnPinTie.innerHTML = `<i class="fa-solid fa-store text-sky-400"></i> Soy ${nomTie}`;

  const btnPinEmp = document.getElementById('btn-pin-ir-empleado');
  if (btnPinEmp) btnPinEmp.innerHTML = `<i class="fa-solid fa-user-check text-emerald-400"></i> Soy ${nomEmp}`;

  const badgeRol = document.getElementById('badge-rol');
  if (badgeRol && typeof rolActual !== 'undefined') {
    if (rolActual === 'tecnico') {
      badgeRol.textContent = `Vista ${nomTec}`;
    } else if (rolActual === 'empleado') {
      const empNom = window.empleadoAutenticadoActual?.nombre || nomEmp;
      badgeRol.textContent = `${nomEmp}: ${empNom}`;
    } else if (rolActual === 'tienda') {
      badgeRol.textContent = `Vista ${nomTie}`;
    }
  }
}

function renderizarCamposEtiquetasEnPanel() {
  etiquetasPersonalizadas = cargarEtiquetasDesdeStorage();
  const cont = document.getElementById('lista-campos-editables');
  if (!cont) return;
  cont.innerHTML = Object.keys(ETIQUETAS_DEFAULT).map(key => `
    <div class="bg-slate-950 border border-slate-800 rounded-xl p-2.5">
      <label class="block text-[10px] text-slate-400 mb-1">Original: <span class="text-slate-300">${ETIQUETAS_DEFAULT[key]}</span></label>
      <input type="text" data-edit-etiqueta-key="${key}" value="${(etiquetasPersonalizadas[key] || '').replace(/"/g, '&quot;')}"
        class="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500">
    </div>
  `).join('');
}

function guardarEtiquetasPersonalizadas() {
  const actualizadas = cargarEtiquetasDesdeStorage();
  document.querySelectorAll('[data-edit-etiqueta-key]').forEach(inp => {
    const k = inp.getAttribute('data-edit-etiqueta-key');
    const val = inp.value.trim();
    actualizadas[k] = val || ETIQUETAS_DEFAULT[k];
  });
  etiquetasPersonalizadas = actualizadas;
  localStorage.setItem('redone_etiquetas_campos_v3_1', JSON.stringify(etiquetasPersonalizadas));
  aplicarEtiquetasPersonalizadas();
  alert('✅ Nombres y etiquetas actualizados correctamente.');
}

function restaurarEtiquetasDefault() {
  etiquetasPersonalizadas = { ...ETIQUETAS_DEFAULT };
  localStorage.setItem('redone_etiquetas_campos_v3_1', JSON.stringify(etiquetasPersonalizadas));
  aplicarEtiquetasPersonalizadas();
  renderizarCamposEtiquetasEnPanel();
}

// =========================================================================
// PLANTILLAS DE MENSAJES DE WHATSAPP EDITABLES EN LOCALSTORAGE
// =========================================================================
const PLANTILLAS_WA_DEFAULT = {
  recepcionCliente: `Hola *{cliente}*, gracias por confiar en *{taller}* 📲.\n\nRegistramos tu orden de servicio con los siguientes datos:\n• *Folio:* {folio}\n• *Equipo:* {equipo}\n• *Falla reportada:* {falla}\n• *Costo estimado:* {total}\n• *Anticipo:* {anticipo}\n• *Saldo pendiente:* {saldo}\n• *Garantía:* {garantia}\n\nTe avisaremos por este medio en cuanto tu equipo esté listo.`,
  recepcionTienda: `Hola *{tienda}*, confirmamos recepción en taller *{taller}* 📲:\n• *Folio Taller:* {folio}\n• *Nota Tienda:* {folioTienda}\n• *Recibió:* {encargado}\n• *Equipo:* {equipo}\n• *Falla:* {falla}\n• *Costo Taller:* {total}\n• *Garantía:* {garantia}`,
  equipoListo: `Hola *{cliente}*, te saludamos de *{taller}* 👋.\n\nTu equipo *{equipo}* (Folio: *{folio}*) ya está *LISTO PARA ENTREGA* ✅.\n• Trabajo: {falla}\n• Total: {total}\n• Anticipo: {anticipo}\n• *Saldo a liquidar: {saldo}*\n\n¡Te esperamos!`,
  cotizacion: `*{taller} — PRESUPUESTO DE REPARACIÓN*\n{saludoCliente}le compartimos la cotización para *{equipo}*:\n{bloqueDescuentos}\n{bloqueOpciones}\n{bloqueExtras}\n\n• *Tiempo estimado:* {tiempoEntrega}\n• *Garantía:* {garantia}\n\n¿Desea agendar o confirmar su reparación?`
};

function cargarPlantillasWhatsAppDesdeStorage() {
  try {
    const raw = localStorage.getItem('redone_plantillas_wa_v3');
    const parsed = raw ? JSON.parse(raw) : {};
    return { ...PLANTILLAS_WA_DEFAULT, ...(parsed && typeof parsed === 'object' ? parsed : {}) };
  } catch (e) {
    return { ...PLANTILLAS_WA_DEFAULT };
  }
}

let plantillasWhatsApp = cargarPlantillasWhatsAppDesdeStorage();

function renderizarPlantillaWA(clave, datos = {}) {
  plantillasWhatsApp = cargarPlantillasWhatsAppDesdeStorage();
  let texto = plantillasWhatsApp[clave] || PLANTILLAS_WA_DEFAULT[clave] || '';
  Object.keys(datos).forEach(k => {
    const valor = datos[k] !== undefined && datos[k] !== null ? String(datos[k]) : '';
    texto = texto.split(`{${k}}`).join(valor);
  });
  return texto;
}

// =========================================================================
// PALETAS Y PINES
// =========================================================================
let contextoPinPendiente = {
  modo: 'tecnico',
  tiendaDestino: null,
  folioQRPendiente: null,
  alIniciar: false
};

const PALETAS_COLOR = {
  red: {
    bodyBg: 'bg-slate-950',
    headerBg: 'bg-slate-900 border-slate-800',
    cardBg: 'bg-slate-900 border-slate-800',
    titleText: 'text-red-400',
    iconText: 'text-red-400',
    btnActive: 'origen-btn bg-red-600 text-white border border-red-500 rounded-xl py-2.5 px-3 text-xs font-semibold shadow-md transition flex flex-col items-center gap-1',
    btnSave: 'w-full bg-red-600 hover:bg-red-500 text-white font-semibold py-3.5 px-6 rounded-2xl shadow-lg shadow-red-600/25 transition flex items-center justify-center gap-2 text-sm',
    bannerClass: 'bg-red-500/10 border-b border-red-500/30 px-6 py-2.5 text-xs text-red-300 flex flex-wrap items-center justify-between gap-2 no-print transition-colors duration-300',
    badgeHeader: 'bg-red-500/20 text-red-300 border-red-500/40',
    badgeBandeja: 'bg-red-500/15 text-red-300 border-red-500/30',
    tiendaCardBorder: 'bg-slate-900 border-red-500/40 rounded-2xl p-5 shadow-xl transition-colors duration-300',
    barBg: 'bg-red-500',
    chkAccent: 'accent-red-500'
  },
  sky: {
    bodyBg: 'bg-sky-950/90',
    headerBg: 'bg-sky-950 border-sky-800/80',
    cardBg: 'bg-slate-900/95 border-sky-800/60',
    titleText: 'text-sky-400',
    iconText: 'text-sky-400',
    btnActive: 'origen-btn bg-sky-500 text-slate-950 border border-sky-300 rounded-xl py-2.5 px-3 text-xs font-bold shadow-lg shadow-sky-500/25 transition flex flex-col items-center gap-1',
    btnSave: 'w-full bg-sky-600 hover:bg-sky-500 text-white font-semibold py-3.5 px-6 rounded-2xl shadow-lg shadow-sky-600/25 transition flex items-center justify-center gap-2 text-sm',
    bannerClass: 'bg-sky-500/15 border-b border-sky-500/40 px-6 py-2.5 text-xs text-sky-200 flex flex-wrap items-center justify-between gap-2 no-print transition-colors duration-300',
    badgeHeader: 'bg-sky-500/20 text-sky-300 border-sky-400/50',
    badgeBandeja: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
    tiendaCardBorder: 'bg-sky-950/50 border-sky-500/50 rounded-2xl p-5 shadow-xl transition-colors duration-300',
    barBg: 'bg-sky-400',
    chkAccent: 'accent-sky-500'
  },
  purple: {
    bodyBg: 'bg-purple-950/85',
    headerBg: 'bg-purple-950 border-purple-800/80',
    cardBg: 'bg-slate-900/95 border-purple-800/60',
    titleText: 'text-purple-400',
    iconText: 'text-purple-400',
    btnActive: 'origen-btn bg-purple-500 text-white border border-purple-300 rounded-xl py-2.5 px-3 text-xs font-bold shadow-lg shadow-purple-500/25 transition flex flex-col items-center gap-1',
    btnSave: 'w-full bg-purple-600 hover:bg-purple-500 text-white font-semibold py-3.5 px-6 rounded-2xl shadow-lg shadow-purple-600/25 transition flex items-center justify-center gap-2 text-sm',
    bannerClass: 'bg-purple-500/15 border-b border-purple-500/40 px-6 py-2.5 text-xs text-purple-200 flex flex-wrap items-center justify-between gap-2 no-print transition-colors duration-300',
    badgeHeader: 'bg-purple-500/20 text-purple-300 border-purple-400/50',
    badgeBandeja: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
    tiendaCardBorder: 'bg-purple-950/50 border-purple-500/50 rounded-2xl p-5 shadow-xl transition-colors duration-300',
    barBg: 'bg-purple-400',
    chkAccent: 'accent-purple-500'
  },
  amber: {
    bodyBg: 'bg-amber-950/60',
    headerBg: 'bg-stone-900 border-amber-800/70',
    cardBg: 'bg-slate-900/95 border-amber-800/60',
    titleText: 'text-amber-400',
    iconText: 'text-amber-400',
    btnActive: 'origen-btn bg-amber-500 text-slate-950 border border-amber-300 rounded-xl py-2.5 px-3 text-xs font-bold shadow-lg shadow-amber-500/25 transition flex flex-col items-center gap-1',
    btnSave: 'w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-3.5 px-6 rounded-2xl shadow-lg shadow-amber-500/25 transition flex items-center justify-center gap-2 text-sm',
    bannerClass: 'bg-amber-500/15 border-b border-amber-500/40 px-6 py-2.5 text-xs text-amber-200 flex flex-wrap items-center justify-between gap-2 no-print transition-colors duration-300',
    badgeHeader: 'bg-amber-500/20 text-amber-300 border-amber-400/50',
    badgeBandeja: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    tiendaCardBorder: 'bg-amber-950/40 border-amber-500/50 rounded-2xl p-5 shadow-xl transition-colors duration-300',
    barBg: 'bg-amber-400',
    chkAccent: 'accent-amber-500'
  },
  emerald: {
    bodyBg: 'bg-emerald-950/80',
    headerBg: 'bg-emerald-950 border-emerald-800/80',
    cardBg: 'bg-slate-900/95 border-emerald-800/60',
    titleText: 'text-emerald-400',
    iconText: 'text-emerald-400',
    btnActive: 'origen-btn bg-emerald-500 text-slate-950 border border-emerald-300 rounded-xl py-2.5 px-3 text-xs font-bold shadow-lg shadow-emerald-500/25 transition flex flex-col items-center gap-1',
    btnSave: 'w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3.5 px-6 rounded-2xl shadow-lg shadow-emerald-600/25 transition flex items-center justify-center gap-2 text-sm',
    bannerClass: 'bg-emerald-500/15 border-b border-emerald-500/40 px-6 py-2.5 text-xs text-emerald-200 flex flex-wrap items-center justify-between gap-2 no-print transition-colors duration-300',
    badgeHeader: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/50',
    badgeBandeja: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    tiendaCardBorder: 'bg-emerald-950/50 border-emerald-500/50 rounded-2xl p-5 shadow-xl transition-colors duration-300',
    barBg: 'bg-emerald-400',
    chkAccent: 'accent-emerald-500'
  },
  rose: {
    bodyBg: 'bg-rose-950/80',
    headerBg: 'bg-rose-950 border-rose-800/80',
    cardBg: 'bg-slate-900/95 border-rose-800/60',
    titleText: 'text-rose-400',
    iconText: 'text-rose-400',
    btnActive: 'origen-btn bg-rose-500 text-white border border-rose-300 rounded-xl py-2.5 px-3 text-xs font-bold shadow-lg shadow-rose-500/25 transition flex flex-col items-center gap-1',
    btnSave: 'w-full bg-rose-600 hover:bg-rose-500 text-white font-semibold py-3.5 px-6 rounded-2xl shadow-lg shadow-rose-600/25 transition flex items-center justify-center gap-2 text-sm',
    bannerClass: 'bg-rose-500/15 border-b border-rose-500/40 px-6 py-2.5 text-xs text-rose-200 flex flex-wrap items-center justify-between gap-2 no-print transition-colors duration-300',
    badgeHeader: 'bg-rose-500/20 text-rose-300 border-rose-400/50',
    badgeBandeja: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
    tiendaCardBorder: 'bg-rose-950/50 border-rose-500/50 rounded-2xl p-5 shadow-xl transition-colors duration-300',
    barBg: 'bg-rose-400',
    chkAccent: 'accent-rose-500'
  },
  cyan: {
    bodyBg: 'bg-cyan-950/80',
    headerBg: 'bg-cyan-950 border-cyan-800/80',
    cardBg: 'bg-slate-900/95 border-cyan-800/60',
    titleText: 'text-cyan-400',
    iconText: 'text-cyan-400',
    btnActive: 'origen-btn bg-cyan-500 text-slate-950 border border-cyan-300 rounded-xl py-2.5 px-3 text-xs font-bold shadow-lg shadow-cyan-500/25 transition flex flex-col items-center gap-1',
    btnSave: 'w-full bg-cyan-600 hover:bg-cyan-500 text-white font-semibold py-3.5 px-6 rounded-2xl shadow-lg shadow-cyan-600/25 transition flex items-center justify-center gap-2 text-sm',
    bannerClass: 'bg-cyan-500/15 border-b border-cyan-500/40 px-6 py-2.5 text-xs text-cyan-200 flex flex-wrap items-center justify-between gap-2 no-print transition-colors duration-300',
    badgeHeader: 'bg-cyan-500/20 text-cyan-300 border-cyan-400/50',
    badgeBandeja: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
    tiendaCardBorder: 'bg-cyan-950/50 border-cyan-500/50 rounded-2xl p-5 shadow-xl transition-colors duration-300',
    barBg: 'bg-cyan-400',
    chkAccent: 'accent-cyan-500'
  },
  indigo: {
    bodyBg: 'bg-indigo-950/80',
    headerBg: 'bg-indigo-950 border-indigo-800/80',
    cardBg: 'bg-slate-900/95 border-indigo-800/60',
    titleText: 'text-indigo-400',
    iconText: 'text-indigo-400',
    btnActive: 'origen-btn bg-indigo-500 text-white border border-indigo-300 rounded-xl py-2.5 px-3 text-xs font-bold shadow-lg shadow-indigo-500/25 transition flex flex-col items-center gap-1',
    btnSave: 'w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3.5 px-6 rounded-2xl shadow-lg shadow-indigo-600/25 transition flex items-center justify-center gap-2 text-sm',
    bannerClass: 'bg-indigo-500/15 border-b border-indigo-500/40 px-6 py-2.5 text-xs text-indigo-200 flex flex-wrap items-center justify-between gap-2 no-print transition-colors duration-300',
    badgeHeader: 'bg-indigo-500/20 text-indigo-300 border-indigo-400/50',
    badgeBandeja: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
    tiendaCardBorder: 'bg-indigo-950/50 border-indigo-500/50 rounded-2xl p-5 shadow-xl transition-colors duration-300',
    barBg: 'bg-indigo-400',
    chkAccent: 'accent-indigo-500'
  }
};

function obtenerConfigTienda(nombreTienda) {
  if (nombreTienda === 'RedOne') return { id: 'redone', nombre: 'RedOne', color: 'red', whatsapp: '', pin: pinMaestro };
  const encontrada = tiendasConfig.find(t => t.nombre.toLowerCase() === String(nombreTienda || '').toLowerCase());
  return encontrada || { id: 'custom', nombre: nombreTienda, color: 'sky', whatsapp: '', pin: '1111' };
}

function obtenerTemaPorOrigen(origen) {
  const cfg = obtenerConfigTienda(origen);
  return PALETAS_COLOR[cfg.color] || PALETAS_COLOR.sky;
}

function tieneSesionPin24hValida() {
  const expira = parseInt(localStorage.getItem('redone_pin_sesion_expira_v3') || '0', 10);
  return Date.now() < expira;
}

function guardarSesionPin24h() {
  const unDiaMs = 24 * 60 * 60 * 1000;
  localStorage.setItem('redone_pin_sesion_expira_v3', String(Date.now() + unDiaMs));
}

function cerrarSesionPin24h() {
  localStorage.removeItem('redone_pin_sesion_expira_v3');
  abrirModalPin({ modo: 'tecnico', alIniciar: true });
}

// =========================================================================
// VARIABLES GLOBALES
// =========================================================================
let fotosBase64 = [];
let origenActual = 'RedOne';
let categoriaRecepcionActual = 'Celular';
let rolActual = 'tecnico';
let tiendaAutenticadaActual = null;
let folioEditandoId = null;
let tipoReparacionActual = 'Pantalla Incell';

let catPresupuestoActual = 'celular';
let modoReparacionCelular = 'pantalla';
let tipoClienteCot = 'publico';
let plataformaCelular = 'android';
let gamaAndroid = 'baja';
let perfilIphone = 'faceid';
let servicioLaptop = 'display';
let servicioImpresora = 'reset';
let ocultarCostosMostrador = false;

let extrasPresupuesto = [];
let margenIncellPct = 30;
let margenOledPct = 20;
let margenRefaccionPct = 25;
let descuentoClientePct = 0;
let descuentoTiendaPctActual = 15;

const TARIFAS_DEFAULT = {
  margenIncellPct: 30,
  margenOledPct: 20,
  androidBaja: 350,
  androidMedia: 500,
  androidAlta: 850,
  iphoneHome: 550,
  iphoneFaceid: 800,
  iphonePro: 1100,
  laptopDisplay: 550,
  laptopMantto: 450,
  impReset: 300,
  descTiendaPct: 15
};

let tarifasTaller = JSON.parse(localStorage.getItem('redone_tarifas_cotizador_v3')) || { ...TARIFAS_DEFAULT };
margenIncellPct = tarifasTaller.margenIncellPct ?? 30;
margenOledPct = tarifasTaller.margenOledPct ?? 20;
descuentoTiendaPctActual = tarifasTaller.descTiendaPct ?? 15;

// =========================================================================
// DATOS INICIALES EN LOCALSTORAGE
// =========================================================================
const ahora = new Date();
const anioActual = ahora.getFullYear();
const mesActual = String(ahora.getMonth() + 1).padStart(2, '0');
const fechaMesActual = `${anioActual}-${mesActual}-10 10:30`;

const ORDENES_INICIALES = [
  {
    id: 'RN-0001',
    fecha: fechaMesActual,
    origen: 'Ixmicel 1',
    folioTienda: '410',
    encargadoTienda: 'Carlos M.',
    cliente: 'Ixmicel 1',
    telefono: '',
    categoriaEquipo: 'Celular',
    equipoOtroDetalle: '',
    marca: 'Samsung',
    modelo: 'Galaxy A14',
    imei: '',
    clave: '1234',
    accesorios: 'Sin chip',
    tipoReparacion: 'Pantalla Incell',
    falla: 'Display roto sin imagen',
    condiciones: ['Display estrellado'],
    condicionDetalle: 'Marco ligero desgaste',
    costoPieza: 350,
    manoObra: 350,
    costo: 700,
    anticipo: 0,
    saldo: 700,
    garantiaTipo: '100',
    estatus: 'En reparación / Esperando pieza',
    pagadoCorte: false,
    fechaPagoCorte: '',
    notas: 'Incell genérica con marco',
    fotos: []
  },
  {
    id: 'RN-0002',
    fecha: fechaMesActual,
    origen: 'Ixmicel 2',
    folioTienda: '118',
    encargadoTienda: 'Valeria R.',
    cliente: 'Ixmicel 2',
    telefono: '',
    categoriaEquipo: 'Celular',
    equipoOtroDetalle: '',
    marca: 'Xiaomi',
    modelo: 'Redmi Note 12',
    imei: '',
    clave: 'Patrón Z',
    accesorios: '',
    tipoReparacion: 'Pantalla OLED',
    falla: 'Manchas negras en OLED',
    condiciones: ['Enciende', 'Display estrellado'],
    condicionDetalle: '',
    costoPieza: 780,
    manoObra: 500,
    costo: 1280,
    anticipo: 0,
    saldo: 1280,
    garantiaTipo: '100',
    estatus: 'Listo para entregar',
    pagadoCorte: false,
    fechaPagoCorte: '',
    notas: 'Listo para avisar a Ixmicel 2',
    fotos: []
  },
  {
    id: 'RN-0003',
    fecha: fechaMesActual,
    origen: 'SmartCell',
    folioTienda: 'SC-89',
    encargadoTienda: 'Luis G.',
    cliente: 'SmartCell',
    telefono: '',
    categoriaEquipo: 'Celular',
    equipoOtroDetalle: '',
    marca: 'Motorola',
    modelo: 'Moto G54',
    imei: '',
    clave: 'Sin clave',
    accesorios: 'Funda transparente',
    tipoReparacion: 'Otro servicio',
    falla: 'Cambio de centro de carga',
    condiciones: ['Enciende'],
    condicionDetalle: 'Puerto flojo',
    costoPieza: 90,
    manoObra: 350,
    costo: 440,
    anticipo: 0,
    saldo: 440,
    garantiaTipo: '100',
    estatus: 'Entregado',
    pagadoCorte: false,
    fechaPagoCorte: '',
    notas: 'Entregado a SmartCell, pendiente de liquidar en corte',
    fotos: []
  },
  {
    id: 'RN-0004',
    fecha: fechaMesActual,
    origen: 'RedOne',
    folioTienda: '',
    encargadoTienda: '',
    cliente: 'Ana Sofía López',
    telefono: '7721102233',
    categoriaEquipo: 'Celular',
    equipoOtroDetalle: '',
    marca: 'Apple / iPhone',
    modelo: 'iPhone 13',
    imei: '356890112233445',
    clave: '9900',
    accesorios: 'Funda silicona',
    tipoReparacion: 'Pantalla OLED',
    falla: 'Pantalla verde parpadeante',
    condiciones: ['Enciende'],
    condicionDetalle: '',
    costoPieza: 1350,
    manoObra: 800,
    costo: 2150,
    anticipo: 1000,
    saldo: 1150,
    garantiaTipo: '100',
    estatus: 'Listo para entregar',
    pagadoCorte: true,
    fechaPagoCorte: fechaMesActual,
    notas: 'Conservar True Tone',
    fotos: []
  },
  {
    id: 'RN-0005',
    fecha: fechaMesActual,
    origen: 'RedOne',
    folioTienda: '',
    encargadoTienda: '',
    cliente: 'Roberto Mendoza',
    telefono: '7721456789',
    categoriaEquipo: 'Celular',
    equipoOtroDetalle: '',
    marca: 'Samsung',
    modelo: 'Galaxy A54',
    imei: '',
    clave: '4545',
    accesorios: '',
    tipoReparacion: 'Pantalla Incell',
    falla: 'Touch falla en mitad superior',
    condiciones: ['Enciende', 'Display estrellado'],
    condicionDetalle: '',
    costoPieza: 480,
    manoObra: 500,
    costo: 980,
    anticipo: 980,
    saldo: 0,
    garantiaTipo: '50',
    estatus: 'Entregado y Pagado',
    pagadoCorte: true,
    fechaPagoCorte: fechaMesActual,
    notas: 'Liquidado en mostrador',
    fotos: []
  },
  {
    id: 'RN-0006',
    fecha: fechaMesActual,
    origen: 'Ixmicel 1',
    folioTienda: '425',
    encargadoTienda: 'Carlos M.',
    cliente: 'Ixmicel 1',
    telefono: '',
    categoriaEquipo: 'Celular',
    equipoOtroDetalle: '',
    marca: 'Samsung',
    modelo: 'Galaxy A14',
    imei: '',
    clave: '0000',
    accesorios: '',
    tipoReparacion: 'Pantalla Incell',
    falla: 'Sin imagen',
    condiciones: ['Apagado / Sin imagen'],
    condicionDetalle: '',
    costoPieza: 350,
    manoObra: 350,
    costo: 700,
    anticipo: 0,
    saldo: 700,
    garantiaTipo: '100',
    estatus: 'Entregado',
    pagadoCorte: false,
    fechaPagoCorte: '',
    notas: 'Pendiente en corte Ixmicel 1',
    fotos: []
  },
  {
    id: 'RN-0007',
    fecha: fechaMesActual,
    origen: 'RedOne',
    folioTienda: '',
    encargadoTienda: '',
    cliente: 'Fernanda Ruiz',
    telefono: '7729988776',
    categoriaEquipo: 'Celular',
    equipoOtroDetalle: '',
    marca: 'Samsung',
    modelo: 'Galaxy A14',
    imei: '',
    clave: '1122',
    accesorios: '',
    tipoReparacion: 'Otro servicio',
    falla: 'Cambio de batería',
    condiciones: ['Enciende'],
    condicionDetalle: '',
    costoPieza: 220,
    manoObra: 350,
    costo: 570,
    anticipo: 570,
    saldo: 0,
    garantiaTipo: '100',
    estatus: 'Entregado y Pagado',
    pagadoCorte: true,
    fechaPagoCorte: fechaMesActual,
    notas: 'Batería nueva',
    fotos: []
  },
  {
    id: 'RN-0008',
    fecha: fechaMesActual,
    origen: 'Ixmicel 2',
    folioTienda: '129',
    encargadoTienda: 'Valeria R.',
    cliente: 'Ixmicel 2',
    telefono: '',
    categoriaEquipo: 'Celular',
    equipoOtroDetalle: '',
    marca: 'Xiaomi',
    modelo: 'Redmi Note 12',
    imei: '',
    clave: '7878',
    accesorios: '',
    tipoReparacion: 'Otro servicio',
    falla: 'Centro de carga',
    condiciones: ['Enciende'],
    condicionDetalle: '',
    costoPieza: 95,
    manoObra: 400,
    costo: 495,
    anticipo: 0,
    saldo: 495,
    garantiaTipo: '100',
    estatus: 'Entregado',
    pagadoCorte: false,
    fechaPagoCorte: '',
    notas: 'Pendiente en corte Ixmicel 2',
    fotos: []
  },
  {
    id: 'RN-0009',
    fecha: fechaMesActual,
    origen: 'SmartCell',
    folioTienda: 'SC-95',
    encargadoTienda: 'Luis G.',
    cliente: 'SmartCell',
    telefono: '',
    categoriaEquipo: 'Celular',
    equipoOtroDetalle: '',
    marca: 'Apple / iPhone',
    modelo: 'iPhone 13',
    imei: '',
    clave: '5566',
    accesorios: '',
    tipoReparacion: 'Pantalla OLED',
    falla: 'Display quebrado',
    condiciones: ['Display estrellado'],
    condicionDetalle: '',
    costoPieza: 1300,
    manoObra: 750,
    costo: 2050,
    anticipo: 0,
    saldo: 2050,
    garantiaTipo: '100',
    estatus: 'Pendiente de revisar',
    pagadoCorte: false,
    fechaPagoCorte: '',
    notas: 'Revisar Face ID',
    fotos: []
  },
  {
    id: 'RN-0010',
    fecha: fechaMesActual,
    origen: 'RedOne',
    folioTienda: '',
    encargadoTienda: '',
    cliente: 'Diego Hernández',
    telefono: '7725544332',
    categoriaEquipo: 'Otros',
    equipoOtroDetalle: 'Consola de videojuegos',
    marca: 'Sony / PlayStation',
    modelo: 'PS4 Slim',
    imei: '',
    clave: 'N/A',
    accesorios: 'Cable corriente',
    tipoReparacion: 'Otro servicio',
    falla: 'Limpieza y cambio de pasta térmica',
    condiciones: ['Enciende'],
    condicionDetalle: 'Ventilador ruidoso',
    costoPieza: 120,
    manoObra: 450,
    costo: 570,
    anticipo: 570,
    saldo: 0,
    garantiaTipo: '100',
    estatus: 'Entregado y Pagado',
    pagadoCorte: true,
    fechaPagoCorte: fechaMesActual,
    notas: 'Silenciosa y operando',
    fotos: []
  }
];

let ordenes = JSON.parse(localStorage.getItem('redone_ordenes_v3'));
if (!ordenes || !Array.isArray(ordenes) || ordenes.length === 0) {
  ordenes = ORDENES_INICIALES.map(o => ({ ...o }));
  localStorage.setItem('redone_ordenes_v3', JSON.stringify(ordenes));
}

function restaurarDatosEjemplo() {
  if (!confirm('¿Restaurar las 10 órdenes de demostración en este navegador?')) return;
  ordenes = ORDENES_INICIALES.map(o => ({ ...o }));
  localStorage.setItem('redone_ordenes_v3', JSON.stringify(ordenes));
  actualizarContadores();
  renderizarBandeja();
  renderizarDashboard();
  renderizarVistaCortes();
  if (rolActual === 'tienda') renderizarVistaTienda();
}

function obtenerSiguienteFolio() {
  let maxNum = 10;
  ordenes.forEach(o => {
    const match = String(o.id || '').match(/RN-(\d+)/i);
    if (match) {
      const n = parseInt(match[1], 10);
      if (n > maxNum) maxNum = n;
    }
  });
  return 'RN-' + String(maxNum + 1).padStart(4, '0');
}
