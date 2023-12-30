import { useContext } from "react";
import { ToggleContext } from "../Toggle/Toggle";
import { IoCheckmarkCircleOutline } from "react-icons/io5";




type ModalType = {
    title?: string,
    children?: any,
    onClickFunction?: any,
    btnClassName?: string
    condBtnRender?: any
    ratingSubmitted?: boolean
    btnName?: string
}

export default function SimpleModal({ title, children, onClickFunction, btnClassName, condBtnRender, ratingSubmitted, btnName }: ModalType) {
    const { toggle }: any = useContext(ToggleContext);

    return (
        <div className="fixed inset-0 z-10 overflow-y-auto flex items-center justify-center bg-black bg-opacity-40">
            <div className="modal-box">
                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={toggle}>✕</button>
                {!ratingSubmitted ?
                    <>
                        <h2 className="font-bold text-xl my-4">{title}</h2>
                        <div className="my-4 text-lg">{children}</div>
                        {condBtnRender && (onClickFunction && <button className={btnClassName} onClick={onClickFunction}>{btnName}</button>)}
                    </>
                    :
                    <>
                        <div style={{ fontSize: "50px" }} className="flex justify-center">
                            <IoCheckmarkCircleOutline style={{ color: 'green' }} />

                        </div>


                        <h2 className=" text-xl my-4">Thank you for submitting your rating!</h2>
                        <h2 className="  my-4">Your rating will be displayed when page refreshes.</h2>
                    </>
                }
            </div>
        </div >
    );
}

