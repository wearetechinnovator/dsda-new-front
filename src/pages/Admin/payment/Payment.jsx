import { useEffect, useMemo, useRef, useState } from 'react'
import Nav from '../../../components/Admin/Nav';
import SideNav from '../../../components/Admin/SideNav';
import { useNavigate } from 'react-router-dom';
import useExportTable from '../../../hooks/useExportTable';
import useMyToaster from '../../../hooks/useMyToaster';
import Cookies from 'js-cookie';
import downloadPdf from '../../../helper/downloadPdf';
import DataShimmer from '../../../components/Admin/DataShimmer';
import { Tooltip } from 'react-tooltip';
import { Popover, Whisper, SelectPicker } from 'rsuite';
import { Icons } from '../../../helper/icons';
import Pagination from '../../../components/Admin/Pagination';
import useSearchTable from '../../../hooks/useSearchTable';
import useSetTableFilter from '../../../hooks/useSetTableFilter';
import NoData from '../../../components/Admin/NoData';




const Payment = ({ mode }) => {
    const toast = useMyToaster();
    const { copyTable, downloadExcel, printTable, exportPdf } = useExportTable();
    const { getFilterState, setFilterState } = useSetTableFilter();
    const savedFilter = getFilterState("payment-management");
    const [activePage, setActivePage] = useState(savedFilter?.activePage || 1);
    const [dataLimit, setDataLimit] = useState(savedFilter?.limit || 10);
    const [totalData, setTotalData] = useState()
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const tableRef = useRef(null);
    const exportData = useMemo(() => {
        return data && data.map((n, _) => ({
            "Hotel Name": n.amenities_hotel_id.hotel_name,
            "Year": n.amenities_year,
            "Month": n.amenities_month,
            "Amount": n.amenities_amount,
            "Payment Date": n.amenities_payment_date,
            "Payment Mode": n.amenities_payment_mode == "1" ? "Online" : "Offline",
            "Payment Status": n.amenities_payment_status,
            "Ref. ID": n.amenities_payment_ref_no,
            "Transaction ID": n.amenities_payment_transaction_id,
            "Receipt No": n.amenities_receipt_number,
        }));
    }, [data]);
    const [loading, setLoading] = useState(true);
    const searchTable = useSearchTable();
    const monthList = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const [selectedHotel, setSelectedHotel] = useState(null);
    const [allHotels, setAllHotels] = useState([]);
    const timeRef = useRef(null);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [status, setStatus] = useState("all");
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
    const years = Array.from({ length: currentYear - 2000 + 1 }, (_, i) => {
        const year = 2000 + i;
        return { label: year.toString(), value: year.toString() };
    }).reverse();
    const [selectedMonth, setSelectedMonth] = useState(null);
    const [selectedYear, setSelectedYear] = useState(null);
    const [totalAmount, setTotalAmount] = useState(0);



    // Get Hotel List for
    const getHotelList = async () => {
        try {
            const data = {
                token: Cookies.get("token")
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
            setAllHotels([...res.data])

        } catch (error) {

        }
    }

    useEffect(() => {
        getHotelList();
    }, [])

    const searchTableDatabase = (txt) => {
        if (txt === "") return;
        if (timeRef.current) clearTimeout(timeRef.current);

        timeRef.current = setTimeout(async () => {
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
                setAllHotels([...res])
            } catch (error) {

            }

        }, 350)
    }


    // Get Amenities data;
    const get = async () => {
        setLoading(true);
        try {
            const data = {
                token: Cookies.get("token"),
                page: activePage,
                limit: dataLimit,
                startDate: startDate,
                endDate: endDate,
                hotelId: selectedHotel,
                status: status,
                month: selectedMonth ? Number(selectedMonth) + 1 : "",
                year: selectedYear
            }

            setFilterState("payment-management", dataLimit, activePage);
            const url = process.env.REACT_APP_MASTER_API + `/amenities/get-amenities`;
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

            const totalAmount = res.data.reduce((acc, i) => {
                return acc += Number(i.amenities_amount);
            }, 0)
            setTotalAmount(totalAmount)

        } catch (error) {
            setLoading(false);
        }
    }

    useEffect(() => {
        get();
    }, [dataLimit, activePage])

    const AmenitiesHotelSearch = async (txt) => {
        if (timeRef.current) clearTimeout(timeRef.current);

        timeRef.current = setTimeout(async () => {
            if (!txt) {
                getHotelList()
                get();
                return;
            }
            try {
                const data = {
                    token: Cookies.get("token"),
                    search: txt
                }
                const url = process.env.REACT_APP_MASTER_API + `/amenities/get-amenities`;
                const req = await fetch(url, {
                    method: "POST",
                    headers: {
                        "Content-Type": 'application/json'
                    },
                    body: JSON.stringify(data)
                });
                const res = await req.json();

                if (req.status !== 200) {
                    setData([]);
                    return;
                }
                setTotalData(res.length);
                setData([...res])

                const totalAmount = res.reduce((acc, i) => {
                    return acc += Number(i.amenities_amount);
                }, 0)
                setTotalAmount(totalAmount);
                return;
            } catch (error) {

            }

        }, 350)
    }


    const exportTable = async (whichType) => {
        if (whichType === "copy") {
            copyTable("itemTable"); // Pass tableid
        }
        else if (whichType === "excel") {
            downloadExcel(exportData, 'amenities.xlsx') // Pass data and filename
        }
        else if (whichType === "print") {
            printTable(tableRef, "Amenities"); // Pass table ref and title
        }
        else if (whichType === "pdf") {
            let document = exportPdf('Amenities', exportData);
            downloadPdf(document)
        }
    }


    const handleFilter = async (defaultStatus = "") => {
        setLoading(true);
        (async () => {
            try {
                const data = {
                    token: Cookies.get("token"),
                    page: activePage,
                    limit: dataLimit,
                    startDate: startDate,
                    endDate: endDate,
                    hotelId: selectedHotel,
                    status: defaultStatus ? defaultStatus : status,
                    month: selectedMonth ? Number(selectedMonth) + 1 : "",
                    year: selectedYear
                }

                setFilterState("payment-management", dataLimit, activePage);
                const url = process.env.REACT_APP_MASTER_API + `/amenities/get-amenities`;
                const req = await fetch(url, {
                    method: "POST",
                    headers: {
                        "Content-Type": 'application/json'
                    },
                    body: JSON.stringify(data)
                });
                const res = await req.json();

                if (req.status !== 200) {
                    setLoading(false);
                    return toast(res.err, 'error');
                }
                setData([...res.data])
                setTotalData(res.total)
                setLoading(false);

                const totalAmount = res.data.reduce((acc, i) => {
                    return acc += Number(i.amenities_amount);
                }, 0)
                setTotalAmount(totalAmount)

            } catch (error) {

            }
        })()
    }


    const setDefaultStatus = async () => {
        const path = window.location.pathname;
        if (path.endsWith("/success") || path.endsWith("/success/")) {
            setStatus("1");
            await handleFilter("1");
        }
    }
    useEffect(() => {
        setDefaultStatus()
    }, [])

    const handleResetFilter = () => {
        // setStartDate('');
        // setEndDate('');
        // setSelectedHotel(null);
        // get();
        window.location.reload();
    }

    return (
        <>
            <Nav title={"Amenities Table"} />
            <main id='main'>
                <SideNav />
                <Tooltip id='itemTooltip' />
                <div className='content__body'>
                    <div className='content__body__main'>
                        <div id='itemFilter' className='w-full'>
                            <p className='font-semibold uppercase'>Filter by Hotel Date</p>
                            <div className='flex flex-col md:flex-row md:gap-4 w-full mt-3 text-[13px]'>
                                <div className='w-full'>
                                    <p className='mb-1'>Hotel List</p>
                                    <SelectPicker
                                        block
                                        data={[
                                            ...allHotels.map((item) => ({
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
                                    <p className='mb-1'>Payment Start Date</p>
                                    <input type='date'
                                        onChange={(e) => setStartDate(e.target.value)}
                                        value={startDate}
                                    />
                                </div>

                                <div className='w-full'>
                                    <p className='mb-1'>Payment End Date</p>
                                    <input type='date'
                                        onChange={(e) => setEndDate(e.target.value)}
                                        value={endDate}
                                    />
                                </div>
                            </div>

                            <div className='flex flex-col md:flex-row md:gap-4 w-full mt-5 text-[13px]'>
                                <div className='w-full'>
                                    <p>Select Year*</p>
                                    <SelectPicker
                                        block
                                        className='w-full'
                                        data={years}
                                        value={selectedYear}
                                        onChange={(v) => setSelectedYear(v)}
                                    />
                                </div>
                                <div className='w-full'>
                                    <p>Select Month *</p>
                                    <SelectPicker
                                        block
                                        className='w-full'
                                        data={months}
                                        value={selectedMonth}
                                        onChange={(v) => setSelectedMonth(v)}
                                    />
                                </div>
                                <div className='w-full'>
                                    <p>Status</p>
                                    <select
                                        onChange={(e) => setStatus(e.target.value)}
                                        value={status}
                                    >
                                        <option value="all">All</option>
                                        <option value="ni">No initiated</option>
                                        <option value="0">Failed</option>
                                        <option value="1">Success</option>
                                        <option value="2">Pending</option>
                                    </select>
                                </div>
                            </div>
                            <div className='form__btn__grp filter'>
                                <button className='reset__btn' onClick={handleResetFilter}>
                                    <Icons.RESET />
                                    Reset
                                </button>
                                <button className='save__btn' onClick={() => handleFilter()}>
                                    <Icons.SEARCH />
                                    Search
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className='content__body__main mt-4'>
                        <div className='add_new_compnent flex justify-between items-center'>
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
                                    <input type='text'
                                        placeholder='Search Hotel Name,Transaction ID or Receipt No'
                                        onChange={(e) => AmenitiesHotelSearch(e.target.value)}
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
                        {
                            loading === false ? <div className='overflow-x-auto list__table list__table__checkin'>
                                <table className='min-w-full bg-white' id='itemTable' ref={tableRef}>
                                    <thead className='bg-gray-100 list__table__head'>
                                        <tr>
                                            <td className='w-[5%]' align='center'>SL No.</td>
                                            <td>Hotel</td>
                                            <td>Sector</td>
                                            <td>Year</td>
                                            <td>Month</td>
                                            <td>Amount</td>
                                            <td>Payment Date</td>
                                            <td>Payment Mode</td>
                                            <td>Payment Status</td>
                                            <td>Ref. ID</td>
                                            <td>Transaction ID</td>
                                            <td>Receipt No</td>
                                            <td>Action</td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            data && data.map((n, i) => {
                                                return <tr key={i} className='hover:bg-gray-100'>
                                                    <td align='center'>{(activePage - 1) * dataLimit + i + 1}</td>
                                                    <td>{n.amenities_hotel_id.hotel_name}</td>
                                                    <td>{n.amenities_hotel_id.hotel_sector_id.name}</td>
                                                    <td>{n.amenities_year}</td>
                                                    <td>{monthList[n.amenities_month - 1]}</td>
                                                    <td>{n.amenities_amount}</td>
                                                    <td>{n.amenities_payment_date}</td>
                                                    <td>
                                                        {
                                                            n.amenities_payment_init === "1" ? (n.amenities_payment_mode == "0" ?
                                                                <span className='chip chip__green'>Offline</span> :
                                                                <span className='chip chip__blue'>Online</span>) :
                                                                <span className='chip chip__grey'>Payment Not initiated</span>
                                                        }
                                                    </td>
                                                    <td>
                                                        {
                                                            n.amenities_payment_init === "1" ? (n.amenities_payment_status == "0" ?
                                                                <span className='chip chip__red'>Failed</span> :
                                                                (n.amenities_payment_status == "1" ?
                                                                    <span className='chip chip__green'>Success</span> :
                                                                    <span className='chip chip__yellow'>Processing</span>)) :
                                                                <span className='chip chip__grey'>Payment Not initiated</span>

                                                        }
                                                    </td>
                                                    <td>{n.amenities_payment_ref_no}</td>
                                                    <td>{n.amenities_payment_transaction_id}</td>
                                                    <td>{n.amenities_receipt_number}</td>
                                                    <td align='center'>
                                                        <Whisper
                                                            placement='leftStart'
                                                            trigger={"click"}
                                                            onClick={(e) => e.stopPropagation()}
                                                            speaker={<Popover full>
                                                                <div
                                                                    className='table__list__action__icon'
                                                                    onClick={(e) => {
                                                                        e.stopPropagation()
                                                                        navigate("/admin/amenities/edit/" + n._id)
                                                                    }}
                                                                >
                                                                    <Icons.EDIT className='text-[16px]' />
                                                                    Edit
                                                                </div>
                                                                {n.amenities_receipt_number && <div
                                                                    className='table__list__action__icon'
                                                                    onClick={(e) => {
                                                                        e.stopPropagation()
                                                                        navigate(`/admin/payment-receipt/monthly/${n._id}`, {
                                                                            state: { payment: true }
                                                                        })
                                                                    }}
                                                                >
                                                                    <Icons.PRINTER className='text-[16px]' />
                                                                    Print Receipt
                                                                </div>}
                                                            </Popover>}
                                                        >
                                                            <div className='table__list__action' >
                                                                <Icons.HORIZONTAL_MORE />
                                                            </div>
                                                        </Whisper>
                                                    </td>
                                                </tr>
                                            })

                                        }
                                    </tbody>
                                    <tfoot>
                                        <tr>
                                            <td colSpan={4} className='font-semibold' align='right'>Total Amount</td>
                                            <td className='font-semibold'>{totalAmount}</td>
                                        </tr>
                                    </tfoot>
                                </table>
                                {data.length < 1 && <NoData />}
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
                </div>
            </main>
        </>
    )
}

export default Payment;