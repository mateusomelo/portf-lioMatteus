const fs = require('fs');
const path = require('path');
const projectRepository = require('../repositories/project.repository');
const verificationService = require('../services/verification.service');
const { slugify, uniqueSlug } = require('../utils/slugify');

function parseTechnologies(input) {
  if (!input) return [];
  if (Array.isArray(input)) return input.map((t) => String(t).trim()).filter(Boolean);
  return String(input).split(',').map((t) => t.trim()).filter(Boolean);
}

function parseFeatured(input) {
  if (typeof input === 'boolean') return input;
  const value = String(input || '').toLowerCase().trim();
  return value === 'sim' || value === 'true' || value === '1' || value === 'yes';
}

/** Campos seguros para expor publicamente (sem dados internos) */
function toPublicProject(project) {
  return {
    id: project.id,
    slug: project.slug,
    name: project.name,
    description: project.description,
    url: project.url,
    github_url: project.github_url,
    technologies: project.technologies,
    category: project.category,
    featured: project.featured,
    card_color: project.card_color,
    image: project.custom_image || project.screenshot_path || null,
    embeddable: !!project.embeddable,
    status: project.status,
    response_time_ms: project.response_time_ms,
    last_checked_at: project.last_checked_at,
    updated_at: project.updated_at,
    created_at: project.created_at
  };
}

/* ---------------------- ADMIN ---------------------- */

async function adminList(req, res) {
  const projects = projectRepository.findAll();
  res.json({ projects });
}

async function adminCreate(req, res) {
  try {
    const body = req.body || {};
    if (!body.name || !body.url) {
      return res.status(400).json({ error: 'Nome e URL do projeto são obrigatórios.' });
    }

    const slug = uniqueSlug(body.name, projectRepository.slugExists);
    const customImage = req.file ? `/uploads/projects/${req.file.filename}` : null;

    let project = projectRepository.create({
      slug,
      name: body.name,
      description: body.description,
      url: body.url,
      github_url: body.github_url,
      technologies: parseTechnologies(body.technologies),
      category: body.category,
      featured: parseFeatured(body.featured),
      card_color: body.card_color,
      custom_image: customImage
    });

    const verification = await verificationService.verifyProject(project);
    project = projectRepository.updateVerification(project.id, verification);

    res.status(201).json({ project: toPublicProject(project) });
  } catch (err) {
    console.error('[adminCreate] erro:', err);
    res.status(500).json({ error: 'Erro ao criar projeto.' });
  }
}

async function adminUpdate(req, res) {
  try {
    const id = Number(req.params.id);
    const existing = projectRepository.findById(id);
    if (!existing) return res.status(404).json({ error: 'Projeto não encontrado.' });

    const body = req.body || {};
    const customImage = req.file ? `/uploads/projects/${req.file.filename}` : null;
    const urlChanged = body.url && body.url !== existing.url;

    let project = projectRepository.update(id, {
      name: body.name || existing.name,
      description: body.description ?? existing.description,
      url: body.url || existing.url,
      github_url: body.github_url ?? existing.github_url,
      technologies: body.technologies !== undefined ? parseTechnologies(body.technologies) : existing.technologies,
      category: body.category ?? existing.category,
      featured: body.featured !== undefined ? parseFeatured(body.featured) : existing.featured,
      card_color: body.card_color ?? existing.card_color,
      custom_image: customImage
    });

    if (urlChanged) {
      const verification = await verificationService.verifyProject(project);
      project = projectRepository.updateVerification(id, verification);
    }

    res.json({ project: toPublicProject(project) });
  } catch (err) {
    console.error('[adminUpdate] erro:', err);
    res.status(500).json({ error: 'Erro ao atualizar projeto.' });
  }
}

async function adminRecheck(req, res) {
  try {
    const id = Number(req.params.id);
    const project = projectRepository.findById(id);
    if (!project) return res.status(404).json({ error: 'Projeto não encontrado.' });

    const verification = await verificationService.verifyProject(project);
    const updated = projectRepository.updateVerification(id, verification);

    res.json({ project: toPublicProject(updated) });
  } catch (err) {
    console.error('[adminRecheck] erro:', err);
    res.status(500).json({ error: 'Erro ao verificar projeto.' });
  }
}

async function adminRemove(req, res) {
  try {
    const id = Number(req.params.id);
    const project = projectRepository.findById(id);
    if (!project) return res.status(404).json({ error: 'Projeto não encontrado.' });

    projectRepository.remove(id);

    [project.screenshot_path, project.custom_image].forEach((relPath) => {
      if (!relPath) return;
      const absPath = path.join(__dirname, '..', '..', relPath);
      fs.promises.unlink(absPath).catch(() => {});
    });

    res.status(204).end();
  } catch (err) {
    console.error('[adminRemove] erro:', err);
    res.status(500).json({ error: 'Erro ao remover projeto.' });
  }
}

/* ---------------------- PÚBLICO ---------------------- */

async function publicList(req, res) {
  let projects = projectRepository.findAll();
  const { category, search } = req.query;

  if (category && category !== 'todos') {
    const cat = category.toLowerCase();
    projects = projects.filter((p) =>
      (p.category || '').toLowerCase() === cat ||
      p.technologies.some((t) => t.toLowerCase() === cat)
    );
  }

  if (search) {
    const term = search.toLowerCase();
    projects = projects.filter((p) =>
      p.name.toLowerCase().includes(term) ||
      (p.description || '').toLowerCase().includes(term) ||
      (p.category || '').toLowerCase().includes(term) ||
      p.technologies.some((t) => t.toLowerCase().includes(term))
    );
  }

  res.json({ projects: projects.map(toPublicProject) });
}

async function publicGetBySlug(req, res) {
  const project = projectRepository.findBySlug(req.params.slug);
  if (!project) return res.status(404).json({ error: 'Projeto não encontrado.' });
  res.json({ project: toPublicProject(project) });
}

module.exports = {
  adminList, adminCreate, adminUpdate, adminRecheck, adminRemove,
  publicList, publicGetBySlug
};
