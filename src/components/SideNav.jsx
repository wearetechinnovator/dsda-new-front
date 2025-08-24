import React, { useEffect, useState } from 'react'
import { HiOutlineHome } from "react-icons/hi2";
import { PiComputerTowerThin } from "react-icons/pi";
import { IoSettingsOutline } from "react-icons/io5";
import { TbUsersGroup } from "react-icons/tb";
import { MdKeyboardArrowDown } from "react-icons/md";
import { Link } from 'react-router-dom';
import { Tooltip } from 'react-tooltip';
import { Popover, Whisper } from 'rsuite';
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
          {/* <Link to={"/admin/party"} data-tooltip-id="sideBarItemToolTip">
            <li className={`flex items-center ${activePath.search("/admin/party") >= 0 ? 'active__link' : ''}`}>
              <span className='mr-3'><PiComputerTowerThin /></span>
              <span>Party</span>
            </li>
          </Link>
          <Link to={"/admin/item"} data-tooltip-id="sideBarItemToolTip">
            <li className={`flex items-center ${activePath.search("/admin/item") >= 0 ? 'active__link' : ''}`}>
              <span className='mr-3'><PiComputerTowerThin /></span>
              <span>Item</span>
            </li>
          </Link> */}
        </div>
        <div className="side__nav__link__group">
          <h3 className='text-[16px] my-5'>Master</h3>
          <Link to={"/admin/admin"} data-tooltip-id="sideBarItemToolTip">
            <li className={`flex items-center ${activePath.search("/admin/item") >= 0 ? 'active__link' : ''}`}>
              <span className='mr-3'><PiComputerTowerThin /></span>
              <span>Admin User</span>
            </li>
          </Link>
          <Link to={"/admin/item"} data-tooltip-id="sideBarItemToolTip">
            <li className={`flex items-center ${activePath.search("/admin/item") >= 0 ? 'active__link' : ''}`}>
              <span className='mr-3'><PiComputerTowerThin /></span>
              <span>Location Master</span>
            </li>
          </Link>
          <Link to={"/admin/hotel"} data-tooltip-id="sideBarItemToolTip">
            <li className={`flex items-center ${activePath.search("/admin/item") >= 0 ? 'active__link' : ''}`}>
              <span className='mr-3'><PiComputerTowerThin /></span>
              <span>Hotel Master</span>
            </li>
          </Link>
        </div>
        <div className="side__nav__link__group">
          <h3 className='text-[16px] my-5'>Management</h3>
          <Link to={"/admin/item"} data-tooltip-id="sideBarItemToolTip">
            <li className={`flex items-center ${activePath.search("/admin/item") >= 0 ? 'active__link' : ''}`}>
              <span className='mr-3'><PiComputerTowerThin /></span>
              <span>Manage Single Hotel</span>
            </li>
          </Link>
          <Link to={"/admin/amenities"} data-tooltip-id="sideBarItemToolTip">
            <li className={`flex items-center ${activePath.search("/admin/item") >= 0 ? 'active__link' : ''}`}>
              <span className='mr-3'><PiComputerTowerThin /></span>
              <span>Payment Managment</span>
            </li>
          </Link>
          <Link to={"/admin/item"} data-tooltip-id="sideBarItemToolTip">
            <li className={`flex items-center ${activePath.search("/admin/item") >= 0 ? 'active__link' : ''}`}>
              <span className='mr-3'><PiComputerTowerThin /></span>
              <span>Notice</span>
            </li>
          </Link>
        </div>
        <div className="side__nav__link__group">
          <h3 className='text-[16px] my-5'>MIS</h3>
          <Link to={"/admin/item"} data-tooltip-id="sideBarItemToolTip">
            <li className={`flex items-center ${activePath.search("/admin/item") >= 0 ? 'active__link' : ''}`}>
              <span className='mr-3'><PiComputerTowerThin /></span>
              <span>Hotel List</span>
            </li>
          </Link>
          <Link to={"/admin/item"} data-tooltip-id="sideBarItemToolTip">
            <li className={`flex items-center ${activePath.search("/admin/item") >= 0 ? 'active__link' : ''}`}>
              <span className='mr-3'><PiComputerTowerThin /></span>
              <span>Bed Availability</span>
            </li>
          </Link>
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

        <div className="side__nav__link__group">
          <h3 className='text-[16px] my-5'>Setup</h3>
          <ul>
            <Link to={"/admin/site"} data-tooltip-id="sideBarItemToolTip">
              <li className={`flex items-center ${activePath.search("/admin/site") >= 0 ? 'active__link' : ''}`}>
                <span className='mr-3'><IoSettingsOutline /></span>
                <span>Site/Business Settings</span>
              </li>
            </Link>
            <Whisper enterable trigger={'hover'} speaker={
              openSubmenus.includes('unit') ?
                <Popover className='p-0 w-[100px]'>
                  <ul>
                    <Link data-tooltip-id="sideBarItemToolTip">
                      <li className='flex items-center'>
                        <span className='mr-2 text-[15px]'><PiComputerTowerThin /></span>
                        <Link to={"/admin/role"} className='focus-within:no-underline text-blue-900 text-[13px]'>
                          Role
                        </Link>
                      </li>
                    </Link>
                    <Link data-tooltip-id="sideBarItemToolTip">
                      <li className='flex items-center'>
                        <span className='mr-2 text-[15px]'><PiComputerTowerThin /></span>
                        <Link to={"/admin/user"} className='focus-within:no-underline text-blue-900 text-[13px]'>
                          User
                        </Link>
                      </li>
                    </Link>
                  </ul>
                </Popover> : <div></div>
            }>
            <li onClick={() => toggleSubmenu('unit')} className='cursor-pointer'>
                <div className='flex items-center justify-between'>
                  <span> <TbUsersGroup /></span>
                  <span>User Management</span>
                  <span className={`transform transition-transform ${openSubmenus.includes('unit') ? 'rotate-180' : ''}`}>
                    <MdKeyboardArrowDown />
                  </span>
                </div>
                <ul className={`ml-2 ${openSubmenus.includes('unit') ? 'block' : 'hidden'} transform transition-transform sub-menu`} >
                  <Link data-tooltip-id="sideBarItemToolTip">
                    <li className='flex items-center'>
                      <span className='mr-3'><PiComputerTowerThin /></span>
                      <span>Role</span>
                    </li>
                  </Link>
                  <Link data-tooltip-id="sideBarItemToolTip">
                    <li className='flex items-center'>
                      <span className='mr-3'><PiComputerTowerThin /></span>
                      <span>User</span>
                    </li>
                  </Link>
                </ul>
              </li>
            </Whisper>
            <Link to={"/admin/unit"} data-tooltip-id="sideBarItemToolTip">
              <li className={`flex items-center ${activePath.search("/admin/unit") >= 0 ? 'active__link' : ''}`}>
                <span className='mr-3'><PiComputerTowerThin /></span>
                <span>Unit</span>
              </li>
            </Link>
            <Link to={"/admin/tax"} data-tooltip-id="sideBarItemToolTip">
              <li className={`flex items-center ${activePath.search("/admin/tax") >= 0 ? 'active__link' : ''}`}>
                <span className='mr-3'><PiComputerTowerThin /></span>
                <span>Tax</span>
              </li>
            </Link>
            <Link to={"/admin/item-category"} data-tooltip-id="sideBarItemToolTip">
              <li className={`flex items-center ${activePath.search("/admin/item-category") >= 0 ? 'active__link' : ''}`}>
                <span className='mr-3'><PiComputerTowerThin /></span>
                <span>Category</span>
              </li>
            </Link>

          </ul>
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