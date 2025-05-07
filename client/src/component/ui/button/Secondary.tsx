import { ConfigProvider, Button } from "antd";
import { ReactNode } from "react";

interface Props {
    text: string;
    icon?: ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    loading?: boolean;
    htmlType?: "submit" | "reset" | "button";
}

const SecondaryButton: React.FC<Props> = ({ text, icon, onClick, disabled, loading, htmlType }) => {
    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: "#2665c9",
                    colorPrimaryHover: "#1A365D",
                    colorPrimaryActive: "#1F3B61",
                    borderRadius: 6,
                    colorIcon: "#191D32",
                    padding: 12,
                    paddingSM: 8,
                },
            }}
        >
            <Button
                type="primary"
                icon={icon}
                onClick={onClick}
                disabled={disabled}
                loading={loading}
                className="flex items-center justify-center gap-2"
                htmlType={htmlType}
            >
                {text}
            </Button>
        </ConfigProvider>
    );
};

export default SecondaryButton;
