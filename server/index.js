import express from 'express';
import cors from 'cors';
import passport from 'passport';
import session from 'express-session';
import "./config/passport.js";
import logger from "./utils/logger.js";
import connectDB from './config/db.js';
import "dotenv/config";
const app = express();


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

app.use('/api/auth', authRouter);
app.use('/api/candidate', candidateRouter);
app.use('/api/interview', interviewRouter);

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