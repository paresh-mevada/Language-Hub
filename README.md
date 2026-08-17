# Language Hub 🌐🤖

**Language Hub** is a full-stack, AI-powered language learning application built with **React**, **Node.js**, **Express**, **MongoDB**, and **OpenAI Responses API**. It features interactive AI conversation tutoring, real-time grammar checks, categorized vocabulary lists with 3D flashcards, interactive practice lessons, live study progress tracking, profile customization, theme switching, and robust security controls.

---

## 🚀 Key Features & Modules

### 1. 🤖 AI Language Tutor Workspace (`/tutor`)
- Real-time conversation practice powered by OpenAI Responses API with structured fallbacks.
- Persistent conversation threads stored in MongoDB (create, rename, select, and delete).
- Markdown response rendering, copy to clipboard, response regeneration, and auto-scroll.
- Fully responsive sidebar history panel for desktop, tablet, and mobile.

### 2. ✍️ Grammar Correction Module (`/grammar`)
- Real-time sentence analysis evaluating grammar errors, spelling, and phrasing.
- Provides corrected text, detailed explanations, and natural alternative phrasings.
- One-click text copy and persisted user grammar history log.

### 3. 📚 Vocabulary & 3D Flashcards (`/vocabulary`)
- Word list management with search, category filtering (`Daily Life`, `Travel`, `Business`, `Technology`, `Food`, `Family`, `Health`), and level filtering (`Beginner` to `Advanced`).
- Favorite and learned state toggles.
- **3D Flashcards Practice Mode**: Interactive card flip animation, next/previous controls, and deck shuffle.

### 4. 📖 Lessons & Interactive Workspace (`/lessons`, `/lessons/:id`)
- Lesson library categorized by Grammar, Vocabulary, Speaking, Listening, Reading, and Writing.
- Markdown theory lessons with code snippets and real-world examples.
- Interactive multiple-choice and fill-in-the-blank exercises with automated scoring and detailed explanations.

### 5. 📊 Progress Tracking & Analytics (`/progress`)
- Real-time streak algorithm calculating current consecutive study days and longest streaks.
- 7-day weekly activity bar chart with daily goal benchmark indicators.
- Live metric cards (Total Study Hours, Lessons Completed, Words Learned, Conversations Held).
- Interactive study minutes logger widget.

### 6. 👤 User Profile Management (`/profile`)
- Editable full name, native language, target learning language, and skill level.
- Avatar selection gallery with preset avatars or custom image URL input.
- Real-time Zustand store synchronization across header and layout.

### 7. ⚙️ Application Settings (`/settings`)
- **Appearance**: Dark Mode 🌙, Light Mode ☀️, and System Default 💻 theme switching persisted in `localStorage` and DOM classes.
- **Learning Preferences**: Target language, proficiency level, and daily study targets (15, 30, 45, 60 mins/day).
- **Notifications**: Toggles for daily study reminders, lesson progress alerts, and streak notifications.

### 8. 🔒 Security & Architecture
- **Authentication**: JWT token verification via Bearer header or HTTP-only cookies, bcryptjs password hashing.
- **Protection**: `helmet` HTTP security headers, `express-rate-limit` request throttling, and NoSQL injection sanitizer.
- **Database Safety**: Mandatory user ownership checks (`userId: req.user._id`) on all private data.

---

## 🛠️ Technology Stack

- **Frontend**: React 19, Vite, Tailwind CSS v4, React Router, Zustand, Axios, Lucide React, React Markdown
- **Backend**: Node.js, Express 5, MongoDB with Mongoose, JWT, bcryptjs, Helmet, Express Rate Limit
- **AI Integration**: OpenAI Node SDK using the Responses API with structured output instructions

---

## 💻 Local Installation & Setup

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **MongoDB**: Local MongoDB instance or MongoDB Atlas cluster connection string

### 1. Clone & Install Dependencies

```bash
# Clone the repository
git clone https://github.com/your-username/language-hub.git
cd language-hub

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Environment Configuration

Create `server/.env` inside the `server/` directory:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/language-hub
JWT_SECRET=your_super_secret_jwt_key_phrase_12345
JWT_EXPIRES_IN=7d
AI_API_KEY=your_openai_api_key
AI_MODEL=gpt-5.4-mini
CLIENT_URL=http://localhost:5173,http://127.0.0.1:5173
```

Create `client/.env` inside the `client/` directory:

```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Run Application Locally

```bash
# Start backend server (Port 5000)
cd server
npm run dev

# In a separate terminal, start frontend dev server (Port 5173)
cd client
npm run dev
```

Open `http://localhost:5173` in your browser to access Language Hub.

---

## 📡 REST API Endpoint Reference

| Method | Endpoint | Description | Protected |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Health check endpoint | No |
| `POST` | `/api/auth/register` | Register a new user account | No |
| `POST` | `/api/auth/login` | Authenticate user & issue JWT | No |
| `POST` | `/api/auth/logout` | Clear auth cookie | Yes |
| `GET` | `/api/auth/me` | Fetch authenticated user data | Yes |
| `GET` | `/api/users/profile` | Retrieve user profile details | Yes |
| `PUT` | `/api/users/profile` | Update user profile & avatar | Yes |
| `GET` | `/api/conversations` | List user AI tutor conversations | Yes |
| `POST` | `/api/conversations` | Create a new AI tutor conversation | Yes |
| `GET` | `/api/conversations/:id` | Get specific conversation details | Yes |
| `PUT` | `/api/conversations/:id` | Rename a conversation | Yes |
| `DELETE` | `/api/conversations/:id` | Delete a conversation | Yes |
| `GET` | `/api/conversations/:id/messages` | Fetch messages for conversation | Yes |
| `POST` | `/api/conversations/:id/messages` | Send message to AI tutor | Yes |
| `POST` | `/api/conversations/:id/messages/:messageId/regenerate` | Regenerate assistant response | Yes |
| `POST` | `/api/grammar/check` | Analyze grammar of submitted text | Yes |
| `GET` | `/api/grammar` | Fetch user grammar check history | Yes |
| `DELETE` | `/api/grammar/:id` | Delete a grammar check entry | Yes |
| `GET` | `/api/vocabulary` | Fetch vocabulary list with filters | Yes |
| `POST` | `/api/vocabulary` | Create a new vocabulary term | Yes |
| `PUT` | `/api/vocabulary/:id` | Update vocabulary word | Yes |
| `DELETE` | `/api/vocabulary/:id` | Delete vocabulary word | Yes |
| `PATCH` | `/api/vocabulary/:id/learned` | Toggle word learned status | Yes |
| `PATCH` | `/api/vocabulary/:id/favorite` | Toggle word favorite status | Yes |
| `GET` | `/api/lessons` | Fetch lessons list with user scores | Yes |
| `GET` | `/api/lessons/:id` | Fetch lesson theory and exercises | Yes |
| `POST` | `/api/lessons/:id/submit` | Submit exercise answers for scoring | Yes |
| `GET` | `/api/progress` | Fetch 7-day streak & analytics | Yes |
| `POST` | `/api/progress` | Log daily practice minutes | Yes |

---

## 📁 Project Architecture

```text
language-hub/
├── client/
│   ├── src/
│   │   ├── components/       # Layout, Header, Sidebar, Tutor, UI components
│   │   ├── context/          # Zustand auth store
│   │   ├── pages/            # Dashboard, Tutor, Grammar, Vocabulary, Lessons, Progress, Profile, Settings
│   │   ├── services/         # Axios API service instances
│   │   ├── utils/            # Settings store & helpers
│   │   ├── App.jsx           # Application Router
│   │   └── main.jsx          # Entry point
│   ├── package.json
│   └── vite.config.js
└── server/
    ├── controllers/          # Request handlers for auth, user, tutor, grammar, vocab, lessons, progress
    ├── middleware/           # Auth protection, error handling, 404, rate limiting
    ├── models/               # Mongoose schemas (User, Conversation, Message, GrammarCheck, Vocabulary, Lesson, Progress)
    ├── routes/               # Express router mounts
    ├── services/             # OpenAI AI service & seed service
    ├── app.js                # Express app setup
    ├── server.js             # HTTP server listener
    └── package.json
```

---

## 📄 License

This project is licensed under the MIT License.
