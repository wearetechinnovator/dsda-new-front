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
  const [form, setForm] = useState({
    title: '', type: '', salePrice: '', category: '', details: '', hsn: '', tax: ''
  })
  const { id } = useParams();
  const unitRowSet = {
    unit: "", conversion: '', opening: '', alert: ''
  }
  const [unitRow, setUnitRow] = useState([unitRowSet]);
  const navigate = useNavigate();



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
        setForm({
          title: data.title, type: data.type, salePrice: data.salePrice,
          category: data.category?._id, details: data.details, hsn: data.category?.hsn, tax: data.category?.tax
        });
        setUnitRow([...data.unit]);
      }

      get();
    }
  }, [mode])


  const savebutton = async (e) => {
    if (form.title === "") {
      return toast("Item name can't be blank", "error")
    }
    else if (form.salePrice === "") {
      return toast("Price can't be blank", "error")
    }
    else if (form.category === "") {
      return toast("Category can't be blank", "error")
    }

    try {
      const url = process.env.REACT_APP_API_URL + "/item/add";
      const token = Cookies.get("token");
      const req = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(
          !mode ? { ...form, token, unit: unitRow }
            : { ...form, token, unit: unitRow, update: true, id: id }
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
    setUnitRow([unitRowSet]);
  }


  return (
    <>
      <Nav title={mode ? "Update New User " : "Add New User"} />
      <main id='main'>
        <SideNav />
        <div className='content__body'>
          <div className='content__body__main bg-white'>
            <div className='flex justify-between  gap-5 flex-col lg:flex-row'>
              <div className='w-full flex flex-col gap-3'>
                <div>
                  <p className='ml-1'>Zone<span className='required__text'>*</span></p>
                  <MySelect2
                    model={"category"}
                    onType={(v) => {
                      console.log(v)
                      setForm({ ...form, category: v })
                    }}
                    value={form.category}
                  />
                </div>
                <div>
                  <p className='ml-1'>Sector<span className='required__text'>*</span></p>
                  <MySelect2
                    model={"category"}
                    onType={(v) => {
                      console.log(v)
                      setForm({ ...form, category: v })
                    }}
                    value={form.category}
                  />
                </div>
                <div>
                  <p className='ml-1'>Block<span className='required__text'>*</span></p>
                  <MySelect2
                    model={"category"}
                    onType={(v) => {
                      console.log(v)
                      setForm({ ...form, category: v })
                    }}
                    value={form.category}
                  />
                </div>
                <div>
                  <p className='ml-1'>District<span className='required__text'>*</span></p>
                  <MySelect2
                    model={"category"}
                    onType={(v) => {
                      console.log(v)
                      setForm({ ...form, category: v })
                    }}
                    value={form.category}
                  />
                </div>
                <div>
                  <p className='ml-1'>Police Station<span className='required__text'>*</span></p>
                  <MySelect2
                    model={"category"}
                    onType={(v) => {
                      console.log(v)
                      setForm({ ...form, category: v })
                    }}
                    value={form.category}
                  />
                </div>
                <div>
                  <p>Name<span className='required__text'>*</span></p>
                  <input type='text' onChange={(e) => setForm({ ...form, title: e.target.value })} value={form.title} />
                </div>
                <div>
                  <p>Address</p>
                  <input type='text' onChange={(e) => setForm({ ...form, title: e.target.value })} value={form.title} />
                </div>
                <div>
                  <p>Email</p>
                  <input type='email' onChange={(e) => setForm({ ...form, title: e.target.value })} value={form.title} />
                </div>
                <div>
                  <p>Username<span className='required__text'>*</span></p>
                  <input type='text' onChange={(e) => setForm({ ...form, title: e.target.value })} value={form.title} />
                </div>
                <div>
                  <p>Password<span className='required__text'>*</span></p>
                  <input type='password' onChange={(e) => setForm({ ...form, title: e.target.value })} value={form.title} />
                </div>
              </div>

              <div className='w-full pt-1 flex flex-col gap-3'>
                <div>
                  <p>Reception Phone</p>
                  <input type='text' onChange={(e) => setForm({ ...form, title: e.target.value })} value={form.title} />
                </div>
                <div>
                  <p>Proprietor Name</p>
                  <input type='text' onChange={(e) => setForm({ ...form, title: e.target.value })} value={form.title} />
                </div>
                <div>
                  <p>Proprietor Phone</p>
                  <input type='text' onChange={(e) => setForm({ ...form, title: e.target.value })} value={form.title} />
                </div>
                <div>
                  <p>Manager Name</p>
                  <input type='text' onChange={(e) => setForm({ ...form, title: e.target.value })} value={form.title} />
                </div>
                <div>
                  <p>Manager Phone <span className='required__text'>*</span></p>
                  <input type='text' onChange={(e) => setForm({ ...form, title: e.target.value })} value={form.title} />
                </div>
                <div>
                  <p>Alternate Manager Phone</p>
                  <input type='text' onChange={(e) => setForm({ ...form, title: e.target.value })} value={form.title} />
                </div>
                <div>
                  <p>Restaurant Available?</p>
                  <select name="" id="">
                    <option value="">--Select--</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
                <div>
                  <p>Conference Hall Available?</p>
                  <select name="" id="">
                    <option value="">--Select--</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
                <div>
                  <p>Status</p>
                  <select name="" id="">
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
                <textarea name="" id="" rows={4}></textarea>
              </div>
            </div>

            <div className='form__btn__grp'>
              <button className='save__btn' onClick={savebutton}>
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