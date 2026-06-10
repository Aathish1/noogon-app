import express from 'express';
import cors from 'cors';
import questionBank from './data/question-bank.json';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// ─── Rate Limiting (simple in-memory) ───────────────────────────
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW = 60_000; // 1 minute
const RATE_LIMIT_MAX = 30; // 30 requests per minute

function rateLimit(req: express.Request, res: express.Response, next: express.NextFunction) {
  const ip = req.ip || 'unknown';
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return next();
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return res.status(429).json({ error: 'Too many requests. Try again in a minute.' });
  }

  entry.count++;
  return next();
}

app.use(rateLimit);

// ─── In-memory profile storage ──────────────────────────────────
let userProfile = {
  name: 'Forger',
  avatar: '👤',
  updatedAt: new Date().toISOString(),
};

// ─── Routes ─────────────────────────────────────────────────────

// Health check
app.get('/api/health', (_req: express.Request, res: express.Response) => {
  res.json({
    status: 'ok',
    name: 'Forge API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// Get user profile
app.get('/api/user/profile', (_req: express.Request, res: express.Response) => {
  res.json(userProfile);
});

// Store/update user profile
app.post('/api/user/profile', (req: express.Request, res: express.Response) => {
  const { name, avatar } = req.body;

  if (name !== undefined) {
    userProfile.name = String(name).trim().slice(0, 50) || 'Forger';
  }
  if (avatar !== undefined) {
    userProfile.avatar = String(avatar).slice(0, 10) || '👤';
  }
  userProfile.updatedAt = new Date().toISOString();

  res.json({ success: true, profile: userProfile });
});

// Get a random disconnect prompt question
app.get('/api/questions/random', (_req: express.Request, res: express.Response) => {
  const questions = questionBank.questions;
  const randomIndex = Math.floor(Math.random() * questions.length);
  res.json(questions[randomIndex]);
});

// Get all questions (admin)
app.get('/api/questions', (_req: express.Request, res: express.Response) => {
  res.json(questionBank);
});

// Get questions by type
app.get('/api/questions/type/:type', (req: express.Request, res: express.Response) => {
  const { type } = req.params;
  const filtered = questionBank.questions.filter((q) => q.type === type);

  if (filtered.length === 0) {
    return res.status(404).json({ error: `No questions found with type: ${type}` });
  }

  const randomIndex = Math.floor(Math.random() * filtered.length);
  res.json(filtered[randomIndex]);
});

// ─── Start ──────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`
  🔥 Forge API running on http://localhost:${PORT}
  
  Endpoints:
    GET /api/health              Health check
    GET /api/user/profile        Get user profile
    POST /api/user/profile       Store user profile
    GET /api/questions/random    Random disconnect prompt
    GET /api/questions           All questions
    GET /api/questions/type/:t   Random question by type
  `);
});
