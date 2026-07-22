/**
 * Cria ou atualiza o usuário administrador.
 * Uso: npm run create-admin -- --email=voce@exemplo.com --password=SenhaForte123
 */
const bcrypt = require('bcryptjs');
const userRepository = require('../repositories/user.repository');

function parseArgs() {
  const args = {};
  process.argv.slice(2).forEach((arg) => {
    const match = arg.match(/^--([^=]+)=(.*)$/);
    if (match) args[match[1]] = match[2];
  });
  return args;
}

async function main() {
  const { email, password } = parseArgs();

  if (!email || !password) {
    console.error('Uso: npm run create-admin -- --email=voce@exemplo.com --password=SenhaForte123');
    process.exit(1);
  }

  if (password.length < 8) {
    console.error('A senha deve ter pelo menos 8 caracteres.');
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = userRepository.upsert({ email: email.toLowerCase().trim(), passwordHash });

  console.log(`Administrador pronto: ${user.email} (id: ${user.id})`);
  process.exit(0);
}

main().catch((err) => {
  console.error('Erro ao criar administrador:', err);
  process.exit(1);
});
