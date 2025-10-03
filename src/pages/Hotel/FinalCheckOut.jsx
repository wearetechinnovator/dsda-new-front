import Nav from '../../components/Hotel/Nav';
import SideNav from '../../components/Hotel/HotelSideNav';
import { Icons } from '../../helper/icons';
import { useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useSearchTable from '../../hooks/useSearchTable';
import useApi from '../../hooks/useApi';
import { Popover, Whisper } from 'rsuite';
import downloadPdf from '../../helper/downloadPdf';
import useExportTable from '../../hooks/useExportTable';
import useMyToaster from '../../hooks/useMyToaster';
import Pagination from '../../components/Admin/Pagination';



const FinalCheckOut = () => {
    const [searchBy, setSearchBy] = useState("room");
    const toast = useMyToaster();
    const { copyTable, downloadExcel, printTable, exportPdf } = useExportTable();
    const [activePage, setActivePage] = useState(1);
    const [dataLimit, setDataLimit] = useState(10);
    const [totalData, setTotalData] = useState();
    const [selected, setSelected] = useState([]);
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
    const { deleteData, restoreData } = useApi()
    const [quickSearchFields, setQuickSearchFields] = useState({
        roomNo: '', mobileNo: '', fromDate: '', toDate: ''
    })



    // Table functionality ---------
    const selectAll = (e) => {
        if (e.target.checked) {
            setSelected(data.map((item, _) => item._id));
        } else {
            setSelected([]);
        }
    };

    const handleCheckboxChange = (id) => {
        setSelected((prevSelected) => {
            if (prevSelected.includes(id)) {
                return prevSelected.filter((previd, _) => previd !== id);
            } else {
                return [...prevSelected, id];
            }
        });
    };


    const exportTable = async (whichType) => {
        if (whichType === "copy") {
            copyTable("table"); // Pass tableid
        }
        else if (whichType === "excel") {
            downloadExcel(exportData, 'block-list.xlsx') // Pass data and filename
        }
        else if (whichType === "print") {
            printTable(tableRef, "Block List"); // Pass table ref and title
        }
        else if (whichType === "pdf") {
            let document = exportPdf('Block List', exportData);
            downloadPdf(document)
        }
    }


    return (
        <>
            <Nav title={"Manage Guest Entry"} />
            <main id='main'>
                <SideNav />
                <div className='content__body'>
                    <div className='content__body__main mt-4'>


                        {/* Option Bar */}
                        <div className="add_new_compnent">
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

                        {/* Table start */}
                        <div className='overflow-x-auto list__table'>
                            <table className='min-w-full bg-white' id='table' ref={tableRef}>
                                <thead className='bg-gray-100 list__table__head'>
                                    <tr>
                                        <td className='py-2 '>SL No.</td>
                                        <td className='py-2 '>Head Guest Details</td>
                                        <td className='py-2 '>Check In Date & Time</td>
                                        <td className='py-2 '>ID Card</td>
                                        <td className='py-2 '>Mobile</td>
                                        <td className='py-2 '>Room No.</td>
                                        <td className='py-2 '>Payment</td>
                                        <td className='py-2 '>Action</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        data.map((d, i) => {
                                            return <tr key={i} className='cursor-pointer hover:bg-gray-100'>
                                                <td className='px-4 border-b'>{d.name}</td>
                                                <td className='px-4 text-center'>
                                                    <button>Checkout</button>
                                                </td>
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

export default FinalCheckOut;

