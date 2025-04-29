import InterviewerData from "./InterviewData.js";
import connectDB from "../config/db.js";
import Interviewers from "../model/Interviewers.js";
import Candiate from "../model/Candidate.js";
import { candidates } from "../Data/CandidateData.js";

// Destroy data
const destroyData = async () => {
    try {
        await Interviewers.deleteMany({});
        await Candiate.deleteMany({});
        console.log("Data destroyed");
        process.exit();
    } catch (err) {
        console.error("Error destroying data:", err);
        process.exit(1);
    }
};

// Insert data
const insertData = async () => {
    try {
        // await Interviewers.deleteMany(); // Optional: clear before insert
        // await Interviewers.insertMany(InterviewerData);
        await Candiate.insertMany(candidates);
        console.log("Data inserted");
        process.exit();
    } catch (err) {
        console.error("Error inserting data:", err);
        process.exit(1);
    }
};

// Run based on argument
const run = async () => {
    await connectDB();

    if (process.argv[2] === "seed") {
        await insertData();
    } else if (process.argv[2] === "destroy") {
        await destroyData();
    } else {
        console.log("Invalid command. Use: node seeder.js seed OR destroy");
        process.exit();
    }
};

run();
