// import {logo} from "/images/IMG_20231227_130325.jpg"

export default function UnderConstruction() {
    return (
        <div className=" flex justify-center mt-20">
            <div className="flex flex-col md:items-center">
                <p className=" px-11 text-2xl md:text-3xl">We're working on something special here,</p>
                <p className=" px-11 text-xl md:text-3xl">but it's not quite ready yet</p>
                <p className="mt-2 px-11">Please check back at a later time</p>
                <img src="/images/IMG_20231227_130328.jpg" alt="logo" className=" w-80 md:w-96" />
            </div>
        </div>
    )
}
