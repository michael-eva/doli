import { useContext } from "react"
import { ToggleContext } from "./Toggle"

type ToggleButton = {
    children: any,
    className: string
}

const ToggleButton = ({ children, className }: ToggleButton) => {
    const { toggle }: any = useContext(ToggleContext)
    return (
        <div className={className} onClick={toggle}>
            {children}
        </div>
    )
}

export default ToggleButton