import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import clsx from "clsx";
import { NavLink } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import type { CommonButtonProps } from "@/@types/common";



const PrimaryButton = ({
    label,
    labelSm,
    onClick,
    style,
    icon,
    loading,
    disabled,
    className,
    htmlType = "submit",
    customStyle,
    asLink = "",
}: CommonButtonProps) => {

    const stying = clsx(`rounded-sm cursor-pointer flex items-center justify-center transition-smooth text-base shadow-sm bg-gradient-to-br from-primary via-secondary to-primary text-white px-4 py-2 hover:from-secondary hover:via-primary transition-colors hover:to-primary ${className}`, {
        "opacity-75 hover:opacity-60": loading,
        "hover:bg-secondary": !(loading || disabled),
        "!cursor-not-allowed !bg-gray-400 ": disabled,
        "active:opacity-20 active:scale-90": !(disabled || loading),
    });

    const isLargeScreen = useMediaQuery({ query: "(min-width: 1023px)" });

    const realLabel = isLargeScreen ? label : labelSm ?? label;

    return (
        <>
            {asLink ?
                <NavLink to={asLink} className={stying}>
                    <span className="flex items-center justify-end">
                        {realLabel}   {icon}
                    </span>
                </NavLink> :
                <button
                    type={htmlType}
                    disabled={disabled}
                    style={{ ...style, ...customStyle }}
                    onClick={(val) => onClick && onClick(val)}
                    className={stying}
                >
                    <span className="flex items-center justify-end">
                        {loading && (
                            <Spin
                                size="small"
                                indicator={
                                    <LoadingOutlined className="mr-2" style={{ color: "white" }} />
                                }
                            />
                        )}{" "}
                        {realLabel}    {icon}  
                    </span>
                </button>
            }
        </>

    );
};



export default PrimaryButton;
