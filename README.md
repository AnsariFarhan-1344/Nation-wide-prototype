# Nationwide Student & Staff Collaboration Portal (PS004)

An all-in-one collaborative ecosystem connecting students, researchers, faculty, and industry mentors across universities nationwide.

---

## 🌟 Key Features

- **Multi-Persona Authentication**: Instant role switcher and auth support for Students, Faculty/Staff, Mentors, and Administrators.
- **AI-Powered Project Discovery & Matching**: Match students to nationwide projects and research opportunities based on skillset and interests.
- **Collaborative Team Workspace**: Integrated Kanban boards, project management, and real-time chat for distributed academic teams.
- **Academic Q&A Knowledge Base**: Upvoting, answers, peer-reviewed solutions, and AI-assisted similar question detection.
- **Mentorship & Research Gateway**: Direct mentor discovery, research opportunity applications, and faculty guidance.
- **Reputation & Badges Leaderboard**: Gamified peer endorsements, badges, and cross-campus reputation tracking.
- **Admin Moderation & Analytics**: Platform moderation queue, verification management, and system-wide analytics.

---

## 🛠️ Tech Stack

- **Frontend**: React (Vite), Modern Vanilla CSS Design System, Lucide Icons
- **Backend**: Node.js, Express.js REST API Layer
- **Database / Auth**: Mock JSON Data store with Supabase integration ready
- **Tooling**: Concurrent Runner (`dev.js`)

---

## 🚀 Quick Start

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- `npm`

### 2. Installation
Install root, client, and server dependencies:
```bash
npm run install-all
```

### 3. Environment Setup
Copy the environment template if needed:
```bash
cp client/.env.example client/.env
```

### 4. Running the Application
Start both the Express backend server (`http://localhost:5000`) and the Vite frontend client (`http://localhost:5173`) simultaneously:
```bash
npm run dev
```

---

## 📁 Project Structure

```
├── client/                 # Vite + React Frontend
│   ├── src/
│   │   ├── components/     # UI Components & Navigation
│   │   ├── context/        # Auth & State Contexts
│   │   ├── pages/          # Application Pages (Projects, Teams, Q&A, etc.)
│   │   └── services/       # API integration client
│   └── package.json
├── server/                 # Node.js + Express Backend
│   ├── data/               # Persistent JSON datasets (Users, Projects, Teams, Q&A)
│   ├── routes/             # Express API route handlers
│   └── server.js           # Server entrypoint
├── dev.js                  # Concurrent dev runner script
└── package.json            # Root configuration
```
