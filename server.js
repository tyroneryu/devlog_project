import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import xss from 'xss';
import jwt from 'jsonwebtoken';
import http from 'http';
import { MongoClient } from 'mongodb';

dotenv.config();

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3001;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "$3vptRTUN";
const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key";
const MONGODB_URI = process.env.MONGODB_URI;

// --- MongoDB Setup ---
let db;
let client;

async function connectToDB() {
  try {
    if (!MONGODB_URI) {
      console.warn("⚠️ MONGODB_URI가 설정되지 않았습니다. DB 연동 기능이 제한됩니다.");
      return;
    }
    
    // MongoClient 인스턴스 생성을 함수 내부로 이동하여 안전하게 처리
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    db = client.db('portfolio');
    console.log("🍃 Connected to MongoDB Atlas (portfolio DB)");
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err.message);
  }
}
connectToDB();

// --- Paths ---
const ROOT_DIR = process.cwd();
const POSTS_DIR = path.join(ROOT_DIR, 'posts');

// --- Socket.io ---
(async () => {
  try {
    const { Server } = await import('socket.io');
    const io = new Server(server, { cors: { origin: "*", methods: ["GET", "POST"] } });
    io.on('connection', (socket) => {
      socket.on('create_challenge', (name) => {
        const roomId = `room_${socket.id.substring(0, 5)}`;
        socket.join(roomId);
        io.emit('update_challenges', [{ id: roomId, creatorName: name }]);
      });
    });
  } catch (e) { console.warn("Socket.io issue:", e.message); }
})();

// --- Middleware ---
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 1000 }));
app.use(express.json({ limit: '10kb' }));

const parseMarkdownFile = (content, filename) => {
  const parts = content.replace(/\r\n/g, '\n').split('---\n');
  if (parts.length < 3) return null;
  const metadata = {};
  parts[1].split('\n').forEach(line => {
    const i = line.indexOf(':');
    if (i === -1) return;
    const k = line.slice(0, i).trim();
    let v = line.slice(i + 1).trim();
    metadata[k] = (v.startsWith('[') && v.endsWith(']')) ? v.slice(1, -1).split(',').map(s => s.trim()) : v;
  });
  return { ...metadata, content: parts.slice(2).join('---\n').trim(), id: metadata.id || filename.replace('.md', '') };
};

// --- API Routes ---
app.post('/api/auth/login', (req, res) => {
  if (req.body.password === ADMIN_PASSWORD) {
    res.json({ token: jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: '24h' }) });
  } else res.status(401).json({ error: 'Invalid password' });
});

app.get('/api/posts', async (req, res) => {
  try {
    const files = await fs.readdir(POSTS_DIR);
    const posts = await Promise.all(files.filter(f => f.endsWith('.md')).map(async (f) => {
      const content = await fs.readFile(path.join(POSTS_DIR, f), 'utf-8');
      return parseMarkdownFile(content, f);
    }));
    res.json(posts.filter(p => p).sort((a, b) => new Date(b.date) - new Date(a.date)));
  } catch (e) { res.json([]); }
});

// --- MongoDB Powered Routes ---

// 1. Guestbook
app.get('/api/guestbook', async (req, res) => {
  try {
    if (!db) return res.json([]);
    const messages = await db.collection('guestbook').find().sort({ date: -1 }).toArray();
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

app.post('/api/guestbook', async (req, res) => {
  try {
    const { name, message, _honey } = req.body;
    if (_honey || !name || !message) return res.status(400).json({ error: 'Invalid' });
    
    const newMessage = {
      name: xss(name.trim()),
      message: xss(message.trim()),
      date: new Date().toISOString()
    };
    
    if (db) {
      await db.collection('guestbook').insertOne(newMessage);
      res.status(201).json(newMessage);
    } else {
      res.status(503).json({ error: 'Database not connected' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to save message' });
  }
});

// 2. Leaderboard
app.post('/api/leaderboard', async (req, res) => {
  try {
    const { gameId, playerName, score } = req.body;
    if (!db) return res.status(503).send();
    
    await db.collection('leaderboard').insertOne({
      game_id: gameId,
      player_name: xss(playerName.trim()),
      score: Number(score),
      date: new Date().toISOString()
    });
    res.status(201).json({ success: true });
  } catch (e) {
    res.status(500).json({ error: 'Failed' });
  }
});

app.get('/api/leaderboard/:gameId', async (req, res) => {
  try {
    if (!db) return res.json([]);
    const filtered = await db.collection('leaderboard')
      .find({ game_id: req.params.gameId })
      .sort({ score: -1 })
      .limit(10)
      .toArray();
    res.json(filtered);
  } catch (e) {
    res.json([]);
  }
});

const DIST_PATH = path.join(ROOT_DIR, 'dist');
app.use(express.static(DIST_PATH));
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) return res.status(404).send('Not Found');
  res.sendFile(path.join(DIST_PATH, 'index.html'));
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server on port ${PORT}`);
});

export default app;
