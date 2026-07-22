const healthcheckService = require('./healthcheck.service');
const iframeService = require('./iframe.service');
const screenshotService = require('./screenshot.service');

/**
 * Orquestra a verificação completa de um projeto:
 * 1. Checa se está online e mede o tempo de resposta.
 * 2. Se online, verifica se o site pode ser incorporado em iframe.
 * 3. Se não puder (ou estiver offline), gera/atualiza uma screenshot automática.
 *
 * O visitante nunca precisa saber qual caminho foi usado: o card sempre
 * terá um conteúdo visual (iframe ao vivo OU screenshot), nunca vazio.
 */
async function verifyProject(project) {
  const health = await healthcheckService.checkHealth(project.url);

  const result = {
    status: health.online ? 'online' : 'offline',
    response_time_ms: health.responseTimeMs,
    embeddable: false,
    screenshot_path: project.screenshot_path || null,
    last_checked_at: new Date().toISOString()
  };

  if (health.online) {
    result.embeddable = iframeService.isEmbeddable(health.headers);
  }

  const needsScreenshot = health.online && !result.embeddable;

  if (needsScreenshot) {
    try {
      result.screenshot_path = await screenshotService.captureScreenshot(project.url, project.slug);
    } catch (err) {
      // Mantém a screenshot anterior (se existir) em caso de falha na captura,
      // para que o card nunca fique sem uma imagem de capa.
      console.error(`[verification] Falha ao capturar screenshot de "${project.name}":`, err.message);
    }
  }

  return result;
}

module.exports = { verifyProject };
