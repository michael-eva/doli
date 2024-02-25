import { CardProps } from ".";

export type LocationSearchProps = {
    onSelect?: (
        address: string,
        postcode: string,
        suburb: string,
        state: string,
        country: string,
        coordinates: any
    ) => void;
    postData?: CardProps;
    types: string[];
    placeholder: string;
    inputClear?: boolean,
    setInputClear?: any,
    suburbAndPostcode: boolean
    signUpData?: {
        address: string,
        suburb: string,
        postcode: string,
        country: string,
        state: string,
    },
    className?: string,
    allChecked: boolean
}