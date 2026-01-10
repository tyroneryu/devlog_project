# Event-Driven Engineering Portfolio: Taeyun Ryu

> **"Where MICE Logistics meets Microservices."**

This is a high-fidelity, interactive portfolio website designed for a hybrid professional who specializes in both **Software Engineering** and **MICE (Meeting, Incentive, Convention, Exhibition) Planning**.

The application treats the user experience as an **Event-Driven System**, integrating **Google Gemini API** deeply into the core navigation and content consumption flow. It operates with a **Real-Time Node.js Backend** to serve content dynamically.

---

## 🚀 Key Features

### 1. 📂 File-System Based CMS (Backend)
- **Architecture**: A custom Express.js server (`server.js`) watches the `posts/` directory.
- **Usage**: Simply drop a Markdown (`.md`) file into the `posts/` folder, and it instantly appears on the website. No database required.

### 2. 🧠 Neural Command Palette (`Cmd + K`)
- Uses **Gemini 3 Flash** to map natural language input to system actions.

### 3. ⚡ The Synergy Engine
- Analyzes your **actual blog posts** fetched from the backend to generate unique project ideas combining Tech & Events.

### 4. 🌐 Global Intelligence Grid (Grounding)
- Real-time venue and tech trend search using Gemini Tools (`googleSearch`, `googleMaps`).

### 5. 📟 Retro Vision Terminal & UX Analysis
- Multimodal analysis of uploaded images and project screenshots.

---

## 🛠️ How to Run

Since this project now has a backend, you need to run both the server and the frontend.

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Environment
Create a `.env` file in the root:
```bash
API_KEY=your_gemini_api_key_here
PORT=3001
```

### 3. Start Development (Full Stack)
This command runs both the Node.js backend and the React frontend concurrently:
```bash
npm run dev:full
```

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3001

---

## 📝 Adding Content

### Blog Posts
1.  Navigate to the `posts/` directory.
2.  Create a new file (e.g., `my-new-post.md`).
3.  Add Frontmatter metadata at the top:
    ```markdown
    ---
    id: my-post
    title: My Post Title
    excerpt: A short summary
    date: Oct 24, 2024
    tags: [React, Node.js]
    category: Dev
    ---
    # Your content here...
    ```

---

## 🛠️ Tech Stack

- **Frontend**: React 19, Tailwind CSS, Framer Motion
- **Backend**: Node.js, Express.js, File System (fs/promises)
- **AI**: Google Gemini API (`@google/genai`)

---

© 2024 Taeyun Ryu. Crafted with precision and intelligence.