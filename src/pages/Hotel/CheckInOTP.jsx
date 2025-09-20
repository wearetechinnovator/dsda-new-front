import Nav from '../../components/Hotel/Nav';
import SideNav from '../../components/Hotel/HotelSideNav'
import { Icons } from '../../helper/icons';
import { useRef } from 'react';
import useMyToaster from '../../hooks/useMyToaster';
import { useLocation, useNavigate } from 'react-router-dom';



const CheckInOTP = () => {
    const location = useLocation()
    const navigate = useNavigate();
    const toast = useMyToaster();
    const otp1 = useRef();
    const otp2 = useRef();
    const otp3 = useRef();
    const otp4 = useRef();


    // Handle Check In..............
    const handleOTP = () => {
        const OTP = otp1.current.value + otp2.current.value + otp3.current.value + otp4.current.value;
        if (OTP.length < 4) {
            return toast("Please enter the 4 digit OTP", "error");
        }

        // Proceed with OTP verification logic here
        toast("OTP verified successfully", "success");

        navigate('/hotel/check-in/guest-entry', {
            state: location.state
        });
    }


    return (
        <>
            <Nav title={"Manage Guest Entry"} />
            <main id='main'>
                <SideNav />
                <div className='content__body grid place-items-center'>
                    <div className='content__body__main w-[400px] border border-gray-300'>
                        <div className='w-full flex items-center justify-between border-b pb-1'>
                            <p className='text-lg font-semibold'>Add New Booking</p>
                            <p className='font-semibold'>Total Unreserved Bed : 50</p>
                        </div>
                        <div className='w-full flex flex-col gap-4 mt-4 justify-center items-center'>
                            <div>
                                <p className='text-md font-semibold text-center'>
                                    Enter 4 digit OTP sent to Guest Mobile No.
                                    <span className='required__text'>*</span>
                                </p>
                                <div className='grid grid-cols-4 gap-2 max-w-[180px] mx-auto mt-4'>
                                    <input ref={otp1} type="text" className='text-center p-2 w-full' onKeyUp={() => otp2.current.focus()} />
                                    <input ref={otp2} type="text" className='text-center p-2 w-full' onKeyUp={() => otp3.current.focus()} />
                                    <input ref={otp3} type="text" className='text-center p-2 w-full' onKeyUp={() => otp4.current.focus()} />
                                    <input ref={otp4} type="text" className='text-center p-2 w-full' />
                                </div>
                            </div>
                        </div>
                        <div className='form__btn__grp'>
                            <button className='save__btn' onClick={handleOTP}>
                                <Icons.CHECK /> Submit
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}

export default CheckInOTP;

