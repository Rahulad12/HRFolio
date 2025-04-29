import express from 'express';
import ActivityLog from '../model/ActivityLogs.js';
import { checkUserExist, authenticate } from '../middleware/auhtMiddleware.js';

const activityLogRouter = express.Router();

activityLogRouter
activityLogRouter.get('/', authenticate, checkUserExist, async (req, res) => {
    try {
        const activityLogs = await ActivityLog.find({}).sort({ createdAt: -1 }).select('-__v');
        res.status(200).json({ success: true, data: activityLogs });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
})


export default activityLogRouter;