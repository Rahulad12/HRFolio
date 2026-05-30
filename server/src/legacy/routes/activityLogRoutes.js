import express from 'express';
import ActivityLog from '../model/ActivityLogs.js';
import { checkUserExist, authenticate } from '../middleware/auhtMiddleware.js';

const activityLogRouter = express.Router();

activityLogRouter.get('/', authenticate, checkUserExist, async (req, res) => {
    try {
        const activityLogs = await ActivityLog.find({}).sort({ createdAt: -1 }).select('-__v');
        res.status(200).json({ success: true, data: activityLogs });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
})

activityLogRouter.get("/candidate/:id", authenticate, checkUserExist, async (req, res) => {
    try {
        const activityLogs = await ActivityLog.find({ candidate: req.params.id }).sort({ createdAt: -1 }).populate({
            path: 'candidate',
            select: '-__v'
        }).select('-__v');
        res.status(200).json({ success: true, data: activityLogs });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
})


export default activityLogRouter;