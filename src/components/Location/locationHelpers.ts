type LatLngLiteral = {
    lat: number,
    lng: number,
    latitude: number,
    longitude: number
}

export function isCoordinateWithinRadius(
    target: LatLngLiteral,
    center: LatLngLiteral,
    radius: number
): boolean {
    const distance = google.maps.geometry.spherical.computeDistanceBetween(
        new google.maps.LatLng(target.lat, target.lng),
        new google.maps.LatLng(center.latitude, center.longitude)
    );
    return distance <= radius;

}