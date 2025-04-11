import { Routes, Route, Navigate } from 'react-router-dom'
import Login from '../pages/Login'
import Register from '../pages/Register'
import { useAppSelector } from '../Hooks/hook'


const Public = () => {
    const isAuth = useAppSelector(state => state.auth.user.token);

    if (isAuth) return  <Navigate to="/dashboard" replace/>
    

    return (
        <Routes>
            <Route path='/' element={<Login />} />
            <Route path='/register' element={<Register />} />
        </Routes>
    )
}

export default Public;