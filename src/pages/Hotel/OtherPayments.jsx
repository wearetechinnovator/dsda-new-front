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



const OtherPayments = () => {
    const toast = useMyToaster();
    const { copyTable, downloadExcel, printTable, exportPdf } = useExportTable();
    const [activePage, setActivePage] = useState(1);
    const [dataLimit, setDataLimit] = useState(10);
    const [totalData, setTotalData] = useState()
    const [selected, setSelected] = useState([]);
    const [isTrash, setIsTrash] = useState(false);
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const tableRef = useRef(null);
    const exportData = useMemo(() => {
        return data && data.map(({ name }, _) => ({
            Name: name,
        }));
    }, [data]);
    const [loading, setLoading] = useState(true);
    const searchTable = useSearchTable();


    // Get data;
    const get = async () => {
        try {
            const data = {
                token: Cookies.get("token"),
                trash: isTrash,
                page: activePage,
                limit: dataLimit,
                hotelId:Cookies.get('hotelId')
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
            console.log(res.data)
            setTotalData(res.total)
            setData([...res.data])
            setLoading(false);

        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        get();
    }, [isTrash, dataLimit, activePage])




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


    return (
        <>
            <Nav title={"Manage Extra Payment"} />
            <main id='main'>
                <SideNav />
                <div className='content__body'>
                    <div className='content__body__main'>
                        <div className='w-full  flex justify-between items-center border-b pb-1'>
                            <p className='font-semibold text-lg'>Make Payment</p>
                            <Icons.SEARCH />
                        </div>
                        <div className='w-full flex flex-col md:flex-row justify-between gap-4 items-center mt-4'>
                            <div className='w-full mt-3'>
                                <p>Amount *</p>
                                <input type="text" />
                            </div>
                            <div className='w-full mt-3'>
                                <p>Purpose</p>
                                <input type="text" />
                            </div>
                        </div>

                        <div className='form__btn__grp'>
                            <button className='reset__btn'>
                                <Icons.RESET />
                                Reset
                            </button>
                            <button className='save__btn'>
                                <Icons.SEARCH /> Search
                            </button>
                        </div>
                    </div>

                    {/* ================================== Table start here ============================== */}
                    {/* ================================================================================== */}

                    {/* Table Content */}
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
                        </div>
                        <div className='overflow-x-auto list__table'>
                            <table className='min-w-full bg-white' id='table' ref={tableRef}>
                                <thead className='list__table__head'>
                                    <tr>
                                        <td className='py-2 '>SL No.</td>
                                        <td className='py-2 '>Hotel Name</td>
                                        <td className='py-2 '>Date</td>
                                        <td className='py-2 '>Amount</td>
                                        <td className='py-2 '>Purpose</td>
                                        <td className='py-2 '>Status</td>
                                        <td className='py-2 '>Transaction Id</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        data.map((d, i) => {
                                            return <tr key={i} className='cursor-pointer hover:bg-gray-100'>
                                                <td className='px-4 border-b'>{d.name}</td>
                                            </tr>
                                        })
                                    }
                                </tbody>
                            </table>
                            <div className='paginate__parent'>
                                <p>Showing {data.length} of {totalData} entries</p>
                                <Pagination
                                    activePage={activePage}
                                    setActivePage={setActivePage}
                                    totalData={totalData}
                                    dataLimit={dataLimit}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}

export default OtherPayments;

