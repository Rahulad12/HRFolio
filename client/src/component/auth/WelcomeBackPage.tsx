import { Avatar, Button } from 'antd';
import { makeCapitilized } from '../../utils/TextAlter';

interface Props {
    submitHandler: () => void;
    loading: boolean;
}

const WelcomeBackPage = ({ submitHandler, loading }: Props) => {

    const image = localStorage.getItem("picture") || "";
    const name = localStorage.getItem("username") || "";
    const email = localStorage.getItem("email") || "";
    return (
        <div>
            <div className='flex flex-col items-center justify-center'>
                {/* User Card */}
                    <div className="w-80 md:w-96 flex flex-col items-center p-6 gap-4">
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
                    </div>
            </div>
        </div>

    );
};

export default WelcomeBackPage;