// Script para criar (ou promover) o primeiro administrador do condomínio.
// Necessário porque, sem admins, ninguém pode aceder às rotas protegidas
// que definem a gestaoAnual.
//
// Uso: node seed.js <email> <password> [nome] [apartamento]

require('dotenv').config();
const bcrypt = require('bcryptjs');
const { connectDB } = require('./config/db');

async function seed() {
  const db = await connectDB();

  const [, , email, password, nome = 'Administrador', apartamento = 'N/A'] = process.argv;

  if (!email || !password) {
    console.log('Uso: node seed.js <email> <password> [nome] [apartamento]');
    process.exit(1);
  }

  const existing = await db.collection('users').findOne({ email: email.toLowerCase() });
  let userId;

  if (existing) {
    userId = existing._id;
    console.log('ℹ️  Utilizador já existe — vai ser promovido a administrador.');
  } else {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await db.collection('users').insertOne({
      nome,
      email: email.toLowerCase(),
      password: hashedPassword,
      apartamento,
      telefone: null,
      createdAt: new Date(),
    });
    userId = result.insertedId;
    console.log('✅ Utilizador criado.');
  }

  const anoAtual = new Date().getFullYear();
  await db.collection('gestaoAnual').updateOne(
    { ano: anoAtual },
    { $addToSet: { adminIds: userId }, $set: { ano: anoAtual, atualizadoEm: new Date() } },
    { upsert: true }
  );

  console.log(`✅ ${email} definido como administrador do ano ${anoAtual}.`);
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
