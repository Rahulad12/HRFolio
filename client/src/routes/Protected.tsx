import { Routes, Route, Navigate } from 'react-router-dom'
import { useAppSelector } from '../Hooks/hook';
import Dashboard from '../pages/Dashboard';
import CvUploader from '../pages/CvUploader';
import CandidatePage from '../pages/CandidateProfile';
import Interview from '../pages/Interview';
import Assessment from '../pages/Assessment';
import AssignedAssessment from '../pages/AssignedAssessment';
const Protected = () => {
    const isAuth = useAppSelector(state => state.auth.user.token);
    if (!isAuth) return <Navigate to="/" replace />
    return (
        <Routes>
            <Route path='/' element={<Dashboard />} />
            <Route path='cv-collection' element={<CvUploader />} />
            <Route path='candidate/:id' element={<CandidatePage />} />
            <Route path='interviews' element={<Interview />} />
            <Route path='assessments' element={<Assessment />} />
            <Route path='assigned' element={<AssignedAssessment />} />
        </Routes>
    )
};

export default Protected;