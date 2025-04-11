import React, { useEffect } from 'react';
import AuthForm from "../component/common/AuthForm";
import { useAppDispatch } from '../Hooks/hook';
import { setCredentials } from '../slices/authSlices';

const Login: React.FC = () => {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = React.useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const email = params.get('email');
    const username = params.get('username');
    console.log(username, email, token);

    if (token && email && username) {
      dispatch(setCredentials({
        user: { username, email, token },
        success: true,
        message: "Login success"
      }));
    }
  }, [dispatch]);

  const submitHandler = () => {
    setIsLoading(true);
    window.location.href = "http://localhost:5000/api/auth/google"; // Adjust if needed
  };

  return (
    <div>
      <AuthForm submitHandler={submitHandler} formType="login" loading={isLoading} />
    </div>
  );
};

export default Login;
