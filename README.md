<div align="center">
<h1 align="center">Pokedex: HTML, CSS y JavaScript Vanilla</h1>
</div>

Pokedex hecha con HTML, CSS y JavaScript puro (sin frameworks), que consume la [PokéAPI](https://pokeapi.co/) para listar Pokémon, buscarlos por nombre o número, y ver el detalle de cada uno: tipo, peso, altura, habilidades y stats base.

## Funcionalidades

- Listado con carga paginada ("Cargar más") en vez de traer todo de una vez.
- Búsqueda en vivo por nombre o número, con orden configurable.
- Detalle de cada Pokémon con navegación por flechas (anterior/siguiente).
- Colores dinámicos según el tipo de cada Pokémon.

## Correr en local

Es un sitio estático, no necesita build ni instalar dependencias. Alcanza con abrir `index.html` en el navegador, o servirlo con cualquier servidor estático, por ejemplo:

```bash
npx serve .
```

## Deploy en Netlify

1. En [Netlify](https://app.netlify.com) → **Add new site → Import an existing project**, elegí este repo de GitHub.
2. Build command: dejar vacío. Publish directory: `.` (raíz del repo) — ya viene configurado en `netlify.toml`.
3. Deploy. No necesita variables de entorno, la PokéAPI es pública y no requiere key.

También se puede desplegar igual de bien en [Vercel](https://vercel.com) con la misma configuración (sin build command, directorio raíz).
