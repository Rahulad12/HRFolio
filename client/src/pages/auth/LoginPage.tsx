import React from 'react';
import AuthLayout from '../../component/auth/AuthLayout';
import Login from '../../component/auth/Login';

const LoginPage: React.FC = () => {
    return (
        <AuthLayout
            title="Welcome to HRfolio"
            subtitle="Sign in to access your HR dashboard"
        >
            <Login />
        </AuthLayout>
    );
};

export default LoginPage;