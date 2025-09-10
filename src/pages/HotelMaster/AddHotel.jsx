import React, { useEffect, useState } from 'react'
import Nav from '../../components/Nav';
import SideNav from '../../components/SideNav'
import { FaRegCheckCircle } from "react-icons/fa";
import { LuFileX2, LuRefreshCcw } from "react-icons/lu";
import { CgPlayListAdd } from "react-icons/cg";
import useMyToaster from '../../hooks/useMyToaster';
import { SelectPicker } from 'rsuite';
import Cookies from 'js-cookie';
import { useNavigate, useParams } from 'react-router-dom';
import useApi from '../../hooks/useApi';
import { RiDeleteBin6Line } from 'react-icons/ri';
import MySelect2 from '../../components/MySelect2';
import { Icons } from '../../helper/icons';
import { MdUploadFile } from 'react-icons/md';



const AddHotel = ({ mode }) => {
  const toast = useMyToaster();
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState({
    zone: '', sector: '', block: '', district: '', policeStation: "", name: '', address: "", email: '',
    username: '', password: '', receptionPhone: '', proprietorName: "", proprietorPhone: "", managerName: '',
    managerPhone: '', alternateManagerPhone: '', restaurantAvailable: '', conferanceHallAvailable: '',
    status: '', about: ''
  })
  const [bedCapacity, setBedCapacity] = useState({
    oneBed: '', twoBed: '', threeBed: '', fourBed: '', fiveBed: '', sixBed: '',
    sevenBed: '', eightBed: '', nineBed: '', tenBed: '', totalBed: '', totalRoom: ''
  });



  useEffect(() => {
    if (mode) {
      const get = async () => {
        const url = process.env.REACT_APP_MASTER_API + "/item/get";
        const cookie = Cookies.get("token");

        const req = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": 'application/json'
          },
          body: JSON.stringify({ token: cookie, id: id })
        })
        const res = await req.json();
        const data = res.data;

      }

      get();
    }
  }, [mode])


  const saveData = async (e) => {
    const requiredKeys = [
      'zone', 'sector', 'block', 'district', 'policeStation',
      'name', 'address', 'username', 'password', 'managerPhone'
    ];

    for (const key of requiredKeys) {
      if (!data[key] || data[key].trim() === "") {
        return toast(`${key.camelToWords()} can't be blank`, 'error');
      }
    }


    try {
      const url = process.env.REACT_APP_MASTER_API + "";
      const token = Cookies.get("token");
      const req = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(
          !mode ? { ...data, token }
            : { ...data, token, update: true, id: id }
        )
      })
      const res = await req.json();
      if (req.status !== 200 || res.err) {
        return toast(res.err, 'error');
      }

      if (!mode) clearData();

      toast(!mode ? "Item create success" : "Item update success", 'success');


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
      zone: '', sector: '', block: '', district: '', policeStation: "", name: '', address: "", email: '',
      username: '', password: '', receptionPhone: '', proprietorName: "", proprietorPhone: "", managerName: '',
      managerPhone: '', alternateManagerPhone: '', restaurantAvailable: '', conferanceHallAvailable: '',
      status: '', about: ''
    });

    setBedCapacity({
      oneBed: '', twoBed: '', threeBed: '', fourBed: '', fiveBed: '', sixBed: '',
      sevenBed: '', eightBed: '', nineBed: '', tenBed: '', totalBed: '', totalRoom: ''
    })
  }

  return (
    <>
      <Nav title={mode ? "Update New Hotel" : "Add New Hotel"} />
      <main id='main'>
        <SideNav />
        <div className='content__body'>
          <div className='content__body__main'>
            <div className='flex justify-between  gap-5 flex-col lg:flex-row'>
              <div className='w-full flex flex-col gap-3'>
                <div>
                  <p className='ml-1'>Zone<span className='required__text'>*</span></p>
                  <MySelect2
                    model={"zone"}
                    onType={(v) => {
                      console.log(v)
                      setData({ ...data, zone: v })
                    }}
                    value={data.zone}
                  />
                </div>
                <div>
                  <p className='ml-1'>Sector<span className='required__text'>*</span></p>
                  <MySelect2
                    model={"sector"}
                    onType={(v) => {
                      console.log(v)
                      setData({ ...data, sector: v })
                    }}
                    value={data.sector}
                  />
                </div>
                <div>
                  <p className='ml-1'>Block<span className='required__text'>*</span></p>
                  <MySelect2
                    model={"block"}
                    onType={(v) => {
                      console.log(v)
                      setData({ ...data, block: v })
                    }}
                    value={data.block}
                  />
                </div>
                <div>
                  <p className='ml-1'>District<span className='required__text'>*</span></p>
                  <MySelect2
                    model={"district"}
                    onType={(v) => {
                      console.log(v)
                      setData({ ...data, district: v })
                    }}
                    value={data.district}
                  />
                </div>
                <div>
                  <p className='ml-1'>Police Station<span className='required__text'>*</span></p>
                  <MySelect2
                    model={"police-station"}
                    onType={(v) => {
                      console.log(v)
                      setData({ ...data, policeStation: v })
                    }}
                    value={data.policeStation}
                  />
                </div>
                <div>
                  <p>Name<span className='required__text'>*</span></p>
                  <input type='text' onChange={(e) => setData({ ...data, name: e.target.value })} value={data.name} />
                </div>
                <div>
                  <p>Address</p>
                  <input type='text' onChange={(e) => setData({ ...data, address: e.target.value })} value={data.address} />
                </div>
                <div>
                  <p>Email</p>
                  <input type='email' onChange={(e) => setData({ ...data, email: e.target.value })} value={data.email} />
                </div>
                <div>
                  <p>Username<span className='required__text'>*</span></p>
                  <input type='text' onChange={(e) => setData({ ...data, username: e.target.value })} value={data.username} />
                </div>
                <div>
                  <p>Password<span className='required__text'>*</span></p>
                  <input type='password' onChange={(e) => setData({ ...data, password: e.target.value })} value={data.title} />
                </div>
              </div>

              <div className='w-full flex flex-col gap-3'>
                <div>
                  <p>Reception Phone</p>
                  <input type='text'
                    onChange={(e) => setData({ ...data, receptionPhone: e.target.value })}
                    value={data.receptionPhone} />
                </div>
                <div>
                  <p>Proprietor Name</p>
                  <input type='text'
                    onChange={(e) => setData({ ...data, proprietorName: e.target.value })}
                    value={data.proprietorName} />
                </div>
                <div>
                  <p>Proprietor Phone</p>
                  <input type='text'
                    onChange={(e) => setData({ ...data, proprietorPhone: e.target.value })}
                    value={data.proprietorPhone} />
                </div>
                <div>
                  <p>Manager Name</p>
                  <input type='text'
                    onChange={(e) => setData({ ...data, managerName: e.target.value })}
                    value={data.managerName} />
                </div>
                <div>
                  <p>Manager Phone <span className='required__text'>*</span></p>
                  <input type='text'
                    onChange={(e) => setData({ ...data, managerPhone: e.target.value })}
                    value={data.managerPhone} />
                </div>
                <div>
                  <p>Alternate Manager Phone</p>
                  <input type='text'
                    onChange={(e) => setData({ ...data, alternateManagerPhone: e.target.value })}
                    value={data.alternateManagerPhone} />
                </div>
                <div>
                  <p>Restaurant Available?</p>
                  <select onChange={(e) => setData({ ...data, restaurantAvailable: e.target.value })}
                    value={data.restaurantAvailable}>
                    <option value="">--Select--</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
                <div>
                  <p>Conference Hall Available?</p>
                  <select onChange={(e) => setData({ ...data, conferanceHallAvailable: e.target.value })}
                    value={data.conferanceHallAvailable}>
                    <option value="">--Select--</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
                <div>
                  <p>Status</p>
                  <select onChange={(e) => setData({ ...data, status: e.target.value })}
                    value={data.status}>
                    <option value="">--Select--</option>
                    <option value="inactive">Inactive</option>
                    <option value="active">Active</option>
                  </select>
                </div>
              </div>
            </div>

            <div className='w-full overflow-auto mt-2'>
              <div>
                <p>About</p>
                <textarea name="" id="" rows={4} onChange={(e) => setData({ ...data, about: e.target.value })}
                  value={data.about}></textarea>
              </div>
            </div>

            {/* ::::::::::::::::::::::::::::::::: HOTEL AND ROOM data ::::::::::::::::::::::::::: */}

            <div className='my-8'>
              <h6 className='my-4'>Room & Bed Capacity*</h6>
              <div class="overflow-x-auto">
                <table class="min-w-full border border-gray-200 text-left">
                  <thead class="bg-gray-100">
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
                          placeholder="One Bed"
                          value={bedCapacity.oneBed}
                          onChange={(e) => handleBedCapacityChange(e, "oneBed")}
                          className="w-20 p-2 border rounded text-xs"
                        />
                      </td>

                      <td className="px-2 py-2 border">
                        <input
                          type="number"
                          placeholder="Two Bed"
                          value={bedCapacity.twoBed}
                          onChange={(e) => handleBedCapacityChange(e, "twoBed")}
                          className="w-20 p-2 border rounded text-xs"
                        />
                      </td>

                      <td className="px-2 py-2 border">
                        <input
                          type="number"
                          placeholder="Three Bed"
                          value={bedCapacity.threeBed}
                          onChange={(e) => handleBedCapacityChange(e, "threeBed")}
                          className="w-20 p-2 border rounded text-xs"
                        />
                      </td>

                      <td className="px-2 py-2 border">
                        <input
                          type="number"
                          placeholder="Four Bed"
                          value={bedCapacity.fourBed}
                          onChange={(e) => handleBedCapacityChange(e, "fourBed")}
                          className="w-20 p-2 border rounded text-xs"
                        />
                      </td>

                      <td className="px-2 py-2 border">
                        <input
                          type="number"
                          placeholder="Five Bed"
                          value={bedCapacity.fiveBed}
                          onChange={(e) => handleBedCapacityChange(e, "fiveBed")}
                          className="w-20 p-2 border rounded text-xs"
                        />
                      </td>

                      <td className="px-2 py-2 border">
                        <input
                          type="number"
                          placeholder="Six Bed"
                          value={bedCapacity.sixBed}
                          onChange={(e) => handleBedCapacityChange(e, "sixBed")}
                          className="w-20 p-2 border rounded text-xs"
                        />
                      </td>

                      <td className="px-2 py-2 border">
                        <input
                          type="number"
                          placeholder="Seven Bed"
                          value={bedCapacity.sevenBed}
                          onChange={(e) => handleBedCapacityChange(e, "sevenBed")}
                          className="w-20 p-2 border rounded text-xs"
                        />
                      </td>

                      <td className="px-2 py-2 border">
                        <input
                          type="number"
                          placeholder="Eight Bed"
                          value={bedCapacity.eightBed}
                          onChange={(e) => handleBedCapacityChange(e, "eightBed")}
                          className="w-20 p-2 border rounded text-xs"
                        />
                      </td>

                      <td className="px-2 py-2 border">
                        <input
                          type="number"
                          placeholder="Nine Bed"
                          value={bedCapacity.nineBed}
                          onChange={(e) => handleBedCapacityChange(e, "nineBed")}
                          className="w-20 p-2 border rounded text-xs"
                        />
                      </td>

                      <td className="px-2 py-2 border">
                        <input
                          type="number"
                          placeholder="Ten Bed"
                          value={bedCapacity.tenBed}
                          onChange={(e) => handleBedCapacityChange(e, "tenBed")}
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


            <div className='form__btn__grp pb-4'>
              <button className='save__btn' onClick={saveData}>
                <Icons.CHECK />
                {mode ? "Update" : "Save"}
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

export default AddHotel;