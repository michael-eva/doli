import { useContext } from "react";
import { ToggleContext } from "./Toggle";

type ToggleButtonProps = {
    children: React.ReactNode,
    className: string,
};

const ToggleButton = ({ children, className }: ToggleButtonProps) => {
    const { toggle }: any = useContext(ToggleContext);
    return (
        <div className={className} onClick={toggle}>
            {children}
        </div>
    );
};

export default ToggleButton;
