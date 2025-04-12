import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom"

const Error = () => {
    const [error, setError] = useState('');
    const location = useLocation();
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const error = queryParams.get('error');
        setError(error || '');
    })
    return (
        <div>
            <h1>Error</h1>
            <p>{error}</p>
        </div>
    )
}

export default Error
