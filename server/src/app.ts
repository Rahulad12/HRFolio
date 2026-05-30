import "dotenv/config";
import express from 'express';
import legacyApp from './legacy/index.js';
import { escalationRoutes } from './modules/escalations/index.js';
import { auditLogRoutes } from './modules/audit-logs/index.js';

const app = express();

app.use(express.json());
app.use('/api/escalations', escalationRoutes);
app.use('/api/audit-logs', auditLogRoutes);
app.use(legacyApp);

export default app;
