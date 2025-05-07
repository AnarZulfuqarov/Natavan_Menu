import './index.scss';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

function BestServCard({ name, desc, img, imgAlt, icon, iconAlt }) {
    const { t } = useTranslation();
    const navigate = useNavigate();

    return (
        <div className="col-3 col-md-6 col-sm-6 col-xs-6" onClick={() => navigate('/services/1')}>
            <div id="bestServCard">
                <div className="image">
                    <img src={img} alt={imgAlt} />
                    <div>
                        <img src={icon} alt={iconAlt} />
                    </div>
                </div>
                <div className="content">
                    <h4>{name}</h4>
                    <p>Həyat keyfiyyətinizi yüksəltmək üçün ən yeni xərçəng müalicə üsulları.</p>
                    <div>
                        <button>
                            {t('bestServCard.button')}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="25"
                                height="26"
                                viewBox="0 0 25 26"
                                fill="none"
                            >
                                <g clipPath="url(#clip0_454_193)">
                                    <path
                                        d="M17.7232 16.0466C17.4449 15.5647 17.5055 14.5701 17.6387 13.6878C17.8083 12.5507 18.1562 11.4431 18.7055 10.434C19.1174 9.67747 19.6734 8.8585 20.2943 8.5M20.2943 8.5C19.6734 8.8585 18.6855 8.9309 17.825 8.90896C16.676 8.87947 15.543 8.62693 14.4741 8.20655C13.643 7.8801 12.7507 7.43401 12.4732 6.95336M20.2943 8.5L4.70586 17.5"
                                        stroke="black"
                                    />
                                    <path
                                        d="M17.7232 16.0466C17.4449 15.5647 17.5055 14.5701 17.6387 13.6878C17.8083 12.5507 18.1562 11.4431 18.7055 10.434C19.1174 9.67747 19.6734 8.8585 20.2943 8.5M20.2943 8.5C19.6734 8.8585 18.6855 8.9309 17.825 8.90896C16.676 8.87947 15.543 8.62693 14.4741 8.20655C13.643 7.8801 12.7507 7.43401 12.4732 6.95336M20.2943 8.5L4.70586 17.5"
                                        stroke="#00DA7B"
                                    />
                                </g>
                                <defs>
                                    <clipPath id="clip0_454_193">
                                        <rect
                                            width="18"
                                            height="18"
                                            fill="white"
                                            transform="translate(24.7943 16.2942) rotate(150)"
                                        />
                                    </clipPath>
                                </defs>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BestServCard;