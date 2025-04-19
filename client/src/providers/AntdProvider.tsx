import { ConfigProvider, App as AntdApp, theme as antdTheme } from "antd";
import { useTheme } from "../context/ThemeContext";

const AntdProvider = ({ children }: { children: React.ReactNode }) => {
    const { darkMode } = useTheme();

    const colorBgBase = darkMode ? "#020817" : "#FFFFFF ";
    const colorPrimary = "#363062";
    const colorTextBase = darkMode ? "#FBFBFF" : "#191D32";

    return (
        <ConfigProvider
            theme={{
                algorithm: darkMode
                    ? antdTheme.darkAlgorithm
                    : antdTheme.defaultAlgorithm,
                token: {
                    colorPrimary,
                    colorBgBase,
                    colorTextBase,
                    colorText: colorTextBase,
                    borderRadius: 6,
                },
                components: {
                    Button: {
                        colorPrimary,
                        colorPrimaryHover: "#EF5B5B",
                        colorPrimaryActive: "#C62828",
                    },
                    Table: {
                        colorText: colorTextBase,
                        colorBgContainer: colorBgBase,
                        headerBg: darkMode ? "#2A2E45" : "#f4f4f8",
                        headerColor: darkMode ? "#C0C0C0" : "#191D32",
                        colorTextHeading: colorPrimary,
                        colorTextBase,
                        borderColor: darkMode ? "#2A2E45" : "#e5e7eb",
                        paddingSM: 8,
                        fontSize: 13,
                        footerBg: darkMode ? "#2A2E45" : "#f4f4f8",
                        footerColor: colorPrimary,
                        borderRadius: 4,
                    },
                    Input: {
                        colorBgContainer: darkMode ? "#191D32" : "#ffffff",
                        colorText: colorTextBase,
                        activeBorderColor: "#D3D3D3",
                    },
                    Select: {
                        colorText: colorTextBase,
                        colorBgContainer: darkMode ? "#191D32" : "#ffffff",
                        activeBorderColor: "#D3D3D3",
                    },
                    Form: {
                        colorBgContainer: darkMode ? "#141414" : "#ffffff",
                    },
                    Menu: {
                        colorBgContainer: darkMode ? "#141414" : "#ffffff",
                        colorText: colorTextBase,
                        itemColor: colorTextBase,
                        itemSelectedColor: colorPrimary,
                        itemHoverColor: colorPrimary,
                    },
                    Card: {
                        colorBgContainer: darkMode ? "#191D32" : "#ffffff",
                        colorBorder: darkMode ? "#D3D3D3" : "#e5e7eb",
                    },
                    Typography: {
                        colorText: colorTextBase
                    },
                    Popover: {
                        colorBgContainer: darkMode ? "#141414" : "#ffffff",
                        colorText: colorTextBase
                    }
                },
            }}
        >
            <AntdApp>{children}</AntdApp>
        </ConfigProvider>
    );
};

export default AntdProvider;
