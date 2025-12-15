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
import { BsBuildings } from 'react-icons/bs';
import { FaBed } from 'react-icons/fa';
import { HiUserAdd } from 'react-icons/hi';
import useMyToaster from '../../hooks/useMyToaster';
import CardLoading from '../../components/Admin/CardLoader';
import NoData from '../../components/Admin/NoData';
import { useNavigate } from 'react-router-dom';



const Dashboard = () => {
  const navigate = useNavigate();
  const toast = useMyToaster();
  const { copyTable, downloadExcel, printTable, exportPdf } = useExportTable();
  const { getFilterState, setFilterState } = useSetTableFilter();
  const savedFilter = getFilterState("dashboard");
  const [activePage, setActivePage] = useState(savedFilter?.activePage || 1);
  const [dataLimit, setDataLimit] = useState(savedFilter?.limit || 10);
  const [totalData, setTotalData] = useState()
  const [data, setData] = useState([]);
  const tableRef = useRef(null);
  const exportData = useMemo(() => {
    return data && data.map((h, _) => ({
      Name: h.hotel_name,
      Zone: h.hotel_zone_id?.name,
      Sector: h.hotel_sector_id?.name,
      Proprietor: h.hotel_block_id?.name,
      PoliceStation: h.hotel_police_station_id?.name,
      District: h.hotel_district_id?.name,
      "Total Guest(s) Enrolled": h.hotel_total_guest,
      "Total Charges": h.hotel_total_charges
    }));
  }, [data]);
  const [loading, setLoading] = useState(true);
  const timeRef = useRef(null);
  const [statsData, setStatsData] = useState({
    allHotels: null, totalOperativeHotel: null, totalInOperativeHotel: null, dayWiseAcitveHotel: null,
    todayActive: null, totalBeds: null, occupiedBeds: null, vacantsBeds: null, extraOccupency: null, toDayFtFls: null,
    tillTodayFtFls: null, toDayChild: null, tillTodyChild: null, toDayAdult: null, tillTodayAdult: null,
    toDayAmicharges: null, totalAmiCharges: null, dueAmiCharge: null, amiChargePaid: null, tillTodayMale: null,
    tillTodayFemale: null, tillTodayOtherGender: null, tillTodayIndian: null, tillTodayForeigner: null
  })
  const token = Cookies.get("token");




  // Get data;
  const get = async () => {
    setLoading(true);
    
    try {
      const data = {
        token: token,
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

        setTotalData(res.total)
        setData([...res.data])
        setLoading(false);
      }
      setLoading(false);

    } catch (error) {
      setLoading(false);
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

      }

    }, 300)

  }



  // ================== [Get Statictics] =============
  useEffect(() => {
    (async () => {
      const [resAdmin, resHotel] = await Promise.all([
        fetch(process.env.REACT_APP_MASTER_API + "/admin/statictics", {
          method: "POST",
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ token: token })
        }).then(r => r.json()),

        fetch(process.env.REACT_APP_BOOKING_API + "/check-in/get-admin-stats", {
          method: "POST",
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ token: token })
        }).then(r => r.json())
      ]);

      setStatsData(prev => ({
        ...prev,
        allHotels: resAdmin.total_hotel,
        totalOperativeHotel: resAdmin.total_operative_hotel,
        totalInOperativeHotel: parseInt(resAdmin.total_hotel) - parseInt(resAdmin.total_operative_hotel),
        totalBeds: resAdmin.total_beds,
        todayActive: resHotel.active_hotel,
        occupiedBeds: resHotel.total_occupied,
        vacantsBeds: Math.max(0, parseInt(resAdmin.total_beds) - parseInt(resHotel.total_occupied)),
        extraOccupency: Math.max(0, parseInt(resHotel.total_occupied) - parseInt(resAdmin.total_beds)),
        toDayFtFls: resHotel.today_footfall,
        tillTodayFtFls: resHotel.total_footfall,
        toDayChild: resHotel.today_child,
        tillTodyChild: resHotel.total_child,
        toDayAdult: resHotel.today_adult,
        tillTodayAdult: resHotel.total_adult,
        toDayAmicharges: resHotel.today_aminity_charge,
        totalAmiCharges: resHotel.total_aminity_charge,
        tillTodayMale: resHotel.total_male,
        tillTodayFemale: resHotel.total_female,
        tillTodayOtherGender: resHotel.total_other_gender,
        tillTodayIndian: resHotel.total_indian,
        tillTodayForeigner: resHotel.total_foreigner,
        amiChargePaid: resAdmin.total_amenities_paid,
        dueAmiCharge: resHotel.total_aminity_charge - resAdmin.total_amenities_paid,
      }));

    })();
  }, []);



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

          {/* Cards  */}

          {/* // statsLoading ? */}
          <div className='w-full'>
            <div className="total__data_cards dashboard">
              <div className='total__card blue__grad' onClick={() => navigate("/admin/hotel")}>
                <div className='total__card__data'>
                  <p>{statsData.allHotels ?? <CardLoading />}</p>
                  <p>{"Total Hotels"}</p>
                </div>
                <BsBuildings className='card__icon' />
              </div>
              <div className='total__card blue__grad' onClick={() => navigate("/admin/hotel", {
                state: "1"
              })}>
                <div className='total__card__data'>
                  <p>{statsData.totalOperativeHotel ?? <CardLoading />}</p>
                  <p>Operative Hotels</p>
                </div>
                <BsBuildings className='card__icon' />
              </div>
              <div className='total__card blue__grad' onClick={() => navigate("/admin/hotel", {
                state: '0'
              })}>
                <div className='total__card__data'>
                  <p>{statsData.totalInOperativeHotel ?? <CardLoading />}</p>
                  <p>Inoperative Hotels</p>
                </div>
                <BsBuildings className='card__icon' />
              </div>
              <div className='total__card blue__grad' onClick={() => navigate("/admin/amenities-charges/overall-date-wise")}>
                <div className='total__card__data'>
                  <p>{statsData.todayActive ?? <CardLoading />}</p>
                  <p>Day Wise Active Hotels</p>
                </div>
                <BsBuildings className='card__icon' />
              </div>
              <div className='total__card blue__grad' onClick={() => navigate("/admin/amenities-charges/hotel-wise")}>
                <div className='total__card__data'>
                  <p>{statsData.todayActive ?? <CardLoading />}</p>
                  <p>Today Active Hotels</p>
                </div>
                <BsBuildings className='card__icon' />
              </div>
              <div className='total__card green__grad' onClick={() => navigate("/admin/report/bed-availablity")}>
                <div className='total__card__data'>
                  <p>{statsData.totalBeds ?? <CardLoading />}</p>
                  <p>Total Beds</p>
                </div>
                <FaBed className='card__icon' />
              </div>

              <div className='total__card green__grad' onClick={() => navigate("/admin/report/bed-availablity")}>
                <div className='total__card__data'>
                  <p>{statsData.occupiedBeds ?? <CardLoading />}</p>
                  <p>Occupied Beds</p>
                </div>
                <FaBed className='card__icon' />
              </div>
              <div className='total__card green__grad' onClick={() => navigate("/admin/report/bed-availablity")}>
                <div className='total__card__data'>
                  <p>{statsData.vacantsBeds ?? <CardLoading />}</p>
                  <p>Vacant Beds</p>
                </div>
                <FaBed className='card__icon' />
              </div>
              <div className='total__card red__grad' onClick={() => navigate("/admin/report/bed-availablity")}>
                <div className='total__card__data'>
                  <p>{statsData.extraOccupency ?? <CardLoading />}</p>
                  <p>Extra Occupancy</p>
                </div>
                <HiUserAdd className='card__icon' />
              </div>
              <div className='total__card purple__grad' onClick={() => navigate("/admin/report/tourist-data/footfall-hotel/today")}>
                <div className='total__card__data'>
                  <p>{statsData.toDayFtFls ?? <CardLoading />}</p>
                  <p>Today Footfalls</p>
                </div>
                <Icons.USERS className='card__icon' />
              </div>
              <div className='total__card purple__grad' onClick={() => navigate("/admin/report/tourist-data/footfall")}>
                <div className='total__card__data'>
                  <p>{statsData.tillTodayFtFls ?? <CardLoading />}</p>
                  <p>Till Today Footfalls</p>
                </div>
                <Icons.USERS className='card__icon' />
              </div>
              <div className='total__card purple__grad' onClick={() => navigate("/admin/report/tourist-data/footfall-hotel/today")}>
                <div className='total__card__data'>
                  <p>{statsData.toDayChild ?? <CardLoading />}</p>
                  <p>Today Child</p>
                </div>
                <Icons.CHILD className='card__icon' />
              </div>

              <div className='total__card purple__grad' onClick={() => navigate("/admin/report/tourist-data/footfall")}>
                <div className='total__card__data'>
                  <p>{statsData.tillTodyChild ?? <CardLoading />}</p>
                  <p>Till Today Child</p>
                </div>
                <Icons.CHILD className='card__icon' />
              </div>
              <div className='total__card purple__grad' onClick={() => navigate("/admin/report/tourist-data/footfall-hotel/today")}>
                <div className='total__card__data'>
                  <p>{statsData.toDayAdult ?? <CardLoading />}</p>
                  <p>Today Adult</p>
                </div>
                <Icons.USER_FILL className='card__icon' />
              </div>
              <div className='total__card purple__grad' onClick={() => navigate("/admin/report/tourist-data/footfall")}>
                <div className='total__card__data'>
                  <p>{statsData.tillTodayAdult ?? <CardLoading />}</p>
                  <p>Till Today Adult</p>
                </div>
                <Icons.USER_FILL className='card__icon' />
              </div>
              <div className='total__card yellow__grad' onClick={() => navigate("/admin/amenities-charges/hotel-wise")}>
                <div className='total__card__data'>
                  <p>{statsData.toDayAmicharges ?? <CardLoading />}</p>
                  <p>Today Aminity Charges</p>
                </div>
                <Icons.RUPES className='card__icon' />
              </div>
              <div className='total__card yellow__grad' onClick={() => navigate("/admin/amenities-charges/hotel-wise/today")}>
                <div className='total__card__data'>
                  <p>{statsData.totalAmiCharges ?? <CardLoading />}</p>
                  <p>Total Aminity Charges</p>
                </div>
                <Icons.RUPES className='card__icon' />
              </div>
              <div className='total__card yellow__grad' onClick={() => navigate("/admin/amenities-charges/amenities-payment")}>
                <div className='total__card__data'>
                  <p>{statsData.dueAmiCharge ?? <CardLoading />}</p>
                  <p>Aminity Charges Due</p>
                </div>
                <Icons.RUPES className='card__icon' />
              </div>

              <div className='total__card yellow__grad' onClick={() => navigate("/admin/amenities-charges/amenities-payment")}>
                <div className='total__card__data'>
                  <p>{statsData.amiChargePaid ?? <CardLoading />}</p>
                  <p>Aminity Charges Paid</p>
                </div>
                <Icons.RUPES className='card__icon' />
              </div>
              <div className='total__card male__grad' onClick={() => navigate("/admin/report/tourist-data/footfall")}>
                <div className='total__card__data'>
                  <p>{statsData.tillTodayMale ?? <CardLoading />}</p>
                  <p>Till Today Male</p>
                </div>
                <Icons.GENDER_MALE className='card__icon' />
              </div>
              <div className='total__card pink__grad' onClick={() => navigate("/admin/report/tourist-data/footfall")}>
                <div className='total__card__data'>
                  <p>{statsData.tillTodayFemale ?? <CardLoading />}</p>
                  <p>Till Today Female</p>
                </div>
                <Icons.GENDER_FEMALE className='card__icon' />
              </div>
              <div className='total__card rainbow__grad' onClick={() => navigate("/admin/report/tourist-data/footfall")}>
                <div className='total__card__data'>
                  <p>{statsData.tillTodayOtherGender ?? <CardLoading />}</p>
                  <p>Till Today Other Gender</p>
                </div>
                <Icons.GENDER_TRANS className='card__icon' />
              </div>
              <div className='total__card flag__grad' onClick={() => navigate("/admin/report/tourist-data/footfall")}>
                <div className='total__card__data'>
                  <p>{statsData.tillTodayIndian ?? <CardLoading />}</p>
                  <p>Till Today Indians</p>
                </div>
                <Icons.USER_FILL className='card__icon' />
              </div>
              <div className='total__card red__chilli' onClick={() => navigate("/admin/report/tourist-data/footfall")}>
                <div className='total__card__data'>
                  <p>{statsData.tillTodayForeigner ?? <CardLoading />}</p>
                  <p>Till Today Foreigner</p>
                </div>
                <Icons.USER_FILL className='card__icon' />
              </div>
            </div>
          </div>

          {/* ============================================================== */}
          {/* Current Stay In Guest List */}
          {/* ============================================================== */}
          {
            !loading ? <div className='content__body__main mt-8'>
              <div className='w-full flex gap-1 border-b pb-1'>
                <Icons.USERS />
                <p className='font-semibold uppercase'>Current Status</p>
              </div>
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
                      <td>Sl.</td>
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
                        return <tr key={i} className='hover:bg-gray-100'>
                          <td align='center'>{(activePage - 1) * dataLimit + i + 1}</td>
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
                {data.length < 1 && <NoData />}
              </div>
              {data.length > 0 && <div className='paginate__parent'>
                <p>Showing {data.length} of {totalData} entries</p>
                <Pagination
                  activePage={activePage}
                  totalData={totalData}
                  dataLimit={dataLimit}
                  setActivePage={setActivePage}
                />
              </div>}
            </div>
              : <DataShimmer />
          }
        </div>
      </main>
    </>
  )
}

export default Dashboard;