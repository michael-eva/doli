import React, { useState } from 'react';

import Select from 'react-select';


export default ({ value, options, setValue, handleInput, isLoading }) => {
    const [isClearable, setIsClearable] = useState(true);
    const [isSearchable, setIsSearchable] = useState(true);
    // const [isLoading, setIsLoading] = useState(false);
    console.log(options);
    return (
        <>
            <Select
                className="w-80"
                classNamePrefix="select"
                value={options.find(option => option.value === value)}
                // value={options.find(option => option.value === value)}
                isLoading={isLoading}
                isClearable={isClearable}
                isSearchable={isSearchable}
                options={options}
                // onChange={ }
                onInputChange={(input) => setValue(input)}
            />
        </>
    );
};