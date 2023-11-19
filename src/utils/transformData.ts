import data from '../data/australian_postcodes.json';

type Array = {
    id: number,
    postcode: string,
    locality: string,
    state: string,
    long: number,
    lat: number
}

function transformData(inputArray: any) {
    return inputArray.map(({ id, postcode, locality, state, long, lat }: Array) => ({
        id,
        postcode,
        locality,
        state,
        long,
        lat,
    }));
}

const locationData = transformData(data);
const jsonData = JSON.stringify(locationData, null, 2);
export function returndata() {
    return jsonData

}

export { jsonData }



