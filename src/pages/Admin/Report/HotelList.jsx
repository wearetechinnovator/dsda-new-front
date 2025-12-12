import { useEffect, useMemo, useRef, useState } from 'react'
import Nav from '../../../components/Admin/Nav';
import SideNav from '../../../components/Admin/SideNav';
import useExportTable from '../../../hooks/useExportTable';
import Cookies from 'js-cookie';
import downloadPdf from '../../../helper/downloadPdf';
import DataShimmer from '../../../components/Admin/DataShimmer';
import { Tooltip } from 'react-tooltip';
import { Popover, SelectPicker, Whisper } from 'rsuite';
import { Icons } from '../../../helper/icons';
import Pagination from '../../../components/Admin/Pagination';
import useSetTableFilter from '../../../hooks/useSetTableFilter';
import NoData from '../../../components/Admin/NoData'



const HotelList = () => {
    const { copyTable, downloadExcel, printTable, exportPdf } = useExportTable();
    const { getFilterState, setFilterState } = useSetTableFilter();
    const savedFilter = getFilterState("hotel-list");
    const [activePage, setActivePage] = useState(savedFilter?.activePage || 1);
    const [dataLimit, setDataLimit] = useState(savedFilter?.limit || 10);
    const [totalData, setTotalData] = useState()
    const [data, setData] = useState([]);
    const tableRef = useRef(null);
    const exportData = useMemo(() => {
        return data && data?.map((h, _) => ({
            "Hotel Name": h.hotel_name,
            "Zone": h.hotel_zone_id?.name,
            "Sector": h.hotel_sector_id?.name,
            "Block": h.hotel_block_id?.name,
            "Police Station": h.hotel_police_station_id?.name,
            "District": h.hotel_district_id?.name,
            "Address": h.hotel_address,
            "Email": h.hotel_email,
            "Reception Phone": h.hotel_reception_phone,
            "Proprietor Phone": h.hotel_proprietor_phone,
            "Proprietor Name": h.hotel_proprietor_name,
            "Manager Name": h.hotel_manager_name,
            "Manager Phone": h.hotel_manager_phone,
            "Alternative Phone": h.hotel_manager_phone_alternative,
            "Total Room": h.hotel_total_room,
            "Total Bed": h.hotel_total_bed,
            "Restaurant": h.hotel_has_restaurant === "1" ? "Available" : "Not Available",
            "Confarence Hall": h.hotel_has_conference_hall === "1" ? "Available" : "Not Available",
            "AC": h.hotel_has_ac === "1" ? 'Yes' : 'No',
            "Swimming Pool": h.hotel_has_swimming_pool === "1" ? 'Yes' : 'No',
            "Parking": h.hotel_has_parking === "1" ? 'Yes' : 'No'
        }));
    }, [data]);
    const [loading, setLoading] = useState(true);
    const timeRef = useRef(null);
    const [selectedHotel, setSelectedHotel] = useState(null);
    const [selectedFilters, setSelectedFilters] = useState({
        hotel: '', zone: '', block: '', district: '', policeStation: '', sector: ''
    })
    const [filterBlock, setFilterBlock] = useState([]);
    const [filterZone, setFilterZone] = useState([]);
    const [filterSector, setFilterSector] = useState([]);
    const [filterDistrict, setFilterDistrict] = useState([]);
    const [filterPoliceStation, setFilterPoliceStation] = useState([]);



    // :::::::::::::::::::::: [GET ALL HOTEL] ::::::::::::::::::::
    const get = async () => {
        try {
            const data = {
                token: Cookies.get("token"),
                page: activePage,
                limit: dataLimit,
                zone: selectedFilters.zone,
                block: selectedFilters.block,
                sector: selectedFilters.sector,
                district: selectedFilters.district,
                policeStation: selectedFilters.policeStation,
                hotelId: selectedHotel
            }
            setFilterState("hotel-list", dataLimit, activePage);
            const url = process.env.REACT_APP_MASTER_API + `/hotel/get`;
            const req = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": 'application/json'
                },
                body: JSON.stringify(data)
            });
            const res = await req.json();
            setTotalData(res.total)
            setData([...res.data])
            setLoading(false);

        } catch (error) {
            console.log(error)
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
                    setData([...res])
                }

            } catch (error) {
                console.log(error)
            }

        }, 300)

    }

    // :::::::::::::::::: [GET ALL FILTER DATA WITHOUT HOTEL] ::::::::::::
    useEffect(() => {
        const get = async (model) => {
            const data = {
                token: Cookies.get("token")
            }
            const url = process.env.REACT_APP_MASTER_API + `/${model}/get`
            const req = await fetch(url, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            })
            const res = await req.json();

            if (model === "block") {
                setFilterBlock([...res.data])
            } else if (model === "zone") {
                setFilterZone([...res.data]);
            } else if (model === "sector") {
                setFilterSector([...res.data]);
            }
            else if (model === "district") {
                setFilterDistrict([...res.data]);
            }
            else if (model === "police-station") {
                setFilterPoliceStation([...res.data]);
            }
        }

        get("block");
        get("zone");
        get("sector");
        get("district");
        get("police-station");
    }, [])


    // Export table
    const exportTable = async (whichType) => {
        if (whichType === "copy") {
            copyTable("hotelTable"); // Pass tableid
        }
        else if (whichType === "excel") {
            downloadExcel(exportData, 'hotel-details.xlsx') // Pass data and filename
        }
        else if (whichType === "print") {
            printTable(tableRef, "Hotel Details List"); // Pass table ref and title
        }
        else if (whichType === "pdf") {
            let document = exportPdf('Hotel Details List', exportData);
            downloadPdf(document)
        }
    }

    // handle filter
    const handleFilter = async () => get();

    // Reset filter form
    const handleResetFilter = async () => window.location.reload();


    return (
        <>
            <Nav title={"Hotel List Table"} />
            <main id='main'>
                <SideNav />
                <Tooltip id='itemTooltip' />
                <div className='content__body'>
                    <div className='content__body__main'>
                        <div className='w-full flex gap-1 items-center border-b pb-1'>
                            <Icons.SEARCH />
                            <p className='font-bold uppercase'>Filter</p>
                        </div>
                        <div id='itemFilter' className='mt-5 w-full'>
                            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full mt-3 text-[13px]'>
                                <div className='w-full'>
                                    <p className='mb-1'>Hotel List</p>
                                    <SelectPicker
                                        block
                                        data={[
                                            ...data.map((item) => ({
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
                                    />
                                </div>
                                <div className='w-full'>
                                    <p className='mb-1'>Zone<span className='required__text'>*</span></p>
                                    <SelectPicker
                                        block
                                        data={[
                                            ...filterZone.map((item) => ({
                                                label: item.name,
                                                value: item._id
                                            }))
                                        ]}
                                        style={{ width: '100%' }}
                                        onChange={(v) => setSelectedFilters({ ...selectedFilters, zone: v })}
                                        value={selectedFilters.zone}
                                        placeholder="Select"
                                        searchable={true}
                                        cleanable={true}
                                        placement='bottomEnd'
                                        onSearch={(serachTxt) => searchTableDatabase(serachTxt, "zone")}
                                    />
                                </div>
                                <div className='w-full'>
                                    <p className='mb-1'>Sector<span className='required__text'>*</span></p>
                                    <SelectPicker
                                        block
                                        data={[
                                            ...filterSector.map((item) => ({
                                                label: item.name,
                                                value: item._id
                                            }))
                                        ]}
                                        style={{ width: '100%' }}
                                        onChange={(v) => setSelectedFilters({ ...selectedFilters, sector: v })}
                                        value={selectedFilters.sector}
                                        placeholder="Select"
                                        searchable={true}
                                        cleanable={true}
                                        placement='bottomEnd'
                                        onSearch={(serachTxt) => searchTableDatabase(serachTxt, "sector")}
                                    />
                                </div>
                                <div className='w-full'>
                                    <p className='mb-1'>Block<span className='required__text'>*</span></p>
                                    <SelectPicker
                                        block
                                        data={[
                                            ...filterBlock.map((item) => ({
                                                label: item.name,
                                                value: item._id
                                            }))
                                        ]}
                                        style={{ width: '100%' }}
                                        onChange={(v) => setSelectedFilters({ ...selectedFilters, block: v })}
                                        value={selectedFilters.block}
                                        placeholder="Select"
                                        searchable={true}
                                        cleanable={true}
                                        placement='bottomEnd'
                                        onSearch={(serachTxt) => searchTableDatabase(serachTxt, "block")}
                                    />
                                </div>
                                <div className='w-full'>
                                    <p className='mb-1'>District<span className='required__text'>*</span></p>
                                    <SelectPicker
                                        block
                                        data={[
                                            ...filterDistrict.map((item) => ({
                                                label: item.name,
                                                value: item._id
                                            }))
                                        ]}
                                        style={{ width: '100%' }}
                                        onChange={(v) => setSelectedFilters({ ...selectedFilters, district: v })}
                                        value={selectedFilters.district}
                                        placeholder="Select"
                                        searchable={true}
                                        cleanable={true}
                                        placement='bottomEnd'
                                        onSearch={(serachTxt) => searchTableDatabase(serachTxt, "district")}
                                    />
                                </div>
                                <div className='w-full'>
                                    <p className='mb-1'>Police Station<span className='required__text'>*</span></p>
                                    <SelectPicker
                                        block
                                        data={[
                                            ...filterPoliceStation.map((item) => ({
                                                label: item.name,
                                                value: item._id
                                            }))
                                        ]}
                                        style={{ width: '100%' }}
                                        onChange={(v) => setSelectedFilters({ ...selectedFilters, policeStation: v })}
                                        value={selectedFilters.policeStation}
                                        placeholder="Select"
                                        searchable={true}
                                        cleanable={true}
                                        placement='bottomEnd'
                                        onSearch={(serachTxt) => searchTableDatabase(serachTxt, "police-station")}
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

                    {!loading ?
                        <div className='content__body__main mt-4'>
                            <div className='w-full flex gap-1 items-center border-b pb-1'>
                                <Icons.HOTEL />
                                <p className='font-semibold uppercase'>Hotel Table</p>
                            </div>
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
                            </div>
                            {/* Table start */}
                            <div className='overflow-x-auto list__table'>
                                <table className='min-w-full bg-white' id='hotelTable' ref={tableRef}>
                                    <thead className='bg-gray-100 list__table__head'>
                                        <tr>
                                            <td className='w-[5%]' align='center'>SL No.</td>
                                            <td className=''>Hotel Name</td>
                                            <td className=''>Zone</td>
                                            <td className=' '>Sector</td>
                                            <td className=''>Block</td>
                                            <td className='w-[8%]'>Police Station</td>
                                            <td className=''>Dictrict</td>
                                            <td className='w-[12%]'>Address</td>
                                            <td className=''>Email</td>
                                            <td className='w-[15%]'>Reception Phone</td>
                                            <td className='w-[12%]'>Proprietor Phone</td>
                                            <td className='w-[12%]'>Proprietor Name</td>
                                            <td className='w-[12%]'>Manager Name</td>
                                            <td className='w-[12%]'>Manager Phone</td>
                                            <td className='w-[12%]'>Alternative Phone</td>
                                            <td className='w-[12%]'>Total Room</td>
                                            <td className=''>Total Bed</td>
                                            <td align='center'>Restaurant</td>
                                            <td align='center'>Confarence Hall</td>
                                            <td align='center'>AC</td>
                                            <td align='center'>Swimming Pool</td>
                                            <td align='center'>Parking</td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            data?.map((d, i) => {
                                                return <tr key={i}>
                                                    <td align='center'>{(activePage - 1) * dataLimit + i + 1}</td>
                                                    <td>{d.hotel_name}</td>
                                                    <td>{d?.hotel_zone_id?.name}</td>
                                                    <td>{d?.hotel_sector_id?.name}</td>
                                                    <td>{d?.hotel_block_id?.name || "--"}</td>
                                                    <td>{d?.hotel_police_station_id?.name || "--"}</td>
                                                    <td>{d?.hotel_district_id?.name || "--"}</td>
                                                    <td>{d?.hotel_address || "--"}</td>
                                                    <td>{d?.hotel_email || "--"}</td>
                                                    <td>{d?.hotel_reception_phone || "--"}</td>
                                                    <td>{d?.hotel_proprietor_phone || "--"}</td>
                                                    <td>{d?.hotel_proprietor_name || "--"}</td>
                                                    <td>{d?.hotel_manager_name || "--"}</td>
                                                    <td>{d?.hotel_manager_phone || "--"}</td>
                                                    <td>{d?.hotel_manager_phone_alternative || "--"}</td>
                                                    <td>{d?.hotel_total_room || "--"}</td>
                                                    <td>{d?.hotel_total_bed || "--"}</td>
                                                    <td>{
                                                        d?.hotel_has_restaurant === "1" ?
                                                            <span className='chip chip__green'> Yes </span> :
                                                            <span className='chip chip__red'> No </span>
                                                    }</td>
                                                    <td>{d?.hotel_has_conference_hall === "1" ?
                                                        <span className='chip chip__green'> Yes </span> :
                                                        <span className='chip chip__red'> No </span>
                                                    }</td>
                                                    <td>{d?.hotel_has_ac === "1" ?
                                                        <span className='chip chip__green'> Yes </span> :
                                                        <span className='chip chip__red'> No </span>
                                                    }</td>
                                                    <td>{d?.hotel_has_swimming_pool === "1" ?
                                                        <span className='chip chip__green'> Yes </span> :
                                                        <span className='chip chip__red'> No </span>
                                                    }</td>
                                                    <td>{d?.hotel_has_parking === "1" ?
                                                        <span className='chip chip__green'> Yes </span> :
                                                        <span className='chip chip__red'> No </span>
                                                    }</td>

                                                </tr>
                                            })
                                        }
                                    </tbody>
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
                        : <>
                            <br />
                            <DataShimmer />
                        </>
                    }
                </div>
            </main>
        </>
    )
}

export default HotelList;
