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
import { Popover, Whisper } from 'rsuite';
import { Icons } from '../../../helper/icons';
import Pagination from '../../../components/Admin/Pagination';
import MySelect2 from '../../../components/Admin/MySelect2';


document.title = "Admin User"
const Payment = ({ mode }) => {
    const toast = useMyToaster();
    const { copyTable, downloadExcel, printTable, exportPdf } = useExportTable();
    const [activePage, setActivePage] = useState(1);
    const [dataLimit, setDataLimit] = useState(10);
    const [totalData, setTotalData] = useState()
    const [selected, setSelected] = useState([]);
    const navigate = useNavigate();
    const [tableStatusData, setTableStatusData] = useState('active');
    const [itemData, setItemData] = useState([]);
    const tableRef = useRef(null);
    const exportData = useMemo(() => {
        return itemData && itemData.map(({ title, category }, _) => ({
            Title: title,
            HSN: category?.hsn
        }));
    }, [itemData]);
    const [loading, setLoading] = useState(true);



    // Get data;
    useEffect(() => {
        const getCategory = async () => {
            try {
                const data = {
                    token: Cookies.get("token"),
                    trash: tableStatusData === "trash" ? true : false,
                    all: tableStatusData === "all" ? true : false
                }
                const url = process.env.REACT_APP_API_URL + `/item/get?page=${activePage}&limit=${dataLimit}`;
                const req = await fetch(url, {
                    method: "POST",
                    headers: {
                        "Content-Type": 'application/json'
                    },
                    body: JSON.stringify(data)
                });
                const res = await req.json();
                setTotalData(res.totalData)
                setItemData([...res.data])
                setLoading(false);

            } catch (error) {
                console.log(error)
            }
        }
        getCategory();
    }, [tableStatusData, dataLimit, activePage])


    const searchTable = (e) => {
        const value = e.target.value.toLowerCase();
        const rows = document.querySelectorAll('.list__table tbody tr');

        rows.forEach(row => {
            const cols = row.querySelectorAll('td');
            let found = false;
            cols.forEach((col, index) => {
                if (index !== 0 && col.innerHTML.toLowerCase().includes(value)) {
                    found = true;
                }
            });
            if (found) {
                row.style.display = "";
            } else {
                row.style.display = "none";
            }
        });
    }

    const selectAll = (e) => {
        if (e.target.checked) {
            setSelected(itemData.map((item, _) => item._id));
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
            copyTable("itemTable"); // Pass tableid
        }
        else if (whichType === "excel") {
            downloadExcel(exportData, 'item-list.xlsx') // Pass data and filename
        }
        else if (whichType === "print") {
            printTable(tableRef, "Item List"); // Pass table ref and title
        }
        else if (whichType === "pdf") {
            let document = exportPdf('Item List', exportData);
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
                    <div
                        className={`w-full bg-white rounded p-4 shadow-sm add_new_compnent overflow-hidden transition-all `}>
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
                                <button
                                    className={`${selected.length > 0 ? 'bg-red-400 text-white' : 'bg-gray-100'} border`}>
                                    <Icons.DELETE className='text-lg' />
                                    Delete
                                </button>
                                <button
                                    onClick={() => navigate("/admin/amenities/add")}
                                    className='bg-[#003E32] text-white'>
                                    <Icons.ADD className='text-xl text-white' />
                                    Add New
                                </button>
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
                                    <MySelect2
                                        model={"hotel"}
                                        onType={(v) => {
                                        }}
                                        value={""}
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
                    {
                        <div className='content__body__main'>
                            {/* Table start */}
                            <div className='overflow-x-auto list__table'>
                                <table className='min-w-full bg-white' id='itemTable' ref={tableRef}>
                                    <thead className='bg-gray-100 list__table__head'>
                                        <tr>
                                            <th className='py-2 px-4 border-b w-[50px]'>
                                                <input type='checkbox' onChange={selectAll} checked={itemData.length > 0 && selected.length === itemData.length} />
                                            </th>
                                            <td className='py-2 px-4 border-b '>SL No.</td>
                                            <th className='py-2 px-4 border-b '>Date</th>
                                            <th className='py-2 px-4 border-b'>Hotel</th>
                                            <th className='py-2 px-4 border-b '>Amount</th>
                                            <th className='py-2 px-4 border-b'>Year</th>
                                            <th className='py-2 px-4 border-b'>Month</th>
                                            <th className='py-2 px-4 border-b'>Payment Mode</th>
                                            <th className='py-2 px-4 border-b'>Transaction ID</th>
                                            <th className='py-2 px-4 border-b'>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td></td>
                                            <td>1</td>
                                            <td>10-5-6</td>
                                            <td>Demo</td>
                                            <td>2500</td>
                                            <td>2025</td>
                                            <td>february</td>
                                            <td>adfss</td>
                                            <td>ad</td>
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

                                                            }}
                                                        >
                                                            <Icons.EDIT className='text-[16px]' />
                                                            Edit
                                                        </div>
                                                    </Popover>}
                                                >
                                                    <div className='table__list__action' >
                                                        <Icons.HORIZONTAL_MORE />
                                                    </div>
                                                </Whisper>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td></td>
                                            <td>1</td>
                                            <td>10-5-6</td>
                                            <td>Demo</td>
                                            <td>2500</td>
                                            <td>2025</td>
                                            <td>february</td>
                                            <td>adfss</td>
                                            <td>ad</td>
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

                                                            }}
                                                        >
                                                            <Icons.EDIT className='text-[16px]' />
                                                            Edit
                                                        </div>
                                                    </Popover>}
                                                >
                                                    <div className='table__list__action' >
                                                        <Icons.HORIZONTAL_MORE />
                                                    </div>
                                                </Whisper>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td></td>
                                            <td>1</td>
                                            <td>10-5-6</td>
                                            <td>Demo</td>
                                            <td>2500</td>
                                            <td>2025</td>
                                            <td>february</td>
                                            <td>adfss</td>
                                            <td>ad</td>
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

                                                            }}
                                                        >
                                                            <Icons.EDIT className='text-[16px]' />
                                                            Edit
                                                        </div>
                                                    </Popover>}
                                                >
                                                    <div className='table__list__action' >
                                                        <Icons.HORIZONTAL_MORE />
                                                    </div>
                                                </Whisper>
                                            </td>
                                        </tr>

                                    </tbody>
                                </table>
                                <div className='paginate__parent'>
                                    <p>Showing {itemData.length} of {totalData} entries</p>
                                    <Pagination
                                        activePage={activePage}
                                        totalData={totalData}
                                        dataLimit={dataLimit}
                                        setActivePage={setActivePage}
                                    />
                                </div>
                            </div>
                        </div>
                        // : <AddNew title={"Item"} link={"/admin/item/add"} />
                        // : <DataShimmer />
                    }
                </div>
            </main>
        </>
    )
}

export default Payment;