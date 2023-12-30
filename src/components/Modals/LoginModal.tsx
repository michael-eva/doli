import { useRef, useEffect } from 'react';
import Login from '../../pages/Login';

export default function LoginModal() {
    const inputRef = useRef(null);

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []); // This effect runs when the modal mounts

    return (
        <div className="fixed inset-0 z-10 overflow-y-auto flex items-center justify-center bg-black bg-opacity-40">
            <div className="modal-box">
                <Login ref={inputRef} />
                {/* Other modal content */}
            </div>
        </div >
    );
}
