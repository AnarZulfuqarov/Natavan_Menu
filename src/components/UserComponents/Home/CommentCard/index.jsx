import image from "/src/assets/icons/1.svg";
import { HiOutlineArrowLeft, HiOutlineArrowRight } from "react-icons/hi";
import { useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "./index.scss";

function CommentCard({ currentIndex, setCurrentIndex, fakeComments }) {
    const { t } = useTranslation();
    const sliderRef = useRef(null);

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const handleNext = () => {
        if (currentIndex < fakeComments.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    // currentIndex değiştiğinde slider'ı güncelle
    useEffect(() => {
        if (sliderRef.current) {
            sliderRef.current.style.transform = `translateX(-${currentIndex * 100}%)`;
        }
    }, [currentIndex]);

    return (
        <div className="comment-card-container">
            <div className="comment-card-slider" ref={sliderRef}>
                {fakeComments.map((comment, index) => (
                    <div className="comment-card" key={index}>
                        <div className="quote-icon">
                            <img src={image} alt="quote icon" />
                        </div>
                        <p>{t(`translation.comments.${index}.text`)}</p>
                        <div className="comment-author">
                            <div className="text">
                                <div className="image">
                                    <img src={comment.image} alt="author" />
                                </div>
                                <div style={{ display: "flex", flexDirection: "column", alignItems: "start" }}>
                                    <h6 className="name">{comment.name}</h6>
                                    <span className="country">{comment.country}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="navigationBtn">
                <button
                    className="prev"
                    onClick={handlePrev}
                    disabled={currentIndex === 0}
                >
                    <HiOutlineArrowLeft />
                </button>
                <button
                    className="next"
                    onClick={handleNext}
                    disabled={currentIndex === fakeComments.length - 1}
                >
                    <HiOutlineArrowRight />
                </button>
            </div>
        </div>
    );
}

export default CommentCard;