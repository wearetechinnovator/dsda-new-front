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



const BedAvailablity = () => {
    const { copyTable, downloadExcel, printTable, exportPdf } = useExportTable();
    const { getFilterState, setFilterState } = useSetTableFilter();
    const savedFilter = getFilterState("bed-availablity");
    const [activePage, setActivePage] = useState(savedFilter?.activePage || 1);
    const [dataLimit, setDataLimit] = useState(savedFilter?.limit || 10);
    const [totalData, setTotalData] = useState()
    const [data, setData] = useState([]);
    const tableRef = useRef(null);
    const exportData = useMemo(() => {
        return data && data.map(({ hotel_name, hotel_zone_id, hotel_sector_id,
            hotel_block_id, hotel_police_station_id, hotel_district_id, hotel_total_bed }, _) => ({
                "Hotel Name": hotel_name,
                Zone: hotel_zone_id?.name,
                Sector: hotel_sector_id?.name,
                Block: hotel_block_id?.name || "--",
                PoliceStation: hotel_police_station_id?.name || "--",
                District: hotel_district_id?.name || "--",
                "Total Bed": hotel_total_bed || "--"
            }));
    }, [data]);
    const [loading, setLoading] = useState(true);
    const timeRef = useRef(null);
    const [selectedHotel, setSelectedHotel] = useState(null);
    const [hotelList, setHotelList] = useState([]);
    const [bedStatus, setBedStatus] = useState('all')
    const [totalBed, setTotalBed] = useState()



    // :::::::::::::::::::::: [GET ALL HOTEL] :::::::::::::::::;
    const get = async () => {
        try {
            const data = {
                token: Cookies.get("token"),
                page: activePage,
                limit: dataLimit,
                occupied: true, // Get Occupied field also;
                bedStatus: bedStatus
            }
            setFilterState("bed-availablity", dataLimit, activePage);
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
            setHotelList([...res.data]);
            setLoading(false);

        } catch (error) {
             
        }
    }
    useEffect(() => {
        get();
    }, [dataLimit, activePage])


    // ::::::::::::::::::::::::::: [ ALL SEARCH FILTER CODE HERE ] ::::::::::::::::::::::::::
    const searchTableDatabase = (txt, from) => {
        if (timeRef.current) clearTimeout(timeRef.current);

        timeRef.current = setTimeout(async () => {
            if (!txt) {
                get();
                return;
            }
            try {
                const data = {
                    token: Cookies.get("token"),
                    search: txt,
                    occupied: true // Get Occupied field also;
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

                if (from === "picker") {
                    setHotelList([...res]);
                } else {
                    setTotalData(res.length)
                    setData([...res])
                }



            } catch (error) {
                 
            }

        }, 150)

    }


    const exportTable = async (whichType) => {
        if (whichType === "copy") {
            copyTable("ReportTable"); // Pass tableid
        }
        else if (whichType === "excel") {
            downloadExcel(exportData, 'HotelReport-list.xlsx') // Pass data and filename
        }
        else if (whichType === "print") {
            printTable(tableRef, "Hotel Report"); // Pass table ref and title
        }
        else if (whichType === "pdf") {
            let document = exportPdf('Hotel Report', exportData);
            downloadPdf(document)
        }
    }


    return (
        <>
            <Nav title={"Hotel Report Table"} />
            <main id='main'>
                <SideNav />
                <Tooltip id='itemTooltip' />
                <div className='content__body'>
                    <div className='content__body__main border rounded mb-4'>
                        <div className='w-full flex gap-1 items-center border-b pb-1'>
                            <Icons.SEARCH />
                            <p className='font-semibold uppercase'>Filter</p>
                        </div>
                        <div id='itemFilter' className='mt-5 w-full'>
                            <div className='w-full mt-3 text-[13px] flex items-center gap-4'>
                                <div className='w-full'>
                                    <p className='mb-1'>Hotel List</p>
                                    <SelectPicker
                                        block
                                        data={[
                                            ...hotelList.map((item) => ({
                                                label: item.hotel_name,
                                                value: item.hotel_name
                                            }))
                                        ]}
                                        style={{ width: '100%' }}
                                        onChange={(v) => setSelectedHotel(v)}
                                        value={selectedHotel}
                                        placeholder="Select"
                                        searchable={true}
                                        cleanable={true}
                                        placement='bottomEnd'
                                        onSearch={(serachTxt) => searchTableDatabase(serachTxt, "picker")}
                                    />
                                </div>
                                <div className="w-full">
                                    <p className='mb-1'>Status</p>
                                    <select className=''
                                        value={bedStatus}
                                        onChange={(e) => setBedStatus(e.target.value)}>
                                        <option value="all">All</option>
                                        <option value="occupied">Occupied</option>
                                        <option value="vacant">Vacant</option>
                                        <option value="extra">Extra Occupancy</option>
                                    </select>
                                </div>
                            </div>
                            <div className='form__btn__grp filter'>
                                <button className='reset__btn' onClick={() => {
                                    setSelectedHotel('');
                                    setBedStatus('all');
                                    get();
                                }}>
                                    <Icons.RESET />
                                    Reset
                                </button>
                                <button className='save__btn' onClick={() => {
                                    searchTableDatabase(selectedHotel, "hotel")
                                }}>
                                    <Icons.SEARCH />
                                    Search
                                </button>
                            </div>
                        </div>
                    </div>

                    {!loading ?
                        <div className='content__body__main '>
                            <div className='w-full flex gap-1 items-center border-b pb-1'>
                                <Icons.BED />
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
                                                onChange={(e) => searchTableDatabase(e.target.value)}
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
                                <table className='min-w-full bg-white' id='ReportTable' ref={tableRef}>
                                    <thead className='bg-gray-100 list__table__head'>
                                        <tr>
                                            <td align='center'>SL No.</td>
                                            <td>Hotel Name</td>
                                            <td>Zone</td>
                                            <td>Sector</td>
                                            <td>Block</td>
                                            <td>Police Station</td>
                                            <td>Dictrict</td>
                                            <td>Total Bed</td>
                                            <td>Occupied Bed</td>
                                            <td>Vacant Bed</td>
                                            <td>Extra Occupied Bed</td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            data?.map((d, i) => {
                                                return <tr key={i}>
                                                    <td align='center'>{(activePage - 1) * dataLimit + i + 1}</td>
                                                    <td>{d.hotel_name}</td>
                                                    <td>{d.hotel_zone_id?.name}</td>
                                                    <td>{d.hotel_sector_id?.name}</td>
                                                    <td>{d.hotel_block_id?.name}</td>
                                                    <td>{d.hotel_police_station_id?.name}</td>
                                                    <td>{d.hotel_district_id?.name}</td>
                                                    <td>{d.hotel_total_bed || 0}</td>
                                                    <td>{d.hotel_total_occupied || 0}</td>
                                                    <td>{
                                                        parseInt(d.hotel_total_bed || 0) - parseInt(d.hotel_total_occupied || 0) < 1 ?
                                                            0 :
                                                            parseInt(d.hotel_total_bed || 0) - parseInt(d.hotel_total_occupied || 0)
                                                    }</td>
                                                    <td>{
                                                        parseInt(d.hotel_total_bed || 0) - parseInt(d.hotel_total_occupied || 0) < 1 ?
                                                            parseInt(d.hotel_total_occupied || 0) - parseInt(d.hotel_total_bed || 0) :
                                                            0
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
                        : <DataShimmer />
                    }
                </div>
            </main>
        </>
    )
}

export default BedAvailablity;
