# Explorador de Episodios · Rick and Morty

Página web de una sola pantalla para buscar episodios de la serie *Rick and Morty* por nombre y por temporada,
usando la [API REST pública de Rick and Morty](https://rickandmortyapi.com/documentation). Permite encontrar
rápidamente un episodio y ver su código, su fecha de emisión y cuántos personajes aparecen.

**Autora:** Rocio Insaurralde · Fundamentos de Desarrollo Web · UCSA

**Variante del TP:** C · Episodios (`https://rickandmortyapi.com/api/episode`)

## Sitios publicados

- GitHub Pages: https://roochi01.github.io/tp-insaurralde-rocio/
- Vercel: https://tp-insaurralde-rocio.vercel.app/
- Repositorio: https://github.com/roochi01/tp-insaurralde-rocio

## Captura

![Captura del Explorador de Episodios](img/captura.png)

## Funcionalidades

- Búsqueda por **nombre del episodio** y filtro por **temporada** (S01 a S05). Ambos criterios se combinan en la
  misma petición (`?name=...&episode=...`).
- Cada resultado se muestra en una tarjeta con el nombre, el código (por ejemplo, `S01E01`), la fecha de emisión
  (`air_date`) y la cantidad de personajes (`characters.length`).
- Mientras espera la respuesta muestra «Buscando…» y desactiva el botón.
- Informa cuando no hay resultados (la API responde 404) y cuando ocurre un error de conexión.
- Muestra «Desconocido» si algún dato viene vacío o como `unknown`.
- Guarda la última búsqueda en `localStorage` y la repite automáticamente al recargar.
- Se adapta a pantallas de celular (probada a 375 px de ancho).
- Muestra el número de versión en el pie de página.

## Tecnologías

- HTML5 semántico (`header`, `main`, `section`, `footer`, `form` con `label`)
- CSS3: variables en `:root`, Flexbox, Grid con `repeat(auto-fill, minmax(...))` y media queries
- JavaScript (ES6+): `fetch`, `async/await`, `try/catch/finally`, `new URL()` y `searchParams`,
  `createElement`/`textContent`
- Fetch API, `localStorage` y la API de Rick and Morty
- Git, GitHub, GitHub Pages y Vercel

## Estructura del proyecto

```
tp-insaurralde-rocio/
├── index.html          Estructura de la página: encabezado, buscador, resultados y pie con la versión
├── README.md           Documentación técnica del proyecto
├── .gitignore          Archivos que Git no debe versionar (sistema, editor, node_modules, .env)
├── css/
│   └── estilos.css     Estilos, variables de color y diseño adaptable a celulares
├── js/
│   └── app.js          Lógica: lectura del formulario, petición a la API, tarjetas y localStorage
└── img/
    └── captura.png     Captura de la aplicación usada en este README
```

## Cómo ejecutarlo localmente

1. Clonar el repositorio:

   ```bash
   git clone https://github.com/roochi01/tp-insaurralde-rocio.git
   ```

2. Abrir `index.html` en el navegador (o con la extensión *Live Server* de VS Code).

No necesita instalación ni servidor propio: los datos se piden directamente a la API pública.

### Cómo probar los estados

- **Sin criterios:** presionar **Buscar** con los campos vacíos muestra un aviso y no hace la petición.
- **Sin resultados:** buscar `zzzz` muestra «Sin resultados» (la API responde 404).
- **Error de conexión:** en DevTools → Network elegir *Offline* y buscar: aparece un mensaje de error
  y el botón vuelve a habilitarse.
- **Persistencia:** buscar algo y recargar la página (F5): los campos se completan y la búsqueda se repite.

## Despliegue

El sitio es estático (HTML, CSS y JavaScript sin paso de compilación), así que se publica tal cual desde la
raíz del repositorio en dos plataformas:

- **GitHub Pages:** Settings → Pages → *Deploy from a branch*, rama `main`, carpeta `/ (root)`.
- **Vercel:** proyecto importado desde este repositorio con el preset *Other*, sin comando de build y con la
  raíz como directorio de salida.

Las dos plataformas están conectadas a la rama `main`: cada `git push` a `main` vuelve a publicar el sitio
automáticamente (despliegue continuo), sin subir archivos a mano. Para comprobarlo se cambia el número de
versión del pie (`<span id="version">` en `index.html`) y, después del push, ambas URL muestran la versión nueva.
