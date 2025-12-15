import { useEffect, useState } from 'react'
import Nav from '../../../components/Admin/Nav';
import SideNav from '../../../components/Admin/SideNav'
import { LuFileX2 } from "react-icons/lu";
import useMyToaster from '../../../hooks/useMyToaster';
import Cookies from 'js-cookie';
import { useNavigate, useParams } from 'react-router-dom';
import { Icons } from '../../../helper/icons';
import { MdUploadFile } from 'react-icons/md';
import checkfile from '../../../helper/checkfile';


const UserAdd = ({ mode }) => {
  const navigate = useNavigate();
  const toast = useMyToaster();
  const { id } = useParams();
  const [fileName, setFileName] = useState('');
  const [data, setData] = useState({
    name: '', email: '', contact: '', role: '',
    profile: '', password: '', designation: ''
  })



  useEffect(() => {
    if (mode) {
      const get = async () => {
        const url = process.env.REACT_APP_MASTER_API + "/admin/get-users";
        const cookie = Cookies.get("token");

        const req = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": 'application/json'
          },
          body: JSON.stringify({ token: cookie, userId: id })
        })
        const res = await req.json();
        setData({ ...res, profile: res.profile_picture })
        if(res.profile_picture){
          setFileName(Date.now)
        }
      }

      get();
    }
  }, [mode])

  const handleFile = async (e) => {
    let validfile = await checkfile(e.target.files[0]);

    if (typeof (validfile) !== 'boolean') return toast(validfile, "error");

    setFileName(e.target.files[0].name)
    const reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = () => {
      setData({ ...data, profile: reader.result });
    }
  }

  const saveData = async (e) => {
    const requiredKeys = [
      'name', 'email', 'contact', 'role', 'designation',
    ];
    if (!mode) requiredKeys.push('password');

    for (const key of requiredKeys) {
      if (!data[key] || data[key].trim() === "") {
        return toast(`${key.camelToWords()} can't be blank`, 'error');
      }
    }


    try {
      let url = mode ? process.env.REACT_APP_MASTER_API + "/admin/update-users" : process.env.REACT_APP_MASTER_API + "/admin/create-users";
      const token = Cookies.get("token");
      const req = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(
          !mode ? { ...data, token } : { ...data, token, userId: id }
        )
      })
      const res = await req.json();
      if (req.status !== 200 || res.err) {
        return toast(res.err, 'error');
      }

      if (!mode) clearData();

      toast(!mode ? "User create success" : "User update success", 'success');

    } catch (error) {
      return toast("Something went wrong", "error")
    }

  }

  const clearData = () => {
    setData({
      name: '', email: '', contact: '', role: '',
      profile: '', password: '', designation: ''
    })
    setFileName("");
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
                    <p className='ml-1'>Role <span className='required__text'>*</span></p>
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
                    <span className='file__name'>{fileName}</span>
                    <div className='flex gap-2'>
                      <input type="file" id="siteLogo" className='hidden' onChange={handleFile} />
                      <label htmlFor="siteLogo" className='file__upload' title='Upload'>
                        <MdUploadFile />
                      </label>
                      {
                        fileName && <LuFileX2 className='remove__upload ' title='Remove upload' onClick={() => {
                          setFileName("");
                          setData({ ...data, profile: "" })
                        }} />
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className='form__btn__grp'>
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

export default UserAdd;