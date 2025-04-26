import { ConfigProvider, App as AntdApp, theme as antdTheme } from "antd";
import { useTheme } from "../context/ThemeContext";


const AntdProvider = ({ children }: { children: React.ReactNode }) => {
  const { darkMode } = useTheme();

  const colorBgBase = darkMode ? "#020817" : "#FFFFFF";
  const colorPrimary = "#1A365D";
  const colorTextBase = darkMode ? "#FBFBFF" : "#191D32";
  const colorHover = darkMode ? "#3f3f55" : "#f0f0f0"; // Hover color for menu items

  return (
    <ConfigProvider
      theme={{
        algorithm: darkMode
          ? antdTheme.darkAlgorithm
          : antdTheme.defaultAlgorithm,
        token: {
          colorPrimary: '#1A365D',
          colorSuccess: '#52C41A',
          colorWarning: '#FAAD14',
          colorError: '#FF4D4F',
          colorInfo: '#1A365D',
          borderRadius: 6,
        },
        components: {
          Menu: {
            itemColor: colorTextBase,
            itemHoverColor: "#1A365D",
            itemHoverBg: colorHover,
            itemSelectedColor: "#fff",
            itemSelectedBg: "#1A365D",
            activeBarBorderWidth: 0,
            borderRadius: 6,
          },
          Button: {
            colorPrimaryHover: "#F54A00",
            colorPrimaryActive: "#C62828",
          },
          Table: {
            colorText: colorTextBase,
            colorBgContainer: colorBgBase,
            headerBg: darkMode ? "#2A2E45" : "#F9FAFB",
            headerColor: darkMode ? "#C0C0C0" : "#191D32",
            colorTextHeading: colorPrimary,
            borderColor: darkMode ? "#2A2E45" : "#e5e7eb",
            paddingSM: 8,
            fontSize: 13,
            footerBg: darkMode ? "#2A2E45" : "#fafaf7",
            footerColor: colorPrimary,
            borderRadius: 4,
          },
          Input: {
            colorBgContainer: darkMode ? "#020817" : "#ffffff",
            colorText: colorTextBase,
            activeBorderColor: "#4d79ff",
            hoverBorderColor: "none",
          },
          DatePicker: {
            colorBgContainer: darkMode ? "#020817" : "#ffffff",
            colorText: colorTextBase,
            activeBorderColor: "#D3D3D3",
          },
          Select: {
            colorText: colorTextBase,
            colorBgContainer: darkMode ? "#020817" : "#ffffff",
            activeBorderColor: "#4d79ff",
            hoverBorderColor: "none",
          },
          Dropdown: {
            colorBgContainer: darkMode ? "#020817" : "#ffffff",
            colorText: colorTextBase,
          },
          Form: {
            colorBgContainer: darkMode ? "#141414" : "#ffffff",
          },
          Card: {
            colorBgContainer: darkMode ? "#020817" : "#ffffff",
            colorBorder: darkMode ? "#D3D3D3" : "#e5e7eb",
            colorText: darkMode ? "#FBFBFF" : "#191D32",
          },
          Typography: {
            colorText: colorTextBase,
          },
          Calendar: {
            colorBgContainer: darkMode ? "#020817" : "#ffffff",
            colorBorder: darkMode ? "#D3D3D3" : "#e5e7eb",
            colorText: darkMode ? "#FBFBFF" : "#191D32",
          },
          Modal: {
            colorBgContainer: darkMode ? "#020817" : "#ffffff",
            colorBorder: darkMode ? "#D3D3D3" : "#e5e7eb",
          },
          InputNumber: {
            colorBgContainer: darkMode ? "#020817" : "#ffffff",
            colorBorder: darkMode ? "#D3D3D3" : "#e5e7eb",
          },
        },
      }}
    >
      <AntdApp>{children}</AntdApp>
    </ConfigProvider>
  );
};

export default AntdProvider;
