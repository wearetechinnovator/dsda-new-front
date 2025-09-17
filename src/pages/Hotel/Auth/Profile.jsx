import { useEffect, useState } from 'react';
import Nav from '../../../components/Admin/Nav';
import SideNav from '../../../components/Admin/SideNav';
import { Icons } from '../../../helper/icons';
import Cookies from 'js-cookie';
import { useSelector } from 'react-redux';
import { add } from '../../../store/userDetailSlice';
import { useDispatch } from 'react-redux';
import useMyToaster from '../../../hooks/useMyToaster';
import { Avatar } from 'rsuite';
import { FaUser } from 'react-icons/fa';
import checkfile from '../../../helper/checkfile';


const Profile = () => {
  const toast = useMyToaster();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.userDetail);
  const [editMode, setEditMode] = useState(false);
  const [editPass, setEditPass] = useState(false);
  const [data, setData] = useState({
    name: '', designation: '', role: '',
    email: "", contact: '', profile: ''
  });
  const [passData, setPassData] = useState({
    currentPass: '', newPass: '', confirmPass: ''
  })
  const url = process.env.REACT_APP_MASTER_API + "/admin/update-users";
  const cookie = Cookies.get("token");
  const userId = Cookies.get("userId");



  useEffect(() => {
    setData({
      name: userData.name, designation: userData.designation,
      role: userData.role, email: userData.email, contact: userData.contact,
      profile: userData.profile_picture
    });

  }, [userData])


  const updateProfile = async () => {
    const req = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({ ...data, userId })
    })
    if (req.status !== 200) {
      return toast("Profile not update", "error");
    }

    dispatch(add({ ...userData, ...data }));
    return toast("Profile update successfully", "success");
  }


  const handleFile = async (e) => {
    let validfile = await checkfile(e.target.files[0]);

    if (typeof (validfile) !== 'boolean') return toast(validfile, "error");

    const reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);

    reader.onload = async () => {
      let updateData = { ...data, profile: reader.result };
      setData(updateData);

      const req = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": 'application/json'
        },
        body: JSON.stringify({ ...updateData, userId })
      })
      const res = await req.json();
      if (req.status !== 200) {
        return toast("Profile not change", "error");
      }

      dispatch(add({ ...userData, ...updateData, profile_picture: reader.result }));
      return toast("Profile picture update successfully", "success");
    }

  }



  return (
    <>
      <Nav title={"Profile"} />
      <main id='main'>
        <SideNav />
        <div className='content__body'>
          <div className='content__body__main'>
            <div className='w-full flex gap-3 items-center'>
              <p className='text-lg font-bold text-blue-500'>Personal Info</p>
              <div className='w-[25px] h-[25px] border bg-gray-50 cursor-pointer text-blue-500 rounded-full grid place-items-center' onClick={() => {
                setEditMode(!editMode)
                if (editMode) updateProfile();
              }}>
                {
                  editMode ? <Icons.CHECK2 className='active:scale-50 transition-all' title='Save' />
                    : <Icons.EDIT className='active:scale-50 transition-all' title='Edit' />
                }
              </div>
            </div>
            <hr className='profile__hr' />
            <div className='w-full flex justify-center mb-2'>
              <div className='relative border rounded-full w-[70px] h-[70px] grid place-items-center'>
                <input type="file" className='hidden' id='fileUpload' onChange={(e) => handleFile(e)} />
                <Avatar circle children={<FaUser />}
                  size='lg' src={data.profile}
                  className='border' />
                <label className='absolute bottom-[-3px] cursor-pointer p-1 text-md right-0 bg-white text-black shadow-lg rounded-full border' htmlFor='fileUpload'>
                  <Icons.PENCIL
                    className='active:scale-50 transition-all'
                  />
                </label>
              </div>
            </div>
            <div
              className={`profile__table space-y-2 ${editMode ? "profile__table__active" : ""}`}>
              <div>
                <p className="font-medium">Name</p>
                <input
                  type="text"
                  value={data.name}
                  onChange={
                    editMode ? (e) => setData({ ...data, name: e.target.value }) : null
                  }
                />
              </div>

              <div>
                <p className="font-medium">Designation</p>
                <input
                  type="text"
                  value={data.designation}
                  onChange={editMode ? (e) => setData({ ...data, designation: e.target.value }) : null}
                />
              </div>

              <div>
                <p className="font-medium">Role</p>
                <input
                  type="text"
                  value={data.role}
                  onChange={editMode ? (e) => setData({ ...data, role: e.target.value }) : null}
                />
              </div>

              <div>
                <p className="font-medium">Email</p>
                <input
                  type="email"
                  value={data.email}
                  onChange={editMode ? (e) => setData({ ...data, email: e.target.value }) : null}
                />
              </div>

              <div>
                <p className="font-medium">Contact Number</p>
                <input
                  type="tel"
                  value={data.contact}
                  onChange={editMode ? (e) => setData({ ...data, contact: e.target.value }) : null}
                />
              </div>
            </div>
          </div>

          {/* ========================== CHANGE PASSWORD ====================== */}
          {/* ================================================================== */}
          <div className='content__body__main mt-5'>
            <div className='w-full flex gap-3 items-center'>
              <p className='text-lg font-bold text-blue-500'>Change Password</p>
              <div className='w-[25px] h-[25px] border bg-gray-50 cursor-pointer text-blue-500 rounded-full grid place-items-center' onClick={() => {
                setEditMode(!editPass)
                // if (editPass) updateProfile();
              }}>
                {
                  editPass ? <Icons.CHECK2 className='active:scale-50 transition-all' title='Save' />
                    : <Icons.EDIT className='active:scale-50 transition-all' title='Edit' />
                }
              </div>
            </div>
            <hr className='profile__hr' />
            <div
              className={`profile__table space-y-2 ${editPass ? "profile__table__active" : ""}`}>
              <div>
                <p className="font-medium">Current Password</p>
                <input
                  type="password"
                  value={data.name}
                  onChange={
                    editPass ? (e) => setData({ ...data, name: e.target.value }) : null
                  }
                />
              </div>

              <div>
                <p className="font-medium">New Password</p>
                <input
                  type="password"
                  value={data.designation}
                  onChange={editPass ? (e) => setData({ ...data, designation: e.target.value }) : null}
                />
              </div>

              <div>
                <p className="font-medium">Confirm Password</p>
                <input
                  type="password"
                  value={data.role}
                  onChange={editPass ? (e) => setData({ ...data, role: e.target.value }) : null}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

export default Profile;
