const db = require('../config/database');

function findByEmail(email) {
  const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
  return stmt.get(email);
}

function findById(id) {
  const stmt = db.prepare('SELECT id, email, created_at FROM users WHERE id = ?');
  return stmt.get(id);
}

function create({ email, passwordHash }) {
  const stmt = db.prepare('INSERT INTO users (email, password_hash) VALUES (?, ?)');
  const info = stmt.run(email, passwordHash);
  return findById(Number(info.lastInsertRowid));
}

function updatePassword(email, passwordHash) {
  const stmt = db.prepare('UPDATE users SET password_hash = ? WHERE email = ?');
  stmt.run(passwordHash, email);
}

function upsert({ email, passwordHash }) {
  const existing = findByEmail(email);
  if (existing) {
    updatePassword(email, passwordHash);
    return findByEmail(email);
  }
  return create({ email, passwordHash });
}

module.exports = { findByEmail, findById, create, upsert };
