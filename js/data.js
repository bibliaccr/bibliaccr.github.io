// data.js — placeholder para datos estáticos futuros
// Las versiones de la Biblia se cargan desde GitHub (ver biblia.js)
// Los devocionales y preguntas también se cargan desde GitHub (ver devocional.js / juego.js)

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
