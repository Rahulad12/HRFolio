// src/components/ThemeToggle.tsx
import { Switch } from "antd";
import { useTheme } from "../../context/ThemeContext";

const ThemeToggle = () => {
    const { darkMode, toggleTheme } = useTheme();

    return (
        <div className="flex items-center gap-2">
            <span className="text-sm">{darkMode ? "Dark" : "Light"} Mode</span>
            <Switch checked={darkMode} onChange={toggleTheme} />
        </div>
    );
};

export default ThemeToggle;
