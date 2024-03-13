import React, { useState } from 'react';

import Select from 'react-select';


export default ({ value, options, isLoading, handleSelect, handleInput }) => {
    const [isClearable, setIsClearable] = useState(true);
    const [isSearchable, setIsSearchable] = useState(true);
    // const [isLoading, setIsLoading] = useState(false);
    console.log(value);

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
                onInputChange={(input) => handleInput(input)}
            />
        </>
    );
};