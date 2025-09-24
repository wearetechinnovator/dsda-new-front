import Nav from '../../components/Hotel/Nav';
import SideNav from '../../components/Hotel/HotelSideNav'
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



const CheckOut = () => {
    const [searchBy, setSearchBy] = useState("room");
    const toast = useMyToaster();
    const { copyTable, downloadExcel, printTable, exportPdf } = useExportTable();
    const [activePage, setActivePage] = useState(1);
    const [dataLimit, setDataLimit] = useState(10);
    const [totalData, setTotalData] = useState()
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
                    <div className='content__body__main'>
                        <div className='w-full  flex justify-between items-center border-b pb-1'>
                            <p className='font-semibold text-lg'>Quick Search</p>
                            <Icons.SEARCH />
                        </div>
                        <div className='w-full mt-4'>
                            <p>Search By</p>
                            <select value={searchBy} onChange={(e) => setSearchBy(e.target.value)}>
                                <option value="room">Room</option>
                                <option value="mobile">Mobile</option>
                                <option value="date">Check In Date</option>
                            </select>
                        </div>
                        {
                            searchBy === "room" && <div className='w-full mt-3'>
                                <p>Room No.*</p>
                                <input type="text" placeholder='Enter Guest Room No.' />
                            </div>
                        }
                        {
                            searchBy === "mobile" && <div className='w-full mt-3'>
                                <p>Guest Mobile Number*</p>
                                <input type="text" placeholder='Enter Guest Mobile Number' />
                            </div>
                        }
                        {
                            searchBy === "date" && <div className='w-full mt-3'>
                                <div className='w-full flex gap-3 items-center justify-between'>
                                    <div className='w-full'>
                                        <p>From*</p>
                                        <input type="date" placeholder='Start Date' />
                                    </div>
                                    <div className='w-full'>
                                        <p>To*</p>
                                        <input type="date" placeholder='End Date' />
                                    </div>
                                </div>
                            </div>
                        }
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

                    {/* Option Bar */}
                    <div className="content__body__main mt-5 mb-5 w-full bg-white rounded p-4 shadow-sm add_new_compnent overflow-hidden
           				 transition-all">
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
                    
                    {/* Table Content */}
                    <div className='content__body__main'>
                        {/* Table start */}
                        <div className='overflow-x-auto list__table'>
                            <table className='min-w-full bg-white' id='table' ref={tableRef}>
                                <thead className='bg-gray-100 list__table__head'>
                                    <tr>
                                        <th className='py-2 px-4 border-b w-[50px]'>
                                            <input type='checkbox' onChange={selectAll} checked={data.length > 0 && selected.length === data.length} />
                                        </th>
                                        <td className='py-2 '>SL No.</td>
                                        <td className='py-2 '>Head Guest Details</td>
                                        <td className='py-2 '>Check In Date & Time</td>
                                        <td className='py-2 '>ID Card</td>
                                        <td className='py-2 '>Mobile</td>
                                        <td className='py-2 '>Room No.</td>
                                        <td className='py-2 '>Payment</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        data.map((d, i) => {
                                            return <tr key={i} className='cursor-pointer hover:bg-gray-100'>
                                                <td className='py-2 px-4 border-b max-w-[10px]'>
                                                    <input type='checkbox' checked={selected.includes(d._id)} onChange={() => handleCheckboxChange(d._id)} />
                                                </td>
                                                <td className='px-4 border-b'>{d.name}</td>
                                                <td className='px-4 text-center'>
                                                    <Whisper
                                                        placement='leftStart'
                                                        trigger={"click"}
                                                        onClick={(e) => e.stopPropagation()}
                                                        speaker={<Popover full>
                                                            <div
                                                                className='table__list__action__icon'
                                                                onClick={(e) => {
                                                                    e.stopPropagation()
                                                                    navigate("/admin/block/edit/" + d._id)
                                                                }}
                                                            >
                                                                <Icons.EDIT className='text-[16px]' />
                                                                Edit
                                                            </div>
                                                            <div
                                                                className='table__list__action__icon'
                                                                onClick={(e) => {
                                                                    e.stopPropagation()
                                                                    deleteData(d._id, "block");
                                                                }}
                                                            >
                                                                <Icons.DELETE className='text-[16px]' />
                                                                Delete
                                                            </div>
                                                            <div
                                                                className='table__list__action__icon'
                                                                onClick={(e) => {
                                                                    e.stopPropagation()
                                                                    deleteData(d._id, "block", true);
                                                                }}
                                                            >
                                                                <Icons.DELETE className='text-[16px]' />
                                                                Trash
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

export default CheckOut;

