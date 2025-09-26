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
  const navigate = useNavigate();
  const { getProfile, getSetting } = useGetUserData(); // Get user info api call
  const userDetails = useSelector((store) => store.userDetail); //get use details from store
  const settingDetails = useSelector((store) => store.settingSlice); //get use details from store
  const [dateTime, setDateTime] = useState("");

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

  useEffect(() => {
    function updateDateTime() {
      const now = new Date();

      // Day with suffix (1st, 2nd, 3rd, etc.)
      const day = now.getDate();
      const suffix =
        day % 10 === 1 && day !== 11
          ? "st"
          : day % 10 === 2 && day !== 12
            ? "nd"
            : day % 10 === 3 && day !== 13
              ? "rd"
              : "th";

      const month = now.toLocaleString("en-US", { month: "long" });
      const year = now.getFullYear();

      // Time with AM/PM
      const time = now.toLocaleString("en-US", {
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: true,
      });

      setDateTime(`${day}${suffix} ${month}, ${year} - ${time}`);
    }

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);

    return () => clearInterval(interval);
  }, []);


  return (
    <>
      <nav>
        <div className="logo__area">
          <img src={settingDetails.logo} alt="" width={120} className='shadow-lg' id='NavLogo' />
        </div>
        <div className='flex items-center h-[100%] justify-between w-[calc(100%-183px)]'>
          <h6 className='text-black ml-5'>{title}</h6>
          <div className="admin__area h-[100%] flex items-center cursor-pointer gap-3">
            <div className='navbar__tools'>
              <p className='nav__tool__time'>
                {dateTime}
              </p>
              <button className='nav__tool__back' onClick={() => navigate(-1)}>
                <Icons.BACK />
              </button>
              <button className='nav__tool__reset' onClick={() => window.location.reload()}>
                <Icons.RESET />
              </button>
            </div>
            <div className='nav__profile__area'>
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
                <div className='ml-2 text-[13px] flex items-center gap-1'>
                  {userDetails.name}
                  <Icons.DROPDOWN />
                </div>
              </Whisper>
            </div>
          </div>
        </div>
      </nav>
    </>
  )
}

export default Nav;

