import express from 'express';
import cors from 'cors';
import passport from 'passport';
import session from 'express-session';
import "./config/passport.js";
import logger from "./utils/logger.js";
import connectDB from './config/db.js';
import { EventEmitter } from 'events';

import "dotenv/config";
const app = express();


EventEmitter.defaultMaxListeners = 20;
// session (if needed for passport)
app.use(session({ secret: 'secret', resave: false, saveUninitialized: true }));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//routes 
import authRouter from './routes/authRoutes.js';
import candidateRouter from './routes/candidateRoutes.js';
import interviewRouter from './routes/interviewRoutes.js';
import interviewerRouter from './routes/interviewerRoutes.js';
import assessmentRouter from './routes/assessmentRoutes.js';
import uploadRouter from './routes/uploadRoutes.js';
import emailRouter from "./routes/emailRoutes.js";
import offerRouter from "./routes/offerRoutes.js";
import searchRouter from './routes/searchRoutes.js';
import activityLogRouter from './routes/activityLogRoutes.js';
import hiredRouter from './routes/hiredRoutes.js';
app.use('/api/auth', authRouter);
app.use('/api/candidate', candidateRouter);
app.use('/api/interview', interviewRouter);
app.use('/api/interviewer', interviewerRouter);
app.use('/api/assessment', assessmentRouter);
app.use('/api/email', emailRouter);
app.use('/api/offer', offerRouter);
app.use("/uploads", express.static("uploads"));
app.use("/api/uploads", uploadRouter);
app.use("/api/search", searchRouter);
app.use("/api/activity-log", activityLogRouter);
app.use("/api/hired", hiredRouter);

app.get('/', (req, res) => {
    logger.info("Server is running");
    res.json({
        success: true,
        message: "Server is running"
    });
});


app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).json({
        success: false,
        message: err.message
    });
    next();
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});