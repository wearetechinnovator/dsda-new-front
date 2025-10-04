import Nav from '../../components/Hotel/Nav'
import SideNav from '../../components/Hotel/HotelSideNav';
import { FaCheckToSlot } from "react-icons/fa6";
import { BsBuildings } from "react-icons/bs";
import { FaBed } from "react-icons/fa";
import { HiUserAdd } from "react-icons/hi";
import { LuArrowRightFromLine } from "react-icons/lu";
import { FaUsers } from "react-icons/fa6";
import { FaRupeeSign } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { useMemo } from 'react';
import useSearchTable from '../../hooks/useSearchTable';
import useExportTable from '../../hooks/useExportTable';
import downloadPdf from '../../helper/downloadPdf';
import { Modal, Popover, Whisper } from 'rsuite';
import { Icons } from '../../helper/icons';
import Pagination from '../../components/Admin/Pagination';
import Cookies from 'js-cookie';
import downloadBase64 from '../../helper/downloadBase64'




const Statistics = () => {
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
    const [recentNotice, setRecentNotice] = useState([]);
    const hotelId = Cookies.get('hotelId');
    const token = Cookies.get('hotel-token');
    const [modalData, setModalData] = useState({ isOpen: false })



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



    useEffect(() => {
        const get = async () => {
            const url = process.env.REACT_APP_MASTER_API + "/notice/get-hotel-notice";
            const cookie = Cookies.get("token");

            const req = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": 'application/json'
                },
                body: JSON.stringify({ hotelId })
            })
            const res = await req.json();
            setRecentNotice([...res]);
            console.log(res);
        }

        get();
    }, [])


    return (
        <>
            <Nav title={"Statistics"} />
            <main id='main'>
                <SideNav />
                <div className='content__body'>
                    <div className='flex flex-col md:flex-row gap-8'>
                        <div className='flex flex-col gap-4 min-w-[200px]'>
                            <div className='text-white grid place-items-center green__grad center h-[120px] rounded-2xl'>
                                <div className='flex flex-col justify-center items-center'>
                                    <FaCheckToSlot className='center__icon' />
                                    <p>CHECK IN</p>
                                </div>
                            </div>
                            <div className='text-white grid place-items-center green__grad center h-[120px] rounded-2xl'>
                                <div className='flex flex-col justify-center items-center'>
                                    <LuArrowRightFromLine className='center__icon' />
                                    <p>CHECK OUT</p>
                                </div>
                            </div>
                        </div>
                        <div className='w-full'>
                            <div className="total__data_cards">
                                <div className='total__card blue__grad'>
                                    <div className='total__card__data'>
                                        <p>10</p>
                                        <p>Total Rooms</p>
                                    </div>
                                    <BsBuildings className='card__icon' />
                                </div>
                                <div className='total__card green__grad'>
                                    <div className='total__card__data'>
                                        <p>10</p>
                                        <p>Total Beds</p>
                                    </div>
                                    <FaBed className='card__icon' />
                                </div>
                                <div className='total__card green__grad'>
                                    <div className='total__card__data'>
                                        <p>10</p>
                                        <p>Occupied Beds</p>
                                    </div>
                                    <FaBed className='card__icon' />
                                </div>
                                <div className='total__card green__grad'>
                                    <div className='total__card__data'>
                                        <p>10</p>
                                        <p>Vacant Beds</p>
                                    </div>
                                    <FaBed className='card__icon' />
                                </div>
                                <div className='total__card red__grad'>
                                    <div className='total__card__data'>
                                        <p>0</p>
                                        <p>Extra Occupancy</p>
                                    </div>
                                    <HiUserAdd className='card__icon' />
                                </div>
                            </div>

                            <div className="total__data_cards__bottom">
                                <div className='total__card blue__grad'>
                                    <div className='total__card__data'>
                                        <p>10</p>
                                        <p>Total Footfals</p>
                                    </div>
                                    <FaUsers className='card__icon' />
                                </div>
                                <div className='total__card green__grad'>
                                    <div className='total__card__data'>
                                        <p>100144</p>
                                        <p>Total Footfals</p>
                                    </div>
                                    <FaUsers className='card__icon' />
                                </div>
                                <div className='total__card yellow__grad'>
                                    <div className='total__card__data'>
                                        <p>0</p>
                                        <p>Today Aminity Charges</p>
                                    </div>
                                    <FaRupeeSign className='card__icon' />
                                </div>
                                <div className='total__card yellow__grad'>
                                    <div className='total__card__data'>
                                        <p>10</p>
                                        <p>Total Aminity Charges</p>
                                    </div>
                                    <FaRupeeSign className='card__icon' />
                                </div>
                            </div>
                        </div>
                    </div>


                    {/* ============================================================== */}
                    {/* Current Stay In Guest List */}
                    {/* ============================================================== */}

                    <div className='content__body__main mt-6'>
                        <div className='w-full flex gap-3 items-center'>
                            <Icons.LIST />
                            <p className='font-semibold text-md uppercase'>Current Stay In Guest List</p>
                        </div>
                        <div className={`add_new_compnent`}>
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
                                    {/* menu... */}
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
                            <table className='min-w-full bg-white' id='itemTable' ref={tableRef}>
                                <thead className='bg-gray-100 list__table__head'>
                                    <tr>
                                        <th className='py-2 px-4 border-b w-[50px]'>
                                            <input type='checkbox' onChange={selectAll} checked={data.length > 0 && selected.length === data.length} />
                                        </th>
                                        <td className='py-2 px-4 border-b '>Sl.</td>
                                        <th className='py-2 px-4 border-b '>Guest Details</th>
                                        <th className='py-2 px-4 border-b '>Check In Date & Time</th>
                                        <th className='py-2 px-4 border-b'>ID Card</th>
                                        <th className='py-2 px-4 border-b'>Mobile</th>
                                        <th className='py-2 px-4 border-b'>Room No.</th>
                                        <th className='py-2 px-4 border-b'>Payment</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        data.map((d, i) => {
                                            return <tr key={i} className='cursor-pointer hover:bg-gray-100'>
                                                <td className='py-2 px-4 border-b max-w-[10px]'>
                                                    <input type='checkbox' checked={selected.includes(d._id)} onChange={() => handleCheckboxChange(d._id)} />
                                                </td>
                                                <td className='px-4 border-b'>{d.hotel_name}</td>
                                                <td className='px-4 border-b' align='center'>{d?.hotel_zone_id?.name}</td>
                                                <td className='px-4 border-b' align='center'>{d?.hotel_sector_id?.name}</td>
                                                <td className='px-4 border-b' align='center'>{d?.hotel_block_id?.name || "--"}</td>
                                                <td className='px-4 border-b'>{d?.hotel_police_station_id?.name || "--"}</td>
                                                <td className='px-4 border-b' align='center'>{d?.hotel_district_id?.name || "--"}</td>
                                                <td className='px-4 border-b' align='center'>{d?.hotel_conference_hall === "1" ? "Yes" : "No"}</td>
                                                <td className='px-4 border-b' align='center'>{d?.hotel_conference_hall === "1" ? "Active" : "Inactive"}</td>
                                            </tr>
                                        })
                                    }
                                </tbody>
                            </table>
                            <div className='paginate__parent'>
                                <p>Showing {data.length} of {totalData} entries</p>
                                <Pagination
                                    activePage={activePage}
                                    totalData={totalData}
                                    dataLimit={dataLimit}
                                    setActivePage={setActivePage}
                                />
                            </div>
                        </div>
                    </div>


                    {/* ============================================================== */}
                    {/* RECENT NOTICE */}
                    {/* =============================================================== */}

                    <div className='content__body__main mt-6'>
                        <div className='w-full flex gap-3 items-center mb-3 pb-2 border-b'>
                            <Icons.NOTICE className='text-xl' />
                            <p className='font-semibold text-md uppercase'>Recent Notice</p>
                        </div>
                        {/* Table start */}
                        <div className='overflow-x-auto list__table'>
                            <table className='min-w-full bg-white' id='itemTable' ref={tableRef}>
                                <thead className='bg-gray-100 list__table__head'>
                                    <tr>
                                        <td className='py-2 px-4 border-b w-[5%]'>Sl.</td>
                                        <th className='py-2 px-4 border-b w-[10%]'>Date</th>
                                        <th className='py-2 px-4 border-b w-[*]'>Title</th>
                                        <th className='py-2 px-4 border-b w-[10%]'>Status</th>
                                        <th className='py-2 px-4 border-b w-[12%]' align='center'>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        recentNotice.map((d, i) => {
                                            return <tr key={i} className='cursor-pointer hover:bg-gray-100'>
                                                <td className='py-2 px-4 border-b max-w-[10px]'>{i + 1}</td>
                                                <td className='px-4 border-b' align='center'>{new Date(d?.notice_date).toLocaleDateString()}</td>
                                                <td className='px-4 border-b' align='center'>{d.notice_title}</td>
                                                <td className='px-4 border-b' align='center'>
                                                    <span className='chip__green'>
                                                        {d.notice_status === "1" ? "New" : "Expired"}
                                                    </span>
                                                </td>
                                                <td className='px-4 border-b'>
                                                    <button className='notice__view__btn' onClick={() => {
                                                        setModalData({
                                                            isOpen: true,
                                                            ...d
                                                        })
                                                    }}>
                                                        <Icons.EYE />
                                                        View Details
                                                    </button>
                                                </td>
                                            </tr>
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>
            <Modal open={modalData.isOpen} onClose={() => setModalData({
                ...modalData,
                isOpen: false,
            })}>
                <Modal.Header className='border-b pb-2'>
                    <p className='font-semibold'>Notice Details</p>
                </Modal.Header>
                <Modal.Body>
                    <p className='font-semibold mb-4'>{modalData.notice_title}</p>
                    <p>{modalData.notice_details}</p>
                </Modal.Body>
                <Modal.Footer>
                    <div className='bg-red-400 float-start'>
                        <button className='notice__view__btn' onClick={()=>{
                            if(modalData.notice_file) downloadBase64(modalData.notice_file);
                        }}>
                            <Icons.DOWNLOAD />
                            Download
                        </button>
                    </div>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default Statistics;
