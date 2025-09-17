import Nav from '../../components/Hotel/Nav';
import SideNav from '../../components/Hotel/HotelSideNav'
import { Icons } from '../../helper/icons';
import { useState } from 'react';
import useMyToaster from '../../hooks/useMyToaster';




const CheckIn = () => {
    const toast = useMyToaster();
    const [data, setData] = useState({ guestMobile: '', numberOfGuests: '', verificationBy: 'manager' });


    // Handle Check In..............
    const handleCheckIn = () => {
        if ([data.guestMobile, data.numberOfGuests, data.verificationBy].some(field => field === '')) {
           return toast("All fields are required", "error");
        }

        try {

            
        } catch (error) {
            console.log(error);
            toast("Something went wrong", "error");
        }
    }

    // Reset Form Data...............
    const clearData = () => {
        setData({ guestMobile: '', numberOfGuests: '', verificationBy: 'manager' });
    }

    return (
        <>
            <Nav title={"Manage Guest Entry"} />
            <main id='main'>
                <SideNav />
                <div className='content__body grid place-items-center'>
                    <div className='content__body__main w-[500px] border border-gray-300'>
                        <div className='w-full flex items-center justify-between border-b pb-1'>
                            <p className='text-lg font-semibold'>Add New Booking</p>
                            <p className='font-semibold'>Total Unreserved Bed : 50</p>
                        </div>
                        <div className='w-full flex flex-col gap-4 mt-4'>
                            <div>
                                <p>Mobile No. of Head of the Party<span className='required__text'>*</span></p>
                                <input type='text'
                                    placeholder='Enter Guest Mobile No.'
                                    value={data.guestMobile}
                                    onChange={(e) => setData({ ...data, guestMobile: e.target.value })}
                                />
                            </div>
                            <div>
                                <p>Number of Guest<span className='required__text'>*</span></p>
                                <input type='text'
                                    placeholder='Enter Number of Guests'
                                    value={data.numberOfGuests}
                                    onChange={(e) => setData({ ...data, numberOfGuests: e.target.value })}
                                />
                            </div>
                            <div>
                                <p>Verification By<span className='required__text'>*</span></p>
                                <select
                                    value={data.verificationBy}
                                    onChange={(e) => setData({ ...data, verificationBy: e.target.value })}>
                                    <option value="manager">Manager</option>
                                    <option value="otp">OTP</option>
                                </select>
                            </div>
                            <p className='italic'>* Mandatory field: you must have to entry the field.</p>
                        </div>
                        <div className='form__btn__grp'>
                            <button className='save__btn' onClick={handleCheckIn}>
                                <Icons.CHECK /> Submit
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

export default CheckIn;

