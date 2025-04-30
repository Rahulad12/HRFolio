import { Routes, Route, Navigate } from 'react-router-dom'
import { useAppSelector } from '../Hooks/hook';
import Dashboard from '../pages/Dashboard';
import CandidateList from '../pages/candidates/CandidateList';
import CandidateDetail from '../pages/candidates/CandidateDetail';
import CandidateForm from '../pages/candidates/CandidateForm';
import InterviewSchedule from '../pages/interviews/InterviewSchedule';
import AssessmentList from '../pages/assessments/AssessmentList';
import AssessmentForm from '../pages/assessments/AssessmentForm';
import AssessmentAssignmentList from '../pages/assessments/AssessmentAssignmentList';
import InterviewerList from '../pages/interviewers/InterviewerList';
import InterviewerForm from '../pages/interviewers/InterviewerForm';
import OfferList from '../pages/offers/OfferList';
import OfferForm from '../pages/offers/OfferForm';
import EmailTemplateList from '../pages/emails/EmailTemplateList';
import EmailTemplateForm from '../pages/emails/EmailTemplateForm';
import NotFound from '../pages/NotFound';
import AssignAssessment from '../pages/assessments/AssignAssessment';
import Interviews from '../pages/interviews/Interviews';
import GeneralEmailForm from '../pages/emails/GeneralEmailForm';
const Protected = () => {
    const isAuth = useAppSelector(state => state.auth.user.token);
    if (!isAuth) return <Navigate to="/" replace />
    return (
        <Routes>
            {/* Dashboard */}
            <Route path="/" element={<Dashboard />} />
            {/* Candidates */}
            <Route path="candidates">
                <Route index element={<CandidateList />} />
                <Route path=":id" element={<CandidateDetail />} />
                <Route path="new" element={<CandidateForm />} />
                <Route path="edit/:id" element={<CandidateForm />} />
                <Route path="email/:id" element={<GeneralEmailForm />} />
            </Route>

            {/* Interviews */}
            <Route path="interviews">
                {/* <Route index element={<InterviewList />} /> */}
                <Route index element={<Interviews />} />
                <Route path="schedule" element={<InterviewSchedule />} />
            </Route>

            {/* Assessments */}
            <Route path="assessments">
                <Route index element={<AssessmentList />} />
                <Route path="new" element={<AssessmentForm />} />
                <Route path="edit/:id" element={<AssessmentForm />} />
                <Route path="assignments" element={<AssessmentAssignmentList />} />
                <Route path="assign" element={<AssignAssessment />} />
                <Route path="assign/edit/:id" element={<AssignAssessment />} />
            </Route>

            {/* Interviewers */}
            <Route path="interviewers">
                <Route index element={<InterviewerList />} />
                <Route path="new" element={<InterviewerForm />} />
                <Route path="edit/:id" element={<InterviewerForm />} />
            </Route>

            {/* Offers */}
            <Route path="offers">
                <Route index element={<OfferList />} />
                <Route path="new" element={<OfferForm />} />
                <Route path="edit/:id" element={<OfferForm />} />
            </Route>

            {/* Email Templates */}
            <Route path="email-templates">
                <Route index element={<EmailTemplateList />} />
                <Route path="new" element={<EmailTemplateForm />} />
                <Route path="edit/:id" element={<EmailTemplateForm />} />
            </Route>

            <Route path="*" element={<NotFound />} />
        </Routes>
    )
};

export default Protected;