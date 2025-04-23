import { Routes, Route, Navigate } from 'react-router-dom'
import Login from '../pages/auth/Login'
import { useAppSelector } from '../Hooks/hook'


const Public = () => {
    const isAuth = useAppSelector(state => state.auth.user.token);

    if (isAuth) return <Navigate to="/dashboard" replace />


    return (
        <Routes>
            <Route path='/' element={<Login />} />
        </Routes>
    )
}

export default Public;