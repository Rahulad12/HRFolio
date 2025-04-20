import { Button, Typography, Divider, Image } from "antd";
import { LogIn } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
interface Props {
    submitHandler: () => void;
    formType: "login" | "register";
    loading: boolean;
}

const AuthForm = ({ submitHandler, formType, loading }: Props) => {
    const formTitle =
        formType === "login"
            ? "Sign in to HRFolio"
            : "Register to HRFolio";

    return (
        <div className="min-h-screen bg-gradient-to-tr from-blue-50 to-indigo-100 flex items-center justify-center px-4 py-12">
            <div className="max-w-md w-full bg-white dark:bg-[#020817] rounded-2xl shadow-xl p-8 border dark:border-gray-700 space-y-6">
                {/* Brand Hero */}
                <div className="text-center">
                        <Image
                            src="/images/logo.png"
                            alt="HRFolio Logo"
                            width={100}
                            height={100}
                            className="inline-block"
                        />
                    <Typography.Paragraph className="text-gray-500 dark:text-gray-300">
                        {formTitle}
                    </Typography.Paragraph>
                </div>

                <Divider>or</Divider>

                {/* Google Sign-in */}
                <Button
                    className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 rounded-lg shadow-sm font-semibold py-2 px-4"
                    loading={loading}
                    disabled={loading}
                    icon={<FcGoogle size={20} />}
                    onClick={submitHandler}
                >
                    Continue with Google
                </Button>

                {/* Optional Footer */}
                <Typography.Text className="text-xs text-center text-gray-400 block">
                    By continuing, you agree to our Terms of Service and Privacy Policy.
                </Typography.Text>
            </div>
        </div>
    );
};

export default AuthForm;
