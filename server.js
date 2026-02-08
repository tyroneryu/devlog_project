
import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import xss from 'xss';
import jwt from 'jsonwebtoken';
import http from 'http';

// Explicitly load env vars
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "$3vptRTUN";
const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key-change-this";

// Create HTTP Server
const server = http.createServer(app);

// --- 배포 환경 호환 경로 설정 (process.cwd()는 프로젝트 루트를 가리킵니다) ---
const ROOT_DIR = process.cwd();
const POSTS_DIR = path.join(ROOT_DIR, 'posts');
const DATA_DIR = path.join(ROOT_DIR, 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');
const GUESTBOOK_FILE = path.join(ROOT_DIR, 'guestbook.json');

// --- Game Logic State ---
let challenges = [];
const rooms = {};

// --- Dynamic Socket.io Setup (Fail-safe) ---
(async () => {
  try {
    const { Server } = await import('socket.io');
    const io = new Server(server, {
      cors: {
        origin: "*", // 배포 환경에서는 모든 오리진 허용 (필요시 특정 도메인으로 제한 가능)
        methods: ["GET", "POST"]
      }
    });

    console.log('🎮 Socket.io initialized successfully.');

    io.on('connection', (socket) => {
      socket.emit('update_challenges', challenges);

      socket.on('create_challenge', (playerName) => {
        const roomId = `room_${socket.id.substring(0, 5)}`;
        rooms[roomId] = {
          id: roomId,
          players: [{ id: socket.id, name: playerName, score: 0 }],
          moves: {},
          round: 1
        };
        socket.join(roomId);
        challenges.push({ id: roomId, creatorName: playerName });
        io.emit('update_challenges', challenges);
        socket.emit('game_created', roomId);
      });

      socket.on('join_challenge', ({ roomId, playerName }) => {
        const room = rooms[roomId];
        if (room && room.players.length < 2) {
          room.players.push({ id: socket.id, name: playerName, score: 0 });
          socket.join(roomId);
          challenges = challenges.filter(c => c.id !== roomId);
          io.emit('update_challenges', challenges);
          io.to(roomId).emit('game_start', { players: room.players, roomId });
        }
      });

      socket.on('make_move', ({ roomId, move }) => {
        const room = rooms[roomId];
        if (!room) return;
        room.moves[socket.id] = move;

        if (Object.keys(room.moves).length === 2) {
          const p1 = room.players[0];
          const p2 = room.players[1];
          const m1 = room.moves[p1.id];
          const m2 = room.moves[p2.id];

          let result = null;
          if (m1 === m2) result = 'draw';
          else if (
              (m1 === 'OVERLOAD' && m2 === 'VIRUS') ||
              (m1 === 'FIREWALL' && m2 === 'OVERLOAD') ||
              (m1 === 'VIRUS' && m2 === 'FIREWALL')
          ) {
            result = p1.id;
            p1.score += 1;
          } else {
            result = p2.id;
            p2.score += 1;
          }

          io.to(roomId).emit('round_result', {
            moves: { [p1.id]: m1, [p2.id]: m2 },
            result,
            scores: { [p1.id]: p1.score, [p2.id]: p2.score }
          });
          room.moves = {};
          room.round += 1;
        }
      });

      socket.on('disconnect', () => {
        challenges = challenges.filter(c => !c.id.includes(socket.id));
        io.emit('update_challenges', challenges);
        for (const roomId in rooms) {
          const room = rooms[roomId];
          if (room.players.some(p => p.id === socket.id)) {
            io.to(roomId).emit('player_left');
            delete rooms[roomId];
          }
        }
      });
    });
  } catch (error) {
    console.warn("⚠️ Socket.io module issue:", error.message);
  }
})();

// --- Security Middleware ---
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
}));

app.use(cors());

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500, // 조금 더 넉넉하게 조정
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(globalLimiter);
app.use(express.json({ limit: '10kb' }));

// --- File System Helpers ---
const initData = async () => {
  try {
    await fs.mkdir(POSTS_DIR, { recursive: true });
    await fs.mkdir(DATA_DIR, { recursive: true });
    try { await fs.access(DB_FILE); } catch { await fs.writeFile(DB_FILE, JSON.stringify({ leaderboard: [] }, null, 2)); }
    try { await fs.access(GUESTBOOK_FILE); } catch { await fs.writeFile(GUESTBOOK_FILE, JSON.stringify([], null, 2)); }
  } catch (error) {
    console.error("Initialization Error:", error);
  }
};

const getDB = async () => {
  try { const data = await fs.readFile(DB_FILE, 'utf-8'); return JSON.parse(data); } catch { return { leaderboard: [] }; }
};

const getGuestbook = async () => {
  try {
    const data = await fs.readFile(GUESTBOOK_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error(`❌ Guestbook Read Error at ${GUESTBOOK_FILE}:`, err.message);
    return [];
  }
};

const saveGuestbook = async (data) => {
  await fs.writeFile(GUESTBOOK_FILE, JSON.stringify(data, null, 2));
};

const parseMarkdownFile = (content, filename) => {
  const normalizedContent = content.replace(/\r\n/g, '\n');
  const separator = '---\n';
  const parts = normalizedContent.split(separator);
  if (parts.length < 3) return null;
  const frontmatterBlock = parts[1];
  const body = parts.slice(2).join(separator).trim();
  const metadata = {};
  frontmatterBlock.split('\n').forEach(line => {
    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) return;
    const key = line.slice(0, colonIndex).trim();
    let value = line.slice(colonIndex + 1).trim();
    if (value.startsWith('[') && value.endsWith(']')) {
      metadata[key] = value.slice(1, -1).split(',').map(s => s.trim());
    } else {
      metadata[key] = value;
    }
  });
  return { ...metadata, content: body, id: metadata.id || filename.replace('.md', '') };
};

initData();

// --- Auth Middleware ---
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// --- API Routes ---
app.post('/api/auth/login', (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    const token = jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token });
  } else {
    res.status(401).json({ error: 'Invalid password' });
  }
});

app.get('/api/posts', async (req, res) => {
  try {
    const files = await fs.readdir(POSTS_DIR);
    const mdFiles = files.filter(file => file.endsWith('.md'));
    const posts = await Promise.all(mdFiles.map(async (file) => {
      const content = await fs.readFile(path.join(POSTS_DIR, file), 'utf-8');
      return parseMarkdownFile(content, file);
    }));
    const validPosts = posts.filter(p => p !== null);
    validPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    res.json(validPosts);
  } catch (error) { res.json([]); }
});

app.get('/api/guestbook', async (req, res) => {
  try {
    const messages = await getGuestbook();
    const sorted = messages.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    res.json(sorted);
  } catch (error) { res.status(500).json({ error: 'Failed to fetch' }); }
});

app.post('/api/guestbook', async (req, res) => {
  try {
    const { name, message, _honey } = req.body;
    if (_honey) return res.status(200).json({ message: 'Success' });
    if (!name || !message) return res.status(400).json({ error: 'Invalid input' });

    const newMessage = {
      id: Date.now().toString(),
      name: xss(name.trim()),
      message: xss(message.trim()),
      date: new Date().toISOString()
    };
    const messages = await getGuestbook();
    messages.push(newMessage);
    await saveGuestbook(messages);
    res.status(201).json(newMessage);
  } catch (error) { res.status(500).json({ error: 'Failed to save' }); }
});

// --- Static File Serving ---
// Render는 빌드 후 dist 폴더를 루트에 생성합니다.
const DIST_PATH = path.join(ROOT_DIR, 'dist');
app.use(express.static(DIST_PATH));

// API 외의 모든 경로는 index.html로 (React Router 지원)
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) return res.status(404).send('API endpoint not found');
  res.sendFile(path.join(DIST_PATH, 'index.html'));
});

// --- Server Execution ---
// Render, Vercel, 로컬 모두 호환되도록 listen을 항상 실행 (Vercel은 알아서 래핑함)
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server active on port ${PORT}`);
  console.log(`📍 Project Root: ${ROOT_DIR}`);
  console.log(`📂 Guestbook: ${GUESTBOOK_FILE}`);
});

export default app;
