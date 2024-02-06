export default function UpdateEmail() {
    return (
        <div className="fixed inset-0 z-10 overflow-y-auto flex items-center justify-center bg-black bg-opacity-50">
            <div className="modal-box ">
                <div className="flex gap-4 flex-col">
                    <label className="label">
                        <span className="label-text w-24">doli</span>
                    </label>
                    <p>You will need to confirm both email addresses - once both have been confirmed, the email address will be updated.</p>
                </div>
            </div>
        </div>
    )
}
