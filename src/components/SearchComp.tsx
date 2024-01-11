import { useForm } from "react-hook-form"
import { useSearchParams } from "react-router-dom"
import { IoSearch } from "react-icons/io5";
import { useState } from "react";


export default function SearchComp() {
    const { register } = useForm()
    const [searchParams, setSearchParams] = useSearchParams()
    const searchFilter = searchParams.get("search")
    const [isOpen, setIsOpen] = useState<boolean>(false)


    const genNewSearchParams = (key: string, value: string) => {
        const sp = new URLSearchParams(searchParams)
        if (value === null) {
            sp.delete(key)
        } else {
            sp.set(key, value)
        }
        setSearchParams(`?${sp.toString()}`)
    }

    return (
        <div className=" flex">
            <div
                className="text-2xl flex items-center cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
            ><IoSearch />
            </div>
            {isOpen && <div className="flex flex-col">
                <input type="text"
                    className="input input-bordered w-36 md:w-60"
                    placeholder='Enter search term'
                    {...register("search")}
                    onChange={(e) => genNewSearchParams("search", e.target.value)}
                    value={searchFilter || ""}
                />
            </div>}
        </div>
    )
}
