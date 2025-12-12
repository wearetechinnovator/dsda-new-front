import { useEffect, useState } from 'react'
import Nav from '../../../components/Hotel/Nav';
import SideNav from '../../../components/Hotel/HotelSideNav'
import { LuFileX2 } from "react-icons/lu";
import useMyToaster from '../../../hooks/useMyToaster';
import { SelectPicker, Toggle } from 'rsuite';
import Cookies from 'js-cookie';
import { useNavigate, useParams } from 'react-router-dom';
import MySelect2 from '../../../components/Admin/MySelect2';
import { Icons } from '../../../helper/icons';
import { MdUploadFile } from 'react-icons/md';
import base64Data from '../../../helper/getBase64';
import { useDispatch, useSelector } from 'react-redux';
import { addHotelDetails } from '../../../store/hotelSlice';



const Profile = () => {
  const toast = useMyToaster();
  const dispatch = useDispatch();
  const hotelData = useSelector(state => state.hotelDetails);
  const [hotelCategories, setHotelCategories] = useState([]);
  const [documentType, setDocumentType] = useState([])
  const [roomType, setRoomType] = useState([]);
  const [data, setData] = useState({
    zone: '', sector: '', block: '', category: '', district: '', policeStation: "", name: '',
    address: "", email: '', establishment: '', miniumRate: '', maximumRate: '', website: '', gmbUrl: '', distanceFromRoad: '', distanceFromSeaBeach: '', ac: '0', swimmingPool: '0', parkingAvailable: '0',
    username: '', password: '', receptionPhone: '', proprietorName: "", proprietorPhone: "",
    managerName: '', managerPhone: '', alternateManagerPhone: '', restaurantAvailable: '0', conferanceHallAvailable: '0', status: '1',
  })
  const [bedCapacity, setBedCapacity] = useState({
    oneBed: '', twoBed: '', threeBed: '', fourBed: '', fiveBed: '', sixBed: '',
    sevenBed: '', eightBed: '', nineBed: '', tenBed: '', totalBed: '', totalRoom: ''
  });

  //  Gallery images;
  const photoGalleryDataSet = { image: '', fileName: '', caption: '' }
  const [photoGallery, setPhotoGallery] = useState([photoGalleryDataSet])

  // Document data
  const [documentDataSet, setDocumentDataSet] = useState({
    selectedDocument: '', fileName: '', file: ''
  })
  const [documentData, setDocumentData] = useState([documentDataSet]);

  // Room Type
  const [roomTypeSet, setRoomTypeSet] = useState({
    selectedRoomType: '', numberOfRoom: "", price: '', breakFast: ''
  })
  const [roomTypeData, setRoomTypeData] = useState([roomTypeSet]);



  useEffect(() => {
    if (hotelData && hotelData.hotel_gallery_image && hotelData.hotel_room_type && hotelData.hotel_document) {
      setPhotoGallery(hotelData.hotel_gallery_image);
      setRoomTypeData(hotelData.hotel_room_type);
      setDocumentData(hotelData.hotel_document);

      setData({
        zone: hotelData.hotel_zone_id?.name || "",
        sector: hotelData.hotel_sector_id?.name || "",
        block: hotelData.hotel_block_id?.name || "",
        category: hotelData.hotel_category?.name || "",
        district: hotelData.hotel_district_id?.name || "",
        policeStation: hotelData.hotel_police_station_id?.name || "",

        name: hotelData.hotel_name || "",
        address: hotelData.hotel_address || "",
        email: hotelData.hotel_email || "",
        establishment: hotelData.hotel_year_of_establishment || "",
        miniumRate: hotelData.hotel_minimum_rate || "",
        maximumRate: hotelData.hotel_maximum_rate || "",
        website: hotelData.hotel_website || "",
        gmbUrl: hotelData.hotel_gmb || "",
        distanceFromRoad: hotelData.hotel_distance_from_main_road || "",
        distanceFromSeaBeach: hotelData.hotel_distance_from_sea_beach || "",

        ac: hotelData.hotel_has_ac || "0",
        swimmingPool: hotelData.hotel_has_swimming_pool || "0",
        parkingAvailable: hotelData.hotel_has_parking || "0",

        username: hotelData.hotel_username || "",
        // password: hotelData.hotel_password || "",
        receptionPhone: hotelData.hotel_reception_phone || "",
        proprietorName: hotelData.hotel_proprietor_name || "",
        proprietorPhone: hotelData.hotel_proprietor_phone || "",
        managerName: hotelData.hotel_manager_name || "",
        managerPhone: hotelData.hotel_manager_phone || "",
        alternateManagerPhone: hotelData.hotel_manager_phone_alternative || "",

        restaurantAvailable: hotelData.hotel_has_restaurant || "0",
        conferanceHallAvailable: hotelData.hotel_has_conference_hall || "0",
        status: hotelData.hotel_status || "1",
      });

      setBedCapacity({
        oneBed: hotelData.hotel_1_bed_room || "",
        twoBed: hotelData.hotel_2_bed_room || "",
        threeBed: hotelData.hotel_3_bed_room || "",
        fourBed: hotelData.hotel_4_bed_room || "",
        fiveBed: hotelData.hotel_5_bed_room || "",
        sixBed: hotelData.hotel_6_bed_room || "",
        sevenBed: hotelData.hotel_7_bed_room || "",
        eightBed: hotelData.hotel_8_bed_room || "",
        nineBed: hotelData.hotel_9_bed_room || "",
        tenBed: hotelData.hotel_10_bed_room || "",
        totalBed: hotelData.hotel_total_bed || "",
        totalRoom: hotelData.hotel_total_room || "",
      })

    }
  }, [hotelData]);


  // get types
  useEffect(() => {
    const get = async (which) => {
      const req = await fetch(process.env.REACT_APP_MASTER_API + `/constant-type/get/${which}`, {
        method: 'GET',
        headers: {
          'x-hotel-token': `Bearer ${Cookies.get("hotel-token")}`
        }
      })
      const res = await req.json();

      if (which === "document") {
        setDocumentType([...res]);

      } else if (which === "hotel-category") {
        setHotelCategories([...res]);

      } else if (which === "room") {
        setRoomType([...res]);
      }
    }

    get("hotel-category");
    get("document");
    get("room");
  }, [])
  useEffect(() => {
    setDocumentData([documentDataSet]);
    setRoomTypeData([roomTypeSet])
  }, [documentDataSet.documentType, roomTypeSet.roomType])



  const saveData = async (e) => {
    const requiredKeys = [
      'zone', 'sector', 'block', 'district', 'policeStation',
      'name', 'address', 'username', 'managerPhone'
    ];

    for (const key of requiredKeys) {
      if (!data[key] || data[key].trim() === "") {
        return toast(`${key.camelToWords()} can't be blank`, 'error');
      }
    }

    const allData = {
      ...data,
      ...bedCapacity,
      photoGallery,
      documentData,
      roomTypeData,
      hotelUpdate: true
    };

    try {
      const url = process.env.REACT_APP_MASTER_API + "/hotel/update";
      const token = Cookies.get("token");
      const hotelId = Cookies.get("hotelId");
      const req = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ ...allData, hotelToken: token, id: hotelId })
      })
      const res = await req.json();
      if (req.status !== 200 || res.err) {
        return toast(res.err, 'error');
      }


      toast("Hotel update success", 'success');
      window.location.reload();
      // dispatch(addHotelDetails({ ...allData }));
      return;
    } catch (error) {
      console.log(error);
      return toast("Something went wrong", "error")
    }

  }


  const handleBedCapacityChange = (e, key) => {
    const value = e.target.value;
    setBedCapacity((prev) => {
      const updated = {
        ...prev,
        [key]: value,
      };

      let totalRoom = 0;
      let totalBed = 0;

      Object.keys(updated).forEach((b) => {
        if (b !== "totalRoom" && b !== "totalBed") {
          const roomCount = Number(updated[b] || 0);

          totalRoom += roomCount;

          const multiplier = parseInt(b) || Number(b.replace("Bed", "")) || 1;
          const mapping = {
            oneBed: 1,
            twoBed: 2,
            threeBed: 3,
            fourBed: 4,
            fiveBed: 5,
            sixBed: 6,
            sevenBed: 7,
            eightBed: 8,
            nineBed: 9,
            tenBed: 10,
          };

          totalBed += roomCount * (mapping[b] || multiplier);
        }
      });

      return {
        ...updated,
        totalRoom,
        totalBed,
      };
    });
  };



  const clearData = () => {
    setData({
      zone: '', sector: '', block: '', category: '', district: '', policeStation: "", name: '',
      address: "", email: '', establishment: '', miniumRate: '', maximumRate: '', website: '', gmbUrl: '', distanceFromRoad: '', distanceFromSeaBeach: '', ac: '0', swimmingPool: '0',
      parkingAvailable: '0', username: '', password: '', receptionPhone: '', proprietorName: "", proprietorPhone: "", managerName: '', managerPhone: '', alternateManagerPhone: '', restaurantAvailable: '0', conferanceHallAvailable: '0', status: '1',
    });

    setBedCapacity({
      oneBed: '', twoBed: '', threeBed: '', fourBed: '', fiveBed: '', sixBed: '',
      sevenBed: '', eightBed: '', nineBed: '', tenBed: '', totalBed: '', totalRoom: ''
    })

    setPhotoGallery([photoGalleryDataSet]);
    setDocumentData([documentDataSet]);
    setRoomTypeData([roomTypeSet]);

  }

  return (
    <>
      <Nav title={"Profile"} />
      <main id='main'>
        <SideNav />
        <div className='content__body'>
          <div className='content__body__main'>
            <div className='flex justify-between  gap-5 flex-col lg:flex-row'>
              <div className='w-full flex flex-col gap-3'>
                <div>
                  <p className='ml-1'>Zone</p>
                  <input type='text' value={data.zone} disabled />
                </div>
                <div>
                  <p>Category</p>
                  <input type='text' value={data.category} disabled />
                </div>
                <div>
                  <p className='ml-1'>Sector</p>
                  <input type='text' value={data.sector} disabled />
                </div>
                <div>
                  <p className='ml-1'>Block<span className='required__text'>*</span></p>
                  <input type='text' value={data.block} disabled />
                </div>
                <div>
                  <p className='ml-1'>District</p>
                  <input type='text' value={data.district} disabled />
                </div>
                <div>
                  <p className='ml-1'>Police Station</p>
                  <input type='text' value={data.policeStation} disabled />
                </div>
                <div>
                  <p>Name<span className='required__text'>*</span></p>
                  <input type='text' disabled value={data.name} />
                </div>
                <div>
                  <p>Year of Establishment<span className='required__text'>*</span></p>
                  <input type='text' disabled value={data.establishment} />
                </div>
                <div>
                  <p>Address</p>
                  <input type='text' disabled value={data.address} />
                </div>
                <div>
                  <p>Email</p>
                  <input type='email' disabled value={data.email} />
                </div>
                <div>
                  <p>Username<span className='required__text'>*</span></p>
                  <input type='text' disabled value={data.username} />
                </div>
              </div>

              <div className='w-full flex flex-col gap-3'>
                <div>
                  <p>GMB URL (Google My Business URL or Google Map URL)</p>
                  <input type='text' disabled value={data.gmbUrl} />
                </div>
                <div>
                  <p>Distance From Main Road (In Meters)</p>
                  <input type='text' disabled value={data.distanceFromRoad} />
                </div>
                <div>
                  <p>Distance From Sea Beach (In Meters)</p>
                  <input type='text' disabled value={data.distanceFromSeaBeach} />
                </div>
                <div>
                  <p>Reception Phone</p>
                  <input type='text' disabled value={data.receptionPhone} />
                </div>
                <div>
                  <p>Proprietor Name</p>
                  <input type='text' disabled value={data.proprietorName} />
                </div>
                <div>
                  <p>Proprietor Phone</p>
                  <input type='text' disabled value={data.proprietorPhone} />
                </div>
                <div>
                  <p>Manager Name</p>
                  <input type='text' disabled value={data.managerName} />
                </div>
                <div>
                  <p>Manager Phone <span className='required__text'>*</span></p>
                  <input type='text' disabled value={data.managerPhone} />
                </div>
                <div>
                  <p>Alternate Manager Phone</p>
                  <input type='text' disabled value={data.alternateManagerPhone} />
                </div>

                <div>
                  <p>Minimum Rate</p>
                  <input type='text' disabled value={data.miniumRate} />
                </div>
                <div>
                  <p>Maximum Rate</p>
                  <input type='text' disabled value={data.maximumRate} />
                </div>
                <div>
                  <p>Website</p>
                  <input type='text' disabled value={data.website} />
                </div>
              </div>
            </div>

            {/* ::::::::::::::::::::::::::::::::: Availablity Inputs ::::::::::::::::::::::::::: */}
            <div className='my-8'>
              <div class="overflow-x-auto">
                <table class="min-w-full border border-gray-200 text-left">
                  <thead class="bg-gray-100 text-xs">
                    <tr>
                      <th class="px-2 py-2 border">Restaurant Available?</th>
                      <th class="px-2 border">AC Available?</th>
                      <th class="px-2 border">Swimming Pool?</th>
                      <th class="px-2 border">Conference Hall Available?</th>
                      <th class="px-2 border">Parking Available?</th>
                      <th class="px-2 border">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="px-2 py-2 border">
                        <Toggle
                          checked={data.restaurantAvailable === "1"}
                          // onChange={(value) => setData({ ...data, restaurantAvailable: value ? "1" : "0" })}
                          checkedChildren="Yes"
                          unCheckedChildren="No"
                        />
                      </td>

                      <td className="px-2 py-2 border">
                        <Toggle
                          checked={data.ac === "1"}
                          // onChange={(value) => setData({ ...data, ac: value ? "1" : "0" })}
                          checkedChildren="Yes"
                          unCheckedChildren="No"
                        />
                      </td>

                      <td className="px-2 py-2 border">
                        <Toggle
                          checked={data.swimmingPool === "1"}
                          // onChange={(value) => setData({ ...data, swimmingPool: value ? "1" : "0" })}
                          checkedChildren="Yes"
                          unCheckedChildren="No"
                        />
                      </td>

                      <td className="px-2 py-2 border">
                        <Toggle
                          checked={data.conferanceHallAvailable === "1"}
                          // onChange={(value) => setData({ ...data, conferanceHallAvailable: value ? "1" : "0" })}
                          checkedChildren="Yes"
                          unCheckedChildren="No"
                        />
                      </td>

                      <td className="px-2 py-2 border">
                        <Toggle
                          size={"md"}
                          checked={data.parkingAvailable === "1"}
                          // onChange={(value) => setData({ ...data, parkingAvailable: value ? "1" : "0" })}
                          checkedChildren="Yes"
                          unCheckedChildren="No"
                        />
                      </td>

                      <td className="px-2 py-2 border">
                        <Toggle
                          checked={data.status === "1"}
                          // onChange={(value) => setData({ ...data, status: value ? "1" : "0" })}
                          checkedChildren="Operative"
                          unCheckedChildren="Inoperative"
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* ::::::::::::::::::::::::::::::::: HOTEL AND ROOM data ::::::::::::::::::::::::::: */}
            <div className='my-8' id='roomAndBedCapacity'>
              <h6 className='mb-4 font-semibold text-[15px] uppercase'>Room & Bed Capacity*</h6>
              <div class="overflow-x-auto">
                <table class="min-w-full border border-gray-200 text-left">
                  <thead class="bg-gray-100 text-xs">
                    <tr>
                      <th class="px-2 py-2 border">One Bedroom</th>
                      <th class="px-2 border">Two Bedroom</th>
                      <th class="px-2 border">Three Bedroom</th>
                      <th class="px-2 border">Four Bedroom</th>
                      <th class="px-2 border">Five Bedroom</th>
                      <th class="px-2 border">Six Bedroom</th>
                      <th class="px-2 border">Seven Bedroom</th>
                      <th class="px-2 border">Eight Bedroom</th>
                      <th class="px-2 border">Nine Bedroom</th>
                      <th class="px-2 border">Ten Bedroom</th>
                      <th class="px-2 border font-bold">Total Beds</th>
                      <th class="px-2 border font-bold">Total Rooms</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="px-2 py-2 border">
                        <input
                          type="number"
                          disabled={true}
                          placeholder="One Bed"
                          value={bedCapacity.oneBed}
                          // onChange={(e) => handleBedCapacityChange(e, "oneBed")}
                          className="w-20 p-2 border rounded text-xs"
                        />
                      </td>

                      <td className="px-2 py-2 border">
                        <input
                          type="number"
                          disabled={true}
                          placeholder="Two Bed"
                          value={bedCapacity.twoBed}
                          // onChange={(e) => handleBedCapacityChange(e, "twoBed")}
                          className="w-20 p-2 border rounded text-xs"
                        />
                      </td>

                      <td className="px-2 py-2 border">
                        <input
                          type="number"
                          disabled={true}
                          placeholder="Three Bed"
                          value={bedCapacity.threeBed}
                          // onChange={(e) => handleBedCapacityChange(e, "threeBed")}
                          className="w-20 p-2 border rounded text-xs"
                        />
                      </td>

                      <td className="px-2 py-2 border">
                        <input
                          type="number"
                          disabled={true}
                          placeholder="Four Bed"
                          value={bedCapacity.fourBed}
                          // onChange={(e) => handleBedCapacityChange(e, "fourBed")}
                          className="w-20 p-2 border rounded text-xs"
                        />
                      </td>

                      <td className="px-2 py-2 border">
                        <input
                          type="number"
                          disabled={true}
                          placeholder="Five Bed"
                          value={bedCapacity.fiveBed}
                          // onChange={(e) => handleBedCapacityChange(e, "fiveBed")}
                          className="w-20 p-2 border rounded text-xs"
                        />
                      </td>

                      <td className="px-2 py-2 border">
                        <input
                          type="number"
                          disabled={true}
                          placeholder="Six Bed"
                          value={bedCapacity.sixBed}
                          // onChange={(e) => handleBedCapacityChange(e, "sixBed")}
                          className="w-20 p-2 border rounded text-xs"
                        />
                      </td>

                      <td className="px-2 py-2 border">
                        <input
                          type="number"
                          disabled={true}
                          placeholder="Seven Bed"
                          value={bedCapacity.sevenBed}
                          // onChange={(e) => handleBedCapacityChange(e, "sevenBed")}
                          className="w-20 p-2 border rounded text-xs"
                        />
                      </td>

                      <td className="px-2 py-2 border">
                        <input
                          type="number"
                          disabled={true}
                          placeholder="Eight Bed"
                          value={bedCapacity.eightBed}
                          // onChange={(e) => handleBedCapacityChange(e, "eightBed")}
                          className="w-20 p-2 border rounded text-xs"
                        />
                      </td>

                      <td className="px-2 py-2 border">
                        <input
                          type="number"
                          disabled={true}
                          placeholder="Nine Bed"
                          value={bedCapacity.nineBed}
                          // onChange={(e) => handleBedCapacityChange(e, "nineBed")}
                          className="w-20 p-2 border rounded text-xs"
                        />
                      </td>

                      <td className="px-2 py-2 border">
                        <input
                          type="number"
                          disabled={true}
                          placeholder="Ten Bed"
                          value={bedCapacity.tenBed}
                          // onChange={(e) => handleBedCapacityChange(e, "tenBed")}
                          className="w-20 p-2 border rounded text-xs"
                        />
                      </td>


                      {/* <!-- Totals --> */}
                      <td class="px-4 py-2 border bg-gray-50 font-semibold">{bedCapacity.totalBed}</td>
                      <td class="px-4 py-2 border bg-gray-50 font-semibold">{bedCapacity.totalRoom}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>


            {/* ::::::::::::::::::::::::::::::::: Photo Gallery ::::::::::::::::::::::::::: */}
            <div className="mb-8 overflow-x-auto">
              <h6 className='mt-2 mb-1 font-semibold text-[15px] uppercase'>Photo Gallery*</h6>
              <table className="min-w-full border border-gray-200 rounded-lg shadow-sm">
                <thead className="bg-gray-100 text-xs">
                  <tr>
                    <th className="px-4 py-2 text-left font-medium text-gray-600 w-[*]">Image</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-600 w-[30%]">Caption</th>
                    <th className="px-4 py-2 font-medium text-gray-600 w-[10px] text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {photoGallery.map((p, index) => {
                    return (
                      <tr key={index} className="border-t">
                        <td className="px-4 py-2">
                          <div className="file__uploader__div">
                            <span className="file__name">{photoGallery[index].fileName}</span>
                            <div className="flex gap-2">
                              <input
                                type="file"
                                id={`siteLogo-${index}`}
                                className="hidden"
                                onChange={async (e) => {
                                  const file = e.target.files[0];
                                  if (!file) return;
                                  const fileData = await base64Data(file);

                                  setPhotoGallery((prev) =>
                                    prev.map((item, i) =>
                                      i === index ? { ...item, image: fileData, fileName: file.name } : item
                                    )
                                  );
                                }}
                              />
                              <label htmlFor={`siteLogo-${index}`} className="file__upload" title="Upload" >
                                <MdUploadFile />
                              </label>
                              <LuFileX2
                                className="remove__upload"
                                title="Remove upload"
                                onClick={() => {
                                  setPhotoGallery((prev) =>
                                    prev.map((item, i) =>
                                      i === index ? { ...item, image: "", fileName: '' } : item
                                    )
                                  );
                                }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="text"
                            value={photoGallery[index].caption}
                            onChange={(e) => {
                              let temp = [...photoGallery];
                              temp[index].caption = e.target.value;
                              setPhotoGallery(temp);
                            }}
                          />
                        </td>
                        <td className="px-4 py-2">
                          <button
                            className='close__icon'
                            onClick={() => {
                              setPhotoGallery((pv) => pv.filter((_, i) => i !== index));
                            }}
                          >
                            <Icons.DELETE />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td colSpan="3" className="px-4 py-2 text-center text-sm text-gray-500">
                      <button
                        className="w-full bg-[#003628] text-white rounded-sm flex items-center gap-1 justify-center outline-none py-2"
                        onClick={() => {
                          setPhotoGallery((pv) => [...pv, photoGalleryDataSet]);
                        }}
                      >
                        <Icons.ADD className="text-white" /> Add More
                      </button>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* ::::::::::::::::::::::::::::::::::::: Documents :::::::::::::::::::::::::::::: */}
            <div className="mb-8 overflow-x-auto">
              <h6 className='mt-2 mb-1 font-semibold text-[15px] uppercase'>Documents*</h6>
              <table className="min-w-full border border-gray-200 rounded-lg shadow-sm">
                <thead className="bg-gray-100 text-xs">
                  <tr>
                    <th className="px-4 py-2 text-left font-medium text-gray-600 w-[30%]">
                      Document Type
                    </th>
                    <th className="px-4 py-2 text-left font-medium text-gray-600 w-[*]">
                      File
                    </th>
                    <th align='center' className="px-4 py-2 font-medium text-gray-600 w-[10px]">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {documentData.map((p, index) => {
                    return (
                      <tr key={index} className="border-t">
                        <td>
                          <SelectPicker
                            block
                            data={documentType?.map(t => ({
                              label: t.document_type_name,
                              value: t._id
                            })) || []}
                            style={{ width: '100%' }}
                            value={documentData?.[index]?.selectedDocument || null}
                            onChange={(v) => {
                              if (documentData.some((item, i) => item.selectedDocument === v && i !== index)) {
                                toast("This document type already added!", "error");
                                return;
                              }

                              // Update selected document
                              setDocumentData((prev) =>
                                prev.map((item, i) =>
                                  i === index ? { ...item, selectedDocument: v } : item
                                )
                              );
                            }}
                            placeholder="Select"
                            searchable
                            cleanable
                            placement="autoVertical"
                            className="mx-3"
                          />


                        </td>
                        <td className="px-4 py-2">
                          <div className="file__uploader__div">
                            <span className="file__name">{documentData[index].fileName}</span>
                            <div className="flex gap-2">
                              {/* unique ID for each row */}
                              <input
                                type="file"
                                id={`document-${index}`}
                                className="hidden"
                                onChange={async (e) => {
                                  const file = e.target.files[0];
                                  if (!file) return;
                                  const fileData = await base64Data(file);
                                  setDocumentData((prev) =>
                                    prev.map((item, i) =>
                                      i === index ? { ...item, fileName: file.name, file: fileData } : item
                                    )
                                  );
                                }}
                              />
                              <label htmlFor={`document-${index}`} className="file__upload" title="Upload">
                                <MdUploadFile />
                              </label>
                              <LuFileX2
                                className="remove__upload"
                                title="Remove upload"
                                onClick={() => {
                                  setDocumentData((prev) =>
                                    prev.map((item, i) =>
                                      i === index ? { ...item, fileName: "" } : item
                                    )
                                  );
                                }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-2">
                          <button
                            className='close__icon'
                            onClick={() => {
                              setDocumentData((pv) => pv.filter((_, i) => i !== index));
                            }}
                          >
                            <Icons.DELETE />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td colSpan="3" className="px-4 py-2 text-center text-sm text-gray-500">
                      <button
                        className="w-full bg-[#003628] text-white rounded-sm flex items-center gap-1 justify-center outline-none py-2"
                        onClick={() => {
                          setDocumentData((pv) => [...pv, documentDataSet]);
                        }}
                      >
                        <Icons.ADD className="text-white" /> Add More
                      </button>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* ::::::::::::::::::::::::::::::::::::: Room Type :::::::::::::::::::::::::::::: */}
            <div className="mb-8 overflow-x-auto">
              <h6 className='mt-2 mb-1 font-semibold text-[15px] uppercase'>Room Type*</h6>
              <table className="min-w-full border border-gray-200 rounded-lg shadow-sm">
                <thead className="bg-gray-100 text-xs">
                  <tr>
                    <th className="px-4 py-2 text-left font-medium text-gray-600 w-[*]">
                      Room Type
                    </th>
                    <th className="px-4 py-2 text-left font-medium text-gray-600 w-[20%]">
                      Number of Room
                    </th>
                    <th className="px-4 py-2 text-left font-medium text-gray-600 w-[20%]">
                      Price
                    </th>
                    <th className="px-4 py-2 text-center font-medium text-gray-600 w-[10%]" align='center'>
                      Breakfast
                    </th>
                    <th align='center' className="px-4 py-2 text-center font-medium text-gray-600 w-[5%]">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {roomTypeData.map((row, index) => (
                    <tr key={index} className="border-t">
                      <td>
                        <SelectPicker
                          block
                          data={roomType?.map(t => ({ label: t.name, value: t._id })) || []}
                          style={{ width: '100%' }}
                          onChange={(v) => {
                            if (roomTypeData.some((item, i) => item.selectedRoomType === v && i !== index)) {
                              toast("This room type already added!", "error");
                              return;
                            }

                            setRoomTypeData(prev =>
                              prev.map((item, i) =>
                                i === index ? { ...item, selectedRoomType: v } : item
                              )
                            );
                          }}
                          value={row.selectedRoomType}
                          placeholder="Select"
                          searchable={true}
                          cleanable={true}
                          placement='autoVertical'
                          className='ml-3'
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="number"
                          value={row.numberOfRoom || ""}
                          onChange={(e) => {
                            setRoomTypeData(prev =>
                              prev.map((item, i) =>
                                i === index ? { ...item, numberOfRoom: e.target.value } : item
                              )
                            );
                          }}
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="text"
                          value={row.price || ""}
                          onChange={(e) => {
                            setRoomTypeData(prev =>
                              prev.map((item, i) =>
                                i === index ? { ...item, price: e.target.value } : item
                              )
                            );
                          }}
                        />
                      </td>
                      <td className="px-4 py-2">
                        <Toggle
                          checked={row.breakFast === "1"}
                          onChange={(value) => {
                            setRoomTypeData(prev =>
                              prev.map((item, i) =>
                                i === index ? { ...item, breakFast: value ? "1" : "0" } : item
                              )
                            );
                          }}
                          checkedChildren="Yes"
                          unCheckedChildren="No"
                        />
                      </td>

                      <td className="px-4 py-2">
                        <button
                          type="button"
                          className="close__icon"
                          onClick={() => {
                            setRoomTypeData(prev => prev.filter((_, i) => i !== index));
                          }}
                        >
                          <Icons.DELETE />
                        </button>
                      </td>
                    </tr>
                  ))}

                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td colSpan="5" className="px-4 py-2 text-center text-sm text-gray-500">
                      <button
                        className="w-full bg-[#003628] text-white rounded-sm flex items-center gap-1 justify-center outline-none py-2"
                        onClick={() => {
                          setRoomTypeData((pv) => [...pv, roomTypeSet]);
                        }}
                      >
                        <Icons.ADD className="text-white" /> Add More
                      </button>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className='form__btn__grp pb-2'>
              <button className='save__btn' onClick={saveData}>
                <Icons.CHECK /> Update
              </button>
              <button className='reset__btn' onClick={clearData}>
                <Icons.RESET />
                Reset
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

export default Profile;

