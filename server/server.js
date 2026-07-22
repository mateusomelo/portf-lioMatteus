const path = require('path');
const express = require('express');
const cors = require('cors');

const { PORT } = require('./config/env');
require('./config/database'); // garante que o banco e as tabelas existem

const authRoutes = require('./routes/auth.routes');
const projectRoutes = require('./routes/project.routes');
const adminRoutes = require('./routes/admin.routes');
const { startMonitorScheduler } = require('./scheduler/monitor.scheduler');

const ROOT_DIR = path.join(__dirname, '..');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ---------- API ---------- */
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/admin', adminRoutes);

/* ---------- Uploads (screenshots e imagens enviadas) ---------- */
app.use('/uploads', express.static(path.join(ROOT_DIR, 'uploads')));

/* ---------- Área administrativa (estática) ---------- */
app.use('/admin', express.static(path.join(ROOT_DIR, 'admin')));

/* ---------- Site público (estático) ---------- */
app.use(express.static(ROOT_DIR));

/* ---------- Página individual de projeto: /projetos/:slug ---------- */
app.get('/projetos/:slug', (req, res) => {
  res.sendFile(path.join(ROOT_DIR, 'projeto.html'));
});

/* ---------- 404 da API ---------- */
app.use('/api', (req, res) => res.status(404).json({ error: 'Rota não encontrada.' }));

app.listen(PORT, () => {
  console.log(`\n Portfólio rodando em http://localhost:${PORT}`);
  console.log(` Área administrativa em http://localhost:${PORT}/admin/login.html\n`);
  startMonitorScheduler();
});
