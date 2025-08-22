import React, { useState } from 'react'
import Nav from '../components/Nav'
import SideNav from '../components/SideNav';
// import MyBreadCrumb from '../components/BreadCrumb';
import { PiPrinterFill } from "react-icons/pi";
import { FaCopy } from "react-icons/fa";
import { FaFilePdf } from "react-icons/fa";
import { FaFileExcel } from "react-icons/fa";
import { LuArrowUpDown } from "react-icons/lu";
import { Pagination } from 'rsuite';
import { MdEditSquare } from "react-icons/md";
import { IoInformationCircle } from "react-icons/io5";


document.title = 'Dashboard';

const Dashboard = () => {
  const [accountpaginationPage, setAccountpaginationPage] = useState(1);
  const [recentsalepagination, setRecentsalepagination] = useState(1);
  const [recentpurchasepagination, setRecentpurchasepagination] = useState(1);
  const [stockalertpagination, setStockalertpagination] = useState(1);


  return (
    <>
      <Nav title={"Dashboard"} />
      <main id='main'>
        <SideNav />
        <div className='content__body'>

        </div>
      </main>
    </>
  )
}

export default Dashboard