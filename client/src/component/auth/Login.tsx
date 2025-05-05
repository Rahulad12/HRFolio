import React, { useEffect, useState } from 'react';
import { useAppDispatch } from '../../Hooks/hook';
import { setCredentials } from '../../slices/authSlices';
import { useLocation, useNavigate } from 'react-router-dom';
import WelcomeBackPage from './WelcomeBackPage';
import { Divider } from 'antd';
import GoogleLoginButton from './AuthForm';

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
    <div className="w-full space-y-6">
      <div className="space-y-4">
        {
          shouldShowWelcomeBack ?
            (
              <WelcomeBackPage submitHandler={submitHandler} loading={isLoading} />
            ) :
            < GoogleLoginButton onClick={submitHandler} loading={isLoading} />
        }

      </div>

      <Divider className="text-neutral-400">
        <span className="text-xs uppercase tracking-wider">Secure Sign-In</span>
      </Divider>

      <div className="text-center text-sm text-neutral-500 space-y-4">
        <p>
          By signing in, you agree to HRfolio's
          <a href="#" className="text-blue-500 hover:text-primary-600 mx-1">Terms of Service</a>
          and
          <a href="#" className="text-primary-500 hover:text-primary-600 mx-1">Privacy Policy</a>.
        </p>

        <p>
          Need assistance? <a href="#" className="text-primary-500 hover:text-primary-600">Contact Support</a>
        </p>
      </div>
    </div>
  );
};
export default Login;
