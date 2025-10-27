import Nav from '../../components/Hotel/Nav';
import SideNav from '../../components/Hotel/HotelSideNav'
import { Icons } from '../../helper/icons';
import { use, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useSearchTable from '../../hooks/useSearchTable';
import { Placeholder, Popover, SelectPicker, Whisper } from 'rsuite';
import downloadPdf from '../../helper/downloadPdf';
import useExportTable from '../../hooks/useExportTable';
import useMyToaster from '../../hooks/useMyToaster';
import Pagination from '../../components/Admin/Pagination';
import useSetTableFilter from '../../hooks/useSetTableFilter';
import Cookies from 'js-cookie';


const Amenities = () => {
    const toast = useMyToaster();
    const { copyTable, downloadExcel, printTable, exportPdf } = useExportTable();
    const { getFilterState, setFilterState } = useSetTableFilter();
    const savedFilter = getFilterState("amenities");
    const [activePage, setActivePage] = useState(savedFilter?.activePage || 1);
    const [dataLimit, setDataLimit] = useState(savedFilter?.limit || 10);
    const [totalData, setTotalData] = useState()
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const tableRef = useRef(null);
    const exportData = useMemo(() => {
        return data && data.map(({ name }, _) => ({
            Name: name,
        }));
    }, [data]);
    const [loading, setLoading] = useState(true);
    const searchTable = useSearchTable();
    const months = [
        { label: 'January', value: '1' },
        { label: 'February', value: '2' },
        { label: 'March', value: '3' },
        { label: 'April', value: '4' },
        { label: 'May', value: '5' },
        { label: 'June', value: '6' },
        { label: 'July', value: '7' },
        { label: 'August', value: '8' },
        { label: 'September', value: '9' },
        { label: 'October', value: '10' },
        { label: 'November', value: '11' },
        { label: 'December', value: '12' }
    ];
    const currentYear = new Date().getFullYear();
    const currentMonthIndex = new Date().getMonth(); // 0-11
    const years = Array.from({ length: currentYear - 2000 + 1 }, (_, i) => {
        const year = 2000 + i;
        return { label: year.toString(), value: year.toString() };
    });
    const [filterData, setFilterData] = useState({ month: '', year: '' })
    const [currentMonthDateList, setCurrentMonthDateList] = useState([]);
    const [staticticData, setStaticticsData] = useState(null);


    // Set current year and month
    useEffect(() => {
        setFilterData({
            year: currentYear.toString(),
            month: months[currentMonthIndex].value
        })
    }, [])

    // Get Statictics Data;
    useEffect(() => {
        (async () => {
            const url = process.env.REACT_APP_BOOKING_API + "/check-in/get-stats";
            const hotelId = Cookies.get('hotelId');
            const token = Cookies.get('hotel-token');

            const req = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": 'application/json'
                },
                body: JSON.stringify({ hotelId })
            })
            const res = await req.json();
            if (req.status === 200) setStaticticsData(res);
        })()
    }, [])


    // Get Guest Data
    const get = async (y, m) => {
        try {
            const hotelId = Cookies.get('hotelId');
            const token = Cookies.get('hotel-token');
            const data = {
                token: Cookies.get("token"),
                page: activePage,
                limit: dataLimit,
                year: filterData.year || y,
                month: filterData.month || m,
                hotel_id: hotelId
            }

            setFilterState("amenities", dataLimit, activePage);

            const url = process.env.REACT_APP_BOOKING_API + `/check-out/get-booking-head`;
            const req = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": 'application/json'
                },
                body: JSON.stringify(data)
            });
            const res = await req.json();
            console.log(res)
            if (req.status === 200) {
                setTotalData(res.total)
                setData([...res.data])
                setLoading(false);
            }
            setLoading(false);

        } catch (error) {
            toast("Something went wrong", "error")
            console.log(error)
        }
    }
    useEffect(() => {
        get(currentYear.toString(), months[currentMonthIndex].value)
    }, [dataLimit, activePage])


    const handleFilterData = () => get();

    const handleResetFilterData = () => {
        setFilterData({
            year: currentYear.toString(),
            month: months[currentMonthIndex].value
        })
        get(currentYear.toString(), months[currentMonthIndex].value)
    }


    useEffect(() => {
        const month = filterData.month;
        const year = filterData.year;
        const dates = [];

        // JS Date month is 0-based → subtract 1
        const date = new Date(year, month - 1, 1);

        while (date.getMonth() === month - 1) {
            const formatted = date.toISOString().split('T')[0]; // yyyy-mm-dd
            dates.push(formatted);
            date.setDate(date.getDate() + 1);
        }
        setCurrentMonthDateList(dates);

    }, [filterData])

    // Table functionality ---------
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


    return (
        <>
            <Nav title={"Manage Guest Entry"} />
            <main id='main'>
                <SideNav />
                <div className='content__body'>
                    <div className='w-full flex flex-col md:flex-row gap-4'>
                        <div className='content__body__main w-full '>
                            <div className='w-full  flex gap-1 items-center border-b pb-1'>
                                <Icons.SEARCH />
                                <p className='font-semibold text-[16px]'>Filter Guest Entry</p>
                            </div>
                            <div className='w-full flex flex-col md:flex-row justify-between gap-4 items-center mt-4'>
                                <div className='w-full mt-3'>
                                    <p>Select Month *</p>
                                    <SelectPicker
                                        block
                                        className='w-full'
                                        data={months}
                                        value={filterData.month}
                                        onChange={(v) => setFilterData({ ...filterData, month: v })}
                                    />
                                </div>
                                <div className='w-full mt-3'>
                                    <p>Select Year*</p>
                                    <SelectPicker
                                        block
                                        className='w-full'
                                        data={years}
                                        value={filterData.year}
                                        onChange={(v) => setFilterData({ ...filterData, year: v })}
                                    />
                                </div>
                            </div>

                            <div className='form__btn__grp'>
                                <button className='reset__btn' onClick={handleResetFilterData}>
                                    <Icons.RESET />
                                    Reset
                                </button>
                                <button className='save__btn' onClick={handleFilterData}>
                                    <Icons.SEARCH /> Search
                                </button>
                            </div>
                        </div>

                        <div className='content__body__main charges__card w-full'>
                            <div className='w-full flex gap-1 items-center border-b pb-1'>
                                <Icons.RUPES />
                                <p className='font-semibold text-[16px]'>Aminity Charges</p>
                            </div>
                            <div className='w-full grid grid-cols-2 md:grid-cols-4 gap-4 mt-4'>
                                <div className='hotel__amemities__card'>
                                    <p className='text-2xl'>{staticticData?.todayAminity}</p>
                                    <p className='text-[12px]'>Today Charges</p>
                                    <Icons.RUPES className='card__icon2' />
                                </div>
                                <div className='hotel__amemities__card '>
                                    <p className='text-2xl'>{staticticData?.totalAminity}</p>
                                    <p className='text-[12px]'>Total Charges</p>
                                    <Icons.RUPES className='card__icon2' />
                                </div>
                                <div className='hotel__amemities__card'>
                                    <p className='text-2xl'>0</p>
                                    <p className='text-[12px]'>Total Payment</p>
                                    <Icons.RUPES className='card__icon2' />
                                </div>
                                <div className='hotel__amemities__card red__card'>
                                    <p className='text-2xl'>0</p>
                                    <p className='text-[12px]'>Total Due</p>
                                    <Icons.RUPES className='card__icon2' />
                                </div>
                            </div>

                            <div className='form__btn__grp'>
                                <button className='reset__btn'>
                                    <Icons.RUPES />
                                    Previous Payments
                                </button>
                                <button className='reset__btn'>
                                    <Icons.RUPES /> Pay Now
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* ================================== Table start here ============================== */}
                    {/* ================================================================================== */}
                    {/* Table Content */}
                    <div className='content__body__main mt-4'>
                        {/* Option Bar */}
                        <div className="add_new_compnent">
                            <div className='flex justify-between items-center'>
                                <div className='flex flex-col'>
                                    <select value={dataLimit} onChange={(e) => setDataLimit(e.target.value)}>
                                        <option value={10}>10</option>
                                        <option value={25}>25</option>
                                        <option value={50}>50</option>
                                        <option value={100}>100</option>
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
                        <div className='overflow-x-auto list__table list__table__checkin'>
                            <table className='min-w-full bg-white' id='table' ref={tableRef}>
                                <thead className='bg-gray-100 list__table__head'>
                                    <tr>
                                        <td align='center' className='w-[2%]'>SL No.</td>
                                        <td className='w-[4%]'>Date</td>
                                        <td className='w-[15%]'>Total Guest(s) Enrolled</td>
                                        <td className='w-[10%]'>Total Amenities Charge Payable (Rs)</td>
                                        <td align='center' className='w-[4%]'>Remark</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        currentMonthDateList.map((d, i) => {
                                            let allData = data.find((ad, _) => ad.date === d);

                                            return <tr key={i} className='hover:bg-gray-100'>
                                                <td align='center'>{i + 1}</td>
                                                <td>{d}</td>
                                                <td className='px-4 border-b'>{allData?.total_guest || 0}</td>
                                                <td className='px-4 border-b'>{allData?.total_bill || 0}</td>
                                                <td className='px-4' align='center'>
                                                    <button
                                                        onClick={() => navigate("/hotel/tourist-data", {
                                                            state: { date: d }
                                                        })}
                                                        className='rounded px-3 py-1 bg-blue-300 text-white'>
                                                        Booking
                                                    </button>
                                                </td>
                                            </tr>
                                        })
                                    }
                                </tbody>
                            </table>
                            {totalData < 1 && <div className='w-full bg-gray-100 text-md text-center py-6'>
                                NO DATA FOUND
                            </div>}
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}

export default Amenities;

