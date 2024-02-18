import axios from 'axios';

const getCoordinates = async (placeNames) => {
    const API_KEY = 'AIzaSyCvaaorvLHbZv5tkSP0mfgsT9B0vC0b4nY'; // Replace with your Google Maps API key
    const results = await Promise.all(
        placeNames.map(async (placeName) => {
            console.log(placeName);

            const encodedPlaceName = encodeURIComponent(placeName);
            const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedPlaceName}&key=${API_KEY}`;

            try {
                const response = await axios.get(url);
                const { results } = response.data;
                if (results && results.length > 0) {
                    const { lat, lng } = results[0].geometry.location;
                    return { latitude: lat, longitude: lng };
                }
                return null;
            } catch (error) {
                console.error('Error fetching coordinates:', error);
                return null;
            }
        })
    );

    return results;
};

export { getCoordinates };
