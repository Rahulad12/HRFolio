import { Routes, Route, Navigate } from 'react-router-dom'
import { useAppSelector } from '../Hooks/hook';
import Dashboard from '../pages/Dashboard';
const Protected = () => {
    const isAuth = useAppSelector(state => state.auth.user.token);
    console.log(isAuth);
    if (!isAuth) return <Navigate to="/" replace />
    return (
        <Routes>
            <Route path='/' element={<Dashboard />} />
        </Routes>
    )
};

export default Protected;