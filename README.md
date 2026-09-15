# CodeNest — Personal Coding Notebook

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-404D59?style=flat)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=flat&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white)](https://www.docker.com/)

> A secure, responsive personal coding notebook and college programming assignment management platform designed for students who want one organized place to save, write, format, edit, search, and manage their solutions.

---

## 🚀 Features

- **Monaco Code Editor**: Professional syntax highlighting, code folding, bracket matching, line numbers, and theme support (Dark/Light).
- **Automatic Code Formatting**: Universal client-side `FormatterService` supporting JavaScript, TypeScript, SQL, JSON, Markdown, HTML, CSS, plus graceful auto-indentation for C, C++, Java, and Python.
- **Subject & Tag Organization**: Keep DSA, C Programming, Java, DBMS/SQL, Web Development, and OS exercises categorized.
- **Instant Search & Filter**: Real-time debounced full-text search across titles, problem questions, notes, and tags.
- **Auto-Save**: Debounced background persistence with visual save state indicators (`Saving...`, `Saved`, `Unsaved changes`).
- **Secure Authentication & Ownership**: Strict database query-level ownership checks preventing Insecure Direct Object References (IDOR).
- **Responsive Developer UI**: Minimalist, high-readability aesthetic inspired by VS Code and Linear, fully functional across desktop, tablet, and mobile.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, Monaco Editor (`@monaco-editor/react`), React Router, TanStack Query, Lucide Icons, Prettier, SQL Formatter.
- **Backend**: Node.js, Express.js, TypeScript, Mongoose ODM, Zod request validation, Helmet, CORS, Rate Limiting, bcrypt, JWT.
- **Database**: MongoDB (Local or MongoDB Atlas).
- **DevOps**: Docker, Docker Compose, Multi-stage Docker builds.

---

## 📦 Quick Start

### 1. Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0
- MongoDB instance (local or MongoDB Atlas connection string)

### 2. Environment Setup
Copy `.env.example` into `server/.env` and update your MongoDB URI and secrets:
```bash
cp .env.example server/.env
```

### 3. Installation
Install root, server, and client dependencies:
```bash
npm run install:all
```

### 4. Running Locally
Start both backend (port 5000) and frontend (port 5173) in development mode:
```bash
npm run dev
```

### 5. Running with Docker Compose
```bash
docker-compose up --build
```
Client will be accessible at `http://localhost:5173` and Server API at `http://localhost:5000/api/v1`.

---

## 🔒 Security Architecture
- **Query-Level Authorization**: Resources are strictly queried by `{ _id, userId }`.
- **Sanitized Outputs**: Data Transfer Objects (DTOs) strip sensitive database metadata (`__v`, internal IDs, passwords).
- **Rate Limiting & Security Headers**: Integrated Helmet and Express-Rate-Limit against brute-force and scraping.
- **Zero Arbitrary Execution for Formatting**: All code formatting is safely executed through client-side universal AST formatters without untrusted server-side code execution.
