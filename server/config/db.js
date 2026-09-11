const { MongoClient } = require('mongodb');

let client;
let db;

async function connectDB() {
  if (db) return db;

  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
  const dbName = process.env.DB_NAME || 'neighbourly';

  client = new MongoClient(uri);
  await client.connect();
  db = client.db(dbName);

  // Índices úteis
  await db.collection('users').createIndex({ email: 1 }, { unique: true });
  await db.collection('gestaoAnual').createIndex({ ano: 1 }, { unique: true });
  await db.collection('quotas').createIndex({ userId: 1, ano: 1, mes: 1 });
  await db.collection('despesas').createIndex({ ano: 1, mes: 1 });
  await db.collection('ocorrencias').createIndex({ estado: 1 });
  await db.collection('reunioes').createIndex({ data: 1 });

  console.log(`✅ Ligado ao MongoDB (base de dados: ${dbName})`);
  return db;
}

function getDb() {
  if (!db) {
    throw new Error('Base de dados não inicializada. Chama connectDB() primeiro.');
  }
  return db;
}

module.exports = { connectDB, getDb };
