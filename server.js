const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = process.env.RAILWAY_VOLUME_MOUNT_PATH || __dirname;
const DATA_FILE = path.join(DATA_DIR, 'data.json');
const EDIT_PIN = process.env.EDIT_PIN || 'gjeane202'; // pode trocar por variável de ambiente no Railway depois
const PIX_KEY = process.env.PIX_KEY || '37999210294';

const DEFAULT_CAKES = [
  { id: "choc",    name: "Bolo de Chocolate",    desc: "Massa fofinha com cobertura de brigadeiro", price: 35, emoji: "🍫", style: "chocolate", image: null },
  { id: "morango", name: "Naked Cake de Morango", desc: "Camadas de baunilha, chantininho e morango", price: 55, emoji: "🍓", style: "morango",  image: null },
  { id: "cenoura", name: "Cenoura com Chocolate", desc: "O clássico que nunca falha",                 price: 30, emoji: "🥕", style: "cenoura",  image: null },
  { id: "redvel",  name: "Red Velvet",            desc: "Aveludado, com cream cheese",                price: 45, emoji: "❤️", style: "red",      image: null },
  { id: "fuba",    name: "Bolo de Fubá Cremoso",  desc: "Com goiabada derretida por dentro",          price: 28, emoji: "🌽", style: "fuba",     image: null },
  { id: "limao",   name: "Bolo de Limão",         desc: "Leve, com calda cítrica",                    price: 28, emoji: "🍋", style: "limao",    image: null }
];

function readCakes() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  } catch (e) {
    return DEFAULT_CAKES;
  }
}

function writeCakes(cakes) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(cakes, null, 2));
}

app.use(express.json({ limit: '25mb' })); // imagens em base64 precisam de um limite maior
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/config', (req, res) => {
  res.json({ pixKey: PIX_KEY });
});

app.get('/api/cakes', (req, res) => {
  res.json(readCakes());
});

app.post('/api/verify-pin', (req, res) => {
  const { pin } = req.body || {};
  res.json({ ok: pin === EDIT_PIN });
});

app.post('/api/cakes', (req, res) => {
  const { pin, cakes } = req.body || {};
  if (pin !== EDIT_PIN) {
    return res.status(401).json({ error: 'Senha incorreta.' });
  }
  if (!Array.isArray(cakes)) {
    return res.status(400).json({ error: 'Dados inválidos.' });
  }
  writeCakes(cakes);
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`Bolos da Jeane rodando na porta ${PORT}`);
});
