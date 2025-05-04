import React, { useEffect, useState } from 'react';
import AuthForm from './AuthForm';
import { useAppDispatch } from '../../Hooks/hook';
import { setCredentials } from '../../slices/authSlices';
import { useLocation, useNavigate } from 'react-router-dom';
import WelcomeBackPage from './WelcomeBackPage';

const Login: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const googleURL = import.meta.env.VITE_API_URL;

  const submitHandler = () => {
    setIsLoading(true);
    window.location.href = `${googleURL}auth/google`;
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');
    const email = queryParams.get('email');
    const name = queryParams.get('name');
    const picture = queryParams.get('picture');
    const googleLogin = queryParams.get('loggedIn');
    const userId = queryParams.get('Id');

    if (token && email && name) {
      dispatch(setCredentials({
        user: {
          username: name,
          email,
          token,
          picture,
          loggedIn: googleLogin === 'true',
          Id: userId || ''
        },
        success: true,
        message: "Login success",
      }));
      navigate('/dashboard');
    }
  }, [location.search, dispatch]);

  const shouldShowWelcomeBack = localStorage.getItem('googleLogin') === 'true';

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Burn-colored background image */}
      <div className="absolute inset-0 w-full h-full">
        <div className="absolute inset-0 bg-gray-900 opacity-40 z-0" />
        <img
          src="/images/bgimage.jpg"
          alt="Background"
          className="w-full h-full object-cover blur-lg bg-center bg-no-repeat bg-cover bg-blend-color-burn"
        />
      </div>

      {/* Foreground content */}
      <div className="relative z-10 p-4 w-full max-w-md">
        {shouldShowWelcomeBack ? (
          <WelcomeBackPage submitHandler={submitHandler} loading={isLoading} />
        ) : (
          <AuthForm submitHandler={submitHandler} loading={isLoading} />
        )}
      </div>
    </div>
  );

};

export default Login;
