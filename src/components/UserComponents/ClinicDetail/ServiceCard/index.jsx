import "./index.scss"
import icon from "/src/assets/icon1.png"
function ClinicDetailServiceCard() {
    return (
        <div className={"col-3 col-md-6 col-sm-6 col-xs-6"}>
            <div id={"clinicDetailServCard"}>
                <div>
                    <img src={icon} />
                </div>
                <h4>Xərçəng müalicəsi</h4>
                <p>Həyat keyfiyyətinizi yüksəltmək üçün ən yeni xərçəng müalicə üsulları.</p>
            </div>
        </div>
    );
}

export default ClinicDetailServiceCard;