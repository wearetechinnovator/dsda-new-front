import React, { useEffect, useState } from 'react'
import Nav from '../../components/Nav';
import SideNav from '../../components/SideNav';
import { FaRegEyeSlash } from "react-icons/fa";
import { FaRegCheckCircle } from "react-icons/fa";
import { LuFileX2, LuRefreshCcw } from "react-icons/lu";
import { MdOutlineRemoveRedEye, MdUploadFile } from "react-icons/md";
import checkfile from '../../helper/checkfile';
import useMyToaster from "../../hooks/useMyToaster";
import Cookies from 'js-cookie';
import { useSelector } from 'react-redux';
import Loading from '../../components/Loading';




const Profile = () => {
  const toast = useMyToaster();
  const [profilePasswordField, setProfilePasswordField] = useState(false);
  const [currentPasswordField, setCurrentPasswordField] = useState(false);
  const [newPasswordField, setNewPasswordField] = useState(false);
  const [data, setData] = useState({
    name: '', email: '', profile: '', password: '', filename: ''
  });
  const [cPassword, setCPassword] = useState({ currentPassword: '', newPassword: '' });
  const userData = useSelector((state) => state.userDetail);
  const [visible, setVisible] = useState(1); // 1=profile | 2=password;
  const [loading, setLoading] = useState(false);



  useEffect(() => {
    setData({ name: userData.name, email: userData.email, filename: userData.filename, profile: userData.profile });
  }, [userData]);


  const setFile = async (e) => {
    let validfile = await checkfile(e.target.files[0]);


    if (typeof (validfile) !== 'boolean') return toast(validfile, "error");

    const reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = () => {
      setData({ ...data, profile: reader.result, filename: e.target.files[0].name });
    }
  }



  const updateProfile = async (e) => {

    if (data.name === "" || data.email === "" || data.password === "") {
      return toast("fill the blank", "error");
    }

    try {
      setLoading(true);
      const url = process.env.REACT_APP_API_URL + "/user/create";
      const updateData = { ...data, update: true, token: Cookies.get("token") }


      const req = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData)
      })
      const res = await req.json();
      setLoading(false);
      if (req.status === 500 || res.err) {
        return toast(res.err, 'error');
      }

      return toast(res.msg, "success")

    } catch (err) {
      console.log(err)
      return toast("Something went wrong", "error");
    }

  }

  const updatePassword = async () => {
    if (cPassword.currentPassword === "" || cPassword.newPassword === "") {
      return toast("fill the blank", "error")
    }

    try {
      setLoading(true);
      const url = process.env.REACT_APP_API_URL + "/user/change-pass";
      const req = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...cPassword, token: Cookies.get("token") })
      })
      const res = await req.json();
      setLoading(false);
      if (req.status === 500 || res.err) {
        return toast(res.err, 'error');
      }

      setCPassword({ currentPassword: '', newPassword: '' })
      return toast(res.msg, "success")

    } catch (err) {
      console.log(err)
      return toast("Something went wrong", "error");
    }


  }

  const clear = (which) => {
    if (which === 1) {
      setData({ name: '', email: '', profile: '', password: '' })
    } else {
      setCPassword({ currentPassword: '', newPassword: '' })
    }
  }


  return (
    <>
      <Nav title={"Profile"} />
      <main id="main">
        <SideNav />
        <div className='content__body'>
          <div className='flex gap-4 items-center py-4'>
            <div className={`profile-switch-button ${visible === 1 ? 'profile-switch-button-active' : null}`}
              onClick={() => setVisible(1)}>
              Profile details
            </div>
            <div className={`profile-switch-button ${visible === 2 ? 'profile-switch-button-active' : null}`}
              onClick={() => setVisible(2)}>
              Change password
            </div>
          </div>
          {visible == 1 && <div className='content__body__main' >
            <div className='flex justify-between gap-5  flex-col lg:flex-row'>
              <div className='w-full'>
                <div>
                  <p className='ml-1'>Name</p>
                  <input type="Text" className='mt-2 mb-2'
                    onChange={(e) => setData({ ...data, name: e.target.value })}
                    value={data.name} />
                </div>
                <div>
                  <p className='ml-1'>Email</p>
                  <input type="email" className='mt-2 mb-2'
                    onChange={(e) => setData({ ...data, email: e.target.value })}
                    value={data.email} />
                </div>
              </div>
              <div className='w-full'>
                <div>
                  <p className='ml-1'>Image</p>
                  <div className='file__uploader__div'>
                    <span className='file__name'>{data.filename}</span>
                    <div className="flex gap-2">
                      <input type="file" id="invoiceLogo" className='hidden' onChange={(e) => setFile(e)} />
                      <label htmlFor="invoiceLogo" className='file__upload' title='Upload'>
                        <MdUploadFile />
                      </label>
                      {
                        data.filename && <LuFileX2 className='remove__upload ' title='Remove upload' onClick={() => {
                          setData({ ...data, filename: "" });
                        }} />
                      }
                    </div>
                  </div>
                </div>
                <p className='ml-1 mb-2 mt-2'>Password</p>
                <div className='relative  '>
                  <input type={profilePasswordField ? "text" : "password"} onChange={(e) => setData({ ...data, password: e.target.value })} value={data.password} />
                  <div className='absolute top-2 right-3 cursor-pointer' onClick={() => setProfilePasswordField(!profilePasswordField)} >
                    {profilePasswordField ? <MdOutlineRemoveRedEye /> : <FaRegEyeSlash />}
                  </div>
                </div>
              </div>
            </div>
            <div className='flex justify-center pt-9 gap-5'>
              <div className=''>
                <button className='p-2 flex rounded-sm bg-green-500 text-white items-center gap-1'
                  onClick={updateProfile}>
                  {loading ? <Loading /> : <FaRegCheckCircle />}
                  Update
                </button>
              </div>
              <div>
                <button className='p-2 flex rounded-sm bg-blue-500 text-white items-center gap-1'
                  onClick={() => clear(1)}>
                  <LuRefreshCcw />
                  Reset
                </button>
              </div>
              {/* <div className="flex rounded-sm ml-4 bg-gray-500 text-white">
                 <IoMdArrowRoundBack className='mt-3 ml-2' />
                <button className='p-2'>Back</button>
                </div> */}
            </div>
          </div>}

          {/* Change password */}
          {visible === 2 && <div className='content__body__main'>
            <p className='ml-1 mb-3'> Current password</p>
            <div className='relative  '>
              <input type={currentPasswordField ? "text" : "password"}
                onChange={(e) => setCPassword({ ...cPassword, currentPassword: e.target.value })}
                value={cPassword.currentPassword} />
              <div className='absolute top-2 right-3' onClick={() => setCurrentPasswordField(!currentPasswordField)} >

                <div className='absolute right-1 cursor-pointer  ' onClick={() => setCurrentPasswordField(!currentPasswordField)} >
                  {currentPasswordField ? <MdOutlineRemoveRedEye /> : <FaRegEyeSlash />}
                </div>
              </div>

              <p className='ml-1 mb-3 mt-2'>New password</p>
              <div className='relative  '>
                <input type={newPasswordField ? "text" : "password"}
                  onChange={(e) => setCPassword({ ...cPassword, newPassword: e.target.value })}
                  value={cPassword.newPassword} />

                <div className='absolute top-2 right-3' onClick={() => setNewPasswordField(!newPasswordField)} >
                  <div className='absolute right-1  cursor-pointer ' onClick={() => setNewPasswordField(!newPasswordField)} >
                    {newPasswordField ? <MdOutlineRemoveRedEye /> : <FaRegEyeSlash />}
                  </div>
                </div>
                <div className='flex justify-center gap-5 pt-9'>
                  <div className=''>
                    <button className='p-2 flex rounded-sm bg-green-500 text-white items-center gap-1'
                      onClick={updatePassword}>
                      {loading ? <Loading /> : <FaRegCheckCircle />}
                      Update
                    </button>
                  </div>
                  <div>
                    <button className='p-2 flex rounded-sm bg-blue-500 text-white items-center gap-1'
                      onClick={() => clear(2)}>
                      <LuRefreshCcw />
                      Reset
                    </button>
                  </div>
                </div>
              </div >
            </div >
          </div>}

        </div>
      </main >
    </>
  )

}

export default Profile;

