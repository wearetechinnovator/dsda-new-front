import { useState } from 'react'
import { HiOutlineHome } from "react-icons/hi2";
import { Link } from 'react-router-dom';
import { Tooltip } from 'react-tooltip';
import { FaEarthAmericas } from 'react-icons/fa6';
import { Icons } from '../../helper/icons';



const SideNav = () => {
  const activePath = window.location.pathname;

  return (
    <aside className='side__nav  min-w-[175px] h-[calc(100vh-50px)] text-white' id='sideBar'>
      <div className="side__nav__logo flex justify-center items-center">
      </div>
      <div className="side__nav__links pb-3">
        <div className="side__nav__link__group">
          <ul>
            <Link to="/admin/dashboard" data-tooltip-id="sideBarItemToolTip">
              <li className={`flex items-center ${"/admin/dashboard" === activePath ? 'active__link' : ''}`} >
                <span className='mr-3'><HiOutlineHome /></span>
                <span>Dashboard</span>
              </li>
            </Link>
          </ul>
        </div>
        <div className="side__nav__link__group">
          <h3 className='menu__title'>Master</h3>
          <Link to={"/admin/user"} data-tooltip-id="sideBarItemToolTip">
            <li className={`flex items-center ${activePath.search("/admin/user") >= 0 ? 'active__link' : ''}`}>
              <span className='mr-3'><Icons.USER size={"13px"} /></span>
              <span>Admin User</span>
            </li>
          </Link>

          <li className={`drp__dwn__menu flex flex-col w-full items-center 
            ${activePath.search("/admin/item") >= 0 ? 'active__link' : ''}`}>
            <div className=' flex cursor-pointer w-full relative' onClick={() => {
              document.querySelector(".sidebar__sub__menu").classList.toggle('open__sidebar__sub__menu');
            }}>
              <span className='mr-3'><Icons.LOCATION /></span>
              <span>Location Master</span>
              <span className='absolute right-0'><Icons.DROPDOWN /></span>
            </div>

            <ul className='sidebar__sub__menu'>
              <li className={`${activePath.search("/admin/district") >= 0 ? 'active__link' : ''}`}><Link to="/admin/district">District</Link></li>
              <li className={`${activePath.search("/admin/block") >= 0 ? 'active__link' : ''}`}><Link to="/admin/block">Block</Link></li>
              <li className={`${activePath.search("/admin/police-station") >= 0 ? 'active__link' : ''}`}><Link to="/admin/police-station">Police Station</Link></li>
              <li className={`${activePath.search("/admin/zone") >= 0 ? 'active__link' : ''}`}><Link to="/admin/zone">Zone</Link></li>
              <li className={`${activePath.search("/admin/sector") >= 0 ? 'active__link' : ''}`}><Link to="/admin/sector">Sector</Link></li>
            </ul>
          </li>

          <Link to={"/admin/hotel"} data-tooltip-id="sideBarItemToolTip">
            <li className={`flex items-center ${activePath.search("/admin/hotel") >= 0 ? 'active__link' : ''}`}>
              <span className='mr-3'><Icons.HOTEL /></span>
              <span>Hotel Master</span>
            </li>
          </Link>
        </div>
        <div className="side__nav__link__group">
          <h3 className='menu__title'>Management</h3>
          <Link to={"/admin/manage-hotel"} data-tooltip-id="sideBarItemToolTip">
            <li className={`flex items-center ${activePath.search("/admin/manage-hotel") >= 0 ? 'active__link' : ''}`}>
              <span className='mr-3'><Icons.HOTEL /></span>
              <span>Manage Single Hotel</span>
            </li>
          </Link>
          <Link to={"/admin/amenities"} data-tooltip-id="sideBarItemToolTip">
            <li className={`flex items-center ${activePath.search("/admin/amenities") >= 0 ? 'active__link' : ''}`}>
              <span className='mr-3'><Icons.RUPES /></span>
              <span>Payment Managment</span>
            </li>
          </Link>
          <Link to={"/admin/notice"} data-tooltip-id="sideBarItemToolTip">
            <li className={`flex items-center ${activePath.search("/admin/notice") >= 0 ? 'active__link' : ''}`}>
              <span className='mr-3'><Icons.BELL /></span>
              <span>Notice</span>
            </li>
          </Link>
        </div>
        <div className="side__nav__link__group">
          <h3 className='menu__title'>MIS</h3>
          <Link to={"/admin/report/hotel-list"} data-tooltip-id="sideBarItemToolTip">
            <li className={`flex items-center ${activePath.search("/admin/report/hotel-list") >= 0 ? 'active__link' : ''}`}>
              <span className='mr-3'><Icons.HOTEL /></span>
              <span>Hotel List</span>
            </li>
          </Link>

          {/* <li className={`drp__dwn__menu flex flex-col w-full items-center  ${activePath.search("/admin/bed") >= 0 ? 'active__link' : ''}`}>
            <div className='flex cursor-pointer w-full relative'
              onClick={() => {
                document.querySelector(".sidebar__sub__menu__bed")
                  .classList.toggle('open__sidebar__sub__menu');
              }}>
              <span className='mr-3'><Icons.BED /></span>
              <span>Bed Availability</span>
              <span className='absolute right-0'><Icons.DROPDOWN /></span>
            </div>

            <ul className='sidebar__sub__menu sidebar__sub__menu__bed'>
              <li><Link to="/admin/report/bed-availablity">Total</Link></li>
              <li><Link to="/admin/report/bed-availablity">Occupied</Link></li>
              <li><Link to="/admin/report/bed-availablity">Vacant</Link></li>
              <li><Link to="/admin/report/bed-availablity">Extra Occupancy</Link></li>
            </ul>
          </li> */}
          <Link to={"/admin/report/bed-availablity"} data-tooltip-id="sideBarItemToolTip">
            <li className={`flex  items-center  ${activePath.search("/admin/bed") >= 0 ? 'active__link' : ''}`}>
              <span className='mr-3'><Icons.BED /></span>
              <span>Bed Availability</span>
              <span className='absolute right-0'><Icons.DROPDOWN /></span>
            </li>
          </Link>

          <li className={`drp__dwn__menu flex flex-col w-full items-center 
            ${activePath.search("/admin/tourist") >= 0 ? 'active__link' : ''}`}>
            <div className='flex cursor-pointer w-full relative'
              onClick={() => {
                document.querySelector(".sidebar__sub__menu__tourist")
                  .classList.toggle('open__sidebar__sub__menu');
              }}>
              <span className='mr-3'><Icons.USERS /></span>
              <span>Tourist Data</span>
              <span className='absolute right-0'><Icons.DROPDOWN /></span>
            </div>

            <ul className='sidebar__sub__menu sidebar__sub__menu__tourist'>
              <li><Link to="/admin/report/tourist-data/footfall-hotel">Date Wise</Link></li>
              <li><Link to="/admin/report/tourist-data/footfall-hotel/today">Today Hotel Wise</Link></li>
              <li><Link to="/admin/report/tourist-data/footfall">Overall</Link></li>
              <li><Link to="/admin/report/tourist-data/bed/extra-occupied">Extra Occupancy</Link></li>
            </ul>
          </li>

          <li className={`drp__dwn__menu flex flex-col w-full items-center 
            ${activePath.search("/admin/amenities-charges") >= 0 ? 'active__link' : ''}`}>

            <div className='flex cursor-pointer w-full relative'
              onClick={() => {
                document.querySelector(".sidebar__sub__menu__amenities")
                  .classList.toggle('open__sidebar__sub__menu');
              }}>
              <span className='mr-3'><Icons.RUPES /></span>
              <span>Amenities Charges</span>
              <span className='absolute right-0'><Icons.DROPDOWN /></span>
            </div>

            <ul className='sidebar__sub__menu sidebar__sub__menu__amenities'>
              <li><Link to="/admin/amenities-charges/overall-date-wise">Overall Date Wise</Link></li>
              <li><Link to="/admin/amenities-charges/total-till-today-hotel-wise">Total Till Today Hotel Wise</Link></li>
              <li><Link to="/admin/amenities-charges/today-hotel-wise">Today Hotel Wise</Link></li>
              <li><Link to="/admin/amenities-charges/paid-due-hotel-wise">Paid & Due Hotel Wise</Link></li>
            </ul>
          </li>
          <Link to={"/admin/other-payments"} data-tooltip-id="sideBarItemToolTip">
            <li className={`flex items-center ${activePath.search("/admin/other-payments") >= 0 ? 'active__link' : ''}`}>
              <span className='mr-3'><Icons.RUPES /></span>
              <span>Other Payments</span>
            </li>
          </Link>
        </div>
      </div>
      <Tooltip id='sideBarItemToolTip' />
      {/* <div
        onClick={toggleSideBar}
        className='cursor-pointer flex justify-center items-center p-2 text-center bg-[#003628] w-full sticky bottom-0 text-xl'>
        <IoIosArrowForward
          className='transition-all'
          id='toggler' />
      </div> */}
    </aside>
  );
}

export default SideNav