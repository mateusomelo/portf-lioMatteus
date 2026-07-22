/**
 * Verifica se uma URL está online e mede o tempo de resposta.
 * Retorna também os headers da resposta, reaproveitados pelo iframeService
 * para evitar uma segunda requisição.
 */
const TIMEOUT_MS = 10000;

async function checkHealth(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
  const start = Date.now();

  try {
    const response = await fetch(url, {
      method: 'GET',
      redirect: 'follow',
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; PortfolioMonitor/1.0; +https://github.com/mateusomelo)'
      }
    });

    const responseTimeMs = Date.now() - start;

    return {
      online: response.ok || (response.status >= 200 && response.status < 500),
      responseTimeMs,
      headers: response.headers,
      finalUrl: response.url || url
    };
  } catch (err) {
    return {
      online: false,
      responseTimeMs: null,
      headers: null,
      finalUrl: url
    };
  } finally {
    clearTimeout(timeout);
  }
}

module.exports = { checkHealth };
