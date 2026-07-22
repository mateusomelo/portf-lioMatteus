const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/user.repository');
const { JWT_SECRET, JWT_EXPIRES_IN } = require('../config/env');

async function login(req, res) {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ error: 'Informe e-mail e senha.' });
  }

  const user = userRepository.findByEmail(String(email).toLowerCase().trim());
  if (!user) {
    return res.status(401).json({ error: 'Credenciais inválidas.' });
  }

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    return res.status(401).json({ error: 'Credenciais inválidas.' });
  }

  const token = jwt.sign({ sub: user.id, email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  return res.json({ token, user: { id: user.id, email: user.email } });
}

async function me(req, res) {
  const user = userRepository.findById(req.user.sub);
  if (!user) return res.status(404).json({ error: 'Usuário não encontrado.' });
  return res.json({ user });
}

module.exports = { login, me };
