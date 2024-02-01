export type CardProps = {
    locationData?: {
        altCountry: string,
        altFormatted_address: string,
        altPostcode: string,
        altState: string,
        altSuburb: string,
        coordinates: {
            latitude: number,
            longitude: number,
        },
        country: string,
        formatted_address: string,
        state: string,
        suburb: string,
        streetAddress: string,
        postcode: string
    },
    id?: string,
    postId?: string,
    imgUrl?: string | null,
    name?: string,
    locality?: string,
    state?: string,
    postcode?: string,
    address?: string,
    type?: string,
    selectedTags?: [{
        value: string,
        label: string
    }],
    description?: string,
    openingHours?: [{
        id: string,
        day: string,
        isOpen: string,
        fromTime: string,
        toTime: string
    }],
    pickUp?: boolean,
    delivery?: boolean,
    dineIn?: boolean,
    contact?: string,
    website?: string,
    [key: string]: any;
}