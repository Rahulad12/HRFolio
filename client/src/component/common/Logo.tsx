import { useTheme } from "../../context/ThemeContext"

const Logo = () => {
    const { darkMode } = useTheme();
    return (
        <div>
            {/* <span className={`${darkMode ? "text-white" : "text-gray-800"} text-5xl`}>H</span> */}
            <span className={`${darkMode ? "text-white" : "text-white"}  text-4xl font-bold`}>H</span>
            <span className=" text-orange-600 text-6xl font-extrabold">R</span>
            <span className={`${darkMode ? "text-white" : "text-white"} font-semibold text-3xl`}>Folio</span>
        </div>
    )
}

export default Logo
