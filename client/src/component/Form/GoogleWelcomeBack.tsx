import { Button, Modal } from "antd";
import { useEffect, useState } from "react";
import {  PlusOutlined } from "@ant-design/icons";

interface GoogleWelcomeBackProps {
    handleGoogleLogin: () => void;
    user?: {
        name: string;
        email: string;
        picture?: string;
    };
}

const GoogleWelcomeBack = ({ handleGoogleLogin, user }: GoogleWelcomeBackProps) => {
    const [showWelcomeBack, setShowWelcomeBack] = useState(false);

    useEffect(() => {
        const googleLoginUsed = localStorage.getItem("googleLoginUsed");
        const isLoggedIn = localStorage.getItem("isLoggedIn");

        if (googleLoginUsed === "true" && isLoggedIn !== "true") {
            setShowWelcomeBack(true);
        }
    }, []);

    return (
        <Modal
            open={showWelcomeBack}
            onCancel={() => setShowWelcomeBack(false)}
            footer={null}
            closable={false}
            centered
            className="rounded-xl"
            width={400}
            style={{ padding: 0 }}
        >
            <div className="flex flex-col items-center justify-center text-center p-6 bg-gradient-to-b from-[#b2d8f7] to-[#d1d8ff] rounded-xl">
                <div className="bg-white rounded-xl p-6 w-full shadow-md">
                    <div className="flex justify-center mb-4">
                        <div className="bg-orange-500 text-white text-2xl font-semibold w-16 h-16 flex items-center justify-center rounded-full">
                            {user?.name?.charAt(0) || "U"}
                        </div>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">{user?.name || "Rahul adhikari"}</h3>
                    <p className="text-sm text-gray-500 mb-6">{user?.email || "st.rahul07@gmail.com"}</p>

                    <Button
                        type="primary"
                        className="w-full bg-[#9147ff] hover:bg-[#7e36e8]"
                        size="large"
                        onClick={handleGoogleLogin}
                    >
                        Continue
                    </Button>

                    <div className="mt-4">
                        <Button
                            type="text"
                            icon={<PlusOutlined />}
                            onClick={() => {
                                setShowWelcomeBack(false);
                                localStorage.removeItem("googleLoginUsed");
                            }}
                        >
                            Continue with another account
                        </Button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default GoogleWelcomeBack;
