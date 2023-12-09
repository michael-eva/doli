import { useContext } from "react"
import { ToggleContext } from "../Toggle/Toggle"

type ModalType = {
    title: string,
    children: string
}



export default function SimpleModal({ title, children }: ModalType) {
    const { toggle }: any = useContext(ToggleContext)
    return (
        <div className="fixed inset-0 z-10 overflow-y-auto flex items-center justify-center bg-black bg-opacity-40">
            <div className="modal-box ">
                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={toggle}>✕</button>
                <h2 className=" font-bold text-xl my-4">{title}</h2>
                <p className="my-4 text-lg">{children}</p>
            </div>
        </div>
    )
}
