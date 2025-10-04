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
        return data && data.map(({ hotel_name, hotel_zone_id, hotel_sector_id,
            hotel_block_id, hotel_police_station_id, hotel_district_id, }, _) => ({
                Name: hotel_name,
                Zone: hotel_zone_id?.name,
                Sector: hotel_sector_id?.name,
                Proprietor: hotel_block_id?.name || "--",
                PoliceStation: hotel_police_station_id?.name || "--",
                District: hotel_district_id?.name || "--"
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

    // :::::::::::::::::::::: [GET ALL HOTEL] :::::::::::::::::;
    const get = async () => {
        try {
            const data = {
                token: Cookies.get("token"),
                page: activePage,
                limit: dataLimit
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

    // ::::::::::::::::::::::::::: [ ALL SEARCH FILTER CODE HERE ] ::::::::::::::::::::::::::
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


    // :::::::::::::::::: [GET ALL FILTER DATA WITHOUT HOTEL] :::::::::::::
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


    return (
        <>
            <Nav title={"Hotel List Table"} />
            <main id='main'>
                <SideNav />
                <Tooltip id='itemTooltip' />
                <div className='content__body'>
                    <div className={`add_new_compnent`}>
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

                        <div id='itemFilter' className='mt-5 w-full border-t pt-2'>
                            <p className='font-bold'>Filter</p>

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
                                <button className='save__btn'>
                                    <Icons.SEARCH />
                                    Search
                                </button>
                                <button className='reset__btn'>
                                    <Icons.RESET />
                                    Reset
                                </button>
                            </div>
                        </div>
                    </div>
                    {!loading ?
                        <div className='content__body__main'>
                            {/* Table start */}
                            <div className='overflow-x-auto list__table'>
                                <table className='min-w-full bg-white' id='itemTable' ref={tableRef}>
                                    <thead className='bg-gray-100 list__table__head'>
                                        <tr>
                                            <th className='py-2 px-4 border-b '>SL No.</th>
                                            <th className='py-2 px-4 border-b '>Hotel Name</th>
                                            <th className='py-2 px-4 border-b'>Zone</th>
                                            <th className='py-2 px-4 border-b '>Sector</th>
                                            <th className='py-2 px-4 border-b'>Block</th>
                                            <th className='py-2 px-4 border-b'>Police Station</th>
                                            <th className='py-2 px-4 border-b'>Dictrict</th>
                                            <th className='py-2 px-4 border-b'>Address</th>
                                            <th className='py-2 px-4 border-b'>Email</th>
                                            <th className='py-2 px-4 border-b'>Reception Phone</th>
                                            <th className='py-2 px-4 border-b'>Proprietor Phone</th>
                                            <th className='py-2 px-4 border-b'>Manager Name</th>
                                            <th className='py-2 px-4 border-b'>Manager Phone</th>
                                            <th className='py-2 px-4 border-b'>Alternative Phone</th>
                                            <th className='py-2 px-4 border-b'>Total Room</th>
                                            <th className='py-2 px-4 border-b'>Total Bed</th>
                                            <th className='py-2 px-4 border-b'>Restaurant</th>
                                            <th className='py-2 px-4 border-b'>Confarence Hall</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            data.map((d, i) => {
                                                return <tr key={i}>
                                                    <td className='px-4 border-b'>{i + 1}</td>
                                                    <td className='px-4 border-b'>{d.hotel_name}</td>
                                                    <td className='px-4 border-b'>{d?.hotel_zone_id?.name}</td>
                                                    <td className='px-4 border-b'>{d?.hotel_sector_id?.name}</td>
                                                    <td className='px-4 border-b'>{d?.hotel_block_id?.name || "--"}</td>
                                                    <td className='px-4 border-b'>{d?.hotel_police_station_id?.name || "--"}</td>
                                                    <td className='px-4 border-b'>{d?.hotel_district_id?.name || "--"}</td>
                                                    <td className='px-4 border-b'>{d?.hotel_address || "--"}</td>
                                                    <td className='px-4 border-b'>{d?.hotel_email || "--"}</td>
                                                    <td className='px-4 border-b'>{d?.hotel_reception_phone || "--"}</td>

                                                    <td className='px-4 border-b'>{d?.hotel_proprietor_phone || "--"}</td>
                                                    <td className='px-4 border-b'>{d?.hotel_manager_name || "--"}</td>
                                                    <td className='px-4 border-b'>{d?.hotel_manager_phone || "--"}</td>
                                                    <td className='px-4 border-b'>{d?.hotel_manager_phone_alternative || "--"}</td>
                                                    <td className='px-4 border-b'>{d?.hotel_total_room || "--"}</td>
                                                    <td className='px-4 border-b'>{d?.hotel_total_bed || "--"}</td>
                                                    <td className='px-4 border-b'>{d?.hotel_has_restaurant === "1" ? "Available" : "Not Available"}</td>
                                                    <td className='px-4 border-b'>{d?.hotel_has_conference_hall === "1" ? "Available" : "Not Available"}</td>
                                                </tr>
                                            })
                                        }
                                    </tbody>
                                </table>
                            </div>
                            <div className='paginate__parent'>
                                <p>Showing {data.length} of {totalData} entries</p>
                                <Pagination
                                    activePage={activePage}
                                    totalData={totalData}
                                    dataLimit={dataLimit}
                                    setActivePage={setActivePage}
                                />
                            </div>
                        </div>
                        : <DataShimmer />
                    }
                </div>
            </main>
        </>
    )
}

export default HotelList;
