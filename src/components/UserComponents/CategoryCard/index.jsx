import './index.scss'
import icon from "/src/assets/icon.png"
import {useNavigate} from "react-router-dom";
import {CATEGORY_IMAGES} from "../../../contants.js";
function CategoryCard({item}) {
    const navigate = useNavigate();
    return (
        <div className={"col-15-60"} onClick={()=>navigate(`/menu/${item?.id}`)}>
            <div id={"category-card"}>
                <div className={"card-icon"}>
                    <img src={CATEGORY_IMAGES + item?.categoryImage}/>
                </div>
                <p>{item?.name}</p>
            </div>
        </div>
    );
}

export default CategoryCard;