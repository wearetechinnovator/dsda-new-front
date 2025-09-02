import { useEffect, useState } from 'react'
import { HiOutlineHome } from "react-icons/hi2";
import { PiComputerTowerThin } from "react-icons/pi";
import { IoSettingsOutline } from "react-icons/io5";
import { TbUsersGroup } from "react-icons/tb";
import { Link } from 'react-router-dom';
import { Tooltip } from 'react-tooltip';
import { useSelector } from 'react-redux';
import { FaEarthAmericas } from 'react-icons/fa6';
import { Icons } from '../helper/icons';



const SideNav = () => {
  const userData = useSelector((store) => store.userDetail)
  const [sideBar, setSideBar] = useState(true);
  const isSideBarOpen = localStorage.getItem("sideBarOpenStatus");
  const activePath = window.location.pathname;

  const [links, setLinks] = useState({
    "main": [
      {
        name: 'Dashboard',
        icon: <HiOutlineHome />,
        link: '/admin/dashboard',
        submenu: null
      },
      {
        name: 'Visit Hotel Portal',
        icon: <FaEarthAmericas />,
        link: '/admin/dashboard',
        submenu: null
      }
    ],
    "sales": [
      {
        name: 'Quotation / Estimate',
        icon: <PiComputerTowerThin />,
        link: '/admin/quotation-estimate',
        submenu: null
      },
      {
        name: 'Proforma Invoice',
        icon: <PiComputerTowerThin />,
        link: '/admin/proforma-invoice',
        submenu: null
      },
      {
        name: 'Sales Invoice',
        icon: <PiComputerTowerThin />,
        link: '/admin/sales-invoice',
        submenu: null
      },
      {
        name: 'Sales Return',
        icon: <PiComputerTowerThin />,
        link: '/admin/sales-return',
        submenu: null
      },
      {
        name: 'Payment In',
        icon: <PiComputerTowerThin />,
        link: '/admin/payment-in',
        submenu: null
      },
      {
        name: 'Credit Note',
        icon: <PiComputerTowerThin />,
        link: '/admin/credit-note',
        submenu: null
      },
      {
        name: 'Delivery Challan',
        icon: <PiComputerTowerThin />,
        link: '/admin/delivery-chalan',
        submenu: null
      },
    ],
    "Purshase": [
      {
        name: 'Purchase Order',
        icon: <PiComputerTowerThin />,
        link: '/admin/purchase-order',
        submenu: null
      },
      {
        name: 'Purchase Invoice',
        icon: <PiComputerTowerThin />,
        link: '/admin/purchase-invoice',
        submenu: null
      },
      {
        name: 'Purchase Return',
        icon: <PiComputerTowerThin />,
        link: '/admin/purchase-return',
        submenu: null
      },
      {
        name: 'Payment Out',
        icon: <PiComputerTowerThin />,
        link: '/admin/payment-out',
        submenu: null
      },
      {
        name: 'Debit Note',
        icon: <PiComputerTowerThin />,
        link: '/admin/debit-note',
        submenu: null
      },
    ],
    "Accounting": [
      {
        name: 'Accounts',
        icon: <PiComputerTowerThin />,
        link: '/admin/account',
        submenu: null
      },
      {
        name: 'Other Transactions',
        icon: <PiComputerTowerThin />,
        link: '/admin/other-transaction',
        submenu: null
      },
    ],
    "Setup": [
      {
        name: 'Site/Business Settings',
        icon: <IoSettingsOutline />,
        link: '/admin/dashboard',
        submenu: null
      },
      {
        name: 'User Management',
        icon: <TbUsersGroup />,
        link: '/admin/dashboard',
        submenu: null
      },
      {
        name: 'Unit',
        icon: <PiComputerTowerThin />,
        link: '/admin/unit',
        submenu: null
      },
      {
        name: 'Tax',
        icon: <PiComputerTowerThin />,
        link: '/admin/tax',
        submenu: null
      },
      {
        name: 'Items',
        icon: <PiComputerTowerThin />,
        link: null,
        submenu: [
          {
            name: 'Category',
            icon: <PiComputerTowerThin />,
            link: '/admin/item-category',
            submenu: null
          },
          {
            name: 'Items',
            icon: <PiComputerTowerThin />,
            link: '/admin/item',
            submenu: null
          },
        ]
      },
      {
        name: 'Party',
        icon: <PiComputerTowerThin />,
        link: '/admin/party',
        submenu: null
      },
    ]
  })
  const [openSubmenus, setOpenSubmenus] = useState([]);

  const toggleSubmenu = (name) => {
    setOpenSubmenus((pv) => {
      if (pv.includes(name)) {
        return pv.filter((item) => item !== name)
      } else {
        return [...pv, name]
      }
    })
  };



  return (
    <aside className='side__nav  min-w-[175px] h-[calc(100vh-50px)] bg-[#003e32] text-white' id='sideBar'>
      <div className="side__nav__logo flex justify-center items-center">
      </div>
      <div className="side__nav__links pb-3">
        <div className="side__nav__link__group">
          <ul>
            {links.main.map((link, index) => (
              <Link key={index} to={link.link} data-tooltip-id="sideBarItemToolTip">
                <li className={`flex items-center ${link.link === activePath ? 'active__link' : ''}`} >
                  <span className='mr-3'>{link.icon}</span>
                  <span>{link.name}</span>
                </li>
              </Link>
            ))}
          </ul>
        </div>
        <div className="side__nav__link__group">
          <h3 className='text-[16px] my-5'>Master</h3>
          <Link to={"/admin/user"} data-tooltip-id="sideBarItemToolTip">
            <li className={`flex items-center ${activePath.search("/admin/user") >= 0 ? 'active__link' : ''}`}>
              <span className='mr-3'><Icons.USER size={"13px"} /></span>
              <span>Admin User</span>
            </li>
          </Link>

          <li className={`flex flex-col w-full items-center 
            ${activePath.search("/admin/item") >= 0 ? 'active__link' : ''}`}>
            <div className='flex cursor-pointer w-full relative' onClick={() => {
              document.querySelector(".sidebar__sub__menu").classList.toggle('open__sidebar__sub__menu');
            }}>
              <span className='mr-3'><Icons.LOCATION /></span>
              <span>Location Master</span>
              <span className='absolute right-0'><Icons.DROPDOWN /></span>
            </div>

            <ul className='sidebar__sub__menu'>
              <li><Link to="/admin/district">District</Link></li>
              <li><Link to="/admin/block">Block</Link></li>
              <li><Link to="/admin/police-station">Police Station</Link></li>
              <li><Link to="/admin/zone">Zone</Link></li>
              <li><Link to="/admin/sector">Sector</Link></li>
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
          <h3 className='text-[16px] my-5'>Management</h3>
          <Link to={"/admin/item"} data-tooltip-id="sideBarItemToolTip">
            <li className={`flex items-center ${activePath.search("/admin/item") >= 0 ? 'active__link' : ''}`}>
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
          <h3 className='text-[16px] my-5'>MIS</h3>
          <Link to={"/admin/item"} data-tooltip-id="sideBarItemToolTip">
            <li className={`flex items-center ${activePath.search("/admin/item") >= 0 ? 'active__link' : ''}`}>
              <span className='mr-3'><Icons.HOTEL /></span>
              <span>Hotel List</span>
            </li>
          </Link>
            <li className={`flex items-center ${activePath.search("/admin/item") >= 0 ? 'active__link' : ''}`}>
              <span className='mr-3'><Icons.BED /></span>
              <span>Bed Availability</span>
            </li>
          <Link to={"/admin/item"} data-tooltip-id="sideBarItemToolTip">
            <li className={`flex items-center ${activePath.search("/admin/item") >= 0 ? 'active__link' : ''}`}>
              <span className='mr-3'><Icons.USERS /></span>
              <span>Tourist Data</span>
            </li>
          </Link>
          <Link to={"/admin/item"} data-tooltip-id="sideBarItemToolTip">
            <li className={`flex items-center ${activePath.search("/admin/item") >= 0 ? 'active__link' : ''}`}>
              <span className='mr-3'><Icons.RUPES /></span>
              <span>Amenities Charges</span>
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