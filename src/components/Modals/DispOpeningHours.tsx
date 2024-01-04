export default function DispOpeningHours({ openingHours }) {

    console.log(openingHours);

    return (
        <div className="">
            <div className="mt-5 flex flex-col">
                <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                        {/* <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg"> */}
                        <table className="min-w-full divide-y divide-gray-300">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="py-1 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                        Day
                                    </th>
                                    <th scope="col" className="px-6 py-1 text-left text-sm font-semibold text-gray-900">
                                        Open
                                    </th>
                                    <th scope="col" className=" text-center px-3 py-1 text-sm font-semibold text-gray-900">
                                        Time
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white">
                                {openingHours?.map((item, index) => (
                                    <tr key={item.id} className={index % 2 === 0 ? undefined : 'bg-gray-50'}>
                                        <td
                                            className="whitespace-nowrap py-1  pr-3 text-xs font-medium text-gray-900 sm:pl-6"
                                        >
                                            {item.day}
                                        </td>
                                        <td
                                            className={item.isOpen === 'open' ? "whitespace-nowrap py-1  pr-3 text-xs font-medium text-green-500 sm:pl-6"
                                                : "whitespace-nowrap py-1  pr-3 text-xs font-medium text-gray-400 sm:pl-6 italic"
                                            }
                                        >
                                            {item.isOpen === "open" ? item.fromTime : "Closed"}
                                        </td>
                                        <td
                                            className="whitespace-nowrap py-1  pr-3 text-xs font-medium text-green-500 sm:pl-6"
                                        >
                                            {item.toTime}
                                        </td>


                                    </tr >
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div >
        // </div >
    );
}
