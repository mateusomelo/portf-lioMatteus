const db = require('../config/database');

function rowToProject(row) {
  if (!row) return null;
  return {
    ...row,
    technologies: JSON.parse(row.technologies || '[]'),
    featured: !!row.featured,
    embeddable: row.embeddable === null ? null : !!row.embeddable
  };
}

function findAll() {
  const stmt = db.prepare('SELECT * FROM projects ORDER BY featured DESC, created_at DESC');
  return stmt.all().map(rowToProject);
}

function findById(id) {
  const stmt = db.prepare('SELECT * FROM projects WHERE id = ?');
  return rowToProject(stmt.get(id));
}

function findBySlug(slug) {
  const stmt = db.prepare('SELECT * FROM projects WHERE slug = ?');
  return rowToProject(stmt.get(slug));
}

function slugExists(slug) {
  const stmt = db.prepare('SELECT id FROM projects WHERE slug = ?');
  return !!stmt.get(slug);
}

function create(data) {
  const stmt = db.prepare(`
    INSERT INTO projects
      (slug, name, description, url, github_url, technologies, category, featured, card_color, custom_image, status)
    VALUES (@slug, @name, @description, @url, @github_url, @technologies, @category, @featured, @card_color, @custom_image, @status)
  `);
  const info = stmt.run({
    slug: data.slug,
    name: data.name,
    description: data.description || '',
    url: data.url,
    github_url: data.github_url || null,
    technologies: JSON.stringify(data.technologies || []),
    category: data.category || null,
    featured: data.featured ? 1 : 0,
    card_color: data.card_color || null,
    custom_image: data.custom_image || null,
    status: 'checking'
  });
  return findById(Number(info.lastInsertRowid));
}

function update(id, data) {
  const stmt = db.prepare(`
    UPDATE projects SET
      name = @name,
      description = @description,
      url = @url,
      github_url = @github_url,
      technologies = @technologies,
      category = @category,
      featured = @featured,
      card_color = @card_color,
      custom_image = COALESCE(@custom_image, custom_image),
      updated_at = CURRENT_TIMESTAMP
    WHERE id = @id
  `);
  stmt.run({
    id,
    name: data.name,
    description: data.description || '',
    url: data.url,
    github_url: data.github_url || null,
    technologies: JSON.stringify(data.technologies || []),
    category: data.category || null,
    featured: data.featured ? 1 : 0,
    card_color: data.card_color || null,
    custom_image: data.custom_image || null
  });
  return findById(id);
}

function updateVerification(id, result) {
  const stmt = db.prepare(`
    UPDATE projects SET
      status = @status,
      response_time_ms = @response_time_ms,
      embeddable = @embeddable,
      screenshot_path = COALESCE(@screenshot_path, screenshot_path),
      last_checked_at = @last_checked_at,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = @id
  `);
  stmt.run({
    id,
    status: result.status,
    response_time_ms: result.response_time_ms,
    embeddable: result.embeddable === null ? null : (result.embeddable ? 1 : 0),
    screenshot_path: result.screenshot_path || null,
    last_checked_at: result.last_checked_at
  });
  return findById(id);
}

function remove(id) {
  const stmt = db.prepare('DELETE FROM projects WHERE id = ?');
  stmt.run(id);
}

module.exports = {
  findAll, findById, findBySlug, slugExists,
  create, update, updateVerification, remove
};
