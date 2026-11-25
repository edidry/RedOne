# RedOne v3.2 — Base Modular

Estructura profesional desacoplada a partir de `RedOne_v3.2_2.html`, lista para escalar, mantener o subir a hosting estático / GitHub / Netlify.

## Estructura de Carpetas

```text
RedOne_v3.2_Modular/
├── index.html                           # Maquetado principal y modales
├── css/
│   └── styles.css                       # Estilos de impresión térmica (58mm/80mm/etiqueta) y animaciones
└── js/
    ├── 01-config-y-estado.js            # Configuración, etiquetas editables, paletas y datos iniciales
    ├── 02-seguridad-y-tiendas.js        # Sistema de PIN (24h), roles y CRUD de tiendas aliadas
    ├── 03-lector-qr-y-patron.js         # Escáner QR (cámara trasera / pistola USB) y patrón 3×3
    ├── 04-cotizador-presupuestos.js     # Cotizador completo, extras múltiples y tarifas base
    ├── 05-navegacion-dashboard-tienda.js# Pestañas, Dashboard ejecutivo y vista de sucursales
    ├── 06-recepcion-bandeja-fotos.js    # Formulario de recepción, bandeja de taller y compresión de fotos
    ├── 07-tickets-whatsapp-cortes.js    # Vista previa de tickets, QR, WhatsApp y cortes de caja
    └── 08-app-init.js                   # Arranque e inicialización de la aplicación
```

## Uso
Abre `index.html` directamente en cualquier navegador moderno (Chrome, Brave, Edge) o despliégalo en cualquier servidor estático sin necesidad de compilación.
