import Nav from '../../../components/Hotel/Nav'
import SideNav from '../../../components/Hotel/HotelSideNav';
import useMyToaster from '../../../hooks/useMyToaster';
import Cookies from 'js-cookie';
import { useState } from 'react';
import { Icons } from '../../../helper/icons';


const ChangeProfilePassword = () => {
  const toast = useMyToaster();
  const [showEye, setShowEye] = useState(false)
  const [passData, setPassData] = useState({ currentPass: '', newPass: '' })
  const url = process.env.REACT_APP_MASTER_API + "/hotel/change-password";
  const hotelId = Cookies.get('hotelId');
  const token = Cookies.get('hotel-token');




  const updatePass = async () => {
    const req = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": 'application/json',
      },
      body: JSON.stringify({
        currentPass: passData.currentPass,
        newPass: passData.newPass, hotelId, token
      })
    })
    const res = await req.json();
    if (req.status !== 200) {
      return toast(res.err, "error");
    }

    setPassData({ currentPass: '', newPass: '' });
    return toast("Password change successfully", "success");
  }



  return (
    <>
      <Nav title={"Change Password"} />
      <main id='main'>
        <SideNav />
        <div className='content__body'>
          <div className='content__body__main mt-5'>
            <div className='w-full flex gap-3 items-center'>
              <p className='text-lg font-bold text-blue-500'>Change Password</p>
              <div className='w-[25px] h-[25px] border bg-gray-50 cursor-pointer text-blue-500 rounded-full grid place-items-center'>
                <Icons.PASSWORD className='text-lg' />
              </div>
            </div>
            <hr className='profile__hr' />
            <div
              className={`space-y-2 profile__table__active`}>
              <div>
                <p className="font-medium">Current Password</p>
                <input
                  type="password"
                  value={passData.currentPass}
                  onChange={(e) => setPassData({ ...passData, currentPass: e.target.value })}
                  autoComplete='off'
                />
              </div>

              <div className='relative'>
                <p className="font-medium">New Password</p>
                <input
                  type={showEye ? "text" : "password"}
                  className=''
                  value={passData.newPass}
                  onChange={(e) => setPassData({ ...passData, newPass: e.target.value })}
                  autoComplete='off'
                />

                <div className='absolute right-4 top-[1.8rem] cursor-pointer' onClick={() => {
                  setShowEye(!showEye);
                }}>
                  {showEye ? <Icons.EYE /> : <Icons.EYE_CLOSE />}
                </div>
              </div>
            </div>

            <div className='form__btn__grp'>
              <button className='save__btn' onClick={updatePass}>
                <Icons.CHECK /> Submit
              </button>
              <button className='reset__btn' onClick={() => {
                setPassData({ currentPass: "", newPass: "" })
              }}>
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

export default ChangeProfilePassword;