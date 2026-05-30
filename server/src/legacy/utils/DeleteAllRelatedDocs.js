import AssessmentLog from "../model/AssessmentLog.js";
import Offer from "../model/Offer.js";
import OfferLog from "../model/offerLogs.js";
import ActivityLog from "../model/ActivityLogs.js";
import Assessment from "../model/Assessment.js";
import AssessmentAssignment from "../model/AssessmentAssignment.js";
import Score from "../model/ScoreModle.js";
import Candidate from "../model/Candidate.js";
import CandidateLog from "../model/CandidateLogs.js";
import Interview from "../model/Interview.js";
import InterviewLog from "../model/interviewLog.js";
import Interviewers from "../model/Interviewers.js";
import GeneralEmail from "../model/GeneralEmail.js";
import EmailTemplate from "../model/EmailTemplate.js";

const deleteAllRelatedDocs = async (candidateId) => {
    await Promise.all([
        AssessmentLog.deleteMany({ candidate: candidateId }),
        Offer.deleteMany({ candidate: candidateId }),
        OfferLog.deleteMany({ candidate: candidateId }),
        ActivityLog.deleteMany({ candidate: candidateId }),
        Assessment.deleteMany({ candidate: candidateId }),
        AssessmentAssignment.deleteMany({ candidate: candidateId }),
        Score.deleteMany({ candidate: candidateId }),
        Candidate.deleteMany({ _id: candidateId }),
        CandidateLog.deleteMany({ candidate: candidateId }),
        Interview.deleteMany({ candidate: candidateId }),
        InterviewLog.deleteMany({ candidate: candidateId }),
        Interviewers.deleteMany({ candidate: candidateId }),
        GeneralEmail.deleteMany({ candidate: candidateId }),
        EmailTemplate.deleteMany({ candidate: candidateId })
    ])
    return {
        success: true,
        message: "Candidate  and all related documents deleted successfully"
    }
};

export default deleteAllRelatedDocs;