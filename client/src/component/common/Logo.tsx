import React from 'react';
import { useNavigate } from 'react-router-dom';
const Logo: React.FC = () => {
    const navigate = useNavigate();
    return (
        <div className="text-center cursor-pointer" onClick={() => navigate('/dashboard')}>
            <span className={`text-white text-4xl font-bold`}>H</span>
            <span className="text-orange-600 text-6xl font-extrabold">R</span>
            <span className={` text-white font-semibold text-3xl`}> Folio</span>

        </div>
    );
};

export default Logo;
