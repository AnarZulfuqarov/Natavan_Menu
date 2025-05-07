import './index.scss';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function HomeServiceCard({ name, desc, icon }) {
    const { t } = useTranslation();
    const navigate = useNavigate();

    return (
        <div className={'col-3 col-md-6 col-sm-6 col-xs-6'} style={{ padding: '8px' }} onClick={() => navigate('/category/1')}>
            <div id={'homeServCard'}>
                <div className={'icons'}>
                    <img src={icon} alt={t('homeServiceCard.iconAlt', { name })} />
                </div>
                <h4>{name}</h4>
                <p>{t('homeServiceCard.description')}</p>
                <div className={'btn'}>
                    <button>
                        {t('homeServiceCard.button')}
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                            <g clip-path="url(#clip0_609_218)">
                                <path d="M12 14.25C12 13.6935 12.5498 12.8625 13.1063 12.165C13.8217 11.265 14.6767 10.4797 15.657 9.8805C16.392 9.43125 17.283 9 18 9M18 9C17.283 9 16.3912 8.56875 15.657 8.1195C14.6767 7.5195 13.8217 6.73425 13.1062 5.83575C12.5497 5.1375 12 4.305 12 3.75M18 9L9.71542e-07 9" stroke="black" />
                                <path d="M12 14.25C12 13.6935 12.5498 12.8625 13.1063 12.165C13.8217 11.265 14.6767 10.4797 15.657 9.8805C16.392 9.43125 17.283 9 18 9M18 9C17.283 9 16.3912 8.56875 15.657 8.1195C14.6767 7.5195 13.8217 6.73425 13.1062 5.83575C12.5497 5.1375 12 4.305 12 3.75M18 9L9.71542e-07 9" stroke="url(#paint0_linear_609_218)" />
                            </g>
                            <defs>
                                <linearGradient id="paint0_linear_609_218" x1="18" y1="9" x2="1.44838e-06" y2="9" gradientUnits="userSpaceOnUse">
                                    <stop offset="0.105769" stop-color="#37DEA1" stop-opacity="0.51" />
                                    <stop offset="0.322115" stop-color="#47D1D6" stop-opacity="0.78" />
                                </linearGradient>
                                <clipPath id="clip0_609_218">
                                    <rect width="18" height="18" fill="white" transform="translate(18 18) rotate(180)" />
                                </clipPath>
                            </defs>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default HomeServiceCard;