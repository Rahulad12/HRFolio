import { Routes, Route, Navigate } from 'react-router-dom'
import Login from '../pages/auth/Login'
import { useAppSelector } from '../Hooks/hook'
import NotFound from '../pages/NotFound'


const Public = () => {
    const isAuth = useAppSelector(state => state.auth.user.token);

    if (isAuth) return <Navigate to="/dashboard" replace />


    return (
        <Routes>
            <Route path='/' element={<Login />} />
            <Route path='*' element={<NotFound />} />
        </Routes>
    )
}

export default Public;