const fs = require('fs');
const path = require('path');

// ============================================================
// ARQUIVO: UserModel.js
// DESCRIÇÃO: Responsável por manipular o armazenamento dos
// usuários em um arquivo JSON.
// ============================================================

// Caminho do arquivo que armazenará os usuários
const usersFile = path.join(__dirname, 'users.json');

// ============================================================
// FUNÇÃO: ensureFile
// DESCRIÇÃO: Verifica se o arquivo users.json existe.
// Caso não exista, cria um arquivo vazio.
// ============================================================
function ensureFile() {
  if (!fs.existsSync(usersFile)) {
    fs.writeFileSync(usersFile, '[]', 'utf8');
  }
}

// ============================================================
// FUNÇÃO: readUsers
// DESCRIÇÃO: Lê todos os usuários cadastrados no arquivo JSON.
// Retorna um array vazio caso o conteúdo seja inválido.
// ============================================================
function readUsers() {
  ensureFile();

  const raw = fs.readFileSync(usersFile, 'utf8');

  try {
    return JSON.parse(raw || '[]');
  } catch (err) {
    return [];
  }
}

// ============================================================
// FUNÇÃO: writeUsers
// DESCRIÇÃO: Salva o array de usuários no arquivo JSON.
// ============================================================
function writeUsers(users) {
  fs.writeFileSync(
    usersFile,
    JSON.stringify(users, null, 2),
    'utf8'
  );
}

// ============================================================
// FUNÇÃO: findByEmail
// DESCRIÇÃO: Procura um usuário pelo e-mail informado.
// Retorna o usuário encontrado ou null.
// ============================================================
async function findByEmail(email) {
  const users = readUsers();

  return users.find((u) => u.email === email) || null;
}

// ============================================================
// FUNÇÃO: createUser
// DESCRIÇÃO: Cria um novo usuário e o adiciona ao arquivo JSON.
// ============================================================
async function createUser({ name, email, passwordHash }) {
  const users = readUsers();

  const newUser = {
    id: Date.now(),
    name: name || null,
    email,
    password: passwordHash,
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);

  writeUsers(users);

  return newUser;
}

// ============================================================
// EXPORTAÇÃO DAS FUNÇÕES DO MODEL
// ============================================================
module.exports = {
  findByEmail,
  createUser,
};