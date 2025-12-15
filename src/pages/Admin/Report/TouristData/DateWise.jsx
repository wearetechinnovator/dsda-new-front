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
import useMyToaster from "../../../../hooks/useMyToaster";
import NoData from "../../../../components/Admin/NoData";




const DateWise = () => {
    const toast = useMyToaster();
    const { copyTable, downloadExcel, printTable, exportPdf } = useExportTable();
    const { getFilterState, setFilterState } = useSetTableFilter();
    const savedFilter = getFilterState("dateWise-touristdata");
    const [activePage, setActivePage] = useState(savedFilter?.activePage || 1);
    const [dataLimit, setDataLimit] = useState(savedFilter?.limit || 10);
    const [totalData, setTotalData] = useState()
    const [hotelList, setHotelList] = useState([]);
    const [enrolledData, setEnrolledData] = useState([]);
    const tableRef = useRef(null);
    const exportData = useMemo(() => {
        return enrolledData && enrolledData?.map((e, i) => ({
            "Sl No.": i + 1,
            Date: e.booking_checkin_date_time.split(" ")[0],
            "Total Guest(s) Enrolled": e.booking_number_of_guest
        }));
    }, [enrolledData]);
    const [loading, setLoading] = useState(true);
    const timeRef = useRef(null);
    const [selectedHotel, setSelectedHotel] = useState(null);
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();
    const firstRender = useRef(true); // For don't run useEffect first time;
    const [totalGuest, setTotalGuest] = useState(0);



    // ::::::::::::::::::::::::::::::: [ GET ENROLLED DATA ] ::::::::::::::::::::::::
    const getEnrolled = async (params) => {
        try {
            const data = {
                token: Cookies.get("token"),
                page: activePage,
                limit: dataLimit,
                id: params.hotelId,
                startDate: params.startDate,
                endDate: params.endDate
            }
            setFilterState("dateWise-touristdata", dataLimit, activePage);
            const url = process.env.REACT_APP_BOOKING_API + `/check-in/tourist-data/footfall`;
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
                setEnrolledData([...res.data])
                setLoading(false);

                const totalGuest = res.data.reduce((acc, i) => {
                    acc = acc + parseInt(i.booking_number_of_guest)
                    return acc;
                }, 0);
                setTotalGuest(totalGuest)
            }


        } catch (error) {
            setLoading(false);
        }
    }
    useEffect(() => {
        if (firstRender.current) {
            firstRender.current = false;
            return;
        }

        getEnrolled({
            hotelId: selectedHotel,
            startDate: startDate,
            endDate: endDate
        })
    }, [dataLimit, activePage])


    // ::::::::::::::::::: [ GET HOTEL LIST ALL AND SEARCH FILTER CODE HERE ] :::::::::::::
    const getHotelList = async () => {
        try {
            const url = process.env.REACT_APP_MASTER_API + `/hotel/get`;
            const req = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": 'application/json'
                },
                body: JSON.stringify({ token: Cookies.get("token") })
            });
            const res = await req.json();

            if (req.status === 200 && res.data.length > 0) {
                setHotelList([...res.data])
            }

        } catch (error) {
            return toast("Hotel list not load", 'error')
        }
    }

    useEffect(() => {
        getHotelList();
    }, [])

    const searchTableDatabase = (txt) => {
        if (timeRef.current) clearTimeout(timeRef.current);

        timeRef.current = setTimeout(async () => {
            let data = {
                token: Cookies.get("token"),
                search: txt
            }
            try {
                const url = process.env.REACT_APP_MASTER_API + `/hotel/get`;
                const req = await fetch(url, {
                    method: "POST",
                    headers: {
                        "Content-Type": 'application/json'
                    },
                    body: JSON.stringify(data)
                });
                const res = await req.json();

                if (req.status === 200 && res.length > 0) {
                    setHotelList([...res])
                }

            } catch (error) {
                 
            }

        }, 300)
    }


    // Export table
    const exportTable = async (whichType) => {
        if (whichType === "copy") {
            copyTable("itemTable"); // Pass tableid
        }
        else if (whichType === "excel") {
            downloadExcel(exportData, 'footfall-list.xlsx') // Pass data and filename
        }
        else if (whichType === "print") {
            printTable(tableRef, "Footfall List"); // Pass table ref and title
        }
        else if (whichType === "pdf") {
            let document = exportPdf('Footfall List', exportData);
            downloadPdf(document)
        }
    }


    // handle filter
    const handleFilter = async () => {
        if (!selectedHotel) return toast("Please select hotel", 'error');
        if (!startDate) return toast("Start date can't be blank", 'error');
        if (!endDate) return toast("End date can't be blank", 'error');

        await getEnrolled({
            hotelId: selectedHotel,
            startDate: startDate,
            endDate: endDate
        })
    };

    // Reset filter form
    const handleResetFilter = async () => {
        setSelectedHotel(null);
        setStartDate(null);
        setEndDate(null);
        setEnrolledData([]);
    };


    return (
        <>
            <Nav title={"Footfall Stats"} />
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
                                    <p className='mb-1'>Hotel List<span className='required__text'>*</span></p>
                                    <SelectPicker
                                        block
                                        data={[
                                            ...hotelList?.map((item) => ({
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
                                <div className='w-full'>
                                    <p className='mb-1'>Start Date<span className='required__text'>*</span></p>
                                    <input type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                    />
                                </div>
                                <div className='w-full'>
                                    <p className='mb-1'>End Date<span className='required__text'>*</span></p>
                                    <input type="date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
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
                        <div className='overflow-x-auto list__table list__table__checkin'>
                            <table className='min-w-full bg-white' id='itemTable' ref={tableRef}>
                                <thead className='bg-gray-100 list__table__head'>
                                    <tr>
                                        <td className='w-[5%]' align='center'>SL No.</td>
                                        <td className='w-[15%]'>Date</td>
                                        <td className=''>Total Guest(s) Enrolled</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        enrolledData?.map((d, i) => {
                                            return <tr key={i}>
                                                <td align='center'>{(activePage - 1) * dataLimit + i + 1}</td>
                                                <td>{d.booking_checkin_date_time.split(" ")[0]}</td>
                                                <td>{d.booking_number_of_guest}</td>
                                            </tr>
                                        })
                                    }
                                </tbody>
                                {enrolledData.length > 0 && <tfoot>
                                    <tr>
                                        <td colSpan={2} className="font-semibold text-right text-lg">Total</td>
                                        <td className="font-semibold text-lg">{totalGuest}</td>
                                    </tr>
                                </tfoot>}
                            </table>
                            {enrolledData.length < 1 && <NoData />}
                        </div>
                        {enrolledData.length > 0 && <div className='paginate__parent'>
                            <p>Showing {enrolledData.length} of {totalData} entries</p>
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