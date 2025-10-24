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
            Hotel: n.amenities_hotel_id.hotel_name,
            Year: n.amenities_year,
            Month: n.amenities_month,
            Amount: n.amenities_amount,
            Payment_Date: n.amenities_payment_date,
            Payment_Mode: n.amenities_payment_mode == "1" ? "Online" : "Offline",
            Payment_Status: n.amenities_payment_status,
            Transaction_ID: n.amenities_payment_transaction_id,
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



    // Get Hotel List for
    const get = async () => {
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
            console.log(error)
        }
    }

    useEffect(() => {
        get();
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
                console.log(error)
            }

        }, 350)
    }



    // Get data;
    useEffect(() => {
        (async () => {
            try {
                const data = {
                    token: Cookies.get("token"),
                    page: activePage,
                    limit: dataLimit
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
                console.log(res);
                setTotalData(res.total)
                setData([...res.data])
                setLoading(false);

            } catch (error) {
                console.log(error)
            }
        })()
    }, [dataLimit, activePage])


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


    return (
        <>
            <Nav title={"Amenities Table"} />
            <main id='main'>
                <SideNav />
                <Tooltip id='itemTooltip' />
                <div className='content__body'>
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
                                    <input type='text'
                                        placeholder='Search...'
                                        onChange={searchTable}
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
                            <p className='font-bold'>Filter by Hotel Date</p>
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
                                        onClean={get}
                                    />
                                </div>
                                <div className='w-full'>
                                    <p className='mb-1'>Start Date<span className='required__text'>*</span></p>
                                    <input type='date'
                                        onChange={() => { }}
                                        value={''} />
                                </div>

                                <div className='w-full'>
                                    <p className='mb-1'>End Date<span className='required__text'>*</span></p>
                                    <input type='date'
                                        onChange={() => { }}
                                        value={''} />
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

                    <div className='content__body__main mt-4'>
                        {/* Table start */}
                        {
                            data.length > 0 ? <div className='overflow-x-auto list__table list__table__checkin'>
                                <table className='min-w-full bg-white' id='itemTable' ref={tableRef}>
                                    <thead className='bg-gray-100 list__table__head'>
                                        <tr>
                                            <td className='w-[5%]' align='center'>SL No.</td>
                                            <td>Hotel</td>
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
                                                    <td>{n.amenities_hotel_id.hotel_name}</td>
                                                    <td>{n.amenities_year}</td>
                                                    <td>{monthList[n.amenities_month]}</td>
                                                    <td>{n.amenities_amount}</td>
                                                    <td>{n.amenities_payment_date}</td>
                                                    <td>
                                                        {
                                                            n.amenities_payment_mode == "0" ?
                                                                <span className='chip chip__green'>Offline</span> :
                                                                <span className='chip chip__blue'>Online</span>
                                                        }
                                                    </td>
                                                    <td>{n.amenities_payment_status}</td>
                                                    <td>{n.amenities_payment_transaction_id}</td>
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
                                                                <div
                                                                    className='table__list__action__icon'
                                                                    onClick={(e) => {
                                                                        e.stopPropagation()
                                                                        navigate("/admin/notice/edit/" + n._id)
                                                                    }}
                                                                >
                                                                    <Icons.PRINTER className='text-[16px]' />
                                                                    Print Receipt
                                                                </div>
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
                                </table>
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