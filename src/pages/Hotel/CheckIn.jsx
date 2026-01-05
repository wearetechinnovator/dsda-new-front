import Nav from '../../components/Hotel/Nav';
import SideNav from '../../components/Hotel/HotelSideNav'
import { Icons } from '../../helper/icons';
import { useEffect, useState } from 'react';
import useMyToaster from '../../hooks/useMyToaster';
import { useNavigate } from 'react-router-dom';
import useConfirmDialog from '../../hooks/useConfirmDialog';
import Cookies from 'js-cookie';
import { useSelector } from 'react-redux';



const CheckIn = () => {
    const { show, modal } = useConfirmDialog();
    const navigate = useNavigate();
    const toast = useMyToaster();
    const [data, setData] = useState({ guestMobile: '', numberOfGuests: '', verificationBy: 'manager' });
    const hotelDetails = useSelector((store) => store.hotelDetails);
    const [staticticData, setStaticticsData] = useState(null);
    const token = Cookies.get('hotel-token');



    // Get Statictics Data;
    useEffect(() => {
        (async () => {
            const url = process.env.REACT_APP_BOOKING_API + "/check-in/get-stats";
            const hotelId = Cookies.get('hotelId');

            const req = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": 'application/json'
                },
                body: JSON.stringify({ hotelId, token })
            })
            const res = await req.json();
            if (req.status === 200) setStaticticsData(res);
        })()
    }, [])



    // Handle Check In..............
    const handleCheckIn = async () => {
        if ([data.guestMobile, data.numberOfGuests, data.verificationBy].some(field => field === '')) {
            return toast("All fields are required", "error");
        }

        // Validate Mobile Number............
        if (isNaN(data.guestMobile) || data.guestMobile.length !== 10) {
            return toast("Invalid Mobile Number", "error");
        }

        // Validate Guest Number..............
        if (!/^[1-9]\d*$/.test(String(data.numberOfGuests))) {
            return toast("Invalid Number of Guest", "error");
        }


        // ================ [Check already checkin or not] =============;

        const check = await fetch(`${process.env.REACT_APP_BOOKING_API}/check-in/add-booking`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                mobileNumber: data.guestMobile, existsCheck: true,
                token: token, NumberOfGuest: data.numberOfGuests
            })
        });
        const checkRes = await check.json();

        if (check.status === 200) {
            if (checkRes.exist) {
                return toast("Guest alredy checkin", 'error');
            }
        } else {
            return toast(checkRes?.err || "Something went wrong", 'error');
        }

        // ::::::::::::::::: SENDING PART :::::::::::::::::
        if (data.verificationBy === 'otp') {
            // Generate OTP;
            let newOtp = Math.floor(1000 + Math.random() * 9000);
            localStorage.setItem("OTP", btoa(newOtp).toString());

            // Send OTP;
            const sendotp = await fetch(process.env.REACT_APP_MASTER_API + "/admin/send-checkin-otp", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    mobile: data.guestMobile, otp: newOtp,
                    token: token
                })
            })
            const res = await sendotp.json();

            navigate('/hotel/check-in-otp', {
                state: {
                    ...data, totalUnreserdBed:
                        (parseInt(hotelDetails?.hotel_total_bed) - parseInt(staticticData?.occupied)) > 1 ?
                            parseInt(hotelDetails?.hotel_total_bed) - parseInt(staticticData?.occupied) :
                            0
                }
            });

        } else {
            const result = await show('Confirm Action', 'Do you want to proceed?');
            if (result === "ok") {
                navigate('/hotel/check-in/guest-entry', {
                    state: data
                });
            }
        }
    }



    // Reset Form Data...............
    const clearData = () => setData({ guestMobile: '', numberOfGuests: '', verificationBy: 'manager' });


    return (
        <>
            {modal}
            <Nav title={"Manage Guest Entry"} />
            <main id='main'>
                <SideNav />
                <div className='content__body md:grid place-items-center'>
                    <div className='content__body__main lg:w-[500px] border border-gray-300'>
                        <div className='w-full flex items-center justify-between border-b pb-1'>
                            <p className='text-lg font-semibold'>Add New Booking</p>
                            <p className='font-semibold'>Total Unreserved Bed : {
                                (parseInt(hotelDetails?.hotel_total_bed) - parseInt(staticticData?.occupied)) > 1 ?
                                    parseInt(hotelDetails?.hotel_total_bed) - parseInt(staticticData?.occupied) :
                                    0
                            }</p>
                        </div>
                        <div className='w-full flex flex-col gap-4 mt-4'>
                            <div>
                                <p>Mobile No. of Head of the Party<span className='required__text'>*</span></p>
                                <input
                                    type="text"
                                    placeholder="Enter Guest Mobile No."
                                    value={data.guestMobile}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (/^\d*$/.test(value) && value.length <= 10) {
                                            setData({ ...data, guestMobile: value });
                                        }
                                    }}
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
                            <button className='reset__btn' onClick={clearData}>
                                <Icons.RESET />
                                Reset
                            </button>
                            <button className='save__btn' onClick={handleCheckIn}>
                                <Icons.CHECK /> Submit
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}

export default CheckIn;

