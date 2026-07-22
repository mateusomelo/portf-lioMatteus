'use strict';

const API_BASE = '/api';
const TOKEN_KEY = 'mom_admin_token';

function getToken() { return localStorage.getItem(TOKEN_KEY); }
function setToken(token) { localStorage.setItem(TOKEN_KEY, token); }
function clearToken() { localStorage.removeItem(TOKEN_KEY); }

async function api(path, options = {}) {
  const headers = options.headers || {};
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (!(options.body instanceof FormData) && options.body) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${API_BASE}${path}`, { ...options, headers });

  if (response.status === 401) {
    clearToken();
    window.location.href = 'login.html';
    throw new Error('Não autenticado.');
  }

  if (response.status === 204) return null;

  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || 'Erro na requisição.');
  return data;
}

/* ---------------------- LOGIN PAGE ---------------------- */
function initLoginPage() {
  const form = document.getElementById('loginForm');
  if (!form) return;

  if (getToken()) {
    window.location.href = 'dashboard.html';
    return;
  }

  const errorEl = document.getElementById('loginError');
  const btnText = document.getElementById('loginBtnText');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorEl.textContent = '';
    btnText.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Entrando...';

    try {
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value;
      const data = await api('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
      setToken(data.token);
      window.location.href = 'dashboard.html';
    } catch (err) {
      errorEl.textContent = err.message || 'Não foi possível entrar.';
      btnText.innerHTML = '<i class="fa-solid fa-right-to-bracket"></i> Entrar';
    }
  });
}

/* ---------------------- DASHBOARD PAGE ---------------------- */
function initDashboardPage() {
  const tableBody = document.getElementById('projectsTableBody');
  if (!tableBody) return;

  if (!getToken()) {
    window.location.href = 'login.html';
    return;
  }

  const emptyState = document.getElementById('emptyState');
  const newProjectBtn = document.getElementById('newProjectBtn');
  const logoutBtn = document.getElementById('logoutBtn');
  const modalOverlay = document.getElementById('projectModalOverlay');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const projectForm = document.getElementById('projectForm');
  const modalTitle = document.getElementById('modalTitle');
  const saveBtnText = document.getElementById('saveBtnText');
  const formFeedback = document.getElementById('formFeedback');
  const toast = document.getElementById('toast');

  let toastTimer = null;
  function showToast(message, type = 'success') {
    toast.textContent = message;
    toast.className = `admin-toast show ${type}`;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 3500);
  }

  function statusBadge(status) {
    const map = {
      online: { icon: '🟢', label: 'Online' },
      offline: { icon: '🔴', label: 'Offline' },
      checking: { icon: '🟡', label: 'Verificando' }
    };
    const info = map[status] || map.checking;
    return `<span class="admin-badge ${status}">${info.icon} ${info.label}</span>`;
  }

  function formatDate(iso) {
    if (!iso) return '—';
    const date = new Date(iso);
    return date.toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  }

  async function loadProjects() {
    tableBody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:40px; color:var(--gray);">Carregando...</td></tr>`;
    try {
      const { projects } = await api('/admin/projects');

      if (!projects.length) {
        tableBody.innerHTML = '';
        emptyState.style.display = 'block';
        return;
      }
      emptyState.style.display = 'none';

      tableBody.innerHTML = projects.map((p) => `
        <tr>
          <td>
            <div class="admin-project-name">
              <img class="admin-project-thumb" src="${p.custom_image || p.screenshot_path || ''}" onerror="this.style.visibility='hidden'" alt="">
              <div>
                <strong>${escapeHtml(p.name)}</strong>
                <div style="font-size:0.75rem; color:var(--gray);">${escapeHtml((p.url || '').replace(/^https?:\/\//, ''))}</div>
              </div>
            </div>
          </td>
          <td>${escapeHtml(p.category || '—')}</td>
          <td>${p.featured ? '<i class="fa-solid fa-star" style="color:var(--neon-blue)"></i>' : '—'}</td>
          <td>${statusBadge(p.status)}</td>
          <td>${p.response_time_ms != null ? p.response_time_ms + ' ms' : '—'}</td>
          <td>${formatDate(p.last_checked_at)}</td>
          <td>
            <div class="admin-row-actions">
              <button class="admin-icon-btn" title="Reverificar" data-action="recheck" data-id="${p.id}"><i class="fa-solid fa-rotate"></i></button>
              <button class="admin-icon-btn" title="Editar" data-action="edit" data-id="${p.id}"><i class="fa-solid fa-pen"></i></button>
              <button class="admin-icon-btn danger" title="Excluir" data-action="delete" data-id="${p.id}"><i class="fa-solid fa-trash"></i></button>
            </div>
          </td>
        </tr>
      `).join('');

      window.__projects = projects;
    } catch (err) {
      tableBody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:40px; color:#ff6b6b;">${escapeHtml(err.message)}</td></tr>`;
    }
  }

  function escapeHtml(str) {
    return String(str || '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  function openModal(project = null) {
    projectForm.reset();
    document.getElementById('projectId').value = project ? project.id : '';
    modalTitle.textContent = project ? 'Editar Projeto' : 'Novo Projeto';
    formFeedback.textContent = '';

    if (project) {
      document.getElementById('pName').value = project.name || '';
      document.getElementById('pDescription').value = project.description || '';
      document.getElementById('pUrl').value = project.url || '';
      document.getElementById('pGithub').value = project.github_url || '';
      document.getElementById('pTechnologies').value = (project.technologies || []).join(', ');
      document.getElementById('pCategory').value = project.category || '';
      document.getElementById('pColor').value = project.card_color || '#00e0ff';
      document.getElementById(project.featured ? 'featuredYes' : 'featuredNo').checked = true;
    }

    modalOverlay.classList.add('active');
  }

  function closeModal() { modalOverlay.classList.remove('active'); }

  newProjectBtn.addEventListener('click', () => openModal());
  closeModalBtn.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', (e) => { if (e.target === modalOverlay) closeModal(); });

  projectForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('projectId').value;
    const formData = new FormData(projectForm);
    formData.set('featured', projectForm.querySelector('input[name="featured"]:checked').value);

    saveBtnText.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Verificando site e salvando...';
    formFeedback.textContent = '';

    try {
      if (id) {
        await api(`/admin/projects/${id}`, { method: 'PUT', body: formData });
        showToast('Projeto atualizado com sucesso!');
      } else {
        await api('/admin/projects', { method: 'POST', body: formData });
        showToast('Projeto criado e verificado com sucesso!');
      }
      closeModal();
      loadProjects();
    } catch (err) {
      formFeedback.style.color = '#ff6b6b';
      formFeedback.textContent = err.message;
    } finally {
      saveBtnText.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Salvar Projeto';
    }
  });

  tableBody.addEventListener('click', async (e) => {
    const btn = e.target.closest('button[data-action]');
    if (!btn) return;
    const id = btn.dataset.id;
    const action = btn.dataset.action;
    const project = (window.__projects || []).find((p) => String(p.id) === id);

    if (action === 'edit') {
      openModal(project);
    } else if (action === 'delete') {
      if (!confirm(`Excluir o projeto "${project.name}"? Essa ação não pode ser desfeita.`)) return;
      try {
        await api(`/admin/projects/${id}`, { method: 'DELETE' });
        showToast('Projeto excluído.');
        loadProjects();
      } catch (err) {
        showToast(err.message, 'error');
      }
    } else if (action === 'recheck') {
      btn.querySelector('i').classList.add('fa-spin');
      try {
        await api(`/admin/projects/${id}/recheck`, { method: 'POST' });
        showToast('Verificação concluída.');
        loadProjects();
      } catch (err) {
        showToast(err.message, 'error');
      } finally {
        btn.querySelector('i').classList.remove('fa-spin');
      }
    }
  });

  logoutBtn.addEventListener('click', () => {
    clearToken();
    window.location.href = 'login.html';
  });

  loadProjects();
}

document.addEventListener('DOMContentLoaded', () => {
  initLoginPage();
  initDashboardPage();
});
