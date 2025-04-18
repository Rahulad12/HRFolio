// src/providers/AntdProvider.tsx
import { ConfigProvider, App as AntdApp, theme as antdTheme } from "antd";
import { useTheme } from "../context/ThemeContext";

const AntdProvider = ({ children }: { children: React.ReactNode }) => {
    const { darkMode } = useTheme();

    return (
        <ConfigProvider
            theme={{
                algorithm: darkMode
                    ? antdTheme.darkAlgorithm
                    : antdTheme.defaultAlgorithm,
                token: {
                    // colorPrimary: "#1F3B61",
                    // colorBgBase: darkMode ? "#1c1c1e" : "#FBFBFF",
                    colorText: darkMode ? "#C63C51" : "#363062",
                    borderRadius: 4,
                },
                components: {
                    Button: {
                        colorPrimary: "#1F3B61",
                        colorPrimaryHover: "#2E3354",
                    },
                    Table: {
                        colorText: darkMode ? "#C63C51" : "#191D32",
                        colorBgContainer: darkMode ? "#1c1c1e" : "#FBFBFF",
                        headerBg: darkMode ? "#141414" : "#f4f4f8",
                        headerColor: darkMode ? "#C63C51" : "#1F3B61",
                        fontSize: 13,
                        colorTextHeading: darkMode ? "#C63C51" : "#1F3B61",
                        colorTextBase: darkMode ? "#C63C51" : "#191D32",
                        padding: 12,
                        borderColor: darkMode ? "#141414" : "#e5e7eb",
                        paddingSM: 8,
                        footerBg: darkMode ? "#141414" : "#f4f4f8",
                        footerColor: darkMode ? "#C63C51" : "#1F3B61",

                    },

                    Input: {
                        colorBgContainer: darkMode ? "#141414" : "#ffffff",
                        colorText: darkMode ? "#e0e0e0" : "#191D32",
                        activeBorderColor: darkMode ? "#C63C51" : "#191D32",
                    },
                    Select: {
                        colorBgContainer: darkMode ? "#141414" : "#ffffff",
                        colorText: darkMode ? "#e0e0e0" : "#191D32",
                    },
                    Form: {
                        colorBgContainer: darkMode ? "#141414" : "#ffffff",
                    },
                    Menu: {
                        colorBgContainer: darkMode ? "#141414" : "#ffffff",
                        colorText: darkMode ? "#e0e0e0" : "#191D32",
                    }
                },
            }}
        >
            <AntdApp>{children}</AntdApp>
        </ConfigProvider>
    );
};

export default AntdProvider;
