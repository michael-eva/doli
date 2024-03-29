import { ReactNode } from "react";

type OpeningHours = {
    openingHours: [{
        id: string;
        day: ReactNode;
        isOpen: string;
        fromTime: ReactNode;
        toTime: ReactNode;
    }]
}

export default function DispOpeningHours({ openingHours }: OpeningHours) {

    return (
        <div className="mt-5 flex flex-col">
            <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle px-6 lg:px-8">
                    <table className="min-w-full divide-y divide-gray-300">
                        <tbody className="bg-white">
                            {openingHours?.map((item, index: number) => (
                                <tr key={index} className={index % 2 === 0 ? undefined : ' bg-amber-50'}>
                                    <td
                                        className="whitespace-nowrap py-1  pr-3 text-xs font-medium text-gray-900 pl-6"
                                    >
                                        {item.day}
                                    </td>
                                    <td
                                        className={item.isOpen === 'open' ? "whitespace-nowrap py-1  pr-3 text-xs font-medium text-green-500 pl-6"
                                            : "whitespace-nowrap py-1  pr-3 text-xs font-medium text-gray-400 pl-6 italic"
                                        }
                                    >
                                        {item.isOpen === "open" ? item.fromTime : "Closed"}
                                    </td>
                                    <td
                                        className="whitespace-nowrap py-1  pr-3 text-xs font-medium text-green-500 pl-6"
                                    >
                                        {item.isOpen === "open" ? item.toTime : ""}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
