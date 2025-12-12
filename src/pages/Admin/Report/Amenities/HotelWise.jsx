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
import { useLocation } from "react-router-dom";
import NoData from "../../../../components/Admin/NoData";




const HotelWise = () => {
    const currentLocation = useLocation();
    const overallDate = currentLocation.state;
    const isTodayFootFallPage = currentLocation.pathname?.endsWith("/today");
    const toast = useMyToaster();
    const { copyTable, downloadExcel, printTable, exportPdf } = useExportTable();
    const [activePage, setActivePage] = useState(1);
    const [dataLimit, setDataLimit] = useState(10);
    const [totalData, setTotalData] = useState()
    const [hotelList, setHotelList] = useState([]);
    const [data, setData] = useState([]);
    const tableRef = useRef(null);
    const exportData = useMemo(() => {
        return data && data.map((h, _) => ({
            Name: h.hotel_name,
            Zone: h.hotel_zone_id?.name,
            Sector: h.hotel_sector_id?.name,
            Proprietor: h.hotel_block_id?.name,
            PoliceStation: h.hotel_police_station_id?.name,
            District: h.hotel_district_id?.name,
            "Total Guest(s) Enrolled": h.hotel_total_guest,
            "Total Charges": h.hotel_total_charges
        }));
    }, [data]);
    const [loading, setLoading] = useState(true);
    const timeRef = useRef(null);
    const [selectedFilters, setSelectedFilters] = useState({
        hotel: '', startDate: isTodayFootFallPage ? new Date().toISOString().split("T")[0] : "",
        endDate: isTodayFootFallPage ? new Date().toISOString().split("T")[0] : ""
    })
    const [isFilterDateSet, setIsFilterDateSet] = useState(null)
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const [navTitle, setNavTitle] = useState("");
    const [allHotel, setAllHotel] = useState([]);
    const [totalEnrolled, setTotalEnrolled] = useState(0);
    const [totalCharge, setTotalCharge] = useState(0);



    // Page wise data change, `Overall` or `Todaywise`
    useEffect(() => {
        if (isTodayFootFallPage) {
            setSelectedFilters(pv => {
                return {
                    ...pv,
                    startDate: new Date().toISOString().split("T")[0],
                    endDate: new Date().toISOString().split("T")[0]
                }
            })
            setNavTitle(`Amenities Stats of Today(${new Date().getDate()} ${monthNames[new Date().getMonth()]}, ${new Date().getFullYear()})`)
        }
        else if (overallDate) {
            setSelectedFilters(pv => {
                return {
                    ...pv,
                    startDate: overallDate,
                    endDate: overallDate
                }
            })
            setNavTitle(`Amenities Stats of (${overallDate})`)

        }
        else {
            setSelectedFilters(pv => {
                return {
                    ...pv,
                    startDate: '',
                    endDate: ''
                }
            })
            setNavTitle('Amenities Stats');
        }

        setIsFilterDateSet(!isFilterDateSet);

    }, [currentLocation])


    // Get All Hotels;
    useEffect(() => {
        (async () => {
            try {
                const data = {
                    token: Cookies.get("token"),
                    all: true
                }
                const req = await fetch(process.env.REACT_APP_MASTER_API + `/hotel/get`, {
                    method: "POST",
                    headers: {
                        "Content-Type": 'application/json'
                    },
                    body: JSON.stringify(data)
                });
                const res = await req.json();
                setAllHotel(res);
            } catch (error) {
                console.log(error);
                return toast("Hotel list not get", "error");
            }
        })()
    }, [])

    // :::::::::::::::::::::: [GET ENROLLED DATA] ::::::::::::::::::::
    const get = async () => {
        try {
            const data = {
                token: Cookies.get("token"),
                page: activePage,
                limit: dataLimit,
                startDate: selectedFilters.startDate,
                endDate: selectedFilters.endDate,
                hotelId: selectedFilters.hotel
            }
            const url = process.env.REACT_APP_BOOKING_API + `/check-in/get-hotel-enrolled-data`;
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
                const { totalEnrolled, totalCharge } = res.data.reduce((acc, i) => {
                    acc.totalEnrolled += parseInt(i.totalEnrolled);
                    acc.totalCharge += parseInt(i.totalCharges);

                    return acc;
                }, { totalEnrolled: 0, totalCharge: 0});

                setTotalEnrolled(totalEnrolled);
                setTotalCharge(totalCharge);
            }
            setLoading(false);

        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        get();
    }, [dataLimit, activePage, isFilterDateSet])


    // ::::::::::::::::::: [ ALL SEARCH FILTER CODE HERE ] :::::::::::::::::
    const searchTableDatabase = (txt) => {
        if (timeRef.current) clearTimeout(timeRef.current);

        timeRef.current = setTimeout(async () => {
            if (!txt) {
                get();
                return;
            }

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
                
                setTotalData(res.length);
                setHotelList([...res]);
            } catch (error) {
                console.log(error)
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
            copyTable("itemTable"); // Pass tableid
        }
        else if (whichType === "excel") {
            downloadExcel(exportData, 'item-list.xlsx') // Pass data and filename
        }
        else if (whichType === "print") {
            printTable(tableRef, "Item List"); // Pass table ref and title
        }
        else if (whichType === "pdf") {
            let document = exportPdf('Item List', exportData);
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

                        <div className='mt-3 w-full border-t pt-2'>
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
                                        onChange={(v) => setSelectedFilters({
                                            ...selectedFilters, hotel: v
                                        })}
                                        value={selectedFilters.hotel}
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

                    {/* ============================================================== */}
                    {/* Current Stay In Guest List */}
                    {/* ============================================================== */}
                    {
                        !loading ? <div className='content__body__main mt-4'>
                            <div className='w-full flex gap-1 border-b pb-1'>
                                <Icons.USERS />
                                <p className='font-semibold uppercase'>Current Status</p>
                            </div>
                            {/* Table start */}
                            <div className='overflow-x-auto list__table list__table__checkin'>
                                <table className='min-w-full bg-white' id='itemTable' ref={tableRef}>
                                    <thead className='bg-gray-100 list__table__head'>
                                        <tr>
                                            <td>Sl.</td>
                                            <td className=''>Hotel Name</td>
                                            <td className=''>Zone</td>
                                            <td className=' '>Sector</td>
                                            <td className=''>Block</td>
                                            <td className=''>Police Station</td>
                                            <td className=''>District</td>
                                            <td className='w-[12%]'>Total Guest(s) Enrolled</td>
                                            <td className='w-[8%]'>Total Charges</td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            allHotel.length > 0 && data?.map((d, i) => {
                                                const currentHotel = allHotel?.find((h, i) => d.hotelId === h._id);
                                                return <tr key={i} className='hover:bg-gray-100'>
                                                    <td align='center'>{(activePage - 1) * dataLimit + i + 1}</td>
                                                    <td>{currentHotel.hotel_name}</td>
                                                    <td>{currentHotel.hotel_zone_id?.name || "--"}</td>
                                                    <td>{currentHotel.hotel_sector_id?.name || "--"}</td>
                                                    <td>{currentHotel.hotel_block_id?.name || "--"}</td>
                                                    <td>{currentHotel.hotel_police_station_id?.name || "--"}</td>
                                                    <td>{currentHotel.hotel_district_id?.name || "--"}</td>
                                                    <td>{d.totalEnrolled}</td>
                                                    <td>{d.totalCharges}</td>
                                                </tr>
                                            })
                                        }
                                    </tbody>
                                    {
                                        allHotel.length > 0 && (
                                            <tr>
                                                <td colSpan={7} className="font-semibold text-right text-lg">Total</td>
                                                <td className="font-semibold text-lg">{totalEnrolled}</td>
                                                <td className="font-semibold text-lg">{totalCharge}</td>
                                            </tr>
                                        )
                                    }
                                </table>
                                {data.length < 1 && <NoData />}
                            </div>
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
                            : <DataShimmer />
                    }

                </div>
            </main>
        </>
    )
}

export default HotelWise;