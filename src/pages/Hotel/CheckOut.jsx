import Nav from '../../components/Hotel/Nav';
import SideNav from '../../components/Hotel/HotelSideNav';
import { Icons } from '../../helper/icons';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useSearchTable from '../../hooks/useSearchTable';
import useApi from '../../hooks/useApi';
import { Popover, Whisper } from 'rsuite';
import downloadPdf from '../../helper/downloadPdf';
import useExportTable from '../../hooks/useExportTable';
import useMyToaster from '../../hooks/useMyToaster';
import Pagination from '../../components/Admin/Pagination';
import Cookies from 'js-cookie';
import useSetTableFilter from '../../hooks/useSetTableFilter';
import { useSelector } from 'react-redux';



const CheckOut = () => {
    const [searchBy, setSearchBy] = useState("room");
    const toast = useMyToaster();
    const { copyTable, downloadExcel, printTable, exportPdf } = useExportTable();
    const { getFilterState, setFilterState } = useSetTableFilter();
    const savedFilter = getFilterState("checkout");
    const [activePage, setActivePage] = useState(savedFilter?.activePage || 1);
    const [dataLimit, setDataLimit] = useState(savedFilter?.limit || 10);
    const [totalData, setTotalData] = useState();
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [bookingHeadList, setBookingHeadList] = useState([]);
    const tableRef = useRef(null);
    const exportData = useMemo(() => {
        return data && data.map(({ name }, _) => ({
            Name: name,
        }));
    }, [data]);
    const [loading, setLoading] = useState(true);
    const searchTable = useSearchTable();
    const [quickSearchFields, setQuickSearchFields] = useState({
        roomNo: '', mobileNo: '', fromDate: '', toDate: ''
    })
    const hotelDetails = useSelector((store) => store.hotelDetails);




    // Get all Head List
    const getHeadList = async () => {
        try {
            const data = {
                token: Cookies.get("token"),
                page: activePage,
                limit: dataLimit,
                head: true, // Get head guest,
                room: quickSearchFields.roomNo,
                mobile: quickSearchFields.mobileNo,
                fromDate: quickSearchFields.fromDate,
                toDate: quickSearchFields.toDate
            }
            setFilterState("checkout", dataLimit, activePage);

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
            console.log(error)
        }
    }
    useEffect(() => {
        getHeadList();
    }, [dataLimit, activePage])

    // Handle Quick Search
    const handleQuickSearch = () => getHeadList();

    // Reset Quick Search Data
    const resetQuickSearch = () => setQuickSearchFields({ roomNo: '', mobileNo: '', fromDate: '', toDate: '' })

    useEffect(() => {
        if (
            quickSearchFields.roomNo === '' &&
            quickSearchFields.mobileNo === '' &&
            quickSearchFields.fromDate === '' &&
            quickSearchFields.toDate === ''
        ) {
            getHeadList();
        }
    }, [quickSearchFields]);



    const exportTable = async (whichType) => {
        if (whichType === "copy") {
            copyTable("table"); // Pass tableid
        }
        else if (whichType === "excel") {
            downloadExcel(exportData, 'block-list.xlsx') // Pass data and filename
        }
        else if (whichType === "print") {
            printTable(tableRef, "Block List"); // Pass table ref and title
        }
        else if (whichType === "pdf") {
            let document = exportPdf('Block List', exportData);
            downloadPdf(document)
        }
    }


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


    return (
        <>
            <Nav title={"Manage Guest Entry"} />
            <main id='main'>
                <SideNav />
                <div className='content__body'>
                    {/* ========================== [Quick Search] ===================== */}
                    {/* =============================================================== */}
                    
                    <div className='content__body__main'>
                        <div className='w-full  flex justify-between items-center border-b pb-1'>
                            <p className='font-semibold text-lg'>Quick Search</p>
                            <Icons.SEARCH />
                        </div>
                        <div className='w-full mt-4'>
                            <p>Search By</p>
                            <select value={searchBy} onChange={(e) => setSearchBy(e.target.value)}>
                                <option value="room">Room</option>
                                <option value="mobile">Mobile</option>
                                <option value="date">Check In Date</option>
                            </select>
                        </div>
                        {
                            searchBy === "room" && <div className='w-full mt-3'>
                                <p>Room No.*</p>
                                <input type="text" placeholder='Enter Guest Room No.'
                                    value={quickSearchFields.roomNo}
                                    onChange={(e) => setQuickSearchFields({ ...quickSearchFields, roomNo: e.target.value })}
                                />
                            </div>
                        }
                        {
                            searchBy === "mobile" && <div className='w-full mt-3'>
                                <p>Guest Mobile Number*</p>
                                <input type="text" placeholder='Enter Guest Mobile Number'
                                    value={quickSearchFields.mobileNo}
                                    onChange={(e) => setQuickSearchFields({ ...quickSearchFields, mobileNo: e.target.value })}
                                />
                            </div>
                        }
                        {
                            searchBy === "date" && <div className='w-full mt-3'>
                                <div className='w-full flex gap-3 items-center justify-between'>
                                    <div className='w-full'>
                                        <p>From*</p>
                                        <input type="date" placeholder='Start Date'
                                            value={quickSearchFields.fromDate}
                                            onChange={(e) => {
                                                setQuickSearchFields({ ...quickSearchFields, fromDate: e.target.value })
                                            }} />
                                    </div>
                                    <div className='w-full'>
                                        <p>To*</p>
                                        <input type="date" placeholder='End Date'
                                            value={quickSearchFields.toDate}
                                            onChange={(e) => {
                                                setQuickSearchFields({ ...quickSearchFields, toDate: e.target.value })
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        }
                        <div className='form__btn__grp'>
                            <button className='reset__btn' onClick={resetQuickSearch}>
                                <Icons.RESET />
                                Reset
                            </button>
                            <button className='save__btn' onClick={handleQuickSearch}>
                                <Icons.SEARCH /> Search
                            </button>
                        </div>
                    </div>

                    {/* ================================== Table start here ============================== */}
                    {/* ================================================================================== */}

                    <div className='content__body__main mt-4'>
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
                        <div className='overflow-x-auto list__table'>
                            <table className='min-w-full bg-white' id='table' ref={tableRef}>
                                <thead className='bg-gray-100 list__table__head'>
                                    <tr>
                                        <td className='py-2 '>SL No.</td>
                                        <td className='py-2 '>Head Guest Details</td>
                                        <td className='py-2 '>Check In Date & Time</td>
                                        <td className='py-2 '>ID Card</td>
                                        <td className='py-2 '>Mobile</td>
                                        <td className='py-2 '>Room No.</td>
                                        <td className='py-2 w-[10%]'>Action</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        bookingHeadList.map((d, i) => {
                                            return <tr key={i} className='cursor-pointer hover:bg-gray-100'>
                                                <td>{i + 1}</td>
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
                                                        <button className='notice__view__btn' onClick={() => {
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
                            <div className='paginate__parent'>
                                <p>Showing {data.length} of {totalData} entries</p>
                                <Pagination
                                    activePage={activePage}
                                    setActivePage={setActivePage}
                                    totalData={totalData}
                                    dataLimit={dataLimit}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}

export default CheckOut;

