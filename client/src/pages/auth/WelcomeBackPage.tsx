import { Avatar, Button, message, Skeleton } from 'antd';
import { makeCapitilized } from '../../utils/TextAlter';
import { useDeleteUserMutation } from '../../services/authServiceApi';

interface Props {
    submitHandler: () => void;
    loading: boolean;
}

const WelcomeBackPage = ({ submitHandler, loading }: Props) => {

    const [deleteUser, { isLoading: loadingDelete }] = useDeleteUserMutation();
    const image = localStorage.getItem("picture") || "";
    const name = localStorage.getItem("username") || "";
    const email = localStorage.getItem("email") || "";
    const Id = localStorage.getItem("Id") || "";

    const handleDelete = async () => {
        try {
            const response = await deleteUser(Id).unwrap();
            if (response?.success) {
                localStorage.removeItem("token");
                localStorage.removeItem("username");
                localStorage.removeItem("email");
                localStorage.removeItem("picture");
                localStorage.removeItem("googleLogin");
                localStorage.removeItem("Id");
                window.location.href = '/';
                message.success(response?.message);
            }
        } catch (error: any) {
            console.error("Error deleting user:", error);
            message.error(error?.data?.message || "Failed to delete user");
            // Handle error if needed
        }
    }
    return (
        <div>
            <div className='flex flex-col items-center justify-center'>
                {/* Intro Header */}
                <div className="text-center mb-12">
                    <p className="text-white text-xl md:text-2xl font-medium mb-2">👋 Welcome Back</p>
                    <h1 className="text-white text-4xl md:text-5xl font-bold leading-tight mb-2">
                        Explore What We Provide
                    </h1>
                    <p className="text-white text-lg md:text-xl font-medium">Login to get started</p>
                </div>

                {/* User Card */}
                <Skeleton loading={loadingDelete} active avatar round paragraph={{ rows: 3 }} className="w-80 md:w-96 rounded-2xl">
                    <div className="bg-white rounded-2xl shadow-xl w-80 md:w-96 flex flex-col items-center p-6 gap-4">
                        <div className='p-8'>
                            <span className="text-blue-950 text-6xl font-bold">H</span>
                            <span className="text-orange-600 text-8xl font-extrabold">R</span>
                            <span className="text-blue-950 text-5xl font-semibold">Folio</span>
                        </div>

                        <Avatar src={image} size={72} className="border border-gray-300" />

                        <div className="text-center mt-2">
                            <h3 className="text-gray-800 text-2xl font-semibold">
                                {makeCapitilized(name)}
                            </h3>
                            <p className="text-gray-500 text-sm font-mono">{makeCapitilized(email)}</p>
                        </div>

                        <Button
                            type="primary"
                            onClick={submitHandler}
                            loading={loading}
                            size='large'
                            disabled={loading}
                            className="w-full"
                        >
                            Continue
                        </Button>

                        <div className=' text-blue-950'>
                            <span>Do You Want To Delete Account? </span>
                            <span className='text-blue-500 cursor-pointer hover:text-orange-600' onClick={handleDelete}>Click here</span>
                        </div>
                    </div>
                </Skeleton>
            </div>
        </div>

    );
};

export default WelcomeBackPage;