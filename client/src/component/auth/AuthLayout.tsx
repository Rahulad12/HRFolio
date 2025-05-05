import { Typography } from 'antd';
import React, { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { Check } from 'lucide-react';
interface AuthLayoutProps {
    children: ReactNode;
    title: string;
    subtitle?: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({
    children,
    title,
    subtitle
}) => {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen flex flex-col md:flex-row">
            {/* Left side - Branding */}
            <div className="hidden md:flex md:w-1/2 bg-blue-950 text-white p-8 flex-col justify-between">
                <div className="animate-fade-in">
                    {/* <Logo size="large" /> */}
                    <div className="cursor-pointer flex items-center" onClick={() => navigate('/')}>
                        <span className="text-white text-7xl font-bold">H</span>
                        <span className="text-orange-600 text-8xl font-extrabold">R</span>
                        <span className="text-white font-semibold text-5xl">Folio</span>
                    </div>
                </div>

                <div className="space-y-6 animate-slide-up">
                    <h1 className="text-4xl font-bold">Transform your HR operations</h1>
                    <p className="text-xl opacity-90">
                        Streamline hiring, onboarding, and people management with HRfolio's powerful platform.
                    </p>

                    <div className="pt-6">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="bg-white/10 p-3 rounded-full">
                                <Check size={24} strokeWidth={2} />
                            </div>
                            <span className="text-lg">Centralized candidate management</span>
                        </div>

                        <div className="flex items-center gap-4 mb-4">
                            <div className="bg-white/10 p-3 rounded-full">
                                <Check size={24} strokeWidth={2} />
                            </div>
                            <span className="text-lg">Streamlined onboarding workflows</span>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="bg-white/10 p-3 rounded-full">
                                <Check size={24} strokeWidth={2} />
                            </div>
                            <span className="text-lg">Advanced analytics and reporting</span>
                        </div>
                    </div>
                </div>

                <div className="text-sm opacity-80">
                    © {new Date().getFullYear()} HRfolio. All rights reserved.
                </div>
            </div>

            {/* Right side - Auth Form */}
            <div className="w-full md:w-1/2 p-6 md:p-10 flex items-center justify-center">
                <div className="w-full max-w-md animate-fade-in">
                    <div className="md:hidden mb-10">

                        <div className="flex items-center justify-center">

                            <span className="text-lg">Streamlined onboarding workflows</span>
                        </div>

                    </div>

                    <div className="text-center mb-10">
                        <Typography.Title level={1} className="text-2xl md:text-3xl font-semibold ">{title}</Typography.Title>
                        {subtitle && <p className="mt-2 text-neutral-400 text-sm">{subtitle}</p>}
                    </div>

                    {children}

                    <div className="mt-10 text-center text-sm text-neutral-500 md:hidden">
                        © {dayjs().year()} HRfolio. All rights reserved.
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;