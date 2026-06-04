# Mariana Ailin & Pablo Matias — Invitación Digital

Invitación de casamiento digital premium, lista para GitHub Pages.

## Estructura

```
/
├── index.html
├── css/
│   ├── main.css          — Tokens, reset, componentes
│   ├── animations.css    — Keyframes y transiciones
│   └── responsive.css    — Media queries
├── js/
│   ├── config.js         — Toda la configuración editable
│   ├── app.js            — Inicialización principal
│   ├── envelope.js       — Sobre 3D y pantalla de acceso
│   ├── countdown.js      — Cuenta regresiva en tiempo real
│   ├── music.js          — Reproductor flotante con fade
│   ├── gallery.js        — Galería masonry + lightbox propio
│   └── scroll-effects.js — Parallax, partículas, reveal
├── assets/
│   ├── hero.jpg          — Foto principal del hero (reemplazar)
│   ├── music.mp3         — Música de fondo (reemplazar)
│   └── gallery/
│       ├── photo-01.jpg  — Fotos de galería (reemplazar)
│       └── ...
└── README.md
```

## Configuración

Editar **`js/config.js`** para personalizar:

| Campo | Descripción |
|-------|-------------|
| `password` | Clave de acceso al sobre |
| `weddingDate` | Fecha y hora de la boda |
| `event.venue` | Dirección y link a Google Maps |
| `gift.alias` | Alias para transferencia |
| `rsvp.formUrl` | Link al formulario de Google Forms |
| `galleryImages` | Array de imágenes de galería |
| `music.src` | Ruta al archivo de música |
| `playlist.embedUrl` | ID de playlist de Spotify |

## Assets necesarios

Agregar en la carpeta `assets/`:

- **`hero.jpg`** — Foto principal, mínimo 1920×1080px
- **`music.mp3`** — Música de fondo (recomendado: ~4MB máx)
- **`gallery/photo-01.jpg`** … **`photo-09.jpg`** — Fotos de galería

Actualizar el array `galleryImages` en `config.js` si agregás o quitás fotos.

## Deploy en GitHub Pages

```bash
# 1. Crear repositorio en GitHub
# 2. Subir todos los archivos
git init
git add .
git commit -m "Invitación Mariana & Pablo"
git remote add origin https://github.com/usuario/boda.git
git push -u origin main

# 3. Ir a Settings → Pages → Deploy from branch: main
```

La invitación quedará disponible en `https://usuario.github.io/boda/`

## Notas técnicas

- **Sin dependencias externas** — HTML, CSS y JS puro
- **Módulos ES6** — Requiere servidor HTTP para desarrollo local (no abrir `index.html` directamente con `file://`)
- **Desarrollo local**: `npx serve .` o `python -m http.server 8080`
- **Lighthouse**: optimizado para score > 95 en Performance, Accessibility y Best Practices
- **Sesión**: `sessionStorage` — el invitado solo ingresa la clave una vez por pestaña
