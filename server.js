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

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "$3vptRTUN";
const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key-change-this";

// Create HTTP Server
const server = http.createServer(app);

// --- Game Logic State ---
let challenges = [];
const rooms = {};

// --- Dynamic Socket.io Setup (Fail-safe) ---
// This prevents the server from crashing if 'socket.io' is missing in node_modules
(async () => {
  try {
    const { Server } = await import('socket.io');
    const io = new Server(server, {
      cors: {
        origin: process.env.NODE_ENV === 'production' ? false : "*",
        methods: ["GET", "POST"]
      }
    });

    console.log('🎮 Socket.io initialized successfully.');

    io.on('connection', (socket) => {
      console.log('🔌 New Client Connected:', socket.id);
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
        } else {
          socket.emit('error', 'Room is full or does not exist.');
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
    console.warn("⚠️ Warning: 'socket.io' module not found. Real-time game features will be disabled, but the server will run.");
    console.warn("   Run 'npm install socket.io socket.io-client' to fix this.");
  }
})();

// --- Security Middleware ---
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "cdn.tailwindcss.com", "cdn.socket.io"],
      styleSrc: ["'self'", "'unsafe-inline'", "fonts.googleapis.com"],
      fontSrc: ["'self'", "fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "images.unsplash.com", "my.spline.design"],
      frameSrc: ["'self'", "my.spline.design"],
      connectSrc: ["'self'", "http://localhost:3001", "ws://localhost:3001", "http://localhost:5173", "ws://localhost:5173", "https://generativelanguage.googleapis.com"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? false : '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(globalLimiter);
app.use(express.json({ limit: '10kb' }));

const POSTS_DIR = path.join(__dirname, 'posts');
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// --- File System & DB Helper Functions ---

const initData = async () => {
  try {
    try {
      await fs.access(POSTS_DIR);
    } catch {
      await fs.mkdir(POSTS_DIR, { recursive: true });
      console.log('📁 Created /posts directory');
    }

    try {
      await fs.access(DATA_DIR);
    } catch {
      await fs.mkdir(DATA_DIR, { recursive: true });
      console.log('📁 Created /data directory');
    }

    try {
      await fs.access(DB_FILE);
    } catch {
      const initialDB = { guestbook: [], leaderboard: [] };
      await fs.writeFile(DB_FILE, JSON.stringify(initialDB, null, 2));
      console.log('💾 Created database.json');
    }
  } catch (error) {
    console.error("Initialization Error:", error);
  }
};

const getDB = async () => {
  try {
    const data = await fs.readFile(DB_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return { guestbook: [], leaderboard: [] };
  }
};

const saveDB = async (data) => {
  try {
    await fs.writeFile(DB_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("DB Write Error", error);
  }
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

// Initialize system immediately
initData().catch(console.error);

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

app.post('/api/admin/posts', authenticateToken, async (req, res) => {
  try {
    const { title, excerpt, content, tags, category } = req.body;
    if (!title || !content) return res.status(400).json({ error: "Title and Content are required" });

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const filename = `${slug}.md`;
    const date = new Date().toISOString().split('T')[0];

    const fileContent = `---
id: ${slug}
title: ${title}
excerpt: ${excerpt || ''}
date: ${date}
tags: [${tags.join(', ')}]
category: ${category || 'Dev'}
---

${content}`;

    await fs.writeFile(path.join(POSTS_DIR, filename), fileContent, 'utf-8');
    res.json({ success: true, id: slug });
  } catch (error) {
    console.error("Failed to create post:", error);
    res.status(500).json({ error: "Failed to save post" });
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
    validPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
    res.json(validPosts);
  } catch (error) {
    // Return empty array instead of crashing
    res.json([]);
  }
});

app.get('/api/posts/:id', async (req, res) => {
  try {
    const files = await fs.readdir(POSTS_DIR);
    const mdFiles = files.filter(file => file.endsWith('.md'));
    for (const file of mdFiles) {
      const content = await fs.readFile(path.join(POSTS_DIR, file), 'utf-8');
      const post = parseMarkdownFile(content, file);
      if (post && post.id === req.params.id) {
        return res.json(post);
      }
    }
    res.status(404).json({ error: 'Post not found' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/guestbook', async (req, res) => {
  try {
    const db = await getDB();
    const sorted = db.guestbook.sort((a, b) => new Date(b.date) - new Date(a.date));
    res.json(sorted);
  } catch (error) {
    res.status(500).json({ error: 'Database Unavailable' });
  }
});

app.post('/api/guestbook', async (req, res) => {
  try {
    const { name, message, _honey } = req.body;
    if (_honey) return res.status(200).json({ message: 'Success' });
    if (!name || !message) return res.status(400).json({ error: 'Invalid input' });

    const cleanName = xss(name.trim());
    const cleanMessage = xss(message.trim());
    const newMessage = {
      id: Date.now().toString(),
      name: cleanName,
      message: cleanMessage,
      date: new Date().toISOString()
    };

    const db = await getDB();
    db.guestbook.push(newMessage);
    await saveDB(db);

    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save message' });
  }
});

app.get('/api/leaderboard/:gameId', async (req, res) => {
  try {
    const { gameId } = req.params;
    const db = await getDB();
    const gameScores = db.leaderboard.filter(entry => entry.game_id === gameId);

    const topScores = gameScores
        .sort((a, b) => b.score - a.score)
        .slice(0, 10);

    res.json(topScores);
  } catch (error) {
    res.status(500).json({ error: 'Database Unavailable' });
  }
});

app.post('/api/leaderboard', async (req, res) => {
  try {
    const { gameId, playerName, score } = req.body;
    if (!gameId || !playerName || score === undefined) return res.status(400).json({ error: 'Invalid input' });

    const newEntry = {
      id: Date.now(),
      game_id: gameId,
      player_name: xss(playerName.trim()),
      score: Number(score),
      date: new Date().toISOString()
    };

    const db = await getDB();
    db.leaderboard.push(newEntry);
    await saveDB(db);

    res.status(201).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save score' });
  }
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

server.listen(PORT, () => {
  console.log(`🚀 Secure Server running on http://localhost:${PORT}`);
});