import { ConfigProvider, Button } from "antd";
import { ReactNode } from "react";

interface Props {
    text: string;
    icon?: ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    loading?: boolean;
}

const PrimaryButton = ({ text, icon, onClick, disabled, loading }: Props) => {
    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: "#1F3B61",
                    colorPrimaryHover: "#2E3354",
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
                style={{
                    height: "40px",
                }}
                className="flex items-center justify-center gap-2"
            >
                {text}
            </Button>
        </ConfigProvider>
    );
};

export default PrimaryButton;
