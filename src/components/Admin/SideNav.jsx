import { HiOutlineHome } from "react-icons/hi2";
import { Link } from "react-router-dom";
import { Tooltip } from "react-tooltip";
import { Icons } from "../../helper/icons";

const SideNav = () => {
  const activePath = window.location.pathname;
  const isLocationActive = ["/district", "/block", "/sector", "/police-station", "/zone"]
    .some(end => activePath.endsWith(end));

  const isTouristActive = ["/footfall-hotel", "/footfall-hotel/today", "/footfall", "/tourist-details"]
    .some(end => activePath.endsWith(end));

  const isAmenityActive = ["/overall-date-wise", "/hotel-wise", "/hotel-wise/today", "/amenities-payment"]
    .some(end => activePath.endsWith(end));

  const toggleSubMenu = (clsName) => {
    document.querySelector(`.${clsName}`)?.classList.toggle("open__sidebar__sub__menu");
  };

  return (
    <aside className="side__nav mobile__menu min-w-[175px] h-[calc(100vh-50px)] text-white" id="sideBar">
      <div className="side__nav__logo flex justify-center items-center"></div>

      <ul className="side__nav__links pb-3">

        {/* Dashboard */}
        <li className={activePath.includes("/admin/dashboard") ? "active__link" : ""}>
          <Link to="/admin/dashboard" data-tooltip-id="sideBarItemToolTip">
            <div className={`flex items-center`}>
              <span className="mr-1"><HiOutlineHome /></span>
              <span>Dashboard</span>
            </div>
          </Link>
        </li>

        {/* Master Section */}
        <li className="submenu__list">
          <h3 className="menu__title">Master</h3>
          <ul>
            <li className={activePath.includes("/admin/user") ? "active__link" : ""}>
              <Link to="/admin/user" data-tooltip-id="sideBarItemToolTip">
                <div className={`flex items-center`}>
                  <span className="mr-1"><Icons.USER size="13px" /></span>
                  <span>Admin User</span>
                </div>
              </Link>
            </li>

            {/* Location Master */}
            <li className="drp__dwn__menu flex flex-col w-full items-center">
              <button
                className="flex cursor-pointer w-full relative"
                onClick={() => toggleSubMenu("sidebar__sub__menu__location")}
              >
                <span className="mr-1"><Icons.LOCATION /></span>
                <span>Location Master</span>
                <span className="absolute right-0"><Icons.DROPDOWN /></span>
              </button>
              <ul className={`sidebar__sub__menu sidebar__sub__menu__location ${isLocationActive ? "open__sidebar__sub__menu" : ""}`}>
                <li className={activePath.includes("/admin/district") ? "active__link" : ""}>
                  <Link to="/admin/district">District</Link>
                </li>
                <li className={activePath.includes("/admin/block") ? "active__link" : ""}>
                  <Link to="/admin/block">Block</Link>
                </li>
                <li className={activePath.includes("/admin/police-station") ? "active__link" : ""}>
                  <Link to="/admin/police-station">Police Station</Link>
                </li>
                <li className={activePath.includes("/admin/zone") ? "active__link" : ""}>
                  <Link to="/admin/zone">Zone</Link>
                </li>
                <li className={activePath.includes("/admin/sector") ? "active__link" : ""}>
                  <Link to="/admin/sector">Sector</Link>
                </li>
              </ul>
            </li>

            <li className={activePath.includes("/admin/room-type") ? "active__link" : ""}>
              <Link to="/admin/room-type" data-tooltip-id="sideBarItemToolTip">
                <div className={`flex items-center`}>
                  <span className="mr-1"><Icons.ROOM_TYPE_ICON /></span>
                  <span>Room Type</span>
                </div>
              </Link>
            </li>
             <li className={activePath.includes("/admin/hotel-category") ? "active__link" : ""}>
              <Link to="/admin/hotel-category" data-tooltip-id="sideBarItemToolTip">
                <div className={`flex items-center`}>
                  <span className="mr-1"><Icons.HOTEL_CATEGORY /></span>
                  <span>Hotel Category</span>
                </div>
              </Link>
            </li>


            <li className={(activePath.includes("/admin/hotel") && !activePath.includes("/admin/hotel-category")) ? "active__link" : ""}>
              <Link to="/admin/hotel" data-tooltip-id="sideBarItemToolTip">
                <div className={`flex items-center`}>
                  <span className="mr-1"><Icons.HOTEL /></span>
                  <span>Hotel Master</span>
                </div>
              </Link>
            </li>
          </ul>
        </li>

        {/* Management Section */}
        <li className="submenu__list">
          <h3 className="menu__title">Management</h3>
          <ul>
            <li className={activePath.includes("/admin/manage-hotel") ? "active__link" : ""}>
              <Link to="/admin/manage-hotel" data-tooltip-id="sideBarItemToolTip">
                <div className={`flex items-center`}>
                  <span className="mr-1"><Icons.HOTEL /></span>
                  <span>Manage Single Hotel</span>
                </div>
              </Link>
            </li>

            <li className={activePath.endsWith("/admin/amenities") ? "active__link" : ""}>
              <Link to="/admin/amenities" data-tooltip-id="sideBarItemToolTip">
                <div className={`flex items-center`}>
                  <span className="mr-1"><Icons.RUPES /></span>
                  <span>Payment Management</span>
                </div>
              </Link>
            </li>

            <li className={activePath.includes("/admin/notice") ? "active__link" : ""}>
              <Link to="/admin/notice" data-tooltip-id="sideBarItemToolTip">
                <div className={`flex items-center`}>
                  <span className="mr-1"><Icons.BELL /></span>
                  <span>Notice</span>
                </div>
              </Link>
            </li>
          </ul>
        </li>

        {/* MIS Section */}
        <li className="submenu__list">
          <h3 className="menu__title">REPORT</h3>
          <ul>
            <li className={`${activePath.includes("/admin/report/hotel-list") ? "active__link" : ""}`}>
              <Link to="/admin/report/hotel-list" data-tooltip-id="sideBarItemToolTip">
                <div className={`flex items-center`}>
                  <span className="mr-1"><Icons.HOTEL /></span>
                  <span>Hotel List</span>
                </div>
              </Link>
            </li>

            <li className={activePath.includes("/admin/report/bed-availablity") ? "active__link" : ""}>
              <Link to="/admin/report/bed-availablity" data-tooltip-id="sideBarItemToolTip">
                <div className={`flex items-center`}>
                  <span className="mr-1"><Icons.BED /></span>
                  <span>Bed Availability</span>
                </div>
              </Link>
            </li>

            {/* Tourist Data */}
            <li className="drp__dwn__menu flex flex-col w-full items-center">
              <button
                className="flex cursor-pointer w-full relative"
                onClick={() => toggleSubMenu("sidebar__sub__menu__tourist")}
              >
                <span className="mr-1"><Icons.USERS /></span>
                <span>Tourist Data</span>
                <span className="absolute right-0"><Icons.DROPDOWN /></span>
              </button>
              <ul className={`sidebar__sub__menu sidebar__sub__menu__tourist ${isTouristActive ? "open__sidebar__sub__menu" : "no"}`}>
                <li className={activePath.endsWith("/admin/report/tourist-data/footfall-hotel") ? "active__link" : ""}>
                  <Link to="/admin/report/tourist-data/footfall-hotel">Date Wise</Link>
                </li>
                <li className={activePath.endsWith("/admin/report/tourist-data/footfall-hotel/today") ? "active__link" : ""}>
                  <Link to="/admin/report/tourist-data/footfall-hotel/today">Today Hotel Wise</Link>
                </li>
                <li className={activePath.endsWith("/admin/report/tourist-data/footfall") ? "active__link" : ""}>
                  <Link to="/admin/report/tourist-data/footfall">Overall</Link>
                </li>
                <li className={activePath.endsWith("/admin/report/tourist-data/tourist-details") ? "active__link" : ""}>
                  <Link to="/admin/report/tourist-data/tourist-details">Tourist Details</Link>
                </li>
              </ul>
            </li>

            {/* Amenities Charges */}
            <li className="drp__dwn__menu flex flex-col w-full items-center">
              <button
                className="flex cursor-pointer w-full relative"
                onClick={() => toggleSubMenu("sidebar__sub__menu__amenities")}
              >
                <span className="mr-1"><Icons.RUPES /></span>
                <span>Amenities Charges</span>
                <span className="absolute right-0"><Icons.DROPDOWN /></span>
              </button>
              <ul className={`sidebar__sub__menu sidebar__sub__menu__amenities ${ isAmenityActive ? "open__sidebar__sub__menu" : ""}`}>
                <li className={activePath.includes("/admin/amenities-charges/overall-date-wise") ? "active__link" : ""}>
                  <Link to="/admin/amenities-charges/overall-date-wise">Overall Date Wise</Link>
                </li>
                <li className={activePath.endsWith("/admin/amenities-charges/hotel-wise") ? "active__link" : ""}>
                  <Link to="/admin/amenities-charges/hotel-wise">Total Till Today Hotel Wise</Link>
                </li>
                <li className={activePath.endsWith("/admin/amenities-charges/hotel-wise/today") ? "active__link" : ""}>
                  <Link to="/admin/amenities-charges/hotel-wise/today">Today Hotel Wise</Link>
                </li>
                <li className={activePath.includes("/admin/amenities-charges/amenities-payment") ? "active__link" : ""}>
                  <Link to="/admin/amenities-charges/amenities-payment">Paid & Due Hotel Wise</Link>
                </li>
              </ul>
            </li>

            <li className={activePath.includes("/admin/other-payment") ? "active__link" : ""}>
              <Link to="/admin/other-payment" data-tooltip-id="sideBarItemToolTip">
                <div className={`flex items-center`}>
                  <span className="mr-1"><Icons.RUPES /></span>
                  <span>Other Payments</span>
                </div>
              </Link>
            </li>
          </ul>
        </li>
      </ul>

      <Tooltip id="sideBarItemToolTip" />
    </aside>
  );
};

export default SideNav;
