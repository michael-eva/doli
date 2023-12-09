import { useContext } from "react";
import { FaExclamationTriangle } from "react-icons/fa";
import { ToggleContext } from "../Toggle/Toggle";
type DeleteModal = {
    clickFunction: (arg0: string) => {},
    id: string,
    btnText: string,
    children: any,
    title: string
}

export default function DeleteModal({ clickFunction, id, btnText, children, title }: DeleteModal) {
    const { toggle } = useContext(ToggleContext)
    return (
        <div className="fixed inset-0 z-10 overflow-y-auto flex items-center justify-center bg-black bg-opacity-40">
            <div className="modal-box">
                <div className="flex items-center gap-2 ">
                    <div style={{ backgroundColor: 'pink', width: '30px', height: '30px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <FaExclamationTriangle style={{ color: 'red', fontSize: '18px' }} />
                    </div>
                    <h3 className="font-bold text-lg">{title}</h3>
                </div>
                <p className="py-4">{children}</p>
                <div className="modal-action">
                    <form method="dialog">
                        <div className="flex gap-2">
                            <button className="btn" onClick={toggle}>Cancel</button>
                            <button className="btn btn-error" onClick={() => clickFunction(id)}>{btnText}</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

    )
}
