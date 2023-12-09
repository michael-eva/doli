import { createContext, useState } from "react"

const ToggleContext = createContext({ on: false, toggle: () => { } })

const Toggle = ({ children }: any) => {
    const [on, setOn] = useState(false)

    const toggle = () => {
        setOn(prev => !prev)
    }

    return (
        <ToggleContext.Provider value={{ on, toggle }}>
            <div>
                {children}
            </div>
        </ToggleContext.Provider>
    )
}

export default Toggle
export { ToggleContext }