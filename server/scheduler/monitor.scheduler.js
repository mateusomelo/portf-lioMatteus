const cron = require('node-cron');
const projectRepository = require('../repositories/project.repository');
const verificationService = require('../services/verification.service');

/**
 * A cada 6 horas, reverifica todos os projetos cadastrados:
 * status online/offline, tempo de resposta e, se necessário, nova screenshot.
 * Roda sequencialmente para não sobrecarregar o servidor com várias
 * instâncias do Chromium simultâneas.
 */
async function runMonitorCycle() {
  const projects = projectRepository.findAll();
  console.log(`[scheduler] Iniciando verificação de ${projects.length} projeto(s)...`);

  for (const project of projects) {
    try {
      const result = await verificationService.verifyProject(project);
      projectRepository.updateVerification(project.id, result);
      console.log(`[scheduler] "${project.name}" -> ${result.status} (${result.response_time_ms ?? '—'}ms)`);
    } catch (err) {
      console.error(`[scheduler] Falha ao verificar "${project.name}":`, err.message);
    }
  }

  console.log('[scheduler] Ciclo de verificação concluído.');
}

function startMonitorScheduler() {
  cron.schedule('0 */6 * * *', () => {
    runMonitorCycle().catch((err) => console.error('[scheduler] Erro no ciclo:', err));
  });
  console.log('[scheduler] Monitoramento automático agendado (a cada 6 horas).');
}

module.exports = { startMonitorScheduler, runMonitorCycle };
