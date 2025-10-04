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



const TouristData = () => {
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
            <Nav title={"Manage Guest Entry"} />
            <main id='main'>
                <SideNav />
                <div className='content__body'>
                    <div className='content__body__main'>
                        <div className='w-full  flex justify-between items-center border-b pb-1'>
                            <p className='font-semibold text-lg'>Filter Guest Entry</p>
                            <Icons.SEARCH />
                        </div>
                        <div className='w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4'>
                            <div className='w-full mt-3'>
                                <p>Mobile Number</p>
                                <input type="text" placeholder='Mobile Number' />
                            </div>
                            <div className='w-full mt-3'>
                                <p>ID Number</p>
                                <input type="text" placeholder='ID Number' />
                            </div>
                            <div className='w-full mt-3'>
                                <p>Guest Name</p>
                                <input type="text" placeholder='Guest Name' />
                            </div>
                            <div className='w-full mt-3'>
                                <p>Start Date</p>
                                <input type="date" />
                            </div>
                            <div className='w-full mt-3'>
                                <p>End Date</p>
                                <input type="date" />
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
                        <p className='my-2'><span>⭐</span> Indicates as Head Guest</p>
                        {/* Table start */}
                        <div className='overflow-x-auto list__table'>
                            <table className='min-w-full bg-white' id='table' ref={tableRef}>
                                <thead className='bg-gray-100 list__table__head'>
                                    <tr>
                                        <td className='py-2 '>SL No.</td>
                                        <td className='py-2 '>Guest Name</td>
                                        <td className='py-2 '>Gender</td>
                                        <td className='py-2 '>Age</td>
                                        <td className='py-2 '>Register Guest Details</td>
                                        <td className='py-2 '>Identity Card</td>
                                        <td className='py-2 '>Mobile</td>
                                        <td className='py-2 '>Check In Date & Time</td>
                                        <td className='py-2 '>Check Out Date & Time</td>
                                        <td className='py-2 '>Verified By</td>
                                        <td className='py-2 '>Added By</td>
                                        <td className='py-2 '>Payment Status</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        data.map((d, i) => {
                                            return <tr key={i} className='cursor-pointer hover:bg-gray-100'>
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

export default TouristData;

