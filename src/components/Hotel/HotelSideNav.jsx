import { HiOutlineHome } from "react-icons/hi2";
import { Link } from 'react-router-dom';
import { Tooltip } from 'react-tooltip';
import { Icons } from '../../helper/icons';



const SideNav = () => {
  const activePath = window.location.pathname;

  return (
    <aside className='side__nav relative min-w-[175px] h-[calc(100vh-50px)] bg-[#003e32] text-white' id='sideBar'>
      <div className="side__nav__logo flex justify-center items-center">
      </div>
      <div className="side__nav__links pb-3">
        <div className="side__nav__link__group">
          <ul>
            {/* <Link to="/hotel/dashboard" data-tooltip-id="sideBarItemToolTip">
              <li className={`flex items-center ${"/hotel/dashboard" === activePath ? 'active__link' : ''}`} >
                <span className='mr-3'><HiOutlineHome /></span>
                <span>Dashboard</span>
              </li>
            </Link> */}
            <Link to="/hotel/dashboard" data-tooltip-id="sideBarItemToolTip">
              <li className={`flex items-center ${"/hotel/dashboard" === activePath ? 'active__link' : ''}`} >
                <span className='mr-3'><HiOutlineHome /></span>
                <span>Dashboard</span>
              </li>
            </Link>
          </ul>
        </div>
        <div className="side__nav__link__group">
          <h3 className='text-[16px] my-5'>Management</h3>
          <Link to={"/hotel/check-in"} data-tooltip-id="sideBarItemToolTip">
            <li className={`flex items-center ${activePath.search("/hotel/check-in") >= 0 ? 'active__link' : ''}`}>
              <span className='mr-3'><Icons.USER size={"13px"} /></span>
              <span>Check In</span>
            </li>
          </Link>
          <Link to={"/hotel/check-out"} data-tooltip-id="sideBarItemToolTip">
            <li className={`flex items-center ${activePath.search("/hotel/check-out") >= 0 ? 'active__link' : ''}`}>
              <span className='mr-3'><Icons.USER size={"13px"} /></span>
              <span>Check Out</span>
            </li>
          </Link>
          <Link to={"/hotel/tourist-data"} data-tooltip-id="sideBarItemToolTip">
            <li className={`flex items-center ${activePath.search("/hotel/tourist-data") >= 0 ? 'active__link' : ''}`}>
              <span className='mr-3'><Icons.USERS /></span>
              <span>MIS Tourist Data</span>
            </li>
          </Link>
          <Link to={"/hotel/amenities"} data-tooltip-id="sideBarItemToolTip">
            <li className={`flex items-center ${activePath.search("/hotel/amenities") >= 0 ? 'active__link' : ''}`}>
              <span className='mr-3'><Icons.RUPES /></span>
              <span>Amenities</span>
            </li>
          </Link>
          <Link to={"/hotel/payments"} data-tooltip-id="sideBarItemToolTip">
            <li className={`flex items-center ${activePath.search("/hotel/payments") >= 0 ? 'active__link' : ''}`}>
              <span className='mr-3'><Icons.RUPES /></span>
              <span>Payments</span>
            </li>
          </Link>
          <Link to={"/hotel/other-payments"} data-tooltip-id="sideBarItemToolTip">
            <li className={`flex items-center ${activePath.search("/hotel/other-payments") >= 0 ? 'active__link' : ''}`}>
              <span className='mr-3'><Icons.RUPES /></span>
              <span>Other Payments</span>
            </li>
          </Link>
        </div>
      </div>
      <Tooltip id='sideBarItemToolTip' />

      {/* :::::::::::::::::::::::: Contact Information ::::::::::::::::::: */}
      {/* :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: */}

      <div className='text-[12px] w-full p-2 flex items-center gap-1 text-white cursor-pointer absolute left-0 bottom-0 border-t border-[#ffffff25]'
        onClick={() => {
          window.location.href = 'tel:7501295001';
        }}>
        <Icons.CALL
          className='bg-[#003254] w-[25px] h-[25px] rounded-full p-1'
        />
        <span>Helpline: </span>
        <span>7501295001</span>
      </div>
    </aside>
  );
}

export default SideNav