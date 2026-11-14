// ==========================================================
// Explorador de Episodios · Rick and Morty (Variante C)
// Autora: Rocio Insaurralde
// ==========================================================

// ---------- Constantes ----------
const URL_API = 'https://rickandmortyapi.com/api/episode';
const CLAVE_STORAGE = 'ultimaBusquedaEpisodios';
const TEXTO_DESCONOCIDO = 'Desconocido';

// ---------- Referencias al DOM ----------
const formulario = document.querySelector('#formulario-busqueda');
const campoNombre = document.querySelector('#campo-nombre');
const campoTemporada = document.querySelector('#campo-temporada');
const botonBuscar = document.querySelector('#boton-buscar');
const mensaje = document.querySelector('#mensaje');
const grillaResultados = document.querySelector('#grilla-resultados');

// ==========================================================
// Utilidades
// ==========================================================

// Devuelve «Desconocido» si el valor viene vacío o como "unknown".
const valorOdesconocido = (valor) => {
  const texto = String(valor ?? '').trim();
  return texto === '' || texto.toLowerCase() === 'unknown' ? TEXTO_DESCONOCIDO : texto;
};

// Convierte "December 2, 2013" en "2 dic 2013".
const formatearFecha = (fechaTexto) => {
  const fecha = new Date(fechaTexto);
  if (Number.isNaN(fecha.getTime())) {
    return valorOdesconocido(fechaTexto);
  }
  return fecha.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
};

// ==========================================================
// Petición a la API (R4)
// ==========================================================

// Arma la URL con new URL() y searchParams (solo agrega los criterios usados).
const construirUrl = (nombre, temporada) => {
  const url = new URL(URL_API);
  if (nombre) {
    url.searchParams.set('name', nombre);
  }
  if (temporada) {
    url.searchParams.set('episode', temporada);
  }
  return url;
};

// Pide los episodios. Devuelve { total, episodios } (vacío si la API responde 404).
const obtenerEpisodios = async (nombre, temporada) => {
  const respuesta = await fetch(construirUrl(nombre, temporada));

  if (respuesta.status === 404) {
    return { total: 0, episodios: [] };
  }
  if (!respuesta.ok) {
    throw new Error(`La API respondió con el código ${respuesta.status}`);
  }

  const datos = await respuesta.json();
  return { total: datos.info.count, episodios: datos.results };
};

// ==========================================================
// Interfaz: mensajes, botón y tarjetas
// ==========================================================

// Muestra un mensaje de estado. tipo: 'info' | 'cargando' | 'exito' | 'aviso' | 'error'
const mostrarMensaje = (texto, tipo = 'info') => {
  mensaje.textContent = texto;
  mensaje.className = `mensaje mensaje--${tipo}`;
};

const limpiarResultados = () => {
  grillaResultados.replaceChildren();
};

// Activa o desactiva el estado «Buscando…» del botón.
const cambiarEstadoCargando = (estaCargando) => {
  botonBuscar.disabled = estaCargando;
  botonBuscar.textContent = estaCargando ? 'Buscando…' : 'Buscar';
};

// Crea un par <dt>/<dd> para la lista de datos de la tarjeta.
const crearDato = (etiqueta, valor) => {
  const termino = document.createElement('dt');
  termino.textContent = etiqueta;

  const definicion = document.createElement('dd');
  definicion.textContent = valor;

  return [termino, definicion];
};

// Crea la tarjeta de un episodio con createElement y textContent (R6).
const crearTarjeta = (episodio) => {
  const tarjeta = document.createElement('article');
  tarjeta.classList.add('tarjeta');

  const codigo = document.createElement('span');
  codigo.classList.add('tarjeta__codigo');
  codigo.textContent = valorOdesconocido(episodio.episode);

  const nombre = document.createElement('h3');
  nombre.classList.add('tarjeta__nombre');
  nombre.textContent = valorOdesconocido(episodio.name);

  const datos = document.createElement('dl');
  datos.classList.add('tarjeta__datos');
  datos.append(
    ...crearDato('Emisión', formatearFecha(episodio.air_date)),
    ...crearDato('Personajes', String(episodio.characters?.length ?? 0)),
  );

  tarjeta.append(codigo, nombre, datos);
  return tarjeta;
};

// Arma el texto «Se encontraron N episodios» (aclara si la API mostró solo una parte).
const crearTextoResumen = (total, mostrados) => {
  const encabezado = total === 1 ? 'Se encontró 1 episodio.' : `Se encontraron ${total} episodios.`;
  const aclaracion = mostrados < total ? ` Se muestran los primeros ${mostrados}.` : '';
  return `${encabezado}${aclaracion}`;
};

// Dibuja todas las tarjetas en la grilla.
const mostrarTarjetas = (episodios) => {
  const tarjetas = episodios.map(crearTarjeta);
  grillaResultados.replaceChildren(...tarjetas);
};

// ==========================================================
// Persistencia con localStorage (R8)
// ==========================================================

const guardarBusqueda = (nombre, temporada) => {
  localStorage.setItem(CLAVE_STORAGE, JSON.stringify({ nombre, temporada }));
};

const leerBusquedaGuardada = () => {
  try {
    return JSON.parse(localStorage.getItem(CLAVE_STORAGE));
  } catch {
    return null;
  }
};

// ==========================================================
// Búsqueda (R5 y R7)
// ==========================================================

const buscarEpisodios = async (nombre, temporada) => {
  cambiarEstadoCargando(true);
  mostrarMensaje('Buscando…', 'cargando');
  limpiarResultados();

  try {
    const { total, episodios } = await obtenerEpisodios(nombre, temporada);

    if (episodios.length === 0) {
      mostrarMensaje('Sin resultados: no hay episodios que coincidan con tu búsqueda.', 'aviso');
      return;
    }

    mostrarTarjetas(episodios);
    mostrarMensaje(crearTextoResumen(total, episodios.length), 'exito');
  } catch (error) {
    console.warn('Error al buscar episodios:', error);
    mostrarMensaje('Ocurrió un error al conectar con la API. Revisa tu conexión e inténtalo de nuevo.', 'error');
  } finally {
    cambiarEstadoCargando(false);
  }
};

// Maneja el envío del formulario.
const manejarEnvio = (evento) => {
  evento.preventDefault();

  const nombre = campoNombre.value.trim();
  const temporada = campoTemporada.value;

  if (!nombre && !temporada) {
    limpiarResultados();
    mostrarMensaje('Escribe un nombre o elige una temporada antes de buscar.', 'aviso');
    campoNombre.focus();
    return;
  }

  guardarBusqueda(nombre, temporada);
  buscarEpisodios(nombre, temporada);
};

// Al cargar la página, completa los campos y repite la última búsqueda.
const restaurarUltimaBusqueda = () => {
  const busqueda = leerBusquedaGuardada();
  if (!busqueda || (!busqueda.nombre && !busqueda.temporada)) {
    return;
  }

  campoNombre.value = busqueda.nombre ?? '';
  campoTemporada.value = busqueda.temporada ?? '';
  buscarEpisodios(campoNombre.value, campoTemporada.value);
};

// ---------- Inicio ----------
formulario.addEventListener('submit', manejarEnvio);
restaurarUltimaBusqueda();
