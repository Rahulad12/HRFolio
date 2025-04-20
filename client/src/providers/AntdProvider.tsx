import { ConfigProvider, App as AntdApp, theme as antdTheme } from "antd";
import { useTheme } from "../context/ThemeContext";

const AntdProvider = ({ children }: { children: React.ReactNode }) => {
  const { darkMode } = useTheme();

  const colorBgBase = darkMode ? "#020817" : "#FFFFFF";
  const colorPrimary = "#363062";
  const colorTextBase = darkMode ? "#FBFBFF" : "#191D32";
  const colorHover = darkMode ? "#3f3f55" : "#f0f0f0"; // Hover color for menu items

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
          Menu: {
            itemColor: colorTextBase,
            itemHoverColor: colorPrimary,
            itemHoverBg: colorHover,
            itemSelectedColor: "#fff",
            itemSelectedBg: colorPrimary,
            activeBarBorderWidth: 0,
            borderRadius: 6,
          },
          Button: {
            colorPrimary,
            colorPrimaryHover: "#EF5B5B",
            colorPrimaryActive: "#C62828",
          },
          Table: {
            colorText: colorTextBase,
            colorBgContainer: colorBgBase,
            headerBg: darkMode ? "#2A2E45" : "#191D32",
            headerColor: darkMode ? "#C0C0C0" : "#FFFF",
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
            activeBorderColor: "#D3D3D3",
          },
          DatePicker: {
            colorBgContainer: darkMode ? "#020817" : "#ffffff",
            colorText: colorTextBase,
            activeBorderColor: "#D3D3D3",
          },
          Select: {
            colorText: colorTextBase,
            colorBgContainer: darkMode ? "#020817" : "#ffffff",
            activeBorderColor: "#D3D3D3",
            borderRadius: 4,
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
