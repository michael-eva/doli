import { useContext } from "react"
import { ToggleContext } from "./Toggle"

type ToggleOn = {
    children: any
}

const ToggleOn = ({ children }: ToggleOn) => {
    const { on }: any = useContext(ToggleContext)
    return on ? children : null
}

export default ToggleOn