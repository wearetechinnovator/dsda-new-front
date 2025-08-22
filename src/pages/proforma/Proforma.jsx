import React, { useEffect, useMemo, useRef, useState } from 'react';
import Nav from '../../components/Nav';
import SideNav from '../../components/SideNav';
// import MyBreadCrumb from '../../components/BreadCrumb';
import { Popover, Whisper } from 'rsuite';
import { data, useNavigate } from 'react-router-dom';
import useExportTable from '../../hooks/useExportTable';
import useMyToaster from '../../hooks/useMyToaster';
import Cookies from 'js-cookie';
import downloadPdf from '../../helper/downloadPdf';
import DataShimmer from '../../components/DataShimmer';
import { Tooltip } from 'react-tooltip';
import AddNew from '../../components/AddNew';
import { Icons } from '../../helper/icons';
import Pagination from '../../components/Pagination';






// Proforma page
document.title = "Proforma"
const Proforma = () => {
  const toast = useMyToaster();
  const { copyTable, downloadExcel, printTable, exportPdf } = useExportTable();
  const [activePage, setActivePage] = useState(1);
  const [dataLimit, setDataLimit] = useState(10);
  const [totalData, setTotalData] = useState();
  const [selected, setSelected] = useState([]);
  const navigate = useNavigate();
  const [billData, setBillData] = useState([]);
  const tableRef = useRef(null);
  const [tableStatusData, setTableStatusData] = useState('active');
  const exportData = useMemo(() => {
    return billData && billData.map(({ estimateDate, proformaNumber, party, validDate }) => ({
      "Estimate Data": estimateDate,
      "Proforma Number": proformaNumber,
      "Party": party.name,
      "Valid Date": validDate
    }));
  }, [billData]);
  const [loading, setLoading] = useState(true);
  const [filterToggle, setFilterToggle] = useState(false);
  const [filterData, setFilterData] = useState({
    productName: "", fromDate: '', toDate: '', billNo: '', party: '',
    gst: "", billDate: ''
  })
  const [ascending, setAscending] = useState(true);



  // Get data;
  const getData = async () => {
    try {
      const data = {
        token: Cookies.get("token"),
        trash: tableStatusData === "trash" ? true : false,
        all: tableStatusData === "all" ? true : false
      }
      const url = process.env.REACT_APP_API_URL + `/proforma/get?page=${activePage}&limit=${dataLimit}`;
      const req = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": 'application/json'
        },
        body: JSON.stringify(data)
      });
      const res = await req.json();
      console.log(res)
      setTotalData(res.totalData)
      setBillData([...res.data]);
      setLoading(false);

    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    getData();
  }, [tableStatusData, dataLimit, activePage])


  const sortByDate = () => {
    const sorted = [...billData].sort((a, b) => {
      const dateA = new Date(a.estimateDate);
      const dateB = new Date(b.estimateDate);
      return ascending ? dateA - dateB : dateB - dateA;
    });
    setBillData(sorted);
    setAscending(!ascending);
  };


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
      setSelected(billData.map(data => data._id));
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
      copyTable("listQuotation"); // Pass tableid
    }
    else if (whichType === "excel") {
      downloadExcel(exportData, 'party-list.xlsx') // Pass data and filename
    }
    else if (whichType === "print") {
      printTable(tableRef, "Party List"); // Pass table ref and title
    }
    else if (whichType === "pdf") {
      let document = exportPdf('Proforma List', exportData);
      downloadPdf(document)
    }
  }

  const removeData = async (trash) => {
    if (selected.length === 0 || tableStatusData !== 'active') {
      return;
    }
    const url = process.env.REACT_APP_API_URL + "/proforma/delete";
    try {
      const req = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ ids: selected, trash: trash })
      });
      const res = await req.json();

      if (req.status !== 200 || res.err) {
        return toast(res.err, 'error');
      }

      selected.forEach((id, _) => {
        setBillData((prevData) => {
          return prevData.filter((data, _) => data._id !== id)
        })
      });
      setSelected([]);

      return toast(res.msg, 'success');

    } catch (error) {
      console.log(error)
      toast("Something went wrong", "error")
    }
  }

  const restoreData = async () => {
    if (selected.length === 0 || tableStatusData !== "trash") {
      return;
    }

    const url = process.env.REACT_APP_API_URL + "/proforma/restore";
    try {
      const req = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ ids: selected })
      });
      const res = await req.json();

      if (req.status !== 200 || res.err) {
        return toast(res.err, 'error');
      }

      selected.forEach((id, _) => {
        setBillData((prevData) => {
          return prevData.filter((data, _) => data._id !== id)
        })
      });
      setSelected([]);
      return toast(res.msg, 'success');

    } catch (error) {
      console.log(error)
      toast("Something went wrong", "error")
    }
  }



  const getFilterData = async () => {

    if ([
      filterData.billDate, filterData.party, filterData.billNo, filterData.fromDate,
      filterData.toDate, filterData.gst, filterData.productName
    ].every((field) => field === "" || !field)) {
      return toast("Choose a filter option", 'error')
    }

    try {
      const url = process.env.REACT_APP_API_URL + `/proforma/filter?page=${activePage}&limit=${dataLimit}`;

      const req = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": 'application/json'
        },
        body: JSON.stringify({ token: Cookies.get("token"), ...filterData })
      });
      const res = await req.json();

      console.log(res)
      setTotalData(res?.totalData)
      setBillData([...res?.data])

    } catch (error) {
      console.log(error)
      return toast("Something went wrong", 'error')
    }
  }


  const clearFilterData = () => {
    getData()
    setFilterData({
      productName: "", fromDate: '', toDate: '', billNo: '', party: '',
      gst: "", billDate: ''
    })
  }



  return (
    <>
      <Nav title={"Proforma"} />
      <main id='main'>
        <SideNav />
        <Tooltip id='proformaTooltip' />
        <div className='content__body'>
          {/* top section */}
          <div
            className={`add_new_compnent ${filterToggle ? 'h-[265px]' : 'h-[45px]'}`}>
            <div className='flex justify-between items-center'>
              <div className='flex flex-col'>
                <select value={dataLimit} onChange={(e) => setDataLimit(e.target.value)}>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>
              <div className='flex items-center gap-2 listing__btn_grp'>
                <div className='flex w-full flex-col lg:w-[300px]'>
                  <input type='text'
                    placeholder='Search...'
                    onChange={searchTable}
                    className='p-[6px]'
                  />
                </div>
                <button onClick={() => {
                  setFilterToggle(!filterToggle)
                }}
                  className={`${filterToggle ? 'bg-gray-200 border-gray-300' : 'bg-gray-100'} border`}>
                  <Icons.FILTER className='text-xl' />
                  Filter
                </button>
                <button
                  onClick={() => removeData(false)}
                  className={`${selected.length > 0 ? 'bg-red-400 text-white' : 'bg-gray-100'} border`}>
                  <Icons.DELETE className='text-lg' />
                  Delete
                </button>
                <button
                  onClick={() => navigate("/admin/proforma-invoice/add")}
                  className='bg-[#003E32] text-white '>
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

            <div id='filterToggle'>
              <hr />

              <div className='grid gap-4 lg:grid-cols-4 sm:grid-cols-2 grid-cols-1' id='filterBill'>
                <div>
                  <p>Product Name</p>
                  <input type="text"
                    value={filterData.productName}
                    onChange={(e) => setFilterData({ ...filterData, productName: e.target.value })}
                  />
                </div>
                <div>
                  <p>Bill No</p>
                  <input type="text"
                    value={filterData.billNo}
                    onChange={(e) => setFilterData({ ...filterData, billNo: e.target.value })}
                  />
                </div>
                <div>
                  <p>From Date</p>
                  <input type="date"
                    value={filterData.fromDate}
                    onChange={(e) => setFilterData({ ...filterData, fromDate: e.target.value })}
                  />
                </div>
                <div>
                  <p>To Date</p>
                  <input type="date"
                    value={filterData.toDate}
                    onChange={(e) => setFilterData({ ...filterData, toDate: e.target.value })}
                  />
                </div>
                <div>
                  <p>Party</p>
                  <input type="text"
                    value={filterData.party}
                    onChange={(e) => setFilterData({ ...filterData, party: e.target.value })}
                  />
                </div>
                <div>
                  <p>GSTIN</p>
                  <input type="text"
                    value={filterData.gst}
                    onChange={(e) => setFilterData({ ...filterData, gst: e.target.value })}
                  />
                </div>
              </div>

              <div className='w-full flex justify-end gap-2 mt-5' id='filterBtnGrp'>
                <button onClick={getFilterData}>
                  <Icons.SEARCH />
                  Search
                </button>
                <button onClick={clearFilterData}>
                  <Icons.RESET />
                  Reset
                </button>
              </div>
            </div>
          </div>
          {
            !loading ? billData.length > 0 ? <div className='content__body__main bg-white'>


              {/* Table start */}
              <div className='overflow-x-auto list__table'>
                <table className='min-w-full bg-white' id='listQuotation' ref={tableRef}>
                  <thead className='list__table__head'>
                    <tr>
                      <th className='py-2 px-4 border-b'>
                        <input type='checkbox'
                          onChange={selectAll}
                          checked={billData.length > 0 && selected.length === billData.length}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </th>
                      <th className='py-2 px-4 border-b cursor-pointer' onClick={sortByDate}>
                        <div className='flex items-center justify-center'>
                          Date {ascending ? <Icons.DROPDOWN /> : <Icons.DROPUP />}
                        </div>
                      </th>
                      <th className='py-2 px-4 border-b'>Proforma Number</th>
                      <th className='py-2 px-4 border-b'>Party Name</th>
                      <th className='py-2 px-4 border-b'>Valid To</th>
                      <th className='py-2 px-4 border-b'>Status</th>
                      <th className='py-2 px-4 border-b'>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      billData.map((data, i) => {
                        return <tr key={i}
                          onClick={() => navigate(`/admin/bill/details/proforma/${data._id}`)}>
                          <td className='py-2 px-4 border-b max-w-[10px]'>
                            <input type='checkbox'
                              checked={selected.includes(data._id)}
                              onChange={() => handleCheckboxChange(data._id)}
                              onClick={(e) => e.stopPropagation()}
                            />
                          </td>
                          <td className='px-4 border-b' align='center'>{new Date(data.estimateDate).toLocaleDateString()}</td>
                          <td className='px-4 border-b' align='center'>{data.proformaNumber}</td>
                          <td className='px-4 border-b' align='center'>{data.party.name}</td>
                          <td className='px-4 border-b' align='center'>{new Date(data.validDate).toLocaleDateString()}</td>
                          <td className='px-4 border-b max-w-[20px]' align='center'>
                            {
                              data.validDate ? <span className={`${data.validDate ? 'bg-green-500' : ''} px-2 text-white rounded-lg text-[12px] font-bold`}>
                                {new Date(Date.parse(new Date().toLocaleDateString())).toISOString() > new Date(Date.parse(data.validDate)).toISOString() ? "Expired" : "Valid"}
                              </span>
                                : "--"
                            }
                          </td>

                          <td className='px-4 text-center'>
                            <Whisper
                              placement='leftStart'
                              trigger={"click"}
                              speaker={<Popover full>
                                <div className='w-[150px]'>
                                  <div
                                    className='table__list__action__icon'
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      navigate(`/admin/proforma-invoice/edit/${data._id}`)

                                    }}
                                  >
                                    <Icons.EDIT className='text-[16px]' />
                                    Edit
                                  </div>
                                  <div
                                    className='table__list__action__icon'
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      navigate(`/admin/bill/details/proforma/${data._id}`)
                                    }}
                                  >
                                    <Icons.INFO_DETAILS className='text-[16px]' />
                                    Details
                                  </div>
                                  <div
                                    className='table__list__action__icon'
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      navigate(`/admin/sales-invoice/convert/add/${data._id}`)
                                    }}
                                  >
                                    <Icons.CONVERT className='text-[14px]' />
                                    Convert to invoice
                                  </div>
                                </div>
                              </Popover>}
                            >
                              <div className='table__list__action' onClick={(e) => e.stopPropagation()}>
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
                  <p>Showing {billData.length} of {totalData} entries</p>
                  {/* ----- Paginatin ----- */}
                  <Pagination
                    activePage={activePage}
                    totalData={totalData}
                    dataLimit={dataLimit}
                    setActivePage={setActivePage}
                  />
                </div>
                {/* pagination end */}
              </div>
            </div>
              : <AddNew title={"Proforma"} link={"/admin/proforma-invoice/add/"} />
              : <DataShimmer />
          }
        </div>
      </main>

    </>
  )
}

export default Proforma;

