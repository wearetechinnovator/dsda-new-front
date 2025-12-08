import { HiOutlineHome } from "react-icons/hi2";
import { Link } from "react-router-dom";
import { Tooltip } from "react-tooltip";
import { Icons } from "../../helper/icons";

const SideNav = () => {
  const activePath = window.location.pathname;

  return (
    <aside className="side__nav mobile__menu min-w-[175px] h-[calc(100vh-50px)] bg-[#003e32] text-white" id="sideBar">
      <div className="side__nav__logo flex justify-center items-center"></div>

      <ul className="side__nav__links pb-3">
        {/* Dashboard */}
        <li className={activePath === "/hotel/dashboard" ? "active__link" : ""}>
          <Link to="/hotel/dashboard" data-tooltip-id="sideBarItemToolTip">
            <div className="flex items-center">
              <span className="mr-3"><HiOutlineHome /></span>
              <span>Dashboard</span>
            </div>
          </Link>
        </li>

        {/* Management Section */}
        <li className="submenu__list">
          <h3 className="menu__title text-[16px] my-5 uppercase">Management</h3>
          <ul>
            <li className={activePath.includes("/hotel/check-in") ? "active__link" : ""}>
              <Link to="/hotel/check-in" data-tooltip-id="sideBarItemToolTip">
                <div className="flex items-center">
                  <span className="mr-3"><Icons.USER size="13px" /></span>
                  <span>Check In</span>
                </div>
              </Link>
            </li>

            <li className={activePath.includes("/hotel/check-out") ? "active__link" : ""}>
              <Link to="/hotel/check-out" data-tooltip-id="sideBarItemToolTip">
                <div className="flex items-center">
                  <span className="mr-3"><Icons.USER size="13px" /></span>
                  <span>Check Out</span>
                </div>
              </Link>
            </li>

            <li className={activePath.includes("/hotel/tourist-data") ? "active__link" : ""}>
              <Link to="/hotel/tourist-data" data-tooltip-id="sideBarItemToolTip">
                <div className="flex items-center">
                  <span className="mr-3"><Icons.USERS /></span>
                  <span>MIS Tourist Data</span>
                </div>
              </Link>
            </li>

            <li className={activePath.includes("/hotel/amenities") ? "active__link" : ""}>
              <Link to="/hotel/amenities" data-tooltip-id="sideBarItemToolTip">
                <div className="flex items-center">
                  <span className="mr-3"><Icons.RUPES /></span>
                  <span>Amenities</span>
                </div>
              </Link>
            </li>

            <li className={activePath.includes("/hotel/payments") ? "active__link" : ""}>
              <Link to="/hotel/payments" data-tooltip-id="sideBarItemToolTip">
                <div className="flex items-center">
                  <span className="mr-3"><Icons.RUPES /></span>
                  <span>Payments</span>
                </div>
              </Link>
            </li>

            <li className={activePath.includes("/hotel/other-payments") ? "active__link" : ""}>
              <Link to="/hotel/other-payments" data-tooltip-id="sideBarItemToolTip">
                <div className="flex items-center">
                  <span className="mr-3"><Icons.RUPES /></span>
                  <span>Other Payments</span>
                </div>
              </Link>
            </li>
          </ul>
        </li>
      </ul>

      <Tooltip id="sideBarItemToolTip" />

      {/* Contact Info */}
      <div
        className="text-[12px] w-full p-2 flex items-center gap-1 text-white cursor-pointer absolute left-0 bottom-0 border-t border-[#ffffff25]"
        onClick={() => window.location.href = 'tel:7501295001'}
      >
        <Icons.CALL className="bg-[#003254] w-[25px] h-[25px] rounded-full p-1" />
        <span>Helpline:</span>
        <span>7501295001</span>
      </div>
    </aside>
  );
};

export default SideNav;
