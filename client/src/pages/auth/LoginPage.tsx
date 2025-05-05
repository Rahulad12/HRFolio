import React from 'react';
import AuthLayout from '../../component/auth/AuthLayout';
import Login from '../../component/auth/Login';

const LoginPage: React.FC = () => {
    const iswelcomeBack = localStorage.getItem("googleLogin") === "true";
    return (
        <AuthLayout
            title={
                iswelcomeBack ? "Welcome Back" : "Welcome"
            }
            subtitle="Sign in to access your HR dashboard"
        >
            <Login />
        </AuthLayout>
    );
};

export default LoginPage;