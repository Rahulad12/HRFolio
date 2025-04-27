import React from 'react';
import { Switch } from 'antd';
import { toggleThemeMode } from '../../slices/themeSlices';
import { Moon, Sun } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../Hooks/hook';

const ThemeToggle: React.FC = () => {
    const dispatch = useAppDispatch();
    const { mode } = useAppSelector(state => state.theme);

    const handleToggle = () => {
        dispatch(toggleThemeMode());
    };

    return (
        <div className="flex items-center mr-3">
            <Sun size={16} className={`mr-2 ${mode === 'light' ? 'text-orange-500' : 'text-gray-400'}`} />
            <Switch
                checked={mode === 'dark'}
                onChange={handleToggle}
                size="small"
            />
            <Moon size={16} className={`ml-2 ${mode === 'dark' ? 'text-blue-400' : 'text-gray-400'}`} />
        </div>
    );
};

export default ThemeToggle;