export default function FilterFields() {
    return (
        <div className="dropdown w-full">
            <div tabIndex={1} role="button" className="btn">Click</div>
            <ul tabIndex={1} className="dropdown-content z-[1] menu shadow bg-base-100 rounded-box w-full">
                <li><a>Item 1</a></li>
                <li><a>Item 2</a></li>
            </ul>
        </div>
    )
}
