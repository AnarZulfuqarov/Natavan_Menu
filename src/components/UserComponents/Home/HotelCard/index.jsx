import "./index.scss";
import defaultImage from "/src/assets/Subtract.png"; // Varsayılan resim
import hoverImage from "/src/assets/HoverImage.png"; // Hover sırasında gösterilecek resim
import { IoLocationOutline } from "react-icons/io5";

function HotelCard({name,desc,img}) {
    return (
        <div className={"col-3"}>
            <div
                id={"hotelCard"}
                style={{
                    background: `linear-gradient(0deg, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)), url(${img})`,
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",

                }}
            >
                <div className={"image"}>
                    <img src={defaultImage} className="default-image" alt="default" />
                    <img src={hoverImage} className="hover-image" alt="hover" />
                    <div className={"card-title"}>
                        <p>
                            <IoLocationOutline className={"icon"} />
                            {desc}
                        </p>
                        <h5>{name}</h5>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HotelCard;