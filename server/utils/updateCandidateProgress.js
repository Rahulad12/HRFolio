import Candidate from '../model/Candidate.js';

export const updateCandidateProgress = async (candidateId, targetStage) => {
    const candidate = await Candidate.findById(candidateId);
    if (!candidate) throw new Error('Candidate not found');

    const PIPELINE_ORDER = [
        'shortlisted',
        'assessment',
        'first',
        'second',
        'third',
        'offered',
        'hired'
    ];

    const targetIndex = PIPELINE_ORDER.indexOf(targetStage);
    if (targetIndex === -1) {
        throw new Error('Invalid pipeline stage');
    }

    if (!['offered', 'hired'].includes(targetStage)) {
        for (let i = 0; i < targetIndex; i++) {
            const prevStage = PIPELINE_ORDER[i];
            if (prevStage === 'shortlisted') continue;

            if (!candidate.progress[prevStage]?.completed) {
                throw new Error(`Cannot move to '${targetStage}' until '${prevStage}' is completed`);
            }
        }
    }


    //  Only mark progress as completed if it's not yet marked
    if (!candidate.progress[targetStage]?.completed) {
        candidate.progress[targetStage] = {
            completed: true,
            date: new Date()
        };
    }

    // Update status only if it's not ahead already
    const currentStatusIndex = PIPELINE_ORDER.indexOf(candidate.status);
    if (currentStatusIndex < targetIndex) {
        candidate.status = targetStage;
    }

    await candidate.save();
    return candidate;
};

