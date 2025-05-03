import Candidate from "../model/Candidate.js";

const candidatePipelineStages = ["shortlisted", "assessment", "first", "second", "third", "offered", "hired"];

export const canCandidateProgress = async (candidateId, currentStage, req, res, next) => {
    try {
        const candidate = await Candidate.findById(candidateId);
        if (!candidate) {
            return res.status(404).json({ success: false, message: "Candidate not found" });
        }

        const currentIndex = candidatePipelineStages.indexOf(currentStage);
        if (currentIndex === -1) {
            return res.status(400).json({ success: false, message: "Invalid stage" });
        }

        // If it's not the first stage, check if the previous stage is completed
        if (currentIndex > 0) {
            const previousStage = candidatePipelineStages[currentIndex - 1];
            const isPreviousCompleted = candidate.progress?.[previousStage]?.completed;

            if (!isPreviousCompleted) {
                return res.status(400).json({
                    success: false,
                    message: `Cannot proceed to '${currentStage}' because '${previousStage}' is not completed`
                });
            }
        }

        next();
    } catch (error) {
        console.error("Error in canCandidateProgress:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

