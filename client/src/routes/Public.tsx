import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from '../pages/auth/LoginPage'
import { useAppSelector } from '../Hooks/hook'
import NotFound from '../pages/NotFound'
import LandingPage from '../pages/landingPage/LandingPage'
import LandingPageLayout from '../pages/landingPage/LandingPageLayout'


const Public = () => {
    const isAuth = useAppSelector(state => state.auth.user.token);
    if (isAuth) return <Navigate to="/dashboard" replace />
    return (
        <Routes>
            <Route path='/login' element={<LoginPage />} />
            <Route element={<LandingPageLayout />}>
                <Route index element={<LandingPage />} />
            </Route>
            <Route path='*' element={<NotFound />} />
        </Routes>
    )
}

export default Public;