import { getGeocode } from "use-places-autocomplete";

export const getCentralCoordinates = async (address: string) => {
    getGeocode({ address: address }).then((results) => {
        const firstResult = results[0];
        const bounds = firstResult.geometry.bounds;
        const { lo: longitudeLow, hi: longitudeHigh } = bounds.Lh;
        const { lo: latitudeLow, hi: latitudeHigh } = bounds.bi;

        // Calculate the central location
        const centralLatitude = (latitudeLow + latitudeHigh) / 2;
        const centralLongitude = (longitudeLow + longitudeHigh) / 2;

        // Create an object containing the central location
        const centralLocation = {
            latitude: centralLatitude,
            longitude: centralLongitude
        };
        return {
            statusCode: 200,
            body: JSON.stringify(centralLocation)
        }
    })
}