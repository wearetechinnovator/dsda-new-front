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
import NoData from '../../components/Admin/NoData';
import DataShimmer from '../../components/Admin/DataShimmer';





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
        { label: 'January', value: '0' },
        { label: 'February', value: '1' },
        { label: 'March', value: '2' },
        { label: 'April', value: '3' },
        { label: 'May', value: '4' },
        { label: 'June', value: '5' },
        { label: 'July', value: '6' },
        { label: 'August', value: '7' },
        { label: 'September', value: '8' },
        { label: 'October', value: '9' },
        { label: 'November', value: '10' },
        { label: 'December', value: '11' }
    ];
    const currentYear = new Date().getFullYear();
    const currentMonthIndex = new Date().getMonth(); // 0-11
    const years = Array.from({ length: currentYear - 2000 + 1 }, (_, i) => {
        const year = 2000 + i;
        return { label: year.toString(), value: year.toString() };
    });
    const now = new Date()
    const [filterData, setFilterData] = useState({
        month: months[now.getMonth()].value, year: now.getFullYear().toString(),
    })
    const [currentMonthDateList, setCurrentMonthDateList] = useState([]);
    const [staticticData, setStaticticsData] = useState({
        todayAminity: '', totalAminity: '', totalPayment: '',
    });
    const timeRef = useRef(null);
    const hotelId = Cookies.get('hotelId');
    const token = Cookies.get('hotel-token');
    const [totalGuest, setTotalGuest] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);


    


    // Get Statictics Data;
    useEffect(() => {
        (async () => {
            const url = process.env.REACT_APP_BOOKING_API + "/check-in/get-stats";
            const url2 = process.env.REACT_APP_MASTER_API + "/amenities/get-total-amenities-pay";

            const [res, res2] = await Promise.all([
                fetch(url, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ hotelId, token })
                }).then(res => res.json()),

                fetch(url2, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ hotelId, hotelToken: token })
                }).then(res => res.json())
            ])

            // if (req.status === 200) {
            setStaticticsData({
                ...staticticData,
                totalAminity: res.totalAminity,
                todayAminity: res.todayAminity,
                totalPayment: res2[0]?.totalAmount || 0,
            })
            // }

        })()
    }, [])


    // :::::::::::::::::::::: [GET ALL HOTEL] ::::::::::::::::::::
    const get = async ({ year, month }) => {
        setLoading(true);

        const y = Number(year);
        const m = Number(month) + 1;
        const startDate = new Date(y, m - 1, 1).toLocaleDateString('en-CA');
        const endDate = new Date(y, m, 0).toLocaleDateString('en-CA');

        try {
            const data = {
                token: Cookies.get("hotel-token"),
                page: activePage,
                limit: dataLimit,
                startDate,
                endDate,
                // hotelId: Cookies.get("hotelId")
            }
            setFilterState("amenities", dataLimit, activePage);
            const url = process.env.REACT_APP_BOOKING_API + `/check-in/get-booking-summary-by-daterange`;
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
                setLoading(false);

                const { totalGuest, totalAmount } = res.data.reduce((acc, item) => {
                    acc.totalGuest += item.totalGuests;
                    acc.totalAmount += item.totalAmount;
                    return acc;

                }, { totalGuest: 0, totalAmount: 0 });

                setTotalGuest(totalGuest);
                setTotalAmount(totalAmount);
            } else {
                setLoading(false);
                return toast("Hotel data not load", 'error')
            }

        } catch (error) {
            return toast("Hotel data not load", 'error')
        }
    }
    useEffect(() => {
        get(filterData);
    }, [dataLimit, activePage])


    // ::::::::::::::::::: [ ALL SEARCH FILTER CODE HERE ] :::::::::::::
    const searchTableDatabase = (txt, model) => {
        if (timeRef.current) clearTimeout(timeRef.current);

        timeRef.current = setTimeout(async () => {
            if (!txt && model === "hotel") {
                get(filterData);
                return;
            }

            try {
                const data = {
                    token: Cookies.get("token"),
                    search: txt
                }
                const url = process.env.REACT_APP_MASTER_API + `/${model}/get`;
                const req = await fetch(url, {
                    method: "POST",
                    headers: {
                        "Content-Type": 'application/json'
                    },
                    body: JSON.stringify(data)
                });
                const res = await req.json();
                if (model === "hotel") {
                    setTotalData(res.length)
                }

            } catch (error) {
                console.log(error);
                return toast("Search error", 'error')
            }

        }, 300)

    }


    const handleFilterData = () => get(filterData);

    const handleResetFilterData = () => {
        setFilterData({
            year: currentYear.toString(),
            month: months[currentMonthIndex].value
        })
        get({ year: currentYear.toString(), month: months[currentMonthIndex].value })
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
            <Nav title={"Manage Payments"} />
            <main id='main'>
                <SideNav />
                <div className='content__body'>
                    <div className='w-full flex flex-col md:flex-row gap-4'>
                        <div className='content__body__main w-full '>
                            <div className='w-full  flex gap-1 items-center border-b pb-1'>
                                <Icons.SEARCH />
                                <p className='font-semibold text-md uppercase'>Filter Guest Entry</p>
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
                                <p className='font-semibold text-md uppercase'>Aminity Charges</p>
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
                                    <p className='text-2xl'>{staticticData?.totalPayment}</p>
                                    <p className='text-[12px]'>Total Payment</p>
                                    <Icons.RUPES className='card__icon2' />
                                </div>
                                <div className='hotel__amemities__card red__card'>
                                    <p className='text-2xl'>{
                                        staticticData?.totalAminity - staticticData?.totalPayment
                                    }</p>
                                    <p className='text-[12px]'>Total Due</p>
                                    <Icons.RUPES className='card__icon2' />
                                </div>
                            </div>

                            <div className='form__btn__grp filter'>
                                <button className='reset__btn' onClick={() => navigate('/hotel/payments', {
                                    state: '1'
                                })}>
                                    <Icons.RUPES />
                                    Previous Payments
                                </button>
                                <button className='reset__btn' onClick={() => navigate('/hotel/payments', {
                                    state: 'without__success'
                                })}>
                                    <Icons.RUPES /> Pay Now
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* ================================== Table start here ============================== */}
                    {/* ================================================================================== */}
                    {/* Table Content */}
                    <div className='content__body__main mt-4'>
                        <div className='add_new_compnent'>
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
                                            placeholder='Search Transaction ID'
                                            onChange={(e) => searchTableDatabase(e.target.value, "hotel")}
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
                        {loading === false ? <div className='overflow-x-auto list__table list__table__checkin'>
                            <table className='min-w-full bg-white' id='amenitiesTable' ref={tableRef}>
                                <thead className='bg-gray-100 list__table__head'>
                                    <tr>
                                        <td className='w-[5%]' align='center'>SL No.</td>
                                        <td className='w-[15%]'>Date</td>
                                        <td>Total Guest(s) Enrolled</td>
                                        <td>Total Charges (₹)</td>
                                        <td align="center">Details</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        data?.map((d, i) => {
                                            return <tr key={i}>
                                                <td align='center'>{(activePage - 1) * dataLimit + i + 1}</td>
                                                <td>{d.date}</td>
                                                <td>{d.totalGuests}</td>
                                                <td>{d.totalAmount}</td>
                                                <td align="center">
                                                    <button
                                                        onClick={() => navigate("/hotel/tourist-data", {
                                                            state: d.date
                                                        })}
                                                        className="flex items-center gap-1 bg-[#93C5FD] hover:bg-[#80b6f3] text-white px-2 py-1 rounded">
                                                        <Icons.EYE />
                                                        Booking
                                                    </button>
                                                </td>
                                            </tr>
                                        })
                                    }
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td colSpan={2} className='font-semibold text-right'>Total</td>
                                        <td className='text-lg font-semibold'>
                                            {totalGuest}
                                        </td>
                                        <td className='text-lg font-semibold'>
                                            {totalAmount}
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                            {data.length < 1 && <NoData />}
                        </div> : <DataShimmer />}
                        {data.length > 0 && <div className='paginate__parent'>
                            <p>Showing {data.length} of {totalData} entries</p>
                            <Pagination
                                activePage={activePage}
                                totalData={totalData}
                                dataLimit={dataLimit}
                                setActivePage={setActivePage}
                            />
                        </div>}
                    </div>
                </div>
            </main>
        </>
    )
}

export default Amenities;

