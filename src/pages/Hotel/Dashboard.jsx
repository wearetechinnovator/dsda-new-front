import Nav from '../../components/Hotel/Nav'
import SideNav from '../../components/Hotel/HotelSideNav';
import { FaCheckToSlot } from "react-icons/fa6";
import { BsBuildings } from "react-icons/bs";
import { FaBed } from "react-icons/fa";
import { HiUserAdd } from "react-icons/hi";
import { LuArrowRightFromLine } from "react-icons/lu";
import { FaUsers } from "react-icons/fa6";
import { FaRupeeSign } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { useMemo } from 'react';
import useSearchTable from '../../hooks/useSearchTable';
import useExportTable from '../../hooks/useExportTable';
import downloadPdf from '../../helper/downloadPdf';
import { Modal, Popover, Whisper } from 'rsuite';
import { Icons } from '../../helper/icons';
import Pagination from '../../components/Admin/Pagination';
import Cookies from 'js-cookie';
import downloadBase64 from '../../helper/downloadBase64'
import { useSelector } from 'react-redux';
import useMyToaster from '../../hooks/useMyToaster';
import useSetTableFilter from '../../hooks/useSetTableFilter';
import NoData from '../../components/Admin/NoData';
import CardLoading from '../../components/Admin/CardLoader';




const Dashboard = () => {
    const toast = useMyToaster();
    const { copyTable, downloadExcel, printTable, exportPdf } = useExportTable();
    const hotelDetails = useSelector((store) => store.hotelDetails);
    const { getFilterState, setFilterState } = useSetTableFilter();
    const savedFilter = getFilterState("dashboard");
    const [activePage, setActivePage] = useState(savedFilter?.activePage || 1);
    const [dataLimit, setDataLimit] = useState(savedFilter?.limit || 10);
    const [totalData, setTotalData] = useState();
    const navigate = useNavigate();
    const [bookingHeadList, setBookingHeadList] = useState([]);
    const tableRef = useRef(null);
    const exportData = useMemo(() => {
        return bookingHeadList && bookingHeadList?.map((b, _) => ({
            'Guest Details': b.booking_details_guest_name,
            'Check In Date & Time': b.booking_details_checkin_date_time,
            'ID Card': b.booking_details_guest_id_type,
            'Mobile': b.booking_details_guest_phone,
            "Room No.": b.booking_details_room_no
        }));
    }, [bookingHeadList]);
    const [loading, setLoading] = useState(true);
    const searchTable = useSearchTable();
    const [recentNotice, setRecentNotice] = useState([]);
    const hotelId = Cookies.get('hotelId');
    const token = Cookies.get('hotel-token');
    const [modalData, setModalData] = useState({ isOpen: false })
    const [staticticData, setStaticticsData] = useState(null);
    const [quickSearchFields, setQuickSearchFields] = useState({
        roomNo: '', mobileNo: '', fromDate: '', toDate: ''
    })
    const [isOpenNotificationModal, setIsOpenNotificationModal] = useState(false);


    // Get all Head List
    useEffect(() => {
        (async () => {
            try {
                const data = {
                    token: token,
                    page: activePage,
                    limit: dataLimit,
                    head: true, // Get head guest,
                    room: quickSearchFields.roomNo,
                    mobile: quickSearchFields.mobileNo,
                    hotelId: Cookies.get("hotelId")
                }
                setFilterState("dashboard", dataLimit, activePage);

                const url = process.env.REACT_APP_BOOKING_API + `/check-in/get-booking`;
                const req = await fetch(url, {
                    method: "POST",
                    headers: {
                        "Content-Type": 'application/json'
                    },
                    body: JSON.stringify(data)
                });
                const res = await req.json();

                setTotalData(res.total)
                setBookingHeadList([...res.data])
                setLoading(false);

            } catch (error) {
                toast("Something went wrong", "error")
                 
            }
        })()

    }, [dataLimit, activePage, quickSearchFields])


    // Get Notice
    useEffect(() => {
        (async () => {
            const url = process.env.REACT_APP_MASTER_API + "/notice/get-hotel-notice";

            const req = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": 'application/json',
                },
                body: JSON.stringify({ hotelId, hotelToken: token })
            })
            const res = await req.json();
            if (req.status === 200) setRecentNotice([...res]);
        })()
    }, [])


    // Get Statictics Data;
    useEffect(() => {
        (async () => {
            const url = process.env.REACT_APP_BOOKING_API + "/check-in/get-stats";
            const hotelId = Cookies.get('hotelId');

            const req = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": 'application/json'
                },
                body: JSON.stringify({ hotelId, token: token })
            })
            const res = await req.json();
            if (req.status === 200) setStaticticsData(res);
        })()
    }, [])


    // Notification Modal
    useEffect(() => {
        setIsOpenNotificationModal(true)
    }, [])


    // Print slip
    const printSlip = async (id) => {
        const Url = process.env.REACT_APP_BOOKING_API + "/check-out/get-booking-head";
        const req = await fetch(Url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id: id }),
        })
        const res = await req.json();

        navigate("/hotel/check-in/guest-entry/bill-details/print", {
            state: {
                id: res._id,
                hotelName: hotelDetails?.hotel_name,
                headGuest: res.booking_head_guest_name,
                checkIn: res.booking_checkin_date_time,
                guests: res.booking_number_of_guest,
                totalAmount: res.booking_bill_amount,
            }
        })
    }


    const exportTable = async (whichType) => {
        if (whichType === "copy") {
            copyTable("table"); // Pass tableid
        }
        else if (whichType === "excel") {
            downloadExcel(exportData, 'guest-list.xlsx') // Pass data and filename
        }
        else if (whichType === "print") {
            printTable(tableRef, "Guest List"); // Pass table ref and title
        }
        else if (whichType === "pdf") {
            let document = exportPdf('Guest List', exportData);
            downloadPdf(document)
        }
    }


    const isCheckoutExpired = (checkoutDateTime) => {
        const now = new Date();
        const checkout = new Date(checkoutDateTime);
        return checkout < now; // true → expired
    };

    return (
        <>
            <Nav title={"Dashboard"} />
            <main id='main'>
                <SideNav />
                <div className='content__body'>

                    {/* Cards  */}
                    <div className='flex flex-col md:flex-row gap-5'>
                        <div className='flex flex-col gap-4 min-w-[200px]'>
                            <div
                                onClick={() => navigate("/hotel/check-in")}
                                className='dashboard__cards checkin__card'>
                                <div className='flex flex-col justify-center items-center'>
                                    <FaCheckToSlot className='center__icon' />
                                    <p>CHECK IN</p>
                                </div>
                            </div>
                            <div
                                onClick={() => navigate("/hotel/check-out")}
                                className='dashboard__cards checkout__card'>
                                <div className='flex flex-col justify-center items-center'>
                                    <LuArrowRightFromLine className='center__icon' />
                                    <p>CHECK OUT</p>
                                </div>
                            </div>
                        </div>
                        <div className='w-full px-[25px]'>
                            <div className="total__data_cards">
                                <div className='total__card blue__grad' onClick={() => navigate('/hotel/profile/#roomAndBedCapacity')}>
                                    <div className='total__card__data'>
                                        <p>{hotelDetails?.hotel_total_room ?? <CardLoading />}</p>
                                        <p>Total Rooms</p>
                                    </div>
                                    <BsBuildings className='card__icon' />
                                </div>
                                <div className='total__card green__grad' onClick={() => navigate('/hotel/profile/#roomAndBedCapacity')}>
                                    <div className='total__card__data'>
                                        <p>{hotelDetails?.hotel_total_bed ?? <CardLoading />}</p>
                                        <p>Total Beds</p>
                                    </div>
                                    <FaBed className='card__icon' />
                                </div>
                                <div className='total__card green__grad' onClick={() => navigate("/hotel/check-out")}>
                                    <div className='total__card__data'>
                                        <p>{staticticData?.occupied ?? <CardLoading />}</p>
                                        <p>Occupied Beds</p>
                                    </div>
                                    <FaBed className='card__icon' />
                                </div>
                                <div className='total__card green__grad'>
                                    <div className='total__card__data'>
                                        <p>
                                            {
                                                (parseInt(hotelDetails?.hotel_total_bed) - parseInt(staticticData?.occupied)) > 1 ?
                                                    parseInt(hotelDetails?.hotel_total_bed) - parseInt(staticticData?.occupied) :
                                                    0
                                            }
                                        </p>
                                        <p>Vacant Beds</p>
                                    </div>
                                    <FaBed className='card__icon' />
                                </div>
                                <div className='total__card red__grad'>
                                    <div className='total__card__data'>
                                        <p>
                                            {
                                                (parseInt(hotelDetails?.hotel_total_bed) - parseInt(staticticData?.occupied)) < 1 ?
                                                    (parseInt(staticticData?.occupied) - parseInt(hotelDetails?.hotel_total_bed)) :
                                                    0
                                            }
                                        </p>
                                        <p>Extra Occupancy</p>
                                    </div>
                                    <HiUserAdd className='card__icon' />
                                </div>
                            </div>

                            <div className="total__data_cards__bottom">
                                <div className='total__card purple__grad'>
                                    <div className='total__card__data'>
                                        <p>{staticticData?.todayFootFall ?? <CardLoading />}</p>
                                        <p>Today Footfals</p>
                                    </div>
                                    <FaUsers className='card__icon' />
                                </div>
                                <div className='total__card purple__grad'>
                                    <div className='total__card__data'>
                                        <p>{staticticData?.totalFootFall ?? <CardLoading />}</p>
                                        <p>Total Footfals</p>
                                    </div>
                                    <FaUsers className='card__icon' />
                                </div>
                                <div className='total__card yellow__grad'>
                                    <div className='total__card__data'>
                                        <p>{staticticData?.todayAminity ?? <CardLoading />}</p>
                                        <p>Today Aminity Charges</p>
                                    </div>
                                    <FaRupeeSign className='card__icon' />
                                </div>
                                <div className='total__card yellow__grad'>
                                    <div className='total__card__data'>
                                        <p>{staticticData?.totalAminity ?? <CardLoading />}</p>
                                        <p>Total Aminity Charges</p>
                                    </div>
                                    <FaRupeeSign className='card__icon' />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ============================================================== */}
                    {/* Current Stay In Guest List */}
                    {/* ============================================================== */}

                    <div className='content__body__main mt-8'>
                        <div className='w-full flex gap-3 items-center pb-2 border-b'>
                            <Icons.USERS className='text-xl' />
                            <p className='font-semibold text-md uppercase'>Current Stay In Guest List</p>
                        </div>
                        {/* Option Bar */}
                        <div className="add_new_compnent">
                            <div className='flex justify-between items-center'>
                                <div className='flex flex-col'>
                                    <select value={dataLimit} onChange={(e) => setDataLimit(e.target.value)}>
                                        <option value={5}>5</option>
                                        <option value={10}>10</option>
                                        <option value={50}>50</option>
                                        <option value={100}>100</option>
                                        <option value={500}>500</option>
                                        <option value={1000}>1000</option>
                                        <option value={5000}>5000</option>
                                        <option value={10000}>10000</option>
                                        <option value={50000}>50000</option>
                                        <option value={totalData}>All</option>
                                    </select>
                                </div>
                                <div className='flex items-center gap-2'>
                                    <div className='flex w-full flex-col lg:w-[300px]'>
                                        <input type='text'
                                            placeholder='Search...'
                                            onChange={searchTable}
                                            className='p-[6px]'
                                        />
                                    </div>
                                    <div className='flex justify-end'>
                                        <Whisper placement='leftStart' enterable
                                            speaker={<Popover full>
                                                <div className='download__menu' onClick={() => exportTable('print')} >
                                                    <Icons.PRINTER className='text-[16px]' />
                                                    Print Table
                                                </div>
                                                <div className='download__menu' onClick={() => exportTable('copy')}>
                                                    <Icons.COPY className='text-[16px]' />
                                                    Copy Table
                                                </div>
                                                <div className='download__menu' onClick={() => exportTable('pdf')}>
                                                    <Icons.PDF className="text-[16px]" />
                                                    Download Pdf
                                                </div>
                                                <div className='download__menu' onClick={() => exportTable('excel')} >
                                                    <Icons.EXCEL className='text-[16px]' />
                                                    Download Excel
                                                </div>
                                            </Popover>}
                                        >
                                            <div className='record__download' >
                                                <Icons.MORE />
                                            </div>
                                        </Whisper>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Table start */}
                        <div className='overflow-x-auto list__table list__table__checkin'>
                            <table className='min-w-full bg-white' id='table' ref={tableRef}>
                                <thead className='bg-gray-100 list__table__head'>
                                    <tr>
                                        <td className='w-[5%]'>SL No.</td>
                                        <td className='w-[*]'>Head Guest Details</td>
                                        <td className='w-[12%]'>Check In Date & Time</td>
                                        <td className='w-[10%]'>ID Card</td>
                                        <td className='w-[6%]'>Mobile</td>
                                        <td className='w-[7%]'>Room No.</td>
                                        <td className='w-[3%]' align='center'>Action</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        bookingHeadList.map((d, i) => {
                                            return <tr key={i} className='cursor-pointer hover:bg-gray-100'>
                                                <td align='center'>{(activePage - 1) * dataLimit + i + 1}</td>
                                                <td className='px-4 border-b'>{d.booking_details_guest_name}</td>
                                                <td>{d.booking_details_checkin_date_time}</td>
                                                <td>{d.booking_details_guest_id_type}</td>
                                                <td>{d.booking_details_guest_phone}</td>
                                                <td>{d.booking_details_room_no}</td>
                                                <td className='px-4 text-center'>
                                                    <div className='flex items-center gap-2'>
                                                        <button className='notice__view__btn' onClick={() => printSlip(d.booking_details_booking_id)}>
                                                            <Icons.PRINTER />
                                                            Print
                                                        </button>
                                                        <button className={`notice__view__btn ${isCheckoutExpired(d.booking_details_checkout_date_time) ? "opacity-50 cursor-not-allowed" : ""}`} onClick={() => {
                                                            if (isCheckoutExpired(d.booking_details_checkout_date_time)) return;
                                                            navigate("/hotel/check-out/details", {
                                                                state: { bookingId: d.booking_details_booking_id }
                                                            })
                                                        }}>
                                                            <Icons.CHECK2 />
                                                            Checkout
                                                        </button>
                                                    </div>
                                                </td>

                                            </tr>
                                        })
                                    }
                                </tbody>
                            </table>
                            {bookingHeadList.length < 1 && <NoData />}
                            {bookingHeadList.length > 0 && <div className='paginate__parent'>
                                <p>Showing {bookingHeadList.length} of {totalData} entries</p>
                                <Pagination
                                    activePage={activePage}
                                    setActivePage={setActivePage}
                                    totalData={totalData}
                                    dataLimit={dataLimit}
                                />
                            </div>}
                        </div>
                    </div>


                    {/* ============================================================== */}
                    {/* RECENT NOTICE */}
                    {/* =============================================================== */}

                    {<div className='content__body__main mt-6'>
                        <div className='w-full flex gap-3 items-center mb-3 pb-2 border-b'>
                            <Icons.NOTICE className='text-xl' />
                            <p className='font-semibold text-md uppercase'>Recent Notice</p>
                        </div>
                        {/* Table start */}
                        <div className='overflow-x-auto list__table list__table__checkin'>
                            <table className='min-w-full bg-white' id='itemTable' ref={tableRef}>
                                <thead className='bg-gray-100 list__table__head'>
                                    <tr>
                                        <td align='center' className='w-[5%]'>SL No.</td>
                                        <td className='w-[8%]'>Date</td>
                                        <td align='left' className='w-[*]'>Title</td>
                                        <td className='w-[8%]'>Status</td>
                                        <td align='center' className='w-[11%]'>Action</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        recentNotice?.map((d, i) => {
                                            return <tr key={i} className='cursor-pointer hover:bg-gray-100'>
                                                <td align='center'>{(activePage - 1) * dataLimit + i + 1}</td>
                                                <td>{new Date(d?.notice_date).toLocaleDateString()}</td>
                                                <td>{d.notice_title}</td>
                                                <td>
                                                    <span className='chip__green'>
                                                        {d.notice_status === "1" ? "New" : "Expired"}
                                                    </span>
                                                </td>
                                                <td align='center'>
                                                    <button className='notice__view__btn' onClick={() => {
                                                        setModalData({
                                                            isOpen: true,
                                                            ...d
                                                        })
                                                    }}>
                                                        <Icons.EYE />
                                                        View Details
                                                    </button>
                                                </td>
                                            </tr>
                                        })
                                    }
                                    {
                                        recentNotice.length < 1 && (
                                            <tr>
                                                <td colSpan={5} align='center' >
                                                    No Notice Available
                                                </td>
                                            </tr>
                                        )
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>}
                </div>
            </main>
            <Modal open={modalData.isOpen} onClose={() => setModalData({
                ...modalData,
                isOpen: false,
            })}>
                <Modal.Header className='border-b pb-2'>
                    <p className='font-semibold flex gap-1 items-center'>
                        <Icons.NOTICE />
                        Notice Details
                    </p>
                </Modal.Header>
                <Modal.Body>
                    <p className='font-semibold mb-4'>{modalData.notice_title}</p>
                    <p className='text-xs'>{modalData.notice_details}</p>
                </Modal.Body>
                <Modal.Footer>
                    <div className='bg-red-400 float-start'>
                        <button className='notice__view__btn' onClick={() => {
                            if (modalData.notice_file) downloadBase64(modalData.notice_file);
                        }}>
                            <Icons.DOWNLOAD />
                            Download
                        </button>
                    </div>
                </Modal.Footer>
            </Modal>

            {/* ::::::::::::::::::::::::::::::: [NOTICE MODAL] :::::::::::::::::::::: */}
            {recentNotice.length > 0 && <Modal open={isOpenNotificationModal} className='min-h-[80%] w-[90%]' onClose={() => {
                setIsOpenNotificationModal(false);
            }}>
                <Modal.Header className=''>
                    <p></p>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        <div className='w-full flex gap-3 items-center mb-3 pb-2 border-b'>
                            <Icons.NOTICE className='text-xl' />
                            <p className='font-semibold text-md uppercase'>Recent Notice</p>
                        </div>
                        {/* Table start */}
                        <div className='overflow-x-auto list__table list__table__checkin notice__modal'>
                            <table className='min-w-full bg-white' id='itemTable' ref={tableRef}>
                                <thead className='bg-gray-100 list__table__head'>
                                    <tr>
                                        <td align='center'>Sl.</td>
                                        <td>Date</td>
                                        <td>Title</td>
                                        <td align='center'>Action</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        recentNotice?.map((d, i) => {
                                            return <tr key={i} className='cursor-pointer hover:bg-gray-100'>
                                                <td align='center'>{i + 1}</td>
                                                <td>{new Date(d?.notice_date).toLocaleDateString()}</td>
                                                <td>{d.notice_title}</td>
                                                <td align='center'>
                                                    <button className='notice__view__btn' onClick={() => {
                                                        setModalData({
                                                            isOpen: true,
                                                            ...d
                                                        })
                                                    }}>
                                                        <Icons.EYE />
                                                        View Details
                                                    </button>
                                                </td>
                                            </tr>
                                        })
                                    }
                                    {
                                        recentNotice.length < 1 && (
                                            <tr>
                                                <td colSpan={5} align='center' >
                                                    No Notice Available
                                                </td>
                                            </tr>
                                        )
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>}
        </>
    )
}

export default Dashboard;
