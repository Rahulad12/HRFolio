import React, { useEffect } from 'react';
import AuthForm from "../component/Form/AuthForm";
import { useAppDispatch } from '../Hooks/hook';
import { setCredentials } from '../slices/authSlices';
import { useLocation } from 'react-router-dom';

const Login: React.FC = () => {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = React.useState(false);

  const location = useLocation();
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');
    const email = queryParams.get('email');
    const name = queryParams.get('name');

    console.log(token, email, name);

    if (token && email && name) {
      dispatch(setCredentials({
        user: { username: name, email, token },
        success: true,
        message: "Login success"
      }));
    }
  }, [dispatch]);

  const submitHandler = () => {
    setIsLoading(true);
    window.location.href = "http://localhost:5000/api/auth/google";
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center p-4'>
      <AuthForm submitHandler={submitHandler} formType="login" loading={isLoading} />
    </div>
  );
};

export default Login;
