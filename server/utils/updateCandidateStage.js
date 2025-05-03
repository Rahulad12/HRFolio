// services/candidateService.js

import Candidate from "../model/Candidate.js";

const STAGE_TRANSITIONS = {
    start: ["shortlisted"],
    shortlisted: ["assessment", "offered", "rejected"],
    assessment: ["first", "offered", "rejected"],
    first: ["second", "offered", "rejected"],
    second: ["third", "offered", "rejected"],
    third: ["offered", "rejected"],
    offered: ["hired", "rejected"],
    hired: [],
    rejected: [],
};

const STAGE_ORDER = [
    "shortlisted",
    "assessment",
    "first",
    "second",
    "third",
    "offered",
    "hired"
];

/**
 * Check if stage transition is allowed
 */
export const canMoveToStage = (currentStatus, newStatus, progress = {}) => {
    if (newStatus === currentStatus) return true;
    if (newStatus === "rejected") return true;

    const allowed = STAGE_TRANSITIONS[currentStatus] || [];
    if (!allowed.includes(newStatus)) return false;

    if (["offered", "rejected"].includes(newStatus)) return true;

    const prevIndex = STAGE_ORDER.indexOf(newStatus) - 1;
    if (prevIndex < 0) return true;

    const prevStage = STAGE_ORDER[prevIndex];
    return progress[prevStage]?.completed === true;
};


/**
 * Update candidate stage with validation
 */
export const updateCandidateStage = async (candidateId, newStatus) => {
    const candidate = await Candidate.findById(candidateId);
    if (!candidate) return null;

    candidate.status = newStatus;
    if (!candidate.progress[newStatus]) {
        candidate.progress[newStatus] = {};
    }
    candidate.progress[newStatus].date = new Date();

    await candidate.save();
    return candidate;
};
