import React, { useRef, useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "./index.scss";
import serv1 from "/src/assets/Servis/genekoloq.png";
import serv2 from "/src/Assets/Servis/ortaped.png";
import serv3 from "/src/assets/Servis/hepatoloq.png";
import serv4 from "/src/assets/Servis/heart.png";
import serv5 from "/src/assets/Servis/oftomoloq.png";
import serv6 from "/src/assets/Servis/cancer.png";
import serv7 from "/src/assets/Servis/travmatoloq.png";
import serv8 from "/src/assets/Servis/sssssssss.png";

// Kategoriler için veri
const categories = [
    { name: "Ginekologiya", icon: serv1 },
    { name: "Onurğa müalicəsi", icon: serv2 },
    { name: "Hepatologiya", icon: serv3 },
    { name: "Kardiologiya", icon: serv4 },
    { name: "Oftalmologiya", icon: serv5 },
    { name: "Xərçəng müalicəsi", icon: serv6 },
    { name: "Travmatologiya", icon: serv7 },
    { name: "Fizioterapiya", icon: serv8 },
    { name: "Ginekologiya", icon: serv1 },
    { name: "Onurğa müalicəsi", icon: serv2 },
    { name: "Hepatologiya", icon: serv3 },
    { name: "Kardiologiya", icon: serv4 },
    { name: "Oftalmologiya", icon: serv5 },
    { name: "Xərçəng müalicəsi", icon: serv6 },
    { name: "Travmatologiya", icon: serv7 },
    { name: "Fizioterapiya", icon: serv8 },
];

const CustomSlider = () => {
    const visibleItems = 4; // Görünen öğe sayısı
    const [currentIndex, setCurrentIndex] = useState(0);
    const sliderRef = useRef(null);

    // Dinamik maxIndex hesaplaması (her 4 kart için 1 bullet)
    const categoriesCount = categories.length;
    const maxIndex = Math.max(0, Math.ceil(categoriesCount / visibleItems) - 1);

    // Slider pozisyonunu izlemek için scroll eventi
    useEffect(() => {
        const slider = sliderRef.current;
        if (!slider) return;

        const handleScroll = () => {
            const scrollLeft = slider.scrollLeft;
            const itemWidth = slider.scrollWidth / categoriesCount;
            const groupIndex = Math.round(scrollLeft / (itemWidth * visibleItems));
            setCurrentIndex(Math.min(groupIndex, maxIndex));
        };

        slider.addEventListener("scroll", handleScroll);
        return () => slider.removeEventListener("scroll", handleScroll);
    }, [maxIndex, categoriesCount, visibleItems]);

    // Bullet'a tıklayınca slider'ı kaydır (4 kartlık gruplar)
    const handleBulletClick = (index) => {
        if (index <= maxIndex && sliderRef.current) {
            const itemWidth = sliderRef.current.scrollWidth / categoriesCount;
            sliderRef.current.scrollTo({
                left: index * itemWidth * visibleItems,
                behavior: "smooth",
            });
            setCurrentIndex(index);
        }
    };

    // Slider'ı sola kaydırma (4 kartlık grup)
    const scrollLeft = () => {
        if (sliderRef.current && currentIndex > 0) {
            const itemWidth = sliderRef.current.scrollWidth / categoriesCount;
            sliderRef.current.scrollTo({
                left: (currentIndex - 1) * itemWidth * visibleItems,
                behavior: "smooth",
            });
            setCurrentIndex(currentIndex - 1);
        }
    };

    // Slider'ı sağa kaydırma (4 kartlık grup)
    const scrollRight = () => {
        if (sliderRef.current && currentIndex < maxIndex) {
            const itemWidth = sliderRef.current.scrollWidth / categoriesCount;
            sliderRef.current.scrollTo({
                left: (currentIndex + 1) * itemWidth * visibleItems,
                behavior: "smooth",
            });
            setCurrentIndex(currentIndex + 1);
        }
    };

    return (
        <>
            <div className="custom-slider">
                <button
                    className="slider-btn left"
                    onClick={scrollLeft}
                    disabled={currentIndex === 0}
                    aria-label="Previous slide"
                >
                    <FaChevronLeft />
                </button>
                <div className="slider-container" ref={sliderRef}>
                    {categories.map((category, index) => (
                        <div className="slider-item" key={index}>
                            <div className="icon">
                                <img src={category.icon} alt={category.name} />
                            </div>
                            <span>{category.name}</span>
                        </div>
                    ))}
                </div>
                <button
                    className="slider-btn right"
                    onClick={scrollRight}
                    disabled={currentIndex >= maxIndex}
                    aria-label="Next slide"
                >
                    <FaChevronRight />
                </button>
            </div>
            <div className="custom-pagination">
                {Array.from({ length: maxIndex + 1 }).map((_, index) => (
                    <span
                        key={index}
                        className={`custom-bullet ${currentIndex === index ? "active" : ""}`}
                        onClick={() => handleBulletClick(index)}
                        role="button"
                        aria-label={`Go to slide ${index + 1}`}
                        tabIndex={0}
                        onKeyDown={(e) => e.key === "Enter" && handleBulletClick(index)}
                    />
                ))}
            </div>
        </>
    );
};

export default CustomSlider;