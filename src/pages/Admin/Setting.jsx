import { useEffect, useState } from 'react';
import Nav from '../../components/Admin/Nav';
import SideNav from '../../components/Admin/SideNav';
import { Icons } from '../../helper/icons';
import Cookies from 'js-cookie';
import { useSelector } from 'react-redux';
import { add } from '../../store/userDetailSlice';
import { useDispatch } from 'react-redux';
import useMyToaster from '../../hooks/useMyToaster';
import { Avatar, TagInput } from 'rsuite';
import { FaUser } from 'react-icons/fa';
import checkfile from '../../helper/checkfile';
import { addSetting } from '../../store/settingSlice';
import useData from 'rsuite/esm/InputPicker/hooks/useData';



const Setting = () => {
  const toast = useMyToaster();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.settingSlice);
  const [editMode, setEditMode] = useState(false);
  const [data, setData] = useState({
    title: '', email: '', contact_number: '',
    address: "", charges_per_tourist: '', id_card_list: '', logo: '',
    age_for_charges: 5, day_for_checkin_checkout: 2, payment_start_date: 5
  });
  const url = userData.err ?
    process.env.REACT_APP_MASTER_API + "/site-setting/create" :
    process.env.REACT_APP_MASTER_API + "/site-setting/update";
  const cookie = Cookies.get("token");



  useEffect(() => {
    setData({
      title: userData.title, email: userData.email, id_card_list: userData.id_card_list,
      address: userData.address, charges_per_tourist: userData.charges_per_tourist,
      contact_number: userData.contact_number, logo: userData.logo,
      age_for_charges: userData.age_for_charges, day_for_checkin_checkout: userData.day_for_checkin_checkout,
      payment_start_date: userData.payment_start_date
    });

  }, [userData])


  const updateProfile = async () => {
    const req = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({ ...data })
    })
    const res = await req.json();
    if (req.status !== 200) {
      return toast("Setting not update", "error");
    }

    dispatch(addSetting({ ...userData, ...data }));
    return toast("Setting update successfully", "success");
  }


  const handleFile = async (e) => {
    let validfile = await checkfile(e.target.files[0]);
    if (typeof (validfile) !== 'boolean') return toast(validfile, "error");

    const reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);

    reader.onload = async () => {
      let updateData = { ...data, logo: reader.result };

      const req = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": 'application/json'
        },
        body: JSON.stringify({ ...updateData, isLogo: true, logo: reader.result })
      })
      const res = await req.json();
      if (req.status !== 200) {
        return toast("Logo not change", "error");
      }
      setData(updateData);
      dispatch(addSetting({ ...userData, ...updateData }));
      return toast("Logo update successfully", "success");
    }

  }



  return (
    <>
      <Nav title={"Setting"} />
      <main id='main'>
        <SideNav />
        <div className='content__body'>
          <div className='content__body__main'>
            <div className='w-full flex gap-3 items-center'>
              <p className='text-lg font-bold text-blue-500'>Site Setting</p>
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
                  size='lg' src={data.logo}
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
                <p className="font-medium">Title</p>
                <input
                  type="text"
                  value={data.title}
                  onChange={
                    editMode ? (e) => setData({ ...data, title: e.target.value }) : null
                  }
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
                  type="text"
                  value={data.contact_number}
                  onChange={editMode ? (e) => setData({ ...data, contact_number: e.target.value }) : null}
                  maxLength={10}
                />
              </div>

              <div>
                <p className="font-medium">Address</p>
                <input
                  type="text"
                  value={data.address}
                  onChange={editMode ? (e) => setData({ ...data, address: e.target.value }) : null}
                />
              </div>

              <div>
                <p className="font-medium">Charges Per Tourist</p>
                <input
                  type="tel"
                  value={data.charges_per_tourist}
                  onChange={editMode ? (e) => setData({ ...data, charges_per_tourist: e.target.value }) : null}
                />
              </div>
              <div>
                <p className="font-medium">Minimus Age for Charge</p>
                <input
                  type="tel"
                  value={data.age_for_charges}
                  onChange={editMode ? (e) => setData({ ...data, age_for_charges: e.target.value }) : null}
                />
              </div>
              <div>
                <p className="font-medium">Previous Checkin Checkout Date</p>
                <input
                  type="tel"
                  value={data.day_for_checkin_checkout}
                  onChange={editMode ? (e) => setData({ ...data, day_for_checkin_checkout: e.target.value }) : null}
                />
              </div>
              <div>
                <p className="font-medium">Payment Day Start</p>
                <input
                  type="tel"
                  value={data.payment_start_date}
                  onChange={editMode ? (e) => setData({ ...data, payment_start_date: e.target.value }) : null}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

export default Setting;
