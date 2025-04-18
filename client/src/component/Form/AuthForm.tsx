import { Button, Typography, Divider } from 'antd';
import { LogIn } from 'lucide-react';

interface Props {
    submitHandler: () => void;
    formType: 'login' | 'register';
    loading: boolean;
}

const AuthForm = ({ submitHandler, formType, loading }: Props) => {

    const formTitle =
        formType === 'login' ? 'Sign in to CV Manager' : 'Register to CV Manager';

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg space-y-6 border border-blue-100">
                {/* Header */}
                <div className="flex flex-col items-center gap-2">
                    <LogIn className="text-blue-700" size={48} />
                    <Typography.Title level={2} className='text-blue-700 font-bold'>
                        {formTitle}
                    </Typography.Title>
                </div>
                {/* OR Divider */}
                <Divider />

                {/* Google Sign-in */}
                <Button
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 h-full"
                    loading={loading}
                    disabled={loading}
                    iconPosition="end"
                    onClick={submitHandler}
                >
                    Continue with Google
                </Button>
            </div>
        </div>
    );
};

export default AuthForm;
