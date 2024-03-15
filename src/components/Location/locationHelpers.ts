import { getGeocode } from "use-places-autocomplete";


type LatLngLiteral = {
    latitude: number|undefined;
    longitude: number|undefined;
};

export function isCoordinateWithinRadius(
    target: LatLngLiteral,
    center: LatLngLiteral,
    radius: number
): boolean {
    const targetLatLng = new google.maps.LatLng(target.latitude!, target.longitude);
    const centerLatLng = new google.maps.LatLng(center.latitude!, center.longitude);

    const distance = google.maps.geometry.spherical.computeDistanceBetween(targetLatLng, centerLatLng);

    return distance <= radius;
}

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
        return centralLocation;



    })
}

