import Candidate from "../model/Candidate.js";

export const canCandidateProgress = (currentStage) => {
    return async (req, res, next) => {
        try {
            const candidateId = req.body.candidate;
            const candidate = await Candidate.findById(candidateId);
            if (!candidate) {
                return res.status(404).json({ success: false, message: "Candidate not found" });
            }
            const pipelineStages = ["shortlisted", "assessment", "first", "second", "third", "offered", "hired"];
            const currentIndex = pipelineStages.indexOf(currentStage);
            if (currentIndex === -1) {
                return res.status(400).json({ success: false, message: "Invalid stage" });
            }
            if (currentIndex > 0) {
                const previousStages = pipelineStages.slice(0, currentIndex);
                if (currentStage === "offered") {
                    const anyCompleted = previousStages.some((stage) => candidate.progress?.[stage]?.completed);
                    if (!anyCompleted) {
                        return res.status(400).json({
                            success: false,
                            message: `Cannot proceed to '${currentStage}' because previous stages are not completed`
                        });
                    }
                }
                else {
                    const previousStage = pipelineStages[currentIndex - 1];
                    const isPreviousCompleted = candidate.progress?.[previousStage]?.completed;

                    if (!isPreviousCompleted) {
                        return res.status(400).json({
                            success: false,
                            message: `Cannot proceed to '${currentStage}' because '${previousStage}' is not completed`
                        });
                    }
                }
            }
            next();
        } catch (error) {
            console.error("Error in canCandidateProgress:", error);
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    };
};

export const canInterviewProgress = () => {
    return async (req, res, next) => {
        try {
            const { InterviewRound } = req.body;
            if (!InterviewRound) {
                return res.status(400).json({ success: false, message: "Interview round not specified" });
            }

            // Get the middleware function from canCandidateProgress
            const middleware = canCandidateProgress(InterviewRound);
            await middleware(req, res, next); // Call it with req, res, next
        } catch (error) {
            console.error("Error in canInterviewProgress:", error);
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    };
};
