import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import os from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'hogwarts-secret';

const uploadDir = process.env.UPLOAD_DIR || (process.env.VERCEL ? path.join(os.tmpdir(), 'uploads') : path.join(__dirname, 'uploads'));
if (!fs.existsSync(uploadDir)) {
  try {
    fs.mkdirSync(uploadDir, { recursive: true });
  } catch (err) {
    console.warn('Could not create upload directory:', uploadDir, err.message);
  }
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  }
});
const upload = multer({ storage });

app.use(express.json());
app.use('/uploads', express.static(uploadDir));
app.use(express.static(path.join(__dirname, 'public')));

let db;

async function initDb() {
  db = await open({
    filename: path.join(__dirname, 'database.sqlite'),
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
    );
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS characters (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      house TEXT NOT NULL,
      role TEXT NOT NULL,
      patronus TEXT,
      image TEXT
    );
  `);

  const admin = await db.get('SELECT * FROM users WHERE username = ?', 'admin');
  if (!admin) {
    const hash = await bcrypt.hash('password', 10);
    await db.run('INSERT INTO users (username, password) VALUES (?, ?)', 'admin', hash);
    console.log('Created default admin/admin login');
  }
}

function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token required' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
}

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: 'Username and password required' });

  const user = await db.get('SELECT * FROM users WHERE username = ?', username);
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '8h' });
  res.json({ token, username: user.username });
});

app.get('/api/characters', authenticateToken, async (req, res) => {
  const chars = await db.all('SELECT * FROM characters ORDER BY id DESC');
  res.json(chars);
});

app.get('/api/characters/:id', authenticateToken, async (req, res) => {
  const character = await db.get('SELECT * FROM characters WHERE id = ?', req.params.id);
  if (!character) return res.status(404).json({ message: 'Character not found' });
  res.json(character);
});

app.post('/api/characters', authenticateToken, upload.single('image'), async (req, res) => {
  const { name, house, role, patronus } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : null;
  if (!name || !house || !role) return res.status(400).json({ message: 'Name, house, and role are required' });

  const result = await db.run(
    'INSERT INTO characters (name, house, role, patronus, image) VALUES (?, ?, ?, ?, ?)',
    name,
    house,
    role,
    patronus || null,
    image
  );
  const id = result.lastID;
  const created = await db.get('SELECT * FROM characters WHERE id = ?', id);
  res.status(201).json(created);
});

app.put('/api/characters/:id', authenticateToken, upload.single('image'), async (req, res) => {
  const { name, house, role, patronus } = req.body;
  const existing = await db.get('SELECT * FROM characters WHERE id = ?', req.params.id);
  if (!existing) return res.status(404).json({ message: 'Character not found' });

  let image = existing.image;
  if (req.file) {
    if (existing.image) {
      const oldImagePath = path.join(__dirname, existing.image.replace('/uploads/', 'uploads/'));
      if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
    }
    image = `/uploads/${req.file.filename}`;
  }

  await db.run(
    'UPDATE characters SET name = ?, house = ?, role = ?, patronus = ?, image = ? WHERE id = ?',
    name || existing.name,
    house || existing.house,
    role || existing.role,
    patronus || existing.patronus,
    image,
    req.params.id
  );

  const updated = await db.get('SELECT * FROM characters WHERE id = ?', req.params.id);
  res.json(updated);
});

app.delete('/api/characters/:id', authenticateToken, async (req, res) => {
  const character = await db.get('SELECT * FROM characters WHERE id = ?', req.params.id);
  if (!character) return res.status(404).json({ message: 'Character not found' });

  if (character.image) {
    const imagePath = path.join(__dirname, character.image.replace('/uploads/', 'uploads/'));
    if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
  }

  await db.run('DELETE FROM characters WHERE id = ?', req.params.id);
  res.json({ message: 'Character deleted' });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

initDb().then(() => {
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
}).catch((err) => {
  console.error('Failed to start DB', err);
  process.exit(1);
});
