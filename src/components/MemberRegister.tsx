export default function MemberRegister() {

    return (
        <>
            <div className="container flex flex-col max-w-md">
                <div className="container flex gap-3">
                    <div className="flex flex-col w-1/2">
                        <label>First Name</label>
                        <input type="text" className="input input-bordered " />
                    </div>
                    <div className="flex flex-col w-1/2">
                        <label>Last Name</label>
                        <input type="text" className="input input-bordered " />
                    </div>
                </div>
                <div className=" flex flex-col mt-7">
                    <label>Email</label>
                    <input type="text" className="input input-bordered " />
                </div>
                <div className="container flex gap-3 mt-7">
                    <div className="flex flex-col w-1/2">
                        <label>Password</label>
                        <input type="password" className="input input-bordered " />
                    </div>
                    <div className="flex flex-col w-1/2">
                        <label>Confirm Password</label>
                        <input type="password" className="input input-bordered " />
                    </div>
                </div>

                <div className="container flex gap-3 mt-7">
                    <div className="flex flex-col w-1/2">
                        <label>Birth Month</label>
                        <select className="select select-bordered w-full max-w-xs">
                            <option disabled selected>- Select Month -</option>
                            <option>Han Solo</option>
                            <option>Greedo</option>
                        </select>
                    </div>
                    <div className="flex flex-col w-1/2">
                        <label>Birth Year</label>
                        <select className="select select-bordered w-full max-w-xs">
                            <option disabled selected>- Select Year -</option>
                            <option>Han Solo</option>
                            <option>Greedo</option>
                        </select>
                    </div>
                </div>


                <div className="container flex gap-3 mt-7">
                    <div className="flex flex-col w-1/2">
                        <label>Suburb</label>
                        <input type="text" className="input input-bordered " />
                    </div>
                    <div className="flex flex-col w-1/2">
                        <label>Post Code</label>
                        <input type="text" className="input input-bordered " />
                    </div>
                </div>
                <button className="btn btn-primary mt-7">Submit</button>
            </div>
        </>
    )
}
