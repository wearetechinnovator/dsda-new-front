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



const UserAdd = ({ mode, save }) => {
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
      // for close sidebar in MySelect2
      if (save) {
        save(true)
        return
      } else {
        return navigate("/admin/item")
      }

    } catch (error) {
      console.log(error);
      return toast("Something went wrong", "error")
    }

  }

  const clearData = () => {
    setForm({
      title: '', type: '', salePrice: '', category: '', details: '', hsn: ''
    })
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
                  <p>Name <span className='required__text'>*</span></p>
                  <input type='text' onChange={(e) => setForm({ ...form, title: e.target.value })} value={form.title} />
                </div>
                <div >
                  <p>Email <span className='required__text'>*</span></p>
                  <input type='text' onChange={(e) => setForm({ ...form, title: e.target.value })} value={form.title} />
                </div>
                <div >
                  <p>Contact Number <span className='required__text'>*</span></p>
                  <input type='text' onChange={(e) => setForm({ ...form, title: e.target.value })} value={form.title} />
                </div>
                <div>
                  <p className='ml-1'>Role</p>
                  <select onChange={(e) => setForm({ ...form, type: e.target.value })} value={form.type}>
                    <option value={""}>--select--</option>
                    <option value={"goods"}>Goods</option>
                    <option value={"service"}>Service</option>
                  </select>
                </div>
                <div >
                  <p>Designation<span className='required__text'>*</span></p>
                  <input type='text' onChange={(e) => setForm({ ...form, title: e.target.value })} value={form.title} />
                </div>
                <div >
                  <p>Date of Birth<span className='required__text'>*</span></p>
                  <input type='date' onChange={(e) => setForm({ ...form, title: e.target.value })} value={form.title} />
                </div>
              </div>
              <div className='w-full pt-1 flex flex-col gap-3'>
                <div>
                  <p className='ml-1'>Gender</p>
                  <select onChange={(e) => setForm({ ...form, type: e.target.value })} value={form.type}>
                    <option value={""}>--select--</option>
                    <option value={"male"}>Goods</option>
                    <option value={"female"}>Female</option>
                    <option value={"others"}>Others</option>
                  </select>
                </div>
                <div >
                  <p>Unique ID Number<span className='required__text'>*</span></p>
                  <input type='text' onChange={(e) => setForm({ ...form, title: e.target.value })} value={form.title} />
                </div>
                <div>
                  <p className='ml-1'>Unique ID Type <span className='required__text'>*</span></p>
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
                  <p>Profile Picture</p>
                  <div className='file__uploader__div'>
                    <span className='file__name'>{"name"}</span>
                    <div className='flex gap-2'>
                      <input type="file" id="siteLogo" className='hidden' />
                      <label htmlFor="siteLogo" className='file__upload' title='Upload'>
                        <MdUploadFile />
                      </label>
                      {
                        <LuFileX2 className='remove__upload ' title='Remove upload' />
                      }
                    </div>
                  </div>
                </div>
                <div >
                  <p>Password<span className='required__text'>*</span></p>
                  <input type='text' onChange={(e) => setForm({ ...form, title: e.target.value })} value={form.title} />
                </div>
                <div>
                  <p className='ml-1'>Status</p>
                  <select onChange={(e) => setForm({ ...form, type: e.target.value })} value={form.type}>
                    <option value={""}>--select--</option>
                    <option value={"inactive"}>Inactive</option>
                    <option value={"active"}>Active</option>
                    <option value={"others"}>Others</option>
                  </select>
                </div>
              </div>
            </div>

            <div className='w-full overflow-auto mt-2'>
              <div>
                <p>About</p>
                <textarea name="" id="" rows={4}></textarea>
              </div>
              <div>
                <p>Address</p>
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

export default UserAdd;