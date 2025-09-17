import React, { useEffect, useState } from 'react';
import { FaUser } from "react-icons/fa";
import { CiSettings } from "react-icons/ci";
import { FiUser } from "react-icons/fi";
import { IoIosLogOut } from "react-icons/io";
import { Avatar, Popover, Whisper } from 'rsuite';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Cookies from 'js-cookie';
import { Icons } from '../../helper/icons'
import useGetUserData from '../../hooks/useGetUserData';


const Nav = ({ title }) => {
  const { getProfile, getSetting } = useGetUserData(); // Get user info api call
  const userDetails = useSelector((store) => store.userDetail); //get use details from store
  const settingDetails = useSelector((store) => store.settingSlice); //get use details from store

  useEffect(() => {
    getProfile();
    getSetting();
  }, [])

  useEffect(() => {
    if (settingDetails?.title) {
      document.title = settingDetails.title;
    }
  }, [settingDetails]);



  const logout = () => {
    Cookies.remove("token");
    Cookies.remove("userId");
    document.location.href = "/admin";
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
            <Whisper className='flex items-center' trigger={'click'} placement='bottomEnd' speaker={
              <Popover full className='w-[150px]'>
                <Link className='menu-link' to={"/admin/site"}>
                  <CiSettings size={"17px"} />
                  <span>Setting</span>
                </Link>
                <Link className='menu-link' to="/admin/profile">
                  <FiUser size={"16px"} />
                  <span>Profile</span>
                </Link>
                <Link className='menu-link' onClick={logout}>
                  <IoIosLogOut size={"16px"} />
                  <span>Logout</span>
                </Link>
              </Popover>}>
              <Avatar circle children={<FaUser />} size='sm' src={userDetails.profile_picture} className='border' />
              <div className='ml-2 text-gray-800 text-[13px] flex items-center gap-1'>
                {userDetails.name}
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

