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
        return data && data?.map((h, i) => ({
            "Sl No.": i + 1,
            "Hotel Name": h.hotel_details?.hotel_name,
            Zone: h.hotel_details?.hotel_zone_id?.name,
            Sector: h.hotel_details?.hotel_sector_id?.name,
            Block: h.hotel_details?.hotel_block_id?.name,
            "Police Station": h.hotel_details?.hotel_police_station_id?.name,
            District: h.hotel_details?.hotel_district_id?.name,
            Footfall: "--",
            "Male": h.totalMale,
            "Female": h.totalFemale,
            "Other Gender": h.totalOtherGender,
            "Adult": h.totalAdult,
            "Child": h.totalChild,
            "Indian": h.totalIndian,
            "Foreigner": h.totalForeigner,
            "Amenity Charge": "--",
        }));
    }, [data]);
    const [loading, setLoading] = useState(true);
    const timeRef = useRef(null);
    const [selectedHotel, setSelectedHotel] = useState(null);
    const [selectedFilters, setSelectedFilters] = useState({
        hotel: '', zone: '', block: '', district: '', policeStation: '', sector: '',
        startDate: isTodayFootFallPage ? new Date().toISOString().split("T")[0] : "",
        endDate: isTodayFootFallPage ? new Date().toISOString().split("T")[0] : "",
        month: '', year: ''
    })
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const [navTitle, setNavTitle] = useState("")


    // Page wise data change, `Overall` or `Todaywise`
    useEffect(() => {
        if (isTodayFootFallPage) {
            setSelectedFilters({
                ...selectedFilters,
                startDate: new Date().toISOString().split("T")[0],
                endDate: new Date().toISOString().split("T")[0]
            })
            setNavTitle(`Amenities Stats of Today(${new Date().getDate()} ${monthNames[new Date().getMonth()]}, ${new Date().getFullYear()})`)
        } else {
            setSelectedFilters({
                ...selectedFilters,
                startDate: '',
                endDate: ''
            })
            setNavTitle('Amenities Stats')
        }
    }, [currentLocation])

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
            const url = process.env.REACT_APP_BOOKING_API + `/check-in/tourist-data/footfall-daywise`;
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

            } else {
                // setLoading(false); 
                return toast("Hotel data not load", 'error')
            }

        } catch (error) {
            console.log(error)
            return toast("Hotel data not load", 'error')
        }
    }
    useEffect(() => {
        get();
    }, [dataLimit, activePage, currentLocation])


    // ::::::::::::::::::: [ ALL SEARCH FILTER CODE HERE ] :::::::::::::
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
                        {/* Table start */}
                        {loading === false ? <div className='overflow-x-auto list__table list__table__checkin'>
                            <table className='min-w-full bg-white' id='itemTable' ref={tableRef}>
                                <thead className='bg-gray-100 list__table__head'>
                                    <tr>
                                        <td className='w-[5%]' align='center'>SL No.</td>
                                        <td className='w-[15%]'>Hotel Name</td>
                                        <td className=''>Zone</td>
                                        <td>Sector</td>
                                        <td>Block</td>
                                        <td>Police Station</td>
                                        <td>District</td>
                                        <td>Total Guest(s) Enrolled</td>
                                        <td>Total Charges (₹)</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        data?.map((d, i) => {
                                            return <tr key={i}>
                                                <td align='center'>{i + 1}</td>
                                                <td>{d.hotel_details?.hotel_name}</td>
                                                <td>{d?.hotel_details?.hotel_zone_id?.name}</td>
                                                <td>{d?.hotel_details?.hotel_sector_id?.name}</td>
                                                <td>{d?.hotel_details?.hotel_block_id?.name}</td>
                                                <td>{d?.hotel_details?.hotel_police_station_id?.name}</td>
                                            </tr>
                                        })
                                    }
                                </tbody>
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

export default HotelWise;