import { Button } from "antd";
import { FcGoogle } from "react-icons/fc";

interface Props {
    submitHandler: () => void;
    loading: boolean;
}

const AuthForm = ({ submitHandler, loading }: Props) => {
    return (
        <div className="flex flex-col items-center justify-center px-4">
            <div className="text-center mb-12">
                <p className="text-white text-xl md:text-2xl font-medium mb-2">👋 Welcome</p>
                <h1 className="text-white text-4xl md:text-5xl font-bold leading-tight mb-2">
                    Explore What We Provide
                </h1>
                <p className="text-white text-lg md:text-xl font-medium">Login to get started</p>
            </div>
            <div className="flex flex-col md:flex-row w-full max-w-4xl bg-white rounded-xl overflow-hidden shadow-xl">
                {/* Left Section */}
                <div className="w-full md:w-1/2 bg-gradient-to-br from-orange-600 via-blue-950 to-blue-950 text-white flex items-center justify-center p-10  md:flex">
                    <h2 className="text-3xl font-bold text-center leading-tight">
                        MAKE SELECTION OF CANDIDATE EASY
                    </h2>
                </div>

                {/* Right Section */}
                <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-8 space-y-8">
                    {/* Logo */}
                    <div className="text-center">
                        <span className="text-blue-950 text-6xl font-bold">H</span>
                        <span className="text-orange-600 text-8xl font-extrabold">R</span>
                        <span className="text-gray-800 text-5xl font-semibold">Folio</span>
                    </div>

                    {/* Google Sign-In */}
                    <div className="w-full">
                        <Button
                            icon={<FcGoogle />}
                            onClick={submitHandler}
                            disabled={loading}
                            loading={loading}
                            className="w-full"
                            shape="round"
                            size="large"
                        >
                            Sign in with Google
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthForm;
