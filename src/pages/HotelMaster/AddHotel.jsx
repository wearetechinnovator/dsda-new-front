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
  const [form, setForm] = useState({
    zone: '', sector: '', block: '', district: '', policeStation: "", name: '', address: "", email: '',
    username: '', password: '', receptionPhone: '', proprietorName: "", proprietorPhone: "", managerName: '',
    managerPhone: '', alternateManagerPhone: '', restaurantAvailable: '', conferanceHallAvailable: '',
    status: '', about: ''
  })



  useEffect(() => {
    if (mode) {
      const get = async () => {
        const url = process.env.REACT_APP_API_URL + "/item/get";
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
      if (!form[key] || form[key].trim() === "") {
        return toast(`${key.camelToWords()} can't be blank`, 'error');
      }
    }


    try {
      const url = process.env.REACT_APP_API_URL + "";
      const token = Cookies.get("token");
      const req = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(
          !mode ? { ...form, token }
            : { ...form, token, update: true, id: id }
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

  const clearData = () => {
    setForm({
      zone: '', sector: '', block: '', district: '', policeStation: "", name: '', address: "", email: '',
      username: '', password: '', receptionPhone: '', proprietorName: "", proprietorPhone: "", managerName: '',
      managerPhone: '', alternateManagerPhone: '', restaurantAvailable: '', conferanceHallAvailable: '',
      status: '', about: ''
    });
  }


  return (
    <>
      <Nav title={mode ? "Update New Hotel" : "Add New Hotel"} />
      <main id='main'>
        <SideNav />
        <div className='content__body'>
          <div className='content__body__main bg-white'>
            <div className='flex justify-between  gap-5 flex-col lg:flex-row'>
              <div className='w-full flex flex-col gap-3'>
                <div>
                  <p className='ml-1'>Zone<span className='required__text'>*</span></p>
                  <MySelect2
                    model={"zone"}
                    onType={(v) => {
                      setForm({ ...form, zone: v })
                    }}
                    value={form.zone}
                  />
                </div>
                <div>
                  <p className='ml-1'>Sector<span className='required__text'>*</span></p>
                  <MySelect2
                    model={"sector"}
                    onType={(v) => {
                      console.log(v)
                      setForm({ ...form, sector: v })
                    }}
                    value={form.sector}
                  />
                </div>
                <div>
                  <p className='ml-1'>Block<span className='required__text'>*</span></p>
                  <MySelect2
                    model={"block"}
                    onType={(v) => {
                      console.log(v)
                      setForm({ ...form, block: v })
                    }}
                    value={form.block}
                  />
                </div>
                <div>
                  <p className='ml-1'>District<span className='required__text'>*</span></p>
                  <MySelect2
                    model={"district"}
                    onType={(v) => {
                      console.log(v)
                      setForm({ ...form, district: v })
                    }}
                    value={form.district}
                  />
                </div>
                <div>
                  <p className='ml-1'>Police Station<span className='required__text'>*</span></p>
                  <MySelect2
                    model={"police-station"}
                    onType={(v) => {
                      console.log(v)
                      setForm({ ...form, policeStation: v })
                    }}
                    value={form.policeStation}
                  />
                </div>
                <div>
                  <p>Name<span className='required__text'>*</span></p>
                  <input type='text' onChange={(e) => setForm({ ...form, name: e.target.value })} value={form.name} />
                </div>
                <div>
                  <p>Address</p>
                  <input type='text' onChange={(e) => setForm({ ...form, address: e.target.value })} value={form.address} />
                </div>
                <div>
                  <p>Email</p>
                  <input type='email' onChange={(e) => setForm({ ...form, email: e.target.value })} value={form.email} />
                </div>
                <div>
                  <p>Username<span className='required__text'>*</span></p>
                  <input type='text' onChange={(e) => setForm({ ...form, username: e.target.value })} value={form.username} />
                </div>
                <div>
                  <p>Password<span className='required__text'>*</span></p>
                  <input type='password' onChange={(e) => setForm({ ...form, password: e.target.value })} value={form.title} />
                </div>
              </div>

              <div className='w-full pt-1 flex flex-col gap-3'>
                <div>
                  <p>Reception Phone</p>
                  <input type='text'
                    onChange={(e) => setForm({ ...form, receptionPhone: e.target.value })}
                    value={form.receptionPhone} />
                </div>
                <div>
                  <p>Proprietor Name</p>
                  <input type='text'
                    onChange={(e) => setForm({ ...form, proprietorName: e.target.value })}
                    value={form.proprietorName} />
                </div>
                <div>
                  <p>Proprietor Phone</p>
                  <input type='text'
                    onChange={(e) => setForm({ ...form, proprietorPhone: e.target.value })}
                    value={form.proprietorPhone} />
                </div>
                <div>
                  <p>Manager Name</p>
                  <input type='text'
                    onChange={(e) => setForm({ ...form, managerName: e.target.value })}
                    value={form.managerName} />
                </div>
                <div>
                  <p>Manager Phone <span className='required__text'>*</span></p>
                  <input type='text'
                    onChange={(e) => setForm({ ...form, managerPhone: e.target.value })}
                    value={form.managerPhone} />
                </div>
                <div>
                  <p>Alternate Manager Phone</p>
                  <input type='text'
                    onChange={(e) => setForm({ ...form, alternateManagerPhone: e.target.value })}
                    value={form.alternateManagerPhone} />
                </div>
                <div>
                  <p>Restaurant Available?</p>
                  <select onChange={(e) => setForm({ ...form, restaurantAvailable: e.target.value })}
                    value={form.restaurantAvailable}>
                    <option value="">--Select--</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
                <div>
                  <p>Conference Hall Available?</p>
                  <select onChange={(e) => setForm({ ...form, conferanceHallAvailable: e.target.value })}
                    value={form.conferanceHallAvailable}>
                    <option value="">--Select--</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
                <div>
                  <p>Status</p>
                  <select onChange={(e) => setForm({ ...form, status: e.target.value })}
                    value={form.status}>
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
                <textarea name="" id="" rows={4} onChange={(e) => setForm({ ...form, about: e.target.value })}
                  value={form.about}></textarea>
              </div>
            </div>

            {/* ::::::::::::::::::::::::::::::::: HOTEL AND ROOM FORM ::::::::::::::::::::::::::: */}

            <div className='my-8'>
              <h6 className='my-4'>Room & Bed Capacity*</h6>
              <div class="overflow-x-auto">
                <table class="min-w-full border border-gray-200 text-center">
                  <thead class="bg-gray-100">
                    <tr>
                      <th class="px-4 py-2 border">One Bedroom</th>
                      <th class="px-4 border">Two Bedroom</th>
                      <th class="px-4 border">Three Bedroom</th>
                      <th class="px-4 border">Four Bedroom</th>
                      <th class="px-4 border">Five Bedroom</th>
                      <th class="px-4 border">Six Bedroom</th>
                      <th class="px-4 border">Seven Bedroom</th>
                      <th class="px-4 border">Eight Bedroom</th>
                      <th class="px-4 border">Nine Bedroom</th>
                      <th class="px-4 border">Ten Bedroom</th>
                      <th class="px-4 border font-bold">Total Beds</th>
                      <th class="px-4 border font-bold">Total Rooms</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      {/* <!-- One Bedroom --> */}
                      <td class="px-4 py-2 border">
                        <div class="flex flex-col items-center">
                          <input
                            type="text"
                            placeholder="One Bed"
                            class="w-20 p-2 border rounded text-xs"
                          />
                        </div>
                      </td>

                      {/* <!-- Two Bedroom --> */}
                      <td class="px-4 py-2 border">
                        <input
                          type="text"
                          placeholder="Two Bed"
                          class="w-20 p-2 border rounded text-xs"
                        />
                      </td>

                      {/* <!-- Other Bedrooms --> */}
                      <td class="px-4 py-2 border">
                        <input
                          type="number"
                          placeholder="Three Bed"
                          class="w-20 p-2 border rounded text-xs"
                        />
                      </td>
                      <td class="px-4 py-2 border">
                        <input
                          type="number"
                          placeholder="Four Bed"
                          class="w-20 p-2 border rounded text-xs"
                        />
                      </td>
                      <td class="px-4 py-2 border">
                        <input
                          type="number"
                          placeholder="Five Bed"
                          class="w-20 p-2 border rounded text-xs"
                        />
                      </td>
                      <td class="px-4 py-2 border">
                        <input
                          type="number"
                          placeholder="Six Bed"
                          class="w-20 p-2 border rounded text-xs"
                        />
                      </td>
                      <td class="px-4 py-2 border">
                        <input
                          type="number"
                          placeholder="Seven Bed"
                          class="w-20 p-2 border rounded text-xs"
                        />
                      </td>
                      <td class="px-4 py-2 border">
                        <input
                          type="number"
                          placeholder="Eight Bed"
                          class="w-20 p-2 border rounded text-xs"
                        />
                      </td>
                      <td class="px-4 py-2 border">
                        <input
                          type="number"
                          placeholder="Nine Bed"
                          class="w-20 p-2 border rounded text-xs"
                        />
                      </td>
                      <td class="px-4 py-2 border">
                        <input
                          type="number"
                          placeholder="Ten Bed"
                          class="w-20 p-2 border rounded text-xs"
                        />
                      </td>


                      {/* <!-- Totals --> */}
                      <td class="px-4 py-2 border bg-gray-50 font-semibold">42</td>
                      <td class="px-4 py-2 border bg-gray-50 font-semibold">6</td>
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