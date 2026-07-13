// data.js — placeholder para datos estáticos futuros
// Las versiones de la Biblia se cargan desde GitHub (ver biblia.js)
// Los devocionales y preguntas también se cargan desde GitHub (ver devocional.js / juego.js)

// URL base del sitio, calculada UNA sola vez y compartida por biblia.js,
// devocional.js y juego.js (antes cada archivo la calculaba por su cuenta
// con `location.href.split('/')`, lo cual se rompía apenas la URL traía
// un hash de pestaña como "#biblia" o "#trivia", o un query string,
// porque esos caracteres se colaban dentro de la URL "base" y el fetch
// terminaba apuntando a una ruta que no existe. Por eso funcionaba al
// navegar dentro de la app pero fallaba al recargar la página estando
// en una pestaña distinta de la inicial (o tras el refresh del registro
// en la trivia).
//
// Usamos SOLO `location.pathname` (nunca `location.href`), que no
// incluye ni el hash ni el query string, y le quitamos el nombre de
// archivo final (p. ej. "index.html") si lo trae.
const SITE_BASE_URL = (() => {
  if (!window.location.href.includes('github.io')) return '.';
  let path = window.location.pathname; // ej: '/', '/index.html', '/repo/', '/repo/index.html'
  path = path.replace(/\/[^/]*$/, ''); // quita el archivo final (o la barra final si no hay archivo)
  return window.location.origin + path; // ej: 'https://ccr.github.io' o 'https://usuario.github.io/repo'
})();

// Utilidad compartida: hace fetch con reintentos automáticos.
// Evita que un fallo de red puntual (timeout, CDN lento, etc.) tumbe
// la carga de la Biblia, la trivia o el devocional sin necesidad de
// que el usuario tenga que refrescar manualmente.
async function fetchConReintentos(url, opciones = {}, intentos = 3, esperaMs = 500) {
  let ultimoError;
  for (let intento = 1; intento <= intentos; intento++) {
    try {
      const res = await fetch(url, opciones);
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res;
    } catch (e) {
      ultimoError = e;
      if (intento < intentos) {
        await new Promise(r => setTimeout(r, esperaMs * intento));
      }
    }
  }
  throw ultimoError;
}
