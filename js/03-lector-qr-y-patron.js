// =========================================================================
// MÓDULO 03: LECTOR QR (CÁMARA / USB) Y PATRÓN DE DESBLOQUEO 3x3
// =========================================================================

// =========================================================================
// LECTOR QR
// =========================================================================
let streamCamaraQR = null;
let animFrameQR = null;

function abrirEscanerQR() {
  if (rolActual !== 'tecnico') {
    abrirModalPin({ modo: 'tecnico' });
    return;
  }
  const modal = document.getElementById('modal-escaner-qr');
  const inputManual = document.getElementById('input-qr-manual');
  const estadoBox = document.getElementById('qr-camara-estado');
  const estadoMsg = document.getElementById('qr-camara-msg');

  inputManual.value = '';
  estadoMsg.textContent = 'Iniciando cámara trasera...';
  estadoBox.classList.remove('hidden');
  modal.classList.remove('hidden');

  iniciarCamaraTraseraQR();
}

async function iniciarCamaraTraseraQR() {
  const video = document.getElementById('qr-video');
  const estadoBox = document.getElementById('qr-camara-estado');
  const estadoMsg = document.getElementById('qr-camara-msg');

  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    estadoMsg.textContent = 'Cámara no disponible. Usa escáner USB o ingreso manual abajo.';
    document.getElementById('input-qr-manual').focus();
    return;
  }

  try {
    streamCamaraQR = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: { ideal: 'environment' } },
      audio: false
    });
    video.srcObject = streamCamaraQR;
    await video.play();
    estadoBox.classList.add('hidden');
    escanearFotogramaQR();
  } catch (err) {
    estadoMsg.textContent = 'Sin acceso a cámara. Usa pistola USB o escribe el folio abajo.';
    document.getElementById('input-qr-manual').focus();
  }
}

function escanearFotogramaQR() {
  const video = document.getElementById('qr-video');
  const canvas = document.getElementById('qr-canvas');
  if (!streamCamaraQR) return;

  if (video.readyState === video.HAVE_ENOUGH_DATA && typeof jsQR === 'function') {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, imageData.width, imageData.height, { inversionAttempts: 'dontInvert' });

    if (code && code.data) {
      procesarCodigoLeido(code.data);
      return;
    }
  }
  animFrameQR = requestAnimationFrame(escanearFotogramaQR);
}

function detenerCamaraQR() {
  if (animFrameQR) {
    cancelAnimationFrame(animFrameQR);
    animFrameQR = null;
  }
  if (streamCamaraQR) {
    streamCamaraQR.getTracks().forEach(track => track.stop());
    streamCamaraQR = null;
  }
  const video = document.getElementById('qr-video');
  if (video) video.srcObject = null;
}

function cerrarEscanerQR() {
  detenerCamaraQR();
  document.getElementById('modal-escaner-qr').classList.add('hidden');
}

function procesarCodigoLeido(rawData) {
  const texto = String(rawData || '').trim();
  if (!texto) return;

  let folioExtraido = texto;
  const matchUrl = texto.match(/[?&]orden=([^&]+)/i);
  if (matchUrl && matchUrl[1]) {
    folioExtraido = decodeURIComponent(matchUrl[1]).trim();
  } else {
    const matchRN = texto.match(/RN-\d+/i);
    if (matchRN) folioExtraido = matchRN[0].toUpperCase();
  }

  cerrarEscanerQR();
  cargarOrdenParaEditar(folioExtraido);
}

// =========================================================================
// PATRÓN DE DESBLOQUEO INTERACTIVO 3x3 (v3.2)
// =========================================================================
let secuenciaPatronActual = [];
let dibujandoPatron = false;

const COORDENADAS_NODOS_PATRON = [
  { id: 1, x: 45, y: 45 },
  { id: 2, x: 120, y: 45 },
  { id: 3, x: 195, y: 45 },
  { id: 4, x: 45, y: 120 },
  { id: 5, x: 120, y: 120 },
  { id: 6, x: 195, y: 120 },
  { id: 7, x: 45, y: 195 },
  { id: 8, x: 120, y: 195 },
  { id: 9, x: 195, y: 195 }
];

function parsearSecuenciaDesdeTexto(texto) {
  const m = String(texto || '').match(/Patr[oó]n:\s*([1-9](?:-[1-9])*)/i);
  if (!m) return [];
  return m[1].split('-').map(n => parseInt(n, 10)).filter(n => n >= 1 && n <= 9);
}

function generarSVGMiniPatron(secuencia) {
  if (!secuencia || secuencia.length === 0) return '';
  let linesHtml = '';
  for (let i = 0; i < secuencia.length - 1; i++) {
    const a = COORDENADAS_NODOS_PATRON[secuencia[i] - 1];
    const b = COORDENADAS_NODOS_PATRON[secuencia[i + 1] - 1];
    if (a && b) {
      linesHtml += `<line x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}" stroke="#818cf8" stroke-width="14" stroke-linecap="round" />`;
    }
  }
  const nodesHtml = COORDENADAS_NODOS_PATRON.map(n => {
    const idx = secuencia.indexOf(n.id);
    const activo = idx !== -1;
    const esInicio = idx === 0;
    const fill = esInicio ? '#34d399' : (activo ? '#818cf8' : '#475569');
    const r = activo ? 14 : 9;
    return `<circle cx="${n.x}" cy="${n.y}" r="${r}" fill="${fill}" />`;
  }).join('');
  return `<svg viewBox="0 0 240 240" class="w-9 h-9 bg-slate-900 rounded-lg border border-slate-700 p-0.5">${linesHtml}${nodesHtml}</svg>`;
}

function actualizarPreviewPatronInline() {
  const val = document.getElementById('clave')?.value || '';
  const sec = parsearSecuenciaDesdeTexto(val);
  const wrap = document.getElementById('preview-patron-inline');
  if (!wrap) return;
  if (sec.length > 0) {
    document.getElementById('svg-preview-patron-inline').innerHTML = generarSVGMiniPatron(sec);
    document.getElementById('txt-preview-patron-inline').textContent = sec.join(' → ');
    wrap.classList.remove('hidden');
  } else {
    wrap.classList.add('hidden');
  }
}

function limpiarPatronInline() {
  const input = document.getElementById('clave');
  if (input) {
    input.value = '';
    actualizarPreviewPatronInline();
    actualizarVista();
  }
}

function abrirModalPatron() {
  const existente = parsearSecuenciaDesdeTexto(document.getElementById('clave').value);
  secuenciaPatronActual = existente.length ? [...existente] : [];
  dibujandoPatron = false;
  renderizarPadPatron();
  document.getElementById('modal-patron').classList.remove('hidden');
}

function cerrarModalPatron() {
  dibujandoPatron = false;
  document.getElementById('modal-patron').classList.add('hidden');
}

function reiniciarDibujoPatron() {
  secuenciaPatronActual = [];
  dibujandoPatron = false;
  const activeLine = document.getElementById('patron-active-line');
  if (activeLine) activeLine.classList.add('hidden');
  renderizarPadPatron();
}

function renderizarPadPatron() {
  const linesGroup = document.getElementById('patron-lines-group');
  const nodesGroup = document.getElementById('patron-nodes-group');
  const txtEl = document.getElementById('patron-secuencia-texto');
  if (!linesGroup || !nodesGroup) return;

  let linesSvg = '';
  for (let i = 0; i < secuenciaPatronActual.length - 1; i++) {
    const n1 = COORDENADAS_NODOS_PATRON[secuenciaPatronActual[i] - 1];
    const n2 = COORDENADAS_NODOS_PATRON[secuenciaPatronActual[i + 1] - 1];
    if (n1 && n2) {
      linesSvg += `<line x1="${n1.x}" y1="${n1.y}" x2="${n2.x}" y2="${n2.y}" stroke="#6366f1" stroke-width="6" stroke-linecap="round" />`;
    }
  }
  linesGroup.innerHTML = linesSvg;

  nodesGroup.innerHTML = COORDENADAS_NODOS_PATRON.map(n => {
    const idx = secuenciaPatronActual.indexOf(n.id);
    const activo = idx !== -1;
    const esInicio = idx === 0;
    const anilloStroke = esInicio ? '#34d399' : (activo ? '#818cf8' : '#334155');
    const anilloFill = activo ? 'rgba(99, 102, 241, 0.22)' : 'rgba(15, 23, 42, 0.9)';
    const puntoFill = esInicio ? '#34d399' : (activo ? '#a5b4fc' : '#64748b');
    return `
      <g>
        <circle cx="${n.x}" cy="${n.y}" r="22" fill="${anilloFill}" stroke="${anilloStroke}" stroke-width="2.5" />
        <circle cx="${n.x}" cy="${n.y}" r="7" fill="${puntoFill}" />
        <text x="${n.x}" y="${n.y - 25}" text-anchor="middle" fill="#64748b" font-size="10" font-family="monospace">${n.id}</text>
      </g>
    `;
  }).join('');

  if (secuenciaPatronActual.length > 0) {
    txtEl.textContent = `Patrón: ${secuenciaPatronActual.join('-')}`;
  } else {
    txtEl.textContent = 'Toca o desliza para iniciar';
  }
}

function obtenerCoordenadasSVGPatron(clientX, clientY) {
  const svg = document.getElementById('patron-svg');
  const rect = svg.getBoundingClientRect();
  return {
    x: ((clientX - rect.left) / rect.width) * 240,
    y: ((clientY - rect.top) / rect.height) * 240
  };
}

function detectarNodoEnPunto(pt, radio = 26) {
  for (const n of COORDENADAS_NODOS_PATRON) {
    const dist = Math.hypot(pt.x - n.x, pt.y - n.y);
    if (dist <= radio) return n.id;
  }
  return null;
}

function agregarNodoConIntermedios(idNuevo) {
  if (secuenciaPatronActual.includes(idNuevo)) return;
  if (secuenciaPatronActual.length > 0) {
    const ultimo = secuenciaPatronActual[secuenciaPatronActual.length - 1];
    const a = COORDENADAS_NODOS_PATRON[ultimo - 1];
    const b = COORDENADAS_NODOS_PATRON[idNuevo - 1];
    const midX = (a.x + b.x) / 2;
    const midY = (a.y + b.y) / 2;
    const intermedio = COORDENADAS_NODOS_PATRON.find(n => n.x === midX && n.y === midY);
    if (intermedio && !secuenciaPatronActual.includes(intermedio.id)) {
      secuenciaPatronActual.push(intermedio.id);
    }
  }
  secuenciaPatronActual.push(idNuevo);
  renderizarPadPatron();
}

(function inicializarEventosPadPatron() {
  const pad = document.getElementById('patron-pad-container');
  if (!pad) return;

  const iniciar = (clientX, clientY) => {
    const pt = obtenerCoordenadasSVGPatron(clientX, clientY);
    const nodo = detectarNodoEnPunto(pt);
    if (nodo) {
      secuenciaPatronActual = [nodo];
      dibujandoPatron = true;
      renderizarPadPatron();
    }
  };

  const mover = (clientX, clientY) => {
    if (!dibujandoPatron) return;
    const pt = obtenerCoordenadasSVGPatron(clientX, clientY);
    const nodo = detectarNodoEnPunto(pt);
    if (nodo) {
      agregarNodoConIntermedios(nodo);
    }
    const activeLine = document.getElementById('patron-active-line');
    if (activeLine && secuenciaPatronActual.length > 0) {
      const ultimo = COORDENADAS_NODOS_PATRON[secuenciaPatronActual[secuenciaPatronActual.length - 1] - 1];
      activeLine.setAttribute('x1', ultimo.x);
      activeLine.setAttribute('y1', ultimo.y);
      activeLine.setAttribute('x2', pt.x);
      activeLine.setAttribute('y2', pt.y);
      activeLine.classList.remove('hidden');
    }
  };

  const finalizar = () => {
    dibujandoPatron = false;
    const activeLine = document.getElementById('patron-active-line');
    if (activeLine) activeLine.classList.add('hidden');
  };

  pad.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    iniciar(e.clientX, e.clientY);
  });
  window.addEventListener('pointermove', (e) => {
    if (dibujandoPatron) {
      e.preventDefault();
      mover(e.clientX, e.clientY);
    }
  });
  window.addEventListener('pointerup', finalizar);
  window.addEventListener('pointercancel', finalizar);
})();

function confirmarPatronDibujado() {
  if (secuenciaPatronActual.length === 0) {
    alert('Dibuja al menos un punto en la cuadrícula 3×3.');
    return;
  }
  document.getElementById('clave').value = `Patrón: ${secuenciaPatronActual.join('-')}`;
  actualizarPreviewPatronInline();
  actualizarVista();
  cerrarModalPatron();
}
