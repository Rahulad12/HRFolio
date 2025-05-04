import Candidate from "../model/Candidate.js";
/**
 * 
 * @param {string} candidateId 
 * @param  {string}currentStage 
 * @param [created, deleted, updated] action 
 * @returns 
 * when any action is performed on candidate progress it updates the candidate progress and returns the updated candidate 
 * and it delete the candidates progress and returns the updated candidate where if canidates current current stage progress will revert to false
 */
export const updateCandidateCurrentStage = async (candidateId, currentStage, action) => {
    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
        return {
            success: false,
            message: "Candidate not found"
        };
    }
    if (!candidate.progress || !candidate.progress[currentStage]) {
        return {
            success: false,
            message: `Stage "${currentStage}" not found in candidate progress`
        };
    }

    candidate.status = currentStage;

    if (action === 'deleted') {
        candidate.progress[currentStage].completed = false;
        candidate.progress[currentStage].date = null;
    } else {
        candidate.progress[currentStage].completed = true;
        candidate.progress[currentStage].date = new Date();
    }

    await candidate.save();

    return {
        success: true,
        message: `Candidate progress for "${currentStage}" ${action === 'deleted' ? 'reverted' : 'updated'} successfully and deleted ${currentStage},"`,
        data: candidate
    };
};
