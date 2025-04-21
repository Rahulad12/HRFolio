import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "antd";
import { FrownOutlined } from "@ant-design/icons";
import Logo from "../component/common/Logo";

const Error = () => {
    const [error, setError] = useState('');
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const error = queryParams.get('error');
        setError(error || 'Something went wrong.');
    }, [location]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300 px-4">
            <div className="bg-white shadow-lg rounded-xl p-10 w-full max-w-md text-center">
                <Logo />
                <div className="text-orange-500 text-6xl m-4 flex justify-center">
                    <FrownOutlined />
                </div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Oops! An Error Occurred</h1>
                <p className="text-gray-600 mb-6">{error}</p>
                <Button
                    type="primary"
                    size="large"
                    className="w-full"
                    onClick={() => navigate("/")}
                >
                    Go Back Home
                </Button>
            </div>
        </div>
    );
};

export default Error;
