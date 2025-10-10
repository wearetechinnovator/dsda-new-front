import { useEffect, useMemo, useRef, useState } from 'react'
import Nav from '../../components/Admin/Nav';
import SideNav from '../../components/Admin/SideNav';
import useExportTable from '../../hooks/useExportTable';
import Cookies from 'js-cookie';
import downloadPdf from '../../helper/downloadPdf';
import DataShimmer from '../../components/Admin/DataShimmer';
import { Tooltip } from 'react-tooltip';
import { Popover, Whisper } from 'rsuite';
import { Icons } from '../../helper/icons';
import Pagination from '../../components/Admin/Pagination';
import useSetTableFilter from '../../hooks/useSetTableFilter';



const Dashboard = () => {
  const { copyTable, downloadExcel, printTable, exportPdf } = useExportTable();
  const { getFilterState, setFilterState } = useSetTableFilter();
  const savedFilter = getFilterState("dashboard");
  const [activePage, setActivePage] = useState(savedFilter?.activePage || 1);
  const [dataLimit, setDataLimit] = useState(savedFilter?.limit || 10);
  const [totalData, setTotalData] = useState()
  const [selected, setSelected] = useState([]);
  const [data, setData] = useState([]);
  const tableRef = useRef(null);
  const exportData = useMemo(() => {
    return data && data.map((h, _) => ({
      Name: h.hotel_name,
      Zone: h.hotel_zone_id?.name,
      Sector: h.hotel_sector_id?.name,
      Proprietor: h.hotel_block_id?.name,
      PoliceStation: h.hotel_police_station_id?.name,
      District: h.hotel_district_id?.name
    }));
  }, [data]);
  const [loading, setLoading] = useState(true);
  const timeRef = useRef(null);




  // Get data;
  const get = async () => {
    try {
      const data = {
        token: Cookies.get("token"),
        page: activePage,
        limit: dataLimit,
        enrolled: true
      }
      setFilterState("dashboard", dataLimit, activePage);
      const url = process.env.REACT_APP_MASTER_API + `/hotel/get`;
      const req = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": 'application/json'
        },
        body: JSON.stringify(data)
      });
      const res = await req.json();

      if (req.status === 200) {
        console.log(res);
        setTotalData(res.total)
        setData([...res.data])
        setLoading(false);
      }
      setLoading(false);

    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    get();
  }, [dataLimit, activePage])

  const searchTableDatabase = (e) => {
    const txt = e.target.value;
    if (timeRef.current) clearTimeout(timeRef.current);

    timeRef.current = setTimeout(async () => {
      if (!txt) {
        get();
        return;
      }

      try {
        const data = {
          token: Cookies.get("token"),
          search: txt,
          enrolled: true
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
        setTotalData(res.length)
        setData([...res])

      } catch (error) {
        console.log(error)
      }

    }, 300)

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


  const exportTable = async (whichType) => {
    if (whichType === "copy") {
      copyTable("table"); // Pass tableid
    }
    else if (whichType === "excel") {
      downloadExcel(exportData, 'hotel-list.xlsx') // Pass data and filename
    }
    else if (whichType === "print") {
      printTable(tableRef, "Data"); // Pass table ref and title
    }
    else if (whichType === "pdf") {
      let document = exportPdf('Hotel List', exportData);
      downloadPdf(document);
    }
  }


  return (
    <>
      <Nav title={"Admin Dashboard"} />
      <main id='main'>
        <SideNav />
        <Tooltip id='itemTooltip' />
        <div className='content__body'>
          {
            !loading ? <div className='content__body__main'>
              {/* Option bar */}
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
                        // onChange={searchTable}
                        onChange={searchTableDatabase}
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
              <div className='overflow-x-auto list__table list__table__checkin'>
                <table className='min-w-full bg-white' id='itemTable' ref={tableRef}>
                  <thead className='bg-gray-100 list__table__head'>
                    <tr>
                      <td className='w-[5%]' align='center'>
                        <input type='checkbox' onChange={selectAll} checked={data.length > 0 && selected.length === data.length} />
                      </td>
                      <td className=''>Name</td>
                      <td className=''>Zone</td>
                      <td className=' '>Sector</td>
                      <td className=''>Block</td>
                      <td className=''>Police Station</td>
                      <td className=''>District</td>
                      <td className='w-[12%]'>Total Guest(s) Enrolled</td>
                      <td className='w-[8%]'>Total Charges</td>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      data?.map((d, i) => {
                        return <tr key={i} className='cursor-pointer hover:bg-gray-100'>
                          <td align='center'>
                            <input type='checkbox' checked={selected.includes(d._id)} onChange={() => handleCheckboxChange(d._id)} />
                          </td>
                          <td>{d.hotel_name}</td>
                          <td>{d.hotel_zone_id?.name || "--"}</td>
                          <td>{d.hotel_sector_id?.name || "--"}</td>
                          <td>{d.hotel_block_id?.name || "--"}</td>
                          <td>{d.hotel_police_station_id?.name || "--"}</td>
                          <td>{d.hotel_district_id?.name || "--"}</td>
                          <td>{d.hotel_total_guest}</td>
                          <td>{d.hotel_total_charges}</td>
                        </tr>
                      })
                    }
                  </tbody>
                </table>
              </div>
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
              : <DataShimmer />
          }
        </div>
      </main>
    </>
  )
}

export default Dashboard;