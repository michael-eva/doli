import { useContext } from "react";
import { ToggleContext } from "../Toggle/Toggle";

type ModalType = {
    children: any
}

export default function CustomModal({ children }: ModalType) {
    const { toggle }: any = useContext(ToggleContext);

    return (
        <div className="fixed inset-0 z-10 overflow-y-auto flex items-center justify-center bg-black bg-opacity-40">
            <div className="modal-box">
                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={toggle}>✕</button>
                {children}
            </div>
        </div >
    );
}

