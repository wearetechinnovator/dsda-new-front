import Nav from '../../components/Hotel/Nav';
import SideNav from '../../components/Hotel/HotelSideNav'
import { Icons } from '../../helper/icons';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Popover, SelectPicker, Whisper } from 'rsuite';
import downloadPdf from '../../helper/downloadPdf';
import useExportTable from '../../hooks/useExportTable';
import useMyToaster from '../../hooks/useMyToaster';
import Pagination from '../../components/Admin/Pagination';
import Cookies from 'js-cookie';
import NoData from '../../components/Admin/NoData';
import DataShimmer from '../../components/Admin/DataShimmer';
import { useSelector } from 'react-redux';
import getDateRangeAminity from '../../helper/getDateRangeAminity';
import usePayment from '../../hooks/usePayment';




const Payments = () => {
    const { type } = useParams();
    const payStatus = type === "paid" ? "1" : type === "due" ? "without__success" : null;
    const navigate = useNavigate();
    const toast = useMyToaster();
    const { copyTable, downloadExcel, printTable, exportPdf } = useExportTable();
    const [activePage, setActivePage] = useState(1);
    const [dataLimit, setDataLimit] = useState(10);
    const [totalData, setTotalData] = useState()
    const [data, setData] = useState([]);
    const tableRef = useRef(null);
    const exportData = useMemo(() => {
        return data && data.map((d, _) => ({
            "Date": d.amenities_payment_date || '--',
            "Amount": d.amenities_amount,
            "Year": d.amenities_year,
            "Month": d.amenities_month,
            "Payment Mode": d.amenities_payment_mode === "0" ? 'Offline' : 'Online',
            "Transaction ID": d.amenities_payment_transaction_id || '--'
        }));
    }, [data]);
    const [loading, setLoading] = useState(true);
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
    });
    const [selectedMonth, setSelectedMonth] = useState(null);
    const [selectedYear, setSelectedYear] = useState(null);
    const timeRef = useRef(null);
    const [dateRangeAminity, setDateRangeAminity] = useState();
    const settingDetails = useSelector((store) => store.settingSlice);
    const { payment, payLoading } = usePayment();




    // GET LAST MONTH AND YEAR FROM ADMIN SETTING;
    useEffect(() => {
        (async () => {
            const data = await getDateRangeAminity({
                m: settingDetails.bill_generate_last_month,
                y: settingDetails.bill_generate_last_year,
                token: Cookies.get("hotel-token"),
                url: process.env.REACT_APP_BOOKING_API + "/check-in/get-hotel-id-total-amount"
            });
            setDateRangeAminity(data)
        })()
    }, [settingDetails])


    // Get data;
    const get = async (month, year) => {
        setLoading(true);
        try {
            const data = {
                token: Cookies.get("hotel-token"),
                page: activePage,
                limit: dataLimit,
                hotelId: Cookies.get('hotelId'),
                month,
                year,
                payStatus: payStatus || null
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
                setLoading(false);
                return toast(res.err, 'error');
            }

            setTotalData(res.total)
            setData([...res.data])
            setLoading(false);

        } catch (error) {

        }
    }
    useEffect(() => {
        get(selectedMonth, selectedYear);
    }, [dataLimit, activePage, payStatus]);


    const AmenitiesHotelSearch = (e) => {
        const txt = e.target.value;
        if (timeRef.current) clearTimeout(timeRef.current);

        timeRef.current = setTimeout(async () => {
            if (!txt) {
                get(selectedMonth, selectedYear);
                return;
            }

            try {
                const data = {
                    token: Cookies.get("token"),
                    hotelId: Cookies.get('hotelId'),
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
                return;
            } catch (error) {

            }

        }, 300)

    }


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


    const handleFilter = async () => get(selectedMonth, selectedYear)

    const handleReset = () => {
        setSelectedMonth(null);
        setSelectedYear(null);
        get('', '');
    }

    return (
        <>
            <Nav title={"Manage Payments"} />
            <main id='main'>
                <SideNav />
                <div className='content__body'>
                    {payStatus !== "without__success" &&
                        (<div className='content__body__main'>
                            <div className='w-full flex gap-1 items-center border-b pb-1'>
                                <Icons.SEARCH />
                                <p className='font-semibold uppercase'>Filter by Month & Year</p>
                            </div>
                            <div className='w-full flex flex-col md:flex-row justify-between gap-4 items-center mt-4'>
                                <div className='w-full mt-3'>
                                    <p>Select Month *</p>
                                    <SelectPicker
                                        block
                                        className='w-full'
                                        data={months}
                                        value={selectedMonth}
                                        onChange={(v) => setSelectedMonth(v)}
                                    />
                                </div>
                                <div className='w-full mt-3'>
                                    <p>Select Year*</p>
                                    <SelectPicker
                                        block
                                        className='w-full'
                                        data={years}
                                        value={selectedYear}
                                        onChange={(v) => setSelectedYear(v)}
                                    />
                                </div>
                            </div>

                            <div className='form__btn__grp'>
                                <button className='reset__btn' onClick={handleReset}>
                                    <Icons.RESET />
                                    Reset
                                </button>
                                <button className='save__btn' onClick={handleFilter}>
                                    <Icons.SEARCH /> Search
                                </button>
                            </div>
                        </div>)}


                    {/* ============================== [CURRENT MONTH DATA] ============================== */}
                    {/* ================================================================================== */}
                    {payStatus === "without__success" &&
                        (<div className='content__body__main mt-4'>
                            <div className='w-full flex gap-1 items-center border-b pb-1'>
                                <Icons.RUPES />
                                <p className='font-semibold uppercase'>Bill Not Generated</p>
                            </div>
                            <div className='overflow-x-auto list__table list__table__checkin'>
                                <table className='min-w-full bg-white'>
                                    <thead className='bg-gray-100 list__table__head'>
                                        <tr>
                                            <td>Year</td>
                                            <td>Month</td>
                                            <td>Amount</td>
                                            <td className='w-[15%]' align='center'>Payment Status</td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            dateRangeAminity && dateRangeAminity?.map((n, i) => {
                                                return <tr key={i} className='hover:bg-gray-100'>
                                                    <td>{n.year}</td>
                                                    <td>{months[n.month - 1].label}</td>
                                                    <td>{n.totalAmount}</td>
                                                    <td><span className='chip chip__grey'>Bill Not Generated</span></td>
                                                </tr>
                                            })

                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>)
                    }
                    {/* ================================== Table start here ============================== */}
                    {/* ================================================================================== */}

                    {/* Table Content */}
                    <div className='content__body__main mt-4'>
                        <div className='w-full flex gap-1 items-center border-b pb-1'>
                            <Icons.RUPES />
                            <p className='font-semibold uppercase'>
                                {payStatus == "without__success" ? "Pay These Bills" : payStatus == "1" ? "Paid Bills" : "All Bills"}
                            </p>
                        </div>
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
                                            onChange={(e) => AmenitiesHotelSearch(e)}
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
                        {
                            loading === false ? <div className='overflow-x-auto list__table list__table__checkin'>
                                <table className='min-w-full bg-white' id='itemTable' ref={tableRef}>
                                    <thead className='bg-gray-100 list__table__head'>
                                        <tr>
                                            <td className='w-[5%]' align='center'>SL No.</td>
                                            <td>Year</td>
                                            <td>Month</td>
                                            <td>Amount</td>
                                            <td>Payment Date</td>
                                            <td>Payment Mode</td>
                                            <td>Payment Status</td>
                                            <td>Transaction ID</td>
                                            <td>Action</td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            data && data.map((n, i) => {
                                                return <tr key={i} className='hover:bg-gray-100'>
                                                    <td align='center'>{(activePage - 1) * dataLimit + i + 1}</td>
                                                    <td>{n.amenities_year}</td>
                                                    <td>{months[n.amenities_month - 1].label}</td>
                                                    <td>{n.amenities_amount}</td>
                                                    <td>{n.amenities_payment_date}</td>
                                                    <td>
                                                        {
                                                            n.amenities_payment_init === "1" ? (n.amenities_payment_mode == "0" ?
                                                                <span className='chip chip__green'>Offline</span> :
                                                                <span className='chip chip__blue'>Online</span>) :
                                                                <span className='chip chip__grey'>Payment Not Initiated</span>
                                                        }
                                                    </td>
                                                    <td>
                                                        {
                                                            n.amenities_payment_init === "1" ? (n.amenities_payment_status == "0" ?
                                                                <span className='chip chip__red'>Failed</span> :
                                                                (n.amenities_payment_status == "1" ?
                                                                    <span className='chip chip__green'>Success</span> :
                                                                    <span className='chip chip__yellow'>Processing</span>)) :
                                                                <span className='chip chip__grey'>Payment Not Initiated</span>
                                                        }
                                                    </td>
                                                    <td>{n.amenities_payment_transaction_id}</td>
                                                    <td align='center'>
                                                        {
                                                            n.amenities_payment_status === "0" && (
                                                                <button
                                                                    className="flex rounded px-2 py-1 bg-green-400 text-white items-center hover:bg-green-500"
                                                                    onClick={payLoading === true ? null : async () => await payment(n._id, "monthly")}
                                                                >
                                                                    <Icons.RUPES />
                                                                    <span>{payLoading ? "Processing..." : "Pay Now"}</span>
                                                                </button>
                                                            )
                                                        }
                                                        {
                                                            n.amenities_payment_status === "2" && (
                                                                <button
                                                                    className="flex rounded px-2 py-1 bg-green-400 text-white items-center hover:bg-green-500"
                                                                    onClick={async () => {
                                                                        window.location.href = `${window.location.origin}/hotel/all-payment/status-check?ref=${n.amenities_payment_ref_no}&type=monthly`
                                                                    }}
                                                                >
                                                                    <Icons.PROCESS className='text-white' />
                                                                    <span> Check Status</span>
                                                                </button>
                                                            )
                                                        }

                                                        {
                                                            n.amenities_receipt_number && n.amenities_payment_status === "1" && (
                                                                <button
                                                                    className="flex rounded px-2 py-1 bg-blue-400 text-white items-center hover:bg-blue-500"
                                                                    onClick={() =>
                                                                        navigate("check-in/guest-entry/bill-details/print", {
                                                                            state: { payment: true }
                                                                        })
                                                                    }
                                                                >
                                                                    <Icons.PRINTER className="text-[16px]" />
                                                                    Print Receipt
                                                                </button>
                                                            )
                                                        }

                                                    </td>
                                                </tr>
                                            })

                                        }
                                    </tbody>
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

export default Payments;

