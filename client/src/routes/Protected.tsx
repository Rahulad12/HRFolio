import { Routes, Route, Navigate } from 'react-router-dom'
import { useAppSelector } from '../Hooks/hook';
import Dashboard from '../pages/Dashboard';
import CvUploader from '../pages/CvUploader';
const Protected = () => {
    const isAuth = useAppSelector(state => state.auth.user.token);
    if (!isAuth) return <Navigate to="/" replace />
    return (
        <Routes>
            <Route path='/' element={<Dashboard />} />
            <Route path='cv-collection' element={<CvUploader />} />
        </Routes>
    )
};

export default Protected;