import { useEffect, useMemo, useRef, useState } from 'react'
import Nav from '../../components/Admin/Nav';
import SideNav from '../../components/Admin/SideNav';
import { useNavigate } from 'react-router-dom';
import useExportTable from '../../hooks/useExportTable';
import Cookies from 'js-cookie';
import downloadPdf from '../../helper/downloadPdf';
import DataShimmer from '../../components/Admin/DataShimmer';
import { Tooltip } from 'react-tooltip';
import { Popover, Whisper } from 'rsuite';
import { Icons } from '../../helper/icons';
import Pagination from '../../components/Admin/Pagination';
import useSearchTable from '../../hooks/useSearchTable';


const Dashboard = () => {
  const { copyTable, downloadExcel, printTable, exportPdf } = useExportTable();
  const [activePage, setActivePage] = useState(1);
  const [dataLimit, setDataLimit] = useState(10);
  const [totalData, setTotalData] = useState()
  const [selected, setSelected] = useState([]);
  const [data, setData] = useState([]);
  const tableRef = useRef(null);
  const exportData = useMemo(() => {
    return data && data.map(({ hotel_name, hotel_zone_id, hotel_sector_id,
      hotel_block_id, hotel_police_station_id, hotel_district_id, }, _) => ({
        Name: hotel_name,
        Zone: hotel_zone_id?.name,
        Sector: hotel_sector_id?.name,
        Proprietor: hotel_block_id?.name || "--",
        PoliceStation: hotel_police_station_id?.name || "--",
        District: hotel_district_id?.name || "--"
      }));
  }, [data]);
  const [loading, setLoading] = useState(true);
  const searchTable = useSearchTable();



  // Get data;
  useEffect(() => {
    const get = async () => {
      try {
        const data = {
          token: Cookies.get("token"),
          page: activePage,
          limit: dataLimit
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
        console.log(res);
        setTotalData(res.total)
        setData([...res.data])
        setLoading(false);

      } catch (error) {
        console.log(error)
      }
    }
    get();
  }, [dataLimit, activePage])


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
          <div className={`mb-5 w-full bg-white rounded p-4 shadow-sm add_new_compnent overflow-hidden transition-all`}>
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
          {
            !loading ? <div className='content__body__main'>
              {/* Table start */}
              <div className='overflow-x-auto list__table'>
                <table className='min-w-full bg-white' id='itemTable' ref={tableRef}>
                  <thead className='bg-gray-100 list__table__head'>
                    <tr>
                      <th className='py-2 px-4 border-b w-[50px]'>
                        <input type='checkbox' onChange={selectAll} checked={data.length > 0 && selected.length === data.length} />
                      </th>
                      <td className='py-2 px-4 border-b '>Name</td>
                      <th className='py-2 px-4 border-b '>Zone</th>
                      <th className='py-2 px-4 border-b '>Sector</th>
                      <th className='py-2 px-4 border-b'>Block</th>
                      <th className='py-2 px-4 border-b'>Police Station</th>
                      <th className='py-2 px-4 border-b'>District</th>
                      <th className='py-2 px-4 border-b'>Total Guest(s) Enrolled</th>
                      <th className='py-2 px-4 border-b'>Total Charges</th>
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
              : <DataShimmer />
          }
        </div>
      </main>
    </>
  )
}

export default Dashboard;