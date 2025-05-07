import "./index.scss"
import {useNavigate} from "react-router-dom";
function ServicesCardCategory({desc,name,icon}) {
    const navigate = useNavigate();
    return (
        <div className={"col-3 col-md-6 col-sm-6 col-xs-6"} style={{padding:"8px"}} onClick={()=>navigate("/services/1")}>
            <div id={"servCardCategory"} >
                <div>
                    <img src={icon} />
                </div>
                <h4>{name}</h4>
                <p>Həyat keyfiyyətinizi yüksəltmək üçün ən yeni xərçəng müalicə üsulları.</p>
            </div>
        </div>
    );
}

export default ServicesCardCategory;