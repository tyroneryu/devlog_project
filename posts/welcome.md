---
id: welcome-to-backend
title: Welcome to the Real-Time Backend
excerpt: This content is being served live from a Node.js Express server reading markdown files from the file system.
date: 2024-10-24
tags: [Node.js, Express, Architecture]
category: Dev
---
# Hello, Server-Side!

You are reading this from a Markdown file located in the `/posts` directory of your project.

## How it works

1.  **Storage**: Files are stored as `.md` files.
2.  **Server**: `server.js` uses `fs/promises` to read these files.
3.  **API**: React fetches `http://localhost:3001/api/posts`.

This architecture allows you to simply **drag and drop** new markdown files into the folder to update your portfolio instantly, without recompiling the frontend code.

> "Simplicity is the ultimate sophistication." - Leonardo da Vinci