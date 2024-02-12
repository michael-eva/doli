import { useState, useEffect } from 'react';

const Carousel = ({ images, autoplayInterval }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentIndex((prevIndex) =>
                prevIndex === images.length - 1 ? 0 : prevIndex + 1
            );
        }, autoplayInterval);

        return () => clearInterval(intervalId);
    }, [images.length, autoplayInterval]);

    return (
        <div className="relative overflow-hidden rounded" style={{ maxWidth: "350px", maxHeight: "200px" }}>
            <div className="flex transition-transform duration-2000 ease-in-out transform" style={{ width: `${images.length * 100}%`, transform: `translateX(-${currentIndex * (100 / images.length)}%)` }}>
                {images.map((image, index) => (
                    <img
                        key={index}
                        className="w-full h-full object-cover"
                        src={image}
                        alt={`Slide ${index}`}
                        style={{ minWidth: "350px", maxHeight: "200px" }} // Set fixed dimensions
                    />
                ))}
            </div>
        </div>
    );
};

const App = () => {
    const images = [
        'images/hey_burg.webp',
        'images/swan_river.webp',
        'images/smart_brothers.webp',
        // Add more image URLs as needed
    ];

    return <Carousel images={images} autoplayInterval={6000} />;
};

export default App;
