import { useEffect, useState } from "react";

export default function OpeningHours({ register, setValue, getValues, errors, setError, clearErrors, watch, postData }: any) {
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

    const [initialOpeningHours, setInitialOpeningHours] = useState([
        { day: "Monday", isOpen: 'closed', fromTime: "", toTime: "" },
        { day: "Tuesday", isOpen: 'closed', fromTime: "", toTime: "" },
        { day: "Wednesday", isOpen: 'closed', fromTime: "", toTime: "" },
        { day: "Thursday", isOpen: 'closed', fromTime: "", toTime: "" },
        { day: "Friday", isOpen: 'closed', fromTime: "", toTime: "" },
        { day: "Saturday", isOpen: 'closed', fromTime: "", toTime: "" },
        { day: "Sunday", isOpen: 'closed', fromTime: "", toTime: "" },])

    const timeOptions = generateTimeOptions();
    const isTimeAfter = (fromTime: string, toTime: string) => {
        const [fromHour, fromMinute] = fromTime.split(':').map(Number);
        const [toHour, toMinute] = toTime.split(':').map(Number);

        const fromTotalMinutes = fromHour * 60 + fromMinute;
        const toTotalMinutes = toHour * 60 + toMinute;

        return toTotalMinutes > fromTotalMinutes;
    };

    useEffect(() => {
        if (postData) {
            setInitialOpeningHours(postData.openingHours)
        }
    }, [postData]);

    // console.log(initialOpeningHours);





    const editOpeningTimesEl = () => {
        return (
            <>
                {initialOpeningHours.map((item, index) => (
                    <tr key={index} className={index % 2 === 0 ? undefined : 'bg-gray-50'}>
                        <td
                            className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6"
                            {...register(`openingHours.${index}.day`, { value: item.day })}
                        >
                            {item.day}
                        </td>
                        <td>
                            <select
                                id={`openingHours.${index}.isOpen`}
                                className="input input-bordered"
                                defaultValue={initialOpeningHours[index].isOpen}
                                {...register(`openingHours.${index}.isOpen`)}
                            >
                                <option value='open'>Open</option>
                                <option value='closed'>Closed</option>
                            </select>
                        </td>
                        {watch(`openingHours[${index}].isOpen`) === 'open' ? (
                            // {initialOpeningHours[index].isOpen === 'open' ? (
                            < td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                {errors && errors[item.day]?.toTime && (
                                    <p className=" text-red-500">*{errors[item.day].toTime.message}</p>
                                )}
                                <div className="flex items-center gap-2">
                                    <p>From</p>
                                    <select
                                        id={`openingHours.${index}.fromTime`}
                                        {...register(`openingHours.${index}.fromTime`)}
                                        className="input input-bordered w-1/2"
                                        defaultValue={initialOpeningHours[index].fromTime || ""}
                                    >
                                        {timeOptions.map((time, idx) => (
                                            <option key={idx}>{time}</option>
                                        ))}
                                    </select>
                                    <p>To</p>
                                    <select
                                        id={`openingHours.${index}.toTime`}
                                        className="input input-bordered w-1/2"
                                        {...register(`openingHours.${index}.toTime`)}
                                        value={item.toTime}
                                        onBlur={(e) => {
                                            const toTimeValue = e.target.value;
                                            const fromTimeValue = watch(`openingHours.${index}.fromTime`);
                                            if (!isTimeAfter(fromTimeValue, toTimeValue)) {
                                                setError(`openingHours.${index}.toTime`, {
                                                    type: 'manual',
                                                    message: 'Closing time needs to be after opening time'
                                                });
                                            } else {
                                                clearErrors(`openingHours.${index}.toTime`);
                                            }
                                        }}
                                    >
                                        {timeOptions.map((time, idx) => (
                                            <option key={idx}>{time}</option>
                                        ))}
                                    </select>
                                </div>
                            </td>
                        ) : (
                            <td>
                                <div className="flex justify-center">
                                    <p>Closed</p>
                                </div>
                            </td>
                        )}
                    </tr >
                ))
                }
            </>
        );

    }
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

                                    {postData ? editOpeningTimesEl()
                                        :
                                        <>
                                            {initialOpeningHours.map((item, index) => (
                                                <tr key={index} className={index % 2 === 0 ? undefined : 'bg-gray-50'}>
                                                    <td
                                                        className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6"
                                                        {...register(`openingHours.${item.day}.day`, { value: item.day })}
                                                    >
                                                        {item.day}
                                                    </td>
                                                    <td>
                                                        <select
                                                            id={`openingHours.${item.day}.isOpen`}
                                                            className="input input-bordered"
                                                            defaultValue="closed"
                                                            {...register(`openingHours.${item.day}.isOpen`)}
                                                        >
                                                            <option value='open'>Open</option>
                                                            <option value='closed'>Closed</option>
                                                        </select>
                                                    </td>

                                                    {watch(`openingHours.${item.day}.isOpen`) === 'open' ?
                                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                            {errors && errors[item.day]?.toTime && (
                                                                <p className=" text-red-500">*{errors[item.day].toTime.message}</p>
                                                            )}
                                                            <div className="flex items-center gap-2">
                                                                <p>From</p>
                                                                <select
                                                                    id={`openingHours.${item.day}.fromTime`}
                                                                    {...register(`openingHours.${item.day}.fromTime`)}
                                                                    className="input input-bordered w-1/2"
                                                                    value={item.fromTime}
                                                                >
                                                                    {timeOptions.map((time, index) => (
                                                                        <option key={index}>{time}</option>
                                                                    ))}
                                                                </select>
                                                                <p>To</p>
                                                                <select
                                                                    id={`openingHours.${item.day}.toTime`}
                                                                    className="input input-bordered w-1/2"
                                                                    {...register(`openingHours.${item.day}.toTime`)}
                                                                    value={item.toTime}
                                                                    onBlur={(e) => {
                                                                        const toTimeValue = e.target.value;
                                                                        const fromTimeValue = watch(`openingHours.${item.day}.fromTime`);
                                                                        if (!isTimeAfter(fromTimeValue, toTimeValue)) {
                                                                            setError(`openingHours.${item.day}.toTime`, {
                                                                                type: 'manual',
                                                                                message: 'Closing time needs to be after opening time'
                                                                            });
                                                                        } else {
                                                                            clearErrors(`openingHours.${item.day}.toTime`);
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
                                        </>
                                    }

                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div >
        </div >
    )
}