const initialOpeningHours = [
    {
        day: "Monday",
        isOpen: false,
        times: {
            fromTime: "",
            toTime: ""
        }
    },
    {
        day: "Tuesday",
        isOpen: false,
        fromTime: "",
        toTime: ""
    },
    {
        day: "Wednesday",
        isOpen: false,
        fromTime: "",
        toTime: ""
    },
    {
        day: "Thursday",
        isOpen: false,
        fromTime: "",
        toTime: ""
    },
    {
        day: "Friday",
        isOpen: false,
        fromTime: "",
        toTime: ""
    },
    {
        day: "Saturday",
        isOpen: false,
        fromTime: "",
        toTime: ""
    },
    {
        day: "Sunday",
        isOpen: false,
        fromTime: "",
        toTime: ""
    },
]

export default function OpeningHours({ register, setValue, getValues, errors, setError, clearErrors }: any) {
    function generateTimeOptions() {
        const times = [];
        for (let hour = 0; hour < 24; hour++) {
            for (let minute = 0; minute < 60; minute += 15) {
                const formattedHour = `${hour < 10 ? '0' : ''}${hour}`;
                const formattedMinute = `${minute === 0 ? '00' : minute}`;
                times.push(`${formattedHour}:${formattedMinute}`);
            }
        }
        return times;
    }
    const timeOptions = generateTimeOptions();
    const isTimeAfter = (fromTime: string, toTime: string) => {
        const [fromHour, fromMinute] = fromTime.split(':').map(Number);
        const [toHour, toMinute] = toTime.split(':').map(Number);

        const fromTotalMinutes = fromHour * 60 + fromMinute;
        const toTotalMinutes = toHour * 60 + toMinute;

        return toTotalMinutes > fromTotalMinutes;
    };
    return (
        <div className="">
            <div className="mt-5 flex flex-col">
                <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-300">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                            Day
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Open / Closed
                                        </th>
                                        <th scope="col" className=" text-center px-3 py-3.5 text-sm font-semibold text-gray-900">
                                            Time
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white">
                                    {initialOpeningHours.map((item, index) => (
                                        <tr key={item.day} className={index % 2 === 0 ? undefined : 'bg-gray-50'}>
                                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                                {item.day}
                                            </td>
                                            <td>
                                                <select
                                                    id={`${item.day}`}
                                                    className="input input-bordered"
                                                    defaultValue='closed'
                                                    {...register(`${item.day}.isOpen`)}
                                                >
                                                    <option value='open'>Open</option>
                                                    <option value='closed'>Closed</option>
                                                </select>
                                            </td>

                                            {getValues(`${item.day}.isOpen`) === 'open' ?
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                    {errors && errors[item.day]?.time?.toTime && (
                                                        <p className=" text-red-500">*{errors[item.day].time.toTime.message}</p>
                                                    )}
                                                    <div className="flex items-center gap-2">
                                                        <p>From</p>
                                                        <select
                                                            id={`${item.fromTime}`}
                                                            {...register(`${item.day}.time.fromTime`)}
                                                            className="input input-bordered w-1/2"
                                                        >
                                                            {timeOptions.map((time, index) => (
                                                                <option key={index}>{time}</option>
                                                            ))}
                                                        </select>
                                                        <p>To</p>
                                                        <select
                                                            id={`${item.fromTime}`}
                                                            className="input input-bordered w-1/2"
                                                            {...register(`${item.day}.time.toTime`)}
                                                            onChange={(e) => {
                                                                const toTimeValue = e.target.value;
                                                                const fromTimeValue = getValues(`${item.day}.time.fromTime`);
                                                                if (!isTimeAfter(fromTimeValue, toTimeValue)) {
                                                                    setError(`${item.day}.time.toTime`, {
                                                                        type: 'manual',
                                                                        message: 'Closing time needs to be after opening time'
                                                                    });
                                                                    setValue(`${item.day}.time.fromTime`, "00:00")
                                                                    setValue(`${item.day}.time.toTime`, "00:00")
                                                                } else {
                                                                    clearErrors(`${item.day}.time.toTime`);
                                                                }
                                                            }}
                                                        >
                                                            {timeOptions.map((time, index) => (
                                                                <option key={index}>{time}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </td> :
                                                <td>

                                                    <div className="flex justify-center">
                                                        <p>Closed</p>
                                                    </div>
                                                </td>
                                            }
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div >
        </div >
    )
}