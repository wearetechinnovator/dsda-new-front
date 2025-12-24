import SideNav from "../../../../components/Admin/SideNav";
import Nav from "../../../../components/Admin/Nav";
import { useRef, useState, useMemo, useEffect } from "react";
import useExportTable from '../../../../hooks/useExportTable';
import useSetTableFilter from '../../../../hooks/useSetTableFilter';
import { Icons } from "../../../../helper/icons";
import { Popover, SelectPicker, Whisper } from "rsuite";
import Cookies from "js-cookie";
import downloadPdf from '../../../../helper/downloadPdf';
import Pagination from '../../../../components/Admin/Pagination';
import DataShimmer from "../../../../components/Admin/DataShimmer";
import useMyToaster from "../../../../hooks/useMyToaster";
import { useLocation, useNavigate } from "react-router-dom";
import NoData from "../../../../components/Admin/NoData";




const DateWise = () => {
    const navigate = useNavigate();
    const toast = useMyToaster();
    const { copyTable, downloadExcel, printTable, exportPdf } = useExportTable();
    const { getFilterState, setFilterState } = useSetTableFilter();
    const savedFilter = getFilterState("amenities-date-wise");
    const [activePage, setActivePage] = useState(savedFilter?.activePage || 1);
    const [dataLimit, setDataLimit] = useState(savedFilter?.limit || 10);
    const [totalData, setTotalData] = useState()
    const [hotelList, setHotelList] = useState([]);
    const [data, setData] = useState([]);
    const tableRef = useRef(null);
    const exportData = useMemo(() => {
        return data && data?.map((d, i) => ({
            'Sl No.': i + 1,
            'Date': d.date,
            'Active Hotels': d.activeHotelCount,
            'Total Guest(s) Enrolled': d.totalGuests,
            'Total Charges': d.totalAmount
        }));
    }, [data]);
    const [loading, setLoading] = useState(true);
    const timeRef = useRef(null);
    const [selectedHotel, setSelectedHotel] = useState(null);

    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const formatDate = (date) => {
        const d = date.getDate().toString().padStart(2, '0');
        const m = (date.getMonth() + 1).toString().padStart(2, '0');
        const y = date.getFullYear();
        return `${y}-${m}-${d}`;
    };
    const startDate = formatDate(firstDayOfMonth); // e.g., "2025-10-01"
    const endDate = formatDate(lastDayOfMonth);

    const [selectedFilters, setSelectedFilters] = useState({
        hotel: '', zone: '', block: '', district: '', policeStation: '', sector: '',
        startDate: startDate,
        endDate: endDate,
        month: '', year: ''
    })
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const [navTitle, setNavTitle] = useState("")
    const [totalActiveHotel, setTotalActiveHotel] = useState(0);
    const [totalGuest, setTotalGuest] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);

    // :::::::::::::::::::::: [GET ALL HOTEL] ::::::::::::::::::::
    const get = async () => {
        setLoading(true);
        try {
            const data = {
                token: Cookies.get("token"),
                page: activePage,
                limit: dataLimit,
                hotelId: selectedHotel,
                startDate: selectedFilters.startDate,
                endDate: selectedFilters.endDate
            }
            setFilterState("amenities-date-wise", dataLimit, activePage);
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


                // Set Total for table footer;
                const { activeHotel, totalGuest, totalAmount } = res.data.reduce((acc, i) => {
                    acc.activeHotel += parseInt(i.activeHotelCount);
                    acc.totalGuest += parseInt(i.totalGuests);
                    acc.totalAmount += parseInt(i.totalAmount);

                    return acc;
                }, { activeHotel: 0, totalGuest: 0, totalAmount: 0 });

                setTotalActiveHotel(activeHotel);
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
        get();
    }, [dataLimit, activePage])


    // ::::::::::::::::::: [ ALL SEARCH FILTER CODE HERE ] :::::::::::::
    const searchTableDatabase = (txt, model) => {
        if (timeRef.current) clearTimeout(timeRef.current);

        timeRef.current = setTimeout(async () => {
            if (!txt && model === "hotel") {
                get();
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
                    setHotelList([...res])
                }

            } catch (error) {

            }

        }, 300)

    }


    // :::::::::::::::::: [GET ALL FILTER DATA WITHOUT HOTEL] ::::::::::::
    const getFilters = async () => {
        const req = await fetch(process.env.REACT_APP_MASTER_API + `/hotel/get`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ token: Cookies.get("token") })
        })
        const res = await req.json();
        setHotelList([...res.data]);
    }
    useEffect(() => {
        getFilters();
    }, [])


    // Export table
    const exportTable = async (whichType) => {
        if (whichType === "copy") {
            copyTable("amenitiesTable"); // Pass tableid
        }
        else if (whichType === "excel") {
            downloadExcel(exportData, 'amenities-list.xlsx') // Pass data and filename
        }
        else if (whichType === "print") {
            printTable(tableRef, "Amenities List"); // Pass table ref and title
        }
        else if (whichType === "pdf") {
            let document = exportPdf('Amenities List', exportData);
            downloadPdf(document)
        }
    }


    // handle filter
    const handleFilter = async () => get();

    // Reset filter form
    const handleResetFilter = async () => window.location.reload();


    return (
        <>
            <Nav title={navTitle} />
            <main id='main'>
                <SideNav />
                <div className='content__body'>

                    {/* Option Bar */}
                    <div className='add_new_compnent border rounded'>
                        <div className='w-full flex items-center gap-1 border-b pb-1'>
                            <Icons.FILTER />
                            <p className='font-semibold uppercase'>Filter</p>
                        </div>
                        <div className='mt-3 w-full'>
                            <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6 w-full mt-3 text-[13px]'>
                                <div className='w-full'>
                                    <p className='mb-1'>Hotel List</p>
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
                                        onSearch={(serachTxt) => searchTableDatabase(serachTxt, "hotel")}
                                        onClean={() => getFilters("hotel")}
                                    />
                                </div>
                                <div className='w-full'>
                                    <p className='mb-1'>Start Date<span className='required__text'>*</span></p>
                                    <input type="date"
                                        value={selectedFilters.startDate}
                                        onChange={(e) => setSelectedFilters({ ...selectedFilters, startDate: e.target.value })}
                                    />
                                </div>
                                <div className='w-full'>
                                    <p className='mb-1'>End Date<span className='required__text'>*</span></p>
                                    <input type="date"
                                        value={selectedFilters.endDate}
                                        onChange={(e) => setSelectedFilters({ ...selectedFilters, endDate: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className='form__btn__grp filter'>
                                <button className='reset__btn' onClick={handleResetFilter}>
                                    <Icons.RESET />
                                    Reset
                                </button>
                                <button className='save__btn' onClick={handleFilter}>
                                    <Icons.SEARCH />
                                    Search
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    <div className='content__body__main mt-4'>
                        <div className='flex justify-between items-center mb-3'>
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
                                        placeholder='Search...'
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
                        {/* Table start */}
                        {loading === false ? <div className='overflow-x-auto list__table list__table__checkin'>
                            <table className='min-w-full bg-white' id='amenitiesTable' ref={tableRef}>
                                <thead className='bg-gray-100 list__table__head'>
                                    <tr>
                                        <td className='w-[5%]' align='center'>SL No.</td>
                                        <td className='w-[15%]'>Date</td>
                                        <td className=''>Active Hotels</td>
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
                                                <td>{d.activeHotelCount}</td>
                                                <td>{d.totalGuests}</td>
                                                <td>{d.totalAmount}</td>
                                                <td align="center">
                                                    <button
                                                        onClick={() => navigate("/admin/amenities-charges/hotel-wise", {
                                                            state: d.date
                                                        })}
                                                        className="flex items-center gap-1 bg-[#93C5FD] hover:bg-[#80b6f3] text-white px-2 py-1 rounded">
                                                        <Icons.EYE />
                                                        View
                                                    </button>
                                                </td>
                                            </tr>
                                        })
                                    }
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td colSpan={2} className="font-semibold text-right text-lg">Total</td>
                                        <td className="font-semibold text-lg">{totalActiveHotel}</td>
                                        <td className="font-semibold text-lg">{totalGuest}</td>
                                        <td className="font-semibold text-lg">{totalAmount}</td>
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

export default DateWise;