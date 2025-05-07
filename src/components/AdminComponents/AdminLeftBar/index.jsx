import './index.scss'
// import logo from "../../../assets/Logo.png"
import { NavLink, useLocation } from "react-router-dom";
import {TbLogs} from "react-icons/tb";
import {FaClinicMedical} from "react-icons/fa";

function AdminLeftBar() {
    const location = useLocation();

    return (
        <section id="adminLeftBar">
            {/*<img src={logo} alt="logo" />*/}
            <li className={location.pathname === "/admin/category" ? "selected" : ""}>
                <TbLogs className="icon" />
                <NavLink to="/admin/category">
                    Kateqoriya
                </NavLink>
            </li>
            <li className={location.pathname === "/admin/clinic" ? "selected" : ""}>
                <FaClinicMedical className="icon" />
                <NavLink to="/admin/clinic">
                    Xəstəxana
                </NavLink>
            </li>


        </section>
    );
}

export default AdminLeftBar;
