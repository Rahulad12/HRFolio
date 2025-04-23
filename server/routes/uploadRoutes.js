import express from "express";
import { upload } from "../upload.js";
import fs from "fs";
import path from "path";
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const uploadRouter = express.Router();

uploadRouter.post("/resume", upload.single("resume"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

    res.status(200).json({
        success: true,
        message: "File uploaded successfully",
        url: fileUrl,
    });
});

uploadRouter.get("/resume/:filename/download", (req, res) => {
    const filename = req.params.filename;
    console.log(filename);
    const filePath = path.join(__dirname, "../uploads", filename);
    console.log(filePath);
    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
        console.log(filePath);
    } else {
        res.status(404).json({ success: false, message: "File not found" });
    }
});


export default uploadRouter;
