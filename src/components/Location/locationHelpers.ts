type LatLngLiteral = {
    latitude: number,
    longitude: number
}

export function isCoordinateWithinRadius(
    target: LatLngLiteral,
    center: LatLngLiteral,
    radius: number
): boolean {
    const distance = google.maps.geometry.spherical.computeDistanceBetween(
        new google.maps.LatLng(target.latitude, target.longitude),
        new google.maps.LatLng(center.latitude, center.longitude)
    );
    return distance <= radius;

}