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
            hotel_block_id, hotel_police_station_id, hotel_district_id, hotel_total_bed}, _) => ({
                "Hotel Name": hotel_name,
                Zone: hotel_zone_id?.name,
                Sector: hotel_sector_id?.name,
                Block: hotel_block_id?.name || "--",
                PoliceStation: hotel_police_station_id?.name || "--",
                District: hotel_district_id?.name || "--",
                "Total Bed":hotel_total_bed || "--"
            }));
    }, [data]);
    const [loading, setLoading] = useState(true);
    const timeRef = useRef(null);
    const [selectedHotel, setSelectedHotel] = useState(null);


    // :::::::::::::::::::::: [GET ALL HOTEL] :::::::::::::::::;
    const get = async () => {
        try {
            const data = {
                token: Cookies.get("token"),
                page: activePage,
                limit: dataLimit
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
                            <div className='w-full mt-3 text-[13px]'>
                                <div className='w-full'>
                                    <p className='mb-1'>Hotel List</p>
                                    <SelectPicker
                                        block
                                        data={[
                                            ...data.map((item) => ({
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
                                        onSearch={(serachTxt) => searchTableDatabase(serachTxt, "hotel")}
                                    />
                                </div>
                            </div>
                            <div className='form__btn__grp filter'>
                                <button className='save__btn' onClick={()=>{
                                    searchTableDatabase(selectedHotel, "hotel")
                                }}>
                                    <Icons.SEARCH />
                                    Search
                                </button>
                                <button className='reset__btn' onClick={()=>{
                                    get();
                                    setSelectedHotel('');
                                }}>
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
                                <table className='min-w-full bg-white' id='ReportTable' ref={tableRef}>
                                    <thead className='bg-gray-100 list__table__head'>
                                        <tr>
                                            <th className='py-2 px-4 border-b '>SL No.</th>
                                            <th className='py-2 px-4 border-b '>Hotel Name</th>
                                            <th className='py-2 px-4 border-b'>Zone</th>
                                            <th className='py-2 px-4 border-b '>Sector</th>
                                            <th className='py-2 px-4 border-b'>Block</th>
                                            <th className='py-2 px-4 border-b'>Police Station</th>
                                            <th className='py-2 px-4 border-b'>Dictrict</th>
                                            <th className='py-2 px-4 border-b'>Total Bed</th>
                                            <th className='py-2 px-4 border-b'>Occupied Bed</th>
                                            <th className='py-2 px-4 border-b'>Vacant Bed</th>
                                            <th className='py-2 px-4 border-b'>Extra Occupied Bed</th>
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
                                                    <td className='px-4 border-b'>{d?.hotel_total_bed || "--"}</td>
                                                    <td className='px-4 border-b'>{d?.hotel_email || "--"}</td>
                                                    <td className='px-4 border-b'>{d?.hotel_reception_phone || "--"}</td>
                                                    <td className='px-4 border-b'>{d?.hotel_proprietor_phone || "--"}</td>
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

export default BedAvailablity;
