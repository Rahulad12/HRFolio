import { Divider } from "antd";
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
        <div className="w-90 h-full max-w-md mx-auto flex border flex-col items-center justify-center bg-gray-800 rounded-xl p-4">
            <div className="card-head flex flex-col items-center">
                <div className="logo">
                    <span className="text-orange-600 text-6xl">Hr</span>
                    <span className="text-white text-3xl">Folio</span>
                </div>
                {/* <div className="text-white text-2xl">
                    <span>{formType === "login" ? "Sign in in one click" : "Register in one click"}</span>
                </div> */}
            </div>
            <Divider className="bg-white" />
            <div className="card-body">
                <div
                    className={`border border-white w-80 h-10 text-white p-2 flex items-center justify-center cursor-pointer ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                    onClick={!loading ? submitHandler : undefined}
                >
                    <span className="p-2"><FcGoogle size={30} /></span>
                    <span className="font-bold w-full text-center">
                        {loading ? "Processing..." : "Continue with Google"}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default AuthForm;
