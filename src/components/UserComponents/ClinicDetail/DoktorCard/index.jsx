import "./index.scss"
import {FaArrowRightLong} from "react-icons/fa6";
import {useNavigate} from "react-router-dom";
function DoktorCard({name,img}) {
    console.log(img)
    const navigate = useNavigate();
    return (
        <div className={"col-3 col-md-6 col-sm-6 col-xs-6"} onClick={()=>navigate("/doktor/1")}>
            <div id={"doktorCard"}>
                <div className={"image"}>
                    <img src={img}/>
                </div>
                <div className={"content"}>
                    <h5>{name}</h5>
                    <p>Xərçəng müalicəsi</p>
                </div>
                <div style={{textAlign:"center"}}>
                    <button>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <g clip-path="url(#clip0_609_394)">
                                <path d="M16 19C16 18.258 16.733 17.15 17.475 16.22C18.429 15.02 19.569 13.973 20.876 13.174C21.856 12.575 23.044 12 24 12M24 12C23.044 12 21.855 11.425 20.876 10.826C19.569 10.026 18.429 8.979 17.475 7.781C16.733 6.85 16 5.74 16 5M24 12L8.18552e-07 12" stroke="black" stroke-width="2"/>
                                <path d="M16 19C16 18.258 16.733 17.15 17.475 16.22C18.429 15.02 19.569 13.973 20.876 13.174C21.856 12.575 23.044 12 24 12M24 12C23.044 12 21.855 11.425 20.876 10.826C19.569 10.026 18.429 8.979 17.475 7.781C16.733 6.85 16 5.74 16 5M24 12L8.18552e-07 12" stroke="url(#paint0_linear_609_394)" stroke-width="2"/>
                            </g>
                            <defs>
                                <linearGradient id="paint0_linear_609_394" x1="24" y1="12" x2="1.29539e-06" y2="12" gradientUnits="userSpaceOnUse">
                                    <stop offset="0.105769" stop-color="#37DEA1" stop-opacity="0.51"/>
                                    <stop offset="0.322115" stop-color="#47D1D6" stop-opacity="0.78"/>
                                </linearGradient>
                                <clipPath id="clip0_609_394">
                                    <rect width="24" height="24" fill="white" transform="translate(24 24) rotate(180)"/>
                                </clipPath>
                            </defs>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DoktorCard;