import { Dispatch, SetStateAction } from "react"

export type FilterFieldsType = {
    register: any
    genNewSearchParams: (key: string, value: string) => void
    typeFilter: string | null
    businessType: string[] | null
    searchFilter: string | null
    locationFilter: string | null
    clearFilters: () => void
    setInputClear: Dispatch<SetStateAction<boolean>>
    inputClear: boolean
    isChecked: boolean
    onSelect?: (
        address: string,
        postcode: string,
        suburb: string,
        state: string,
        country: string,
        coordinates: any
    ) => void;
    handleCheckboxChange: () => void
    nearbyFilter: string | null
}