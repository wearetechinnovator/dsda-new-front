import Nav from '../../../../components/Admin/Nav';
import SideNav from '../../../../components/Admin/SideNav'
import { Icons } from '../../../../helper/icons';
import { useEffect, useMemo, useRef, useState } from 'react';
import useSearchTable from '../../../../hooks/useSearchTable';
import { Avatar, Popover, SelectPicker, Whisper } from 'rsuite';
import downloadPdf from '../../../../helper/downloadPdf';
import useExportTable from '../../../../hooks/useExportTable';
import useMyToaster from '../../../../hooks/useMyToaster';
import Pagination from '../../../../components/Admin/Pagination';
import useSetTableFilter from '../../../../hooks/useSetTableFilter';
import Cookies from 'js-cookie'
import DataShimmer from '../../../../components/Admin/DataShimmer';
import { useSelector } from 'react-redux';


const TouristData = () => {
    const userDetail = useSelector((store) => store.userDetail);
    const toast = useMyToaster();
    const { copyTable, downloadExcel, printTable, exportPdf } = useExportTable();
    const { getFilterState, setFilterState } = useSetTableFilter();
    const savedFilter = getFilterState("touristData");
    const [activePage, setActivePage] = useState(savedFilter?.activePage || 1);
    const [dataLimit, setDataLimit] = useState(savedFilter?.limit || 10);
    const [totalData, setTotalData] = useState()
    const [data, setData] = useState([]);
    const tableRef = useRef(null);
    const exportData = useMemo(() => {
        return data && data.map((d, i) => ({
            "Sl No.": i + 1,
            "Guest Name": d.booking_details_guest_name,
            Gender: d.booking_details_guest_gender,
            Age: d.booking_details_guest_age,
            "Register Guest Details": `${d.booking_details_guest_name} (Mobile: ${d.booking_details_guest_phone})`,
            "Identity Card": `${d.booking_details_guest_id_type} - ${d.booking_details_guest_id_number}`,
            Mobile: d.booking_details_guest_phone,
            "Checkin Date & Time": d.booking_details_checkin_date_time,
            "Verifyed By": d.booking_details_booking_id?.booking_verified_by === "0" ? 'Manager' : 'Admin',
            "Added By": d.booking_details_booking_id?.booking_added_by === "0" ? 'Admin' : 'Hotel',
        }));
    }, [data]);
    const [loading, setLoading] = useState(true);
    const searchTable = useSearchTable();
    const [quickSearchFields, setQuickSearchFields] = useState({
        idCardNumber: '', mobileNo: '', fromDate: '',
        toDate: '', guestName: ''
    })
    const [allHotel, setAllHotel] = useState([]);
    const [selectedHotel, setSelectedHotel] = useState(null);
    const [hotelList, setHotellList] = useState([]);
    const timeRef = useRef(null);



    useEffect(() => {
        console.log(userDetail)
    }, [userDetail])



    // Get Hotel List
    const getHotelList = async () => {
        try {
            const data = {
                token: Cookies.get("token")
            }
            const url = process.env.REACT_APP_MASTER_API + `/hotel/get`;
            const req = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": 'application/json'
                },
                body: JSON.stringify(data)
            });
            const res = await req.json();
            setHotellList([...res.data])

        } catch (error) {

        }
    }

    useEffect(() => {
        getHotelList();
    }, [])
    const searchTableDatabase = (txt) => {
        if (txt === "") return;
        if (timeRef.current) clearTimeout(timeRef.current);

        timeRef.current = setTimeout(async () => {
            try {
                const data = {
                    token: Cookies.get("token"),
                    search: txt
                }
                const url = process.env.REACT_APP_MASTER_API + `/hotel/get`;
                const req = await fetch(url, {
                    method: "POST",
                    headers: {
                        "Content-Type": 'application/json'
                    },
                    body: JSON.stringify(data)
                });
                const res = await req.json();
                setHotellList([...res])
            } catch (error) {

            }

        }, 350)

    }



    // Get all Head List
    const get = async (firstDay, lastDay) => {
        setLoading(true);
        try {
            const data = {
                token: Cookies.get("token"),
                page: activePage,
                limit: dataLimit,
                idCardNumber: quickSearchFields.idCardNumber,
                mobile: quickSearchFields.mobileNo,
                fromDate: quickSearchFields.fromDate || firstDay,
                toDate: quickSearchFields.toDate || lastDay,
                guestName: quickSearchFields.guestName,
                hotelId: selectedHotel
            }

            setFilterState("touristData", dataLimit, activePage);

            const url = process.env.REACT_APP_BOOKING_API + `/check-in/get-booking`;
            const req = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": 'application/json'
                },
                body: JSON.stringify(data)
            });
            const res = await req.json();
            if (req.status === 200) {
                setTotalData(res.total)
                setData([...res.data])
            }


            // Get all Hotel
            const hoteReq = await fetch(process.env.REACT_APP_MASTER_API + `/hotel/get`, {
                method: "POST",
                headers: {
                    "Content-Type": 'application/json'
                },
                body: JSON.stringify({ token: Cookies.get("token"), limit: 50000000 })
            });
            const hotelRes = await hoteReq.json();
            setAllHotel([...hotelRes.data])
            setLoading(false);

        } catch (error) {
            toast("Something went wrong", "error")

        }
    }
    // Assign current date in quick filter fromDate and toDate;
    useEffect(() => {
        const today = new Date();
        const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
        const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

        // Format date as yyyy-mm-dd in local time
        const formatDate = (date) => {
            const month = (date.getMonth() + 1).toString().padStart(2, "0");
            const day = date.getDate().toString().padStart(2, "0");
            const year = date.getFullYear();
            return `${year}-${month}-${day}`;
        };

        setQuickSearchFields((prev) => ({
            ...prev,
            fromDate: formatDate(firstDay),
            toDate: formatDate(lastDay),
        }));


        get(formatDate(firstDay), formatDate(lastDay));
    }, [dataLimit, activePage])



    // Table Export functionality ---------
    const exportTable = async (whichType) => {
        if (whichType === "copy") {
            copyTable("table"); // Pass tableid
        }
        else if (whichType === "excel") {
            downloadExcel(exportData, 'tourist-data.xlsx') // Pass data and filename
        }
        else if (whichType === "print") {
            printTable(tableRef, "Tourist Data"); // Pass table ref and title
        }
        else if (whichType === "pdf") {
            let document = exportPdf('Tourist Data', exportData);
            downloadPdf(document)
        }
    }


    // Handle quick serach button;
    const handleQuickSearch = () => get();

    // Handle quick search reset;
    const handleResetQuickSearch = () => {
        window.location.reload();
    };


    const deleteBooking = async (bookingId) => {
        try {
            const url = process.env.REACT_APP_BOOKING_API + `/check-in/delete-booking`
            const req = await fetch(url, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ bookingId, token: Cookies.get("token") })
            })
            const res = await req.json();
            if (req.status !== 200) {
                return toast(res.err, 'error');
            }

            toast(res.msg, 'success');
            // window.location.reload();
            get();
            return;

        } catch (error) {
            return toast("Booking not delete", 'error')
        }
    }

    return (
        <>
            <Nav title={"Manage Guest Entry"} />
            <main id='main'>
                <SideNav />
                <div className='content__body'>
                    <div className='content__body__main'>
                        <div className='w-full flex gap-1 items-center'>
                            <Icons.SEARCH />
                            <p className='font-semibold text-sm'>Filter Guest Entry</p>
                        </div>
                        <div className='w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                            <div className='w-full mt-3'>
                                <p className="">Select Hotel</p>
                                <SelectPicker
                                    block
                                    data={[
                                        ...hotelList.map((item) => ({
                                            label: item.hotel_name,
                                            value: item._id
                                        }))
                                    ]}
                                    style={{ width: '100%' }}
                                    onChange={(v) => setSelectedHotel(v)}
                                    value={selectedHotel}
                                    placeholder="Select"
                                    searchable={true}
                                    cleanable={true}
                                    placement='bottomEnd'
                                    onSearch={(serachTxt) => searchTableDatabase(serachTxt)}
                                    onClean={getHotelList}
                                />
                            </div>
                            <div className='w-full mt-3'>
                                <p>Mobile Number</p>
                                <input type="text" placeholder='Mobile Number'
                                    onChange={(e) => setQuickSearchFields({ ...quickSearchFields, mobileNo: e.target.value })}
                                    value={quickSearchFields.mobileNo}
                                />
                            </div>
                            <div className='w-full mt-3'>
                                <p>ID Card Number</p>
                                <input type="text" placeholder='ID Number'
                                    onChange={(e) => setQuickSearchFields({ ...quickSearchFields, idCardNumber: e.target.value })}
                                    value={quickSearchFields.idCardNumber}
                                />
                            </div>
                            <div className='w-full mt-3'>
                                <p>Guest Name</p>
                                <input type="text" placeholder='Guest Name'
                                    onChange={(e) => setQuickSearchFields({ ...quickSearchFields, guestName: e.target.value })}
                                    value={quickSearchFields.guestName}
                                />
                            </div>
                            <div className='w-full mt-3'>
                                <p>Start Date</p>
                                <input type="date"
                                    onChange={(e) => setQuickSearchFields({ ...quickSearchFields, fromDate: e.target.value })}
                                    value={quickSearchFields.fromDate}
                                />
                            </div>
                            <div className='w-full mt-3'>
                                <p>End Date</p>
                                <input type="date"
                                    onChange={(e) => setQuickSearchFields({ ...quickSearchFields, toDate: e.target.value })}
                                    value={quickSearchFields.toDate}
                                />
                            </div>
                        </div>

                        <div className='form__btn__grp'>
                            <button className='reset__btn' onClick={handleResetQuickSearch}>
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


                    {/* Table Content */}
                    <div className='content__body__main mt-4'>
                        {
                            !loading ?
                                <div>
                                    <div className='w-full flex gap-1 items-center'>
                                        <Icons.TABLE />
                                        <p className='font-semibold text-sm'>Report Table</p>
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
                                                    <input type='search'
                                                        placeholder='Search Hotel Name or Guest Name...'
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
                                    <p className='my-2 flex items-center gap-2'>
                                        <Icons.STAR className='text-red-500 text-md' />
                                        <span className='italic text-red-600'>Indicates as Head Guest</span>
                                    </p>
                                    {/* Table start */}
                                    <div className='overflow-x-auto list__table list__table__checkin'>
                                        <table className='min-w-full bg-white' id='table' ref={tableRef}>
                                            <thead className='bg-gray-100 list__table__head'>
                                                <tr>
                                                    <td align='center' className='w-[3%]'>SL No.</td>
                                                    <td>Hotel Name</td>
                                                    <td>Guest Name</td>
                                                    <td className='w-[5%]'>Guest Photo</td>
                                                    <td>Gender</td>
                                                    <td className='w-[5%]' align='center'>DOB</td>
                                                    <td>Age</td>
                                                    <td className='w-[4%]'>Nationality</td>
                                                    <td className='w-[4%]'>Country</td>
                                                    <td className='w-[4%]'>State</td>
                                                    <td className='w-[4%]'>District</td>
                                                    <td className='w-[4%]'>Address</td>
                                                    {/* <td>Register Guest Details</td> */}
                                                    <td className='w-[5%]'>ID Card</td>
                                                    <td className='w-[3%]'>ID Proof</td>
                                                    <td>Mobile</td>
                                                    <td>Room No.</td>
                                                    <td>Check In Date & Time</td>
                                                    <td>Check Out Date & Time</td>
                                                    <td align='center'>Verified By</td>
                                                    <td align='center'>Added By</td>
                                                    {
                                                        userDetail?.role === "Administrator" && (
                                                            <td align='center'>Action</td>
                                                        )
                                                    }
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    data?.map((d, i) => {
                                                        const currentHotel = allHotel?.find((h, _) => h._id === d.booking_details_hotel_id);
                                                        return <tr key={i} className='hover:bg-gray-100'>
                                                            <td align='center'>{(activePage - 1) * dataLimit + i + 1}</td>
                                                            <td>{currentHotel?.hotel_name}</td>
                                                            <td>
                                                                <span style={{ display: 'inline-block', verticalAlign: 'middle' }}>
                                                                    {d.booking_details_guest_name}
                                                                </span>
                                                                <span style={{ display: 'inline-block', verticalAlign: 'middle', marginLeft: '4px' }}>
                                                                    {d.booking_details_is_head_guest === "1" && (
                                                                        <Icons.STAR className="text-red-500 text-[10px]" />
                                                                    )}
                                                                </span>
                                                            </td>
                                                            <td align='center'>
                                                                <Avatar
                                                                    circle
                                                                    src={process.env.REACT_APP_BOOKING_API + "/upload/" + d.booking_details_guest_photo}
                                                                    size={'sm'}
                                                                />
                                                            </td>
                                                            <td>{d.booking_details_guest_gender}</td>
                                                            <td>{d.booking_details_guest_dob || "-"}</td>
                                                            <td>{d.booking_details_guest_age}</td>
                                                            <td>{d.booking_details_guest_nationality === "india" ? "Indian" : d.booking_details_guest_nationality === "foreign" ? "Foreigner" : ""}</td>
                                                            <td>{d.booking_details_guest_country || "-"}</td>
                                                            <td>{d.booking_details_guest_state || "-"}</td>
                                                            <td>{d.booking_details_guest_district || "-"}</td>
                                                            <td>{d.booking_details_guest_address || "-"}</td>
                                                            {/* <td>
                                                                {d.booking_details_guest_name}
                                                                <br />
                                                                (Mobile: {d.booking_details_guest_phone})
                                                            </td> */}
                                                            <td>
                                                                {d.booking_details_guest_id_type} - {d.booking_details_guest_id_number}
                                                            </td>
                                                            <td align='center'>
                                                                {d.booking_details_guest_id_proof ?
                                                                    <a href={process.env.REACT_APP_BOOKING_API + "/upload/" + d.booking_details_guest_id_proof} download={''}>
                                                                        <span className='chip chip__blue cursor-pointer'>
                                                                            <Icons.DOWNLOAD />
                                                                        </span>
                                                                    </a>
                                                                    : "-"
                                                                }
                                                            </td>
                                                            <td>{d.booking_details_guest_phone}</td>
                                                            <td align='center'>{d.booking_details_room_no || "-"}</td>
                                                            <td>{d.booking_details_checkin_date_time}</td>
                                                            <td>{d.booking_details_checkout_date_time || '--'}</td>
                                                            <td>
                                                                {
                                                                    d.booking_details_booking_id?.booking_verified_by === "0" ?
                                                                        <span className='chip chip__green'>
                                                                            <Icons.USER />
                                                                            Manager
                                                                        </span> :
                                                                        <span className='chip chip__green'>
                                                                            <Icons.ADMIN_USER />
                                                                            Admin
                                                                        </span>
                                                                }
                                                            </td>
                                                            <td>
                                                                {
                                                                    d.booking_details_booking_id?.booking_added_by === "0" ?
                                                                        <span className='chip chip__blue'>
                                                                            <Icons.ADMIN_USER />
                                                                            Admin
                                                                        </span> :
                                                                        <span className='chip chip__blue'>
                                                                            <Icons.HOTEL />
                                                                            Hotel
                                                                        </span>
                                                                }
                                                            </td>

                                                            {
                                                                userDetail?.role === "Administrator" && (
                                                                    <td align='center'>
                                                                        {d.booking_details_is_head_guest === "1" && (
                                                                            <div
                                                                                onClick={() => deleteBooking(d.booking_details_booking_id._id)}
                                                                                className='bg-red-500 hover:bg-red-400 cursor-pointer text-white rounded-full w-[25px] h-[25px] grid place-items-center'>
                                                                                <Icons.DELETE className='text-[18px]' />
                                                                            </div>
                                                                        )}
                                                                    </td>
                                                                )
                                                            }

                                                        </tr>
                                                    })
                                                }

                                                {
                                                    data.length < 1 && (
                                                        <tr>
                                                            <td colSpan={11} align='center' className='p-4 text-lg'>
                                                                No Data Found
                                                            </td>
                                                        </tr>
                                                    )
                                                }
                                            </tbody>
                                        </table>
                                    </div>

                                    {totalData && <div className='paginate__parent'>
                                        <p>Showing {data.length} of {totalData} entries</p>
                                        <Pagination
                                            activePage={activePage}
                                            setActivePage={setActivePage}
                                            totalData={totalData}
                                            dataLimit={dataLimit}
                                        />
                                    </div>}
                                </div>
                                : <DataShimmer />
                        }
                    </div>

                </div>
            </main>
        </>
    )
}

export default TouristData;

