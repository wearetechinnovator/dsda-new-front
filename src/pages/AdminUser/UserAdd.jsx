import { useEffect, useState } from 'react'
import Nav from '../../components/Nav';
import SideNav from '../../components/SideNav'
import { LuFileX2 } from "react-icons/lu";
import useMyToaster from '../../hooks/useMyToaster';
import Cookies from 'js-cookie';
import { useNavigate, useParams } from 'react-router-dom';
import { Icons } from '../../helper/icons';
import { MdUploadFile } from 'react-icons/md';



const UserAdd = ({ mode }) => {
  const toast = useMyToaster();
  const [data, setData] = useState({
    name: '', email: '', contact: '', role: '',
    profile: '', password: '', designation: ''
  })
  const { id } = useParams();
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
      }

      get();
    }
  }, [mode])


  const savebutton = async (e) => {
    const requiredKeys = [
      'name', 'email', 'contact', 'role', 'password', 'designation',
    ];

    for (const key of requiredKeys) {
      if (!data[key] || data[key].trim() === "") {
        return toast(`${key.camelToWords()} can't be blank`, 'error');
      }
    }



    try {
      const url = process.env.REACT_APP_MASTER_API + "/admin/create-users";
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

      toast(!mode ? "User create success" : "User update success", 'success');

    } catch (error) {
      console.log(error);
      return toast("Something went wrong", "error")
    }

  }

  const clearData = () => {
    setData({
      name: '', email: '', contact: '', role: '',
      profile: '', password: '', designation: ''
    })
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
                  <input type='text' onChange={(e) => setData({ ...data, name: e.target.value })} value={data.name} />
                </div>
                <div >
                  <p>Email <span className='required__text'>*</span></p>
                  <input type='email' onChange={(e) => setData({ ...data, email: e.target.value })} value={data.email} />
                </div>
                <div >
                  <p>Password<span className='required__text'>*</span></p>
                  <input type='password' onChange={(e) => setData({ ...data, password: e.target.value })} value={data.password} />
                </div>
              </div>

              <div className='w-full flex flex-col gap-3'>
                <div >
                  <p>Contact Number <span className='required__text'>*</span></p>
                  <input type='text' onChange={(e) => setData({ ...data, contact: e.target.value })} value={data.contact} />
                </div>
                <div className="flex flex-col md:flex-row gap-3 w-full items-center">
                  <div className='w-full'>
                    <p className='ml-1'>Role</p>
                    <select onChange={(e) => setData({ ...data, role: e.target.value })} value={data.role}>
                      <option value={""}>--select--</option>
                      <option value="Administrator">Administrator</option>
                      <option value="CEO">CEO</option>
                      <option value="Editor">Editor</option>
                      <option value="DM Office">DM Office</option>
                      <option value="Police Station">Police Station</option>
                      <option value="State">State</option>
                    </select>
                  </div>
                  <div className='w-full'>
                    <p>Designation<span className='required__text'>*</span></p>
                    <input type='text' onChange={(e) => setData({ ...data, designation: e.target.value })} value={data.designation} />
                  </div>
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