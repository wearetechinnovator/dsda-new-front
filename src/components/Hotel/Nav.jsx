import React, { useEffect, useState } from 'react';
import { FaUser } from "react-icons/fa";
import { FiUser } from "react-icons/fi";
import { IoIosLogOut } from "react-icons/io";
import { Avatar, Popover, Whisper } from 'rsuite';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Cookies from 'js-cookie';
import { Icons } from '../../helper/icons';
import useGetHotelData from '../../hooks/useGetHotelData';
import useGetUserData from '../../hooks/useGetUserData';


const Nav = ({ title }) => {
  const { getHotelData } = useGetHotelData();
  const { getSetting } = useGetUserData(); // Get user info api call
  const hotelDetails = useSelector((store) => store.hotelDetails);
  const settingDetails = useSelector((store) => store.settingSlice)

  useEffect(() => {
    getHotelData();
    getSetting();
  }, []);

  useEffect(() => {
    if (settingDetails?.title) {
      document.title = settingDetails.title;
    }
  }, [settingDetails]);


  const logout = () => {
    Cookies.remove("hotel-token");
    Cookies.remove("hotelId");
    document.location.href = "/";
  }


  return (
    <>
      <nav className='w-full text-white h-[50px] bg-white shadow-lg flex justify-between'>
        <div className="logo__area w-[175px]  h-[100%] bg-[#003628] px-3 flex justify-between items-center">
          <img src={settingDetails.logo} alt="" width={120} className='shadow-lg' id='NavLogo' />
          {/* <TbMenuDeep className='text-white text-xl cursor-pointer' onClick={toggleSideBar} /> */}
        </div>
        <div className='flex items-center justify-between w-[calc(100%-175px)]'>
          <h6 className='text-black ml-5'>{title}</h6>
          <div className="admin__area px-4 py-2 flex items-center cursor-pointer gap-3">
            <div className='ml-2 text-gray-800 text-[13px] flex items-center gap-1' onClick={() => {
              window.location.href = 'tel:7501295001';
            }}>
              <Icons.CALL />
              <span>Helpline: </span>
              <span>7501295001</span>
            </div>
            <Whisper className='flex items-center' trigger={'click'} placement='bottomEnd' speaker={
              <Popover full className='w-[150px]'>
                <Link className='menu-link' to="/hotel/profile">
                  <FiUser size={"16px"} />
                  <span>Profile</span>
                </Link>
                <Link className='menu-link' onClick={logout}>
                  <IoIosLogOut size={"16px"} />
                  <span>Logout</span>
                </Link>
              </Popover>}>
              <Avatar circle
                children={<FaUser />} size='sm'
                className='border'
              />
              <div className='ml-2 text-gray-800 text-[13px] flex items-center gap-1'>
                {hotelDetails?.hotel_name}
                <Icons.DROPDOWN />
              </div>
            </Whisper>
          </div>
        </div>
      </nav>
    </>
  )
}

export default Nav;

