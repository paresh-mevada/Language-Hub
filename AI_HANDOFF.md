# Language Hub - AI Handoff

## Project Status

Language Hub is a JavaScript-only full-stack language learning platform.

Completed phases:

1. Project setup
2. Backend foundation
3. User authentication
4. Frontend authentication UI
5. Authenticated application layout
6. Dashboard
7. AI language tutor workspace
8. AI tutor behavior
9. Grammar correction with persisted history and `/api/grammar/check`
10. Vocabulary model, CRUD APIs, searchable lists, favorites, learned state, and flashcards
11. Lessons model, lesson list, detail page, exercises, scoring, and completion status
12. Progress model, live dashboard statistics, and charts
13. User profile API and editable profile screen
14. Persistent theme, learning preferences, and notification settings
15. Final responsive verification across screen sizes (Desktop, Laptop, Tablet, Mobile)
16. Complete API coverage audit & REST format verification
17. Centralized Express error handler for Mongoose, JWT, AI provider, and validation errors
18. Helmet HTTP headers, rate limiting (express-rate-limit), NoSQL injection protection, and ownership checks
19. Automated demo data seeding for lessons, vocabulary, AI tutor starter conversations, and 7-day progress metrics
20. Code quality audit, clean folder architecture, production build verification, and complete README documentation rewrite

---

🎉 **ALL 20 PHASES ARE FULLY IMPLEMENTED, VERIFIED, AND COMPLETED!**







## Stack

- Frontend: React 19, Vite, Tailwind CSS v4, React Router, Zustand, Axios, Lucide React, React Markdown
- Backend: Node.js, Express 5, MongoDB with Mongoose, JWT, bcryptjs
- AI: OpenAI Node SDK using the Responses API

## Run Locally

Install and run the frontend:

```bash
cd client
npm install
npm run dev
```

Install and run the backend:

```bash
cd server
npm install
npm run dev
```

Frontend default URL: `http://localhost:5173`

Backend default URL: `http://localhost:5000`

## Required Environment Variables

Create `server/.env` from `server/.env.example`:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRES_IN=7d
AI_API_KEY=your_api_key
AI_MODEL=gpt-5.4-mini
AI_BASE_URL=
CLIENT_URL=http://localhost:5173,http://127.0.0.1:5173
```

Create `client/.env` from `client/.env.example`:

```env
VITE_API_URL=http://localhost:5000/api
```

MongoDB, `JWT_SECRET`, and `AI_API_KEY` are needed for the full application flow.

## Implemented Features

### Authentication

- Register, login, logout, and current-user API endpoints
- Bcrypt password hashing
- JWT verification via bearer token or HTTP-only cookie
- Protected React routes and Zustand auth state
- Login and registration screens with loading and error states

### Application Layout

- Responsive sidebar and mobile drawer
- Active navigation state
- Collapsible desktop sidebar
- Header with notification button and user menu
- Protected routes for dashboard, tutor, lessons, vocabulary, grammar, progress, profile, and settings

### Dashboard

- Personalized welcome message
- Dynamic learning statistics, daily-goal progress, recent conversations, and quick actions
- Connected live API metrics from Progress, Lessons, Vocabulary, and Conversations

### AI Tutor

- Create, select, rename, and delete conversations
- Persist user and assistant messages in MongoDB
- Markdown-rendered responses, copy, regenerate, typing indicator, and automatic scroll
- Responsive conversation history panel
- `server/services/aiService.js` is the only module that calls the AI provider
- If `AI_API_KEY` is missing, the tutor responds with a safe setup error

### Vocabulary Module

- Vocabulary word list, creation modal, edit modal, delete
- Search by word, definition, or example
- Category filtering (`Daily Life`, `Travel`, `Business`, `Education`, `Technology`, `Food`, `Family`, `Health`)
- Level filtering (`Beginner` to `Advanced`)
- Toggle favorite & learned status
- Interactive 3D Flashcards practice mode with flip animation, card navigation, and shuffle deck

### Lessons Module

- Lesson library categorized by Grammar, Vocabulary, Speaking, Listening, Reading, and Writing
- Lesson card overview with category icon, level, duration, and completion percentage
- Detailed lesson view with Markdown theory and interactive practice exercises
- Support for Multiple Choice and Fill-in-the-Blank exercise types
- Automated exercise scoring, detailed answer evaluation with explanations, and persistent user progress

### Progress Tracking

- Daily activity tracking model and log progress API (`POST /api/progress`)
- Real-time streak calculation algorithm (current streak & longest streak)
- Weekly 7-day activity bar chart with daily goal benchmark indicator
- Learning distribution balance indicators
- Quick study minutes logger widget

### User Profile

- User profile API endpoints (`GET /api/users/profile`, `PUT /api/users/profile`)
- Editable full name, native language, target learning language, and skill level
- Preset avatar picker gallery + custom image URL support
- Real-time Zustand auth store synchronization across application header and layout

### Settings

- Appearance theme configuration (Dark Mode, Light Mode, System Theme) persisted in `localStorage` and DOM classes
- Learning preferences (Target Language, Skill Level, Daily Target Goal of 15-60 mins)
- Notification toggles for Daily Practice Reminders, Lesson Progress, and Achievement Alerts
- Reset defaults action and settings save feedback

## Important API Routes

```text
GET  /api/health

POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me

GET    /api/conversations
POST   /api/conversations
GET    /api/conversations/:id
PUT    /api/conversations/:id
DELETE /api/conversations/:id
GET    /api/conversations/:id/messages
POST   /api/conversations/:id/messages
POST   /api/conversations/:id/messages/:messageId/regenerate

POST   /api/grammar/check
GET    /api/grammar
DELETE /api/grammar
DELETE /api/grammar/:id

GET    /api/vocabulary
POST   /api/vocabulary
PUT    /api/vocabulary/:id
DELETE /api/vocabulary/:id
PATCH  /api/vocabulary/:id/learned
PATCH  /api/vocabulary/:id/favorite

GET    /api/lessons
GET    /api/lessons/:id
POST   /api/lessons
POST   /api/lessons/:id/submit

GET    /api/progress
POST   /api/progress

GET    /api/users/profile
PUT    /api/users/profile
```

## Key Files

```text
client/src/App.jsx
client/src/context/authStore.js
client/src/services/api.js
client/src/services/conversationService.js
client/src/services/grammarService.js
client/src/services/vocabularyService.js
client/src/services/lessonService.js
client/src/services/progressService.js
client/src/services/userService.js
client/src/utils/settingsStore.js
client/src/components/layout/AppLayout.jsx
client/src/pages/Dashboard.jsx
client/src/pages/Tutor.jsx
client/src/pages/Grammar.jsx
client/src/pages/Vocabulary.jsx
client/src/pages/Lessons.jsx
client/src/pages/LessonDetail.jsx
client/src/pages/Progress.jsx
client/src/pages/Profile.jsx
client/src/pages/Settings.jsx

server/app.js
server/server.js
server/models/User.js
server/models/Conversation.js
server/models/Message.js
server/models/GrammarCheck.js
server/models/Vocabulary.js
server/models/Lesson.js
server/models/UserLessonProgress.js
server/models/Progress.js
server/controllers/authController.js
server/controllers/userController.js
server/controllers/conversationController.js
server/controllers/grammarController.js
server/controllers/vocabularyController.js
server/controllers/lessonController.js
server/controllers/progressController.js
server/services/aiService.js
server/routes/userRoutes.js
server/routes/grammarRoutes.js
server/routes/vocabularyRoutes.js
server/routes/lessonRoutes.js
server/routes/progressRoutes.js
```





## Remaining Roadmap

Implement these phases next, without replacing working authentication, layout, or tutor functionality:

1. Phase 9: Grammar correction with persisted history and `/api/grammar/check`
2. Phase 10: Vocabulary model, CRUD APIs, searchable lists, favorites, learned state, and flashcards
3. Phase 11: Lessons model, lesson list, detail page, exercises, scoring, and completion status
4. Phase 12: Progress model, live dashboard statistics, and charts
5. Phase 13: User profile API and editable profile screen
6. Phase 14: Persistent theme, learning preferences, and notification settings
7. Phase 15: Final responsive verification across screen sizes
8. Phase 16-20: Complete API coverage, security hardening, seed data, error coverage, and final README

## Engineering Constraints

- JavaScript only. Do not add TypeScript files.
- Keep API responses in the existing `{ success, message, data }` format.
- Keep secrets in environment variables only.
- Use the existing Axios service and Zustand auth store.
- Preserve ownership checks on user-specific MongoDB documents.
- Keep AI provider calls inside `server/services/aiService.js`.
- Reuse the authenticated `AppLayout` and existing Tailwind/Lucide component patterns.
- Build and verify the frontend after changes with `npm run build` from `client`.
