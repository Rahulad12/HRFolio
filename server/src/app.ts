import "dotenv/config";
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import legacyApp from './legacy/index.js';
import { escalationRoutes } from './modules/escalations/index.js';
import { auditLogRoutes } from './modules/audit-logs/index.js';
import helmet from "helmet";
import morgan from "morgan";
const app = express();

//middleware
app.use(helmet());

const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:5173')
  .split(',')
  .map(o => o.trim())
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error(`CORS: origin '${origin}' not allowed`))
    }
  },
  credentials: true,
}));

app.use(morgan('combined'));
app.use(express.json());
app.use(cookieParser());

//routes
app.use('/api/escalations', escalationRoutes);
app.use('/api/audit-logs', auditLogRoutes);
app.use(legacyApp);

export default app;
