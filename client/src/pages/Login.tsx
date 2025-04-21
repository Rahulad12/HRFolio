import React, { useEffect, useState } from 'react';
import AuthForm from '../component/Form/AuthForm';
import { useAppDispatch } from '../Hooks/hook';
import { setCredentials } from '../slices/authSlices';
import { useLocation } from 'react-router-dom';
import WelcomeBackPage from './WelcomeBackPage';

const Login: React.FC = () => {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();

  const submitHandler = () => {
    setIsLoading(true);
    window.location.href = 'http://localhost:5000/api/auth/google';
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
        user: { username: name, email, token, picture, loggedIn: googleLogin === 'true', Id: userId || '' },
        success: true,
        message: "Login success",
      }));
    }
  }, [location.search, dispatch]);

  const shouldShowWelcomeBack = localStorage.getItem('googleLogin') === 'true';

  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-600 from-10% via-blue-400 via-20% to-purple-400 flex flex-col items-center justify-center p-4">
      {
        shouldShowWelcomeBack ? (
          <WelcomeBackPage submitHandler={submitHandler} loading={isLoading} />
        ) : (
          <AuthForm submitHandler={submitHandler} loading={isLoading} />
        )
      }
    </div>
  );
};

export default Login;
