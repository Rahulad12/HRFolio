import MainRoutes from "./routes/MainRoutes";
import { ConfigProvider, App as AntApp, theme } from 'antd';
import { useAppDispatch, useAppSelector } from "./Hooks/hook";
import { setThemeMode } from "./slices/themeSlices";
import { useEffect } from "react";

const App = () => {
  const dispatch = useAppDispatch();
  const { mode } = useAppSelector(state => state.theme);

  useEffect(() => {
    const savedTheme = localStorage.getItem('themeMode');
    if (savedTheme === 'light' || savedTheme === 'dark') {
      dispatch(setThemeMode(savedTheme));
    }
  }, [dispatch]);

  useEffect(() => {
    if (mode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [mode]);

  const antTheme = {
    token: {
      colorPrimary: '#1A365D',
      colorSuccess: '#52C41A',
      colorWarning: '#FAAD14',
      colorError: '#FF4D4F',
      colorInfo: '#1A365D',
      borderRadius: 6,
      colorText: mode === 'dark' ? '#fff' : '#1A365D',
      colorIcon: '#1A365D',
      colorBgContainer: mode === 'dark' ? '#0D1117' : '#fff',
    },
    components: {
      Button: {
        colorPrimaryHover: '#FF7A22',
      },
    },
    algorithm: mode === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
  };

  return (
    <ConfigProvider theme={antTheme}>
      <AntApp>
        <MainRoutes />
      </AntApp>
    </ConfigProvider>
  );
};

export default App;
