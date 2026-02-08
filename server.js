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

const ROOT_DIR = process.cwd();
const POSTS_DIR = path.join(ROOT_DIR, 'posts');
const DIST_PATH = path.join(ROOT_DIR, 'dist');
const GUESTBOOK_FILE = path.join(ROOT_DIR, 'guestbook.json');

// --- MongoDB Setup ---
let db = null;
async function connectToDB() {
  if (!MONGODB_URI) return;
  try {
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    db = client.db('portfolio');
    console.log("🍃 Connected to MongoDB");
  } catch (err) {
    console.error("❌ MongoDB Error:", err.message);
  }
}
connectToDB();

// --- Middleware ---
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 1000 }));
app.use(express.json({ limit: '10kb' }));

// 마크다운 파서
const parseMarkdownFile = (content, filename) => {
  try {
    const normalizedContent = content.replace(/\r\n/g, '\n').trim();
    const parts = normalizedContent.split('---\n');
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
  } catch (e) { return null; }
};

// --- API Routes ---

// 블로그 목록
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

// 블로그 상세
app.get('/api/posts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const files = await fs.readdir(POSTS_DIR);
    for (const f of files.filter(f => f.endsWith('.md'))) {
      const content = await fs.readFile(path.join(POSTS_DIR, f), 'utf-8');
      const post = parseMarkdownFile(content, f);
      if (post && post.id === id) return res.json(post);
    }
    res.status(404).json({ error: 'Post not found' });
  } catch (e) { res.status(500).json({ error: 'Server Error' }); }
});

// 방명록 목록 (JSON 파일 우선 읽기)
app.get('/api/guestbook', async (req, res) => {
  try {
    // 1. 먼저 MongoDB 시도
    if (db) {
      const messages = await db.collection('guestbook').find().sort({ date: -1 }).toArray();
      if (messages.length > 0) return res.json(messages);
    }
    
    // 2. MongoDB에 데이터가 없거나 연결 안된 경우 JSON 파일 읽기
    const data = await fs.readFile(GUESTBOOK_FILE, 'utf-8');
    const messages = JSON.parse(data);
    res.json(messages.sort((a, b) => new Date(b.date) - new Date(a.date)));
  } catch (error) {
    res.json([]);
  }
});

// 방명록 작성 (JSON 파일에 동기화)
app.post('/api/guestbook', async (req, res) => {
  const { name, message, _honey } = req.body;
  if (_honey || !name || !message) return res.status(400).json({ error: 'Invalid' });
  
  const newMessage = {
    id: `msg-${Date.now()}`,
    name: xss(name),
    message: xss(message),
    date: new Date().toISOString()
  };

  try {
    // 1. 파일 업데이트
    const data = await fs.readFile(GUESTBOOK_FILE, 'utf-8');
    const messages = JSON.parse(data);
    messages.unshift(newMessage);
    await fs.writeFile(GUESTBOOK_FILE, JSON.stringify(messages, null, 2));

    // 2. MongoDB 업데이트 (선택 사항)
    if (db) {
      await db.collection('guestbook').insertOne(newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save message' });
  }
});

app.post('/api/auth/login', (req, res) => {
  if (req.body.password === ADMIN_PASSWORD) {
    res.json({ token: jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: '24h' }) });
  } else res.status(401).json({ error: 'Invalid password' });
});

// --- Static & Catch-all ---
app.use(express.static(DIST_PATH));
app.use((req, res) => {
  if (req.path.startsWith('/api')) return res.status(404).json({ error: 'API Not Found' });
  res.sendFile(path.join(DIST_PATH, 'index.html'));
});

server.listen(PORT, '0.0.0.0', () => console.log(`🚀 Server on ${PORT}`));
export default app;
