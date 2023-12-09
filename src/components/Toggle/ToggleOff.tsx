import { useContext } from "react"
import { ToggleContext } from "./Toggle"

const ToggleOff = ({ children }: any) => {
    const { on } = useContext(ToggleContext)

    return on ? null : children
}

export default ToggleOff