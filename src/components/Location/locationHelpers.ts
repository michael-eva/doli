type LatLngLiteral = {
    latitude: number;
    longitude: number;
};

export function isCoordinateWithinRadius(
    target: LatLngLiteral,
    center: LatLngLiteral,
    radius: number
): boolean {
    const targetLatLng = new google.maps.LatLng(target.latitude, target.longitude);
    const centerLatLng = new google.maps.LatLng(center.latitude, center.longitude);

    const distance = google.maps.geometry.spherical.computeDistanceBetween(targetLatLng, centerLatLng);

    return distance <= radius;
}
