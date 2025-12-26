import Nav from '../../components/Hotel/Nav';
import SideNav from '../../components/Hotel/HotelSideNav'
import { Icons } from '../../helper/icons';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useSearchTable from '../../hooks/useSearchTable';
import { Popover, Whisper } from 'rsuite';
import downloadPdf from '../../helper/downloadPdf';
import useExportTable from '../../hooks/useExportTable';
import useMyToaster from '../../hooks/useMyToaster';
import Pagination from '../../components/Admin/Pagination';
import Cookies from 'js-cookie';
import NoData from '../../components/Admin/NoData';
import DataShimmer from '../../components/Admin/DataShimmer';
import usePayment from '../../hooks/usePayment';



const OtherPayments = () => {
    const toast = useMyToaster();
    const { copyTable, downloadExcel, printTable, exportPdf } = useExportTable();
    const [activePage, setActivePage] = useState(1);
    const [dataLimit, setDataLimit] = useState(10);
    const [totalData, setTotalData] = useState()
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const tableRef = useRef(null);
    const exportData = useMemo(() => {
        return data && data.map((d, _) => ({
            "SL. No.": _ + 1,
            "Hotel Name": d.other_payment_hotel_id.hotel_name,
            "Date": d.other_payment_payment_date,
            "Amount": d.other_payment_amount,
            "Purpose": d.other_payment_purpose,
            "Status": d.other_payment_payment_init === "1" ? (d.other_payment_payment_status === "0" ? 'Failed' :
                (d.other_payment_payment_status === "1" ? 'Success' : 'Processing')) :
                'Payment Not initiated',
            "Transaction ID": d.other_payment_payment_transaction_id
        }));
    }, [data]);
    const [loading, setLoading] = useState(true);
    const [filterData, setFilterData] = useState({ amount: '', purpose: '' });
    const timeRef = useRef(null);
    const { payment, payLoading } = usePayment();





    // Get data;
    const get = async ({ amount, purpose }) => {
        setLoading(true);
        try {
            const data = {
                token: Cookies.get("hotel-token"),
                page: activePage,
                limit: dataLimit,
                hotelId: Cookies.get('hotelId'),
                amount: amount,
                purpose: purpose
            }
            const url = process.env.REACT_APP_MASTER_API + `/other-payments/get-payment`;
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
        get(filterData);
    }, [dataLimit, activePage])

    const searchTableDatabase = (e) => {
        const txt = e.target.value;
        if (timeRef.current) clearTimeout(timeRef.current);

        timeRef.current = setTimeout(async () => {
            if (!txt) {
                get(filterData);
                return;
            }

            try {
                const data = {
                    token: Cookies.get("token"),
                    hotelId: Cookies.get('hotelId'),
                    transactionid: true,
                    search: txt
                }
                const url = process.env.REACT_APP_MASTER_API + `/other-payments/get-payment`;
                const req = await fetch(url, {
                    method: "POST",
                    headers: {
                        "Content-Type": 'application/json'
                    },
                    body: JSON.stringify(data)
                });
                const res = await req.json();
                setTotalData(res.length)
                setData([...res])

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
            downloadExcel(exportData, 'other-payments.xlsx') // Pass data and filename
        }
        else if (whichType === "print") {
            printTable(tableRef, "Other Payments"); // Pass table ref and title
        }
        else if (whichType === "pdf") {
            let document = exportPdf('Other Payments', exportData);
            downloadPdf(document)
        }
    }


    const handleFilter = async () => get(filterData);

    const resetFilter = async () => {
        setFilterData(p => {
            return { ...p, purpose: '', amount: '' }
        });
        get({ amount: '', purpose: '' });
    }


    return (
        <>
            <Nav title={"Manage Extra Payment"} />
            <main id='main'>
                <SideNav />
                <div className='content__body'>
                    <div className='content__body__main'>
                        <div className='w-full flex gap-1 items-center border-b pb-1'>
                            <Icons.SEARCH />
                            <p className='font-semibold text-md'>Search Payment</p>
                        </div>
                        <div className='w-full flex flex-col md:flex-row justify-between gap-4 items-center mt-4'>
                            <div className='w-full mt-3'>
                                <p>Purpose </p>
                                <input type="text"
                                    value={filterData.purpose}
                                    onChange={(e) => setFilterData({ ...filterData, purpose: e.target.value })}
                                />
                            </div>
                            <div className='w-full mt-3'>
                                <p>Amount </p>
                                <input type="text"
                                    value={filterData.amount}
                                    onChange={(e) => setFilterData({ ...filterData, amount: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className='flex justify-start gap-2 mt-2'>
                            <div className='search__sug__badge' onClick={(e) => setFilterData({ ...filterData, purpose: "mismatch"})}>
                                mismatch
                            </div>
                            <div className='search__sug__badge' onClick={(e) => setFilterData({ ...filterData, purpose: "fine"})}>
                                fine
                            </div>
                        </div>


                        <div className='form__btn__grp'>
                            <button className='reset__btn' onClick={resetFilter}>
                                <Icons.RESET />
                                Reset
                            </button>
                            <button className='save__btn' onClick={handleFilter}>
                                <Icons.SEARCH /> Search
                            </button>
                        </div>
                    </div>

                    {/* ================================== Table start here ============================== */}
                    {/* ================================================================================== */}

                    {/* Table Content */}
                    {!loading ?
                        <div className='content__body__main mt-4'>
                            {/* Option Bar */}
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
                                            <input
                                                type='search'
                                                placeholder='Search Transaction ID...'
                                                onChange={searchTableDatabase}
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
                            <div className='overflow-x-auto list__table list__table__checkin'>
                                <table className='min-w-full bg-white' id='table' ref={tableRef}>
                                    <thead className='list__table__head'>
                                        <tr>
                                            <td align='center' className='w-[5%]'>SL No.</td>
                                            <td>Date</td>
                                            <td>Amount</td>
                                            <td>Purpose</td>
                                            <td className='w-[15%]'>Status</td>
                                            <td>Transaction Id</td>
                                            <td className='w-[12%]'>Action</td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            data.map((d, i) => {
                                                return <tr key={i} className='hover:bg-gray-100'>
                                                    <td align='center'>{(activePage - 1) * dataLimit + i + 1}</td>
                                                    <td>{d.other_payment_payment_date}</td>
                                                    <td>{d.other_payment_amount}</td>
                                                    <td>{d.other_payment_purpose}</td>
                                                    <td>
                                                        {
                                                            d.other_payment_payment_init === "1" ?
                                                                (d.other_payment_payment_status === "0" ?
                                                                    <span className='chip chip__red'>Failed</span> :
                                                                    (d.other_payment_payment_status === "1" ?
                                                                        <span className='chip chip__green'>Success</span> :
                                                                        <span className='chip chip__yellow'>Processing</span>)) :
                                                                <span className='chip chip__grey'>Payment Not Initiated</span>

                                                        }
                                                    </td>
                                                    <td>{d.other_payment_payment_transaction_id}</td>
                                                    <td align='center'>
                                                        {
                                                            d.other_payment_payment_status === "0" && (
                                                                <button
                                                                    className='flex rounded px-2 py-1 bg-green-400 text-white items-center hover:bg-green-500'
                                                                    onClick={payLoading === true ? null : async () => await payment(d._id, "others")}
                                                                >
                                                                    <Icons.RUPES />
                                                                    <span>{payLoading ? "Processing..." : "Pay Now"}</span>
                                                                </button>
                                                            )
                                                        }
                                                        {
                                                            d.other_payment_payment_status === "2" && (
                                                                <button
                                                                    className="flex rounded px-2 py-1 bg-green-400 text-white items-center hover:bg-green-500"
                                                                    onClick={async () => {
                                                                        window.location.href=`${window.location.origin}/hotel/all-payment/status-check?ref=${d.other_payment_payment_ref_no}&type=others`
                                                                    }}
                                                                >
                                                                    <Icons.PROCESS className='text-white' />
                                                                    <span> Check Status</span>
                                                                </button>
                                                            )
                                                        }
                                                        {(d.other_payment_receipt_number && d.other_payment_payment_status === '1') && <button
                                                            className='flex rounded px-2 py-1 gap-1 bg-blue-400 text-white items-center hover:bg-blue-500'
                                                            onClick={() => navigate("check-in/guest-entry/bill-details/print", {
                                                                state: {
                                                                    payment: true
                                                                }
                                                            })}
                                                        >
                                                            <Icons.PRINTER className='text-[16px]' />
                                                            Print Receipt
                                                        </button>}
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

export default OtherPayments;

