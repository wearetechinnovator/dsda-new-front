import Nav from '../../components/Hotel/Nav';
import SideNav from '../../components/Hotel/HotelSideNav'
import { Icons } from '../../helper/icons';
import { useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useSearchTable from '../../hooks/useSearchTable';
import useApi from '../../hooks/useApi';
import { Popover, SelectPicker, Whisper } from 'rsuite';
import downloadPdf from '../../helper/downloadPdf';
import useExportTable from '../../hooks/useExportTable';
import useMyToaster from '../../hooks/useMyToaster';
import Pagination from '../../components/Admin/Pagination';



const Amenities = () => {
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
    const months = [
        { label: 'January', value: 'january' },
        { label: 'February', value: 'february' },
        { label: 'March', value: 'march' },
        { label: 'April', value: 'april' },
        { label: 'May', value: 'may' },
        { label: 'June', value: 'june' },
        { label: 'July', value: 'july' },
        { label: 'August', value: 'august' },
        { label: 'September', value: 'september' },
        { label: 'October', value: 'october' },
        { label: 'November', value: 'november' },
        { label: 'December', value: 'december' }
    ];
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: currentYear - 2000 + 1 }, (_, i) => {
        const year = 2000 + i;
        return { label: year.toString(), value: year.toString() };
    });


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
                    <div className='w-full flex flex-col md:flex-row gap-4'>
                        <div className='content__body__main w-full'>
                            <div className='w-full  flex justify-between items-center border-b pb-1'>
                                <p className='font-semibold text-lg'>Filter Guest Entry</p>
                                <Icons.SEARCH />
                            </div>
                            <div className='w-full flex flex-col md:flex-row justify-between gap-4 items-center mt-4'>
                                <div className='w-full mt-3'>
                                    <p>Select Month *</p>
                                    <SelectPicker
                                        className='w-full'
                                        data={months}
                                    />
                                </div>
                                <div className='w-full mt-3'>
                                    <p>Select Year*</p>
                                    <SelectPicker
                                        className='w-full'
                                        data={years}
                                    />
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

                        <div className='content__body__main w-full'>
                            <div className='w-full  flex justify-between items-center border-b pb-1'>
                                <p className='font-semibold text-lg'>Aminity Charges</p>
                                <Icons.RUPES />
                            </div>
                            <div className='w-full grid grid-cols-2 md:grid-cols-4 gap-4 mt-4'>
                                <div className='hotel__amemities__card'>
                                    <p className='text-2xl'>0</p>
                                    <p>Today Charges</p>
                                </div>
                                <div className='hotel__amemities__card'>
                                    <p className='text-2xl'>0</p>
                                    <p>Today Charges</p>
                                </div>
                                <div className='hotel__amemities__card'>
                                    <p className='text-2xl'>0</p>
                                    <p>Today Charges</p>
                                </div>
                                <div className='hotel__amemities__card'>
                                    <p className='text-2xl'>0</p>
                                    <p>Today Charges</p>
                                </div>
                            </div>

                            <div className='form__btn__grp'>
                                <button className='reset__btn'>
                                    <Icons.RUPES />
                                    Previous Payments
                                </button>
                                <button className='reset__btn'>
                                    <Icons.RUPES /> Pay Now
                                </button>
                            </div>
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
                        <div className='overflow-x-auto list__table'>
                            <table className='min-w-full bg-white' id='table' ref={tableRef}>
                                <thead className='bg-gray-100 list__table__head'>
                                    <tr>
                                        <td className='py-2 '>SL No.</td>
                                        <td className='py-2 '>Date</td>
                                        <td className='py-2 '>Total Guest(s) Enrolled</td>
                                        <td className='py-2 '>Total Amenities Charge Payable (Rs)</td>
                                        <td className='py-2 '>Remark</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        data.map((d, i) => {
                                            return <tr key={i} className='cursor-pointer hover:bg-gray-100'>
                                                <td className='px-4 border-b'>{d.name}</td>
                                                <td className='px-4 text-center'>
                                                    <button className='rounded px-3 py-1 bg-blue-300 text-white'>
                                                        Booking
                                                    </button>
                                                </td>
                                            </tr>
                                        })
                                    }
                                    <tr className='cursor-pointer hover:bg-gray-100'>
                                        <td className='px-4 border-b'>test</td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td className='px-4 text-center'>
                                            <button className='rounded px-3 py-1 bg-blue-300 text-white'>
                                                Booking
                                            </button>
                                        </td>
                                    </tr>
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

export default Amenities;

