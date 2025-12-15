import Nav from '../../components/Hotel/Nav'
import SideNav from '../../components/Hotel/HotelSideNav';
import { Icons } from '../../helper/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import useMyToaster from '../../hooks/useMyToaster';
import Cookies from 'js-cookie';



const CheckOutDetails = () => {
    const toast = useMyToaster();
    const settingDetails = useSelector((store) => store.settingSlice)
    const navigate = useNavigate();
    const location = useLocation();
    const { bookingId } = location.state;
    const [bookingDetails, setBookingDetails] = useState([])
    const [loading, setLoading] = useState(null);
    const [minDate, setMinDate] = useState(null);
    const today = new Date();
    const [selectedCheckout, setSelectedCheckout] = useState([]);
    const [checkoutDate, setCheckoutDate] = useState();
    const [checkoutTime, setCheckoutTime] = useState();
    const [checkinDate, setCheckinDate] = useState();
    const [checkinTime, setCheckinTime] = useState();
    const hotelToken = Cookies.get("hotel-token");
    



    // Get Checkin Checkout date from setting;
    useEffect(() => {
        if (settingDetails?.day_for_checkin_checkout) {
            const min = new Date(
                Date.now() - settingDetails.day_for_checkin_checkout * 24 * 60 * 60 * 1000
            );
            setMinDate(min);
        }
    }, [settingDetails]);


    // Get Checkout user Data
    useEffect(() => {
        setLoading(true);

        (async () => {
            const Url = process.env.REACT_APP_BOOKING_API + "/check-in/get-booking";
            const req = await fetch(Url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ bookingId, token: hotelToken }),
            })
            const res = await req.json();

            if (req.status === 200) {
                setLoading(false)
                setBookingDetails([...res]);
                 

                setCheckoutDate(res[0].booking_details_checkout_date_time.split(" ")[0])
                setCheckoutTime(res[0].booking_details_checkout_date_time.split(" ")[1])
                
                setCheckinDate(res[0].booking_details_checkin_date_time.split(" ")[0])
                setCheckinTime(res[0].booking_details_checkin_date_time.split(" ")[1])
            }
        })();
    }, [bookingId])


    // Checkout
    const handleCheckOut = async () => {
        if (!checkoutDate) {
            return toast("Please Select Checkout Date", "error");
        } else if (!checkoutTime) {
            return toast("Please Select Checkout Time", "error");
        } else if (!selectedCheckout || selectedCheckout.length < 1) {
            return toast("Please Select Checkout User", "error");
        }


        // ==========================[ Check Checkout date ]========================= 
        // ==========================================================================
        const checkinDateObj = new Date(checkinDate);
        const checkoutDateObj = new Date(checkoutDate);

        // --- Extract new checkout time from user input ---
        const newTime = checkoutTime;               // "HH:MM"
        const [newH, newM] = newTime.split(":");
        checkoutDateObj.setHours(newH, newM, 0, 0);

        // --- Build proper check-in datetime (date + time separately) ---
        const checkinTimePart = checkinTime;          // "HH:MM"
        const [cH, cM] = checkinTimePart.split(":");
        checkinDateObj.setHours(cH, cM, 0, 0);

        // --- Validation: checkout must be strictly greater than checkin ---
        if (checkoutDateObj.getTime() <= checkinDateObj.getTime()) {
            return toast("You can't checkout earlier or at the same time", "error");
        }



        try {
            const Url = process.env.REACT_APP_BOOKING_API + "/check-out/guest-checkout";
            const req = await fetch(Url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ids: selectedCheckout, bookingId, date: checkoutDate,
                    time: checkoutTime, numberOfGuest: bookingDetails.length
                }),
            })
            const res = await req.json();
            if (req.status === 200) {
                toast("Checkout successfully", 'success');
                setBookingDetails((p) => p.filter((bData) => !selectedCheckout.includes(bData._id)));
                return;
            }

            return toast("User not checkout", "error")

        } catch (error) {
             
            toast("Something went wrong", "error")
        }

    }

    return (
        <>
            <Nav title={"Manage Guest Entry"} />
            <main id='main'>
                <SideNav />
                <div className='content__body'>
                    <div className="content__body__main">
                        <div className='w-full bg-[#32C5D2] p-2 rounded text-white flex gap-1 items-center'>
                            <Icons.INFO_DETAILS className='text-xl' />
                            <p className='font-bold'>Check Out Entry</p>
                        </div>
                        <div className='mt-4 w-full flex justify-between items-center gap-4'>
                            <div className='w-full'>
                                <p>Check Out Date<span className='required__text'>*</span></p>
                                <input
                                    type="date"
                                    placeholder="Enter Date"
                                    value={checkoutDate}
                                    min={minDate?.toISOString().split("T")[0]} // 2 days before today
                                    onChange={(e) => {
                                        const selectedDate = e.target.value;
                                        const min = minDate?.toISOString().split("T")[0];

                                        // extra safeguard: prevent manual typing of invalid date
                                        if (selectedDate < min) {
                                            alert(`Please select a valid date after ${min}.`);
                                            return;
                                        }
                                        setCheckoutDate(selectedDate)
                                    }}
                                />
                            </div>
                            <div className='w-full'>
                                <p>Check Out Time<span className='required__text'>*</span></p>
                                <input type='time'
                                    placeholder='Enter Time'
                                    value={checkoutTime}
                                    onChange={(e) => {
                                        setCheckoutTime(e.target.value);
                                    }}
                                />
                            </div>
                        </div>

                        <div className='w-full overflow-x-auto mt-10'>
                            <table className='w-full check__out__details__table'>
                                <thead>
                                    <tr>
                                        <td className='w-[3%]' align='center'>
                                            <input type="checkbox"
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        bookingDetails?.forEach((b, _) => {
                                                            setSelectedCheckout((p) => {
                                                                return [...p, b._id]
                                                            })
                                                        })
                                                    } else {
                                                        setSelectedCheckout((p) => {
                                                            return []
                                                        })
                                                    }
                                                }}
                                            />
                                        </td>
                                        <td className='w-[5%]'>Sl.No.</td>
                                        <td>Guest Details</td>
                                        <td>Check In Date & Time</td>
                                        <td>ID Card</td>
                                        <td>Mobile</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        loading == false ? bookingDetails?.map((d, i) => {
                                            return <tr key={i}>
                                                <td align='center'>
                                                    <input type="checkbox"
                                                        checked={selectedCheckout.includes(d._id)}
                                                        onChange={(e) => {
                                                            if (e.target.checked) {
                                                                setSelectedCheckout((p) => {
                                                                    return [...p, d._id]
                                                                })
                                                            } else {
                                                                setSelectedCheckout((p) => {
                                                                    return p.filter((id, _) => id !== d._id)
                                                                })
                                                            }
                                                        }}
                                                    />
                                                </td>
                                                <td align='center'>{i + 1}</td>
                                                <td>{d.booking_details_guest_name} ({d.booking_details_guest_age} Years | {d.booking_details_guest_gender})</td>
                                                <td>{d.booking_details_checkin_date_time}</td>
                                                <td>{d.booking_details_guest_id_type} ({d.booking_details_guest_id_number})</td>
                                                <td>{d.booking_details_guest_phone}</td>
                                            </tr>
                                        })
                                            : <tr>
                                                <td colSpan={6} align='center'>
                                                    <span className='text-[16px]'>Loading...</span>
                                                </td>
                                            </tr>
                                    }
                                </tbody>
                                <tfoot>
                                    <tr align="center" className='pt-4'>
                                        <td colSpan={6}>
                                            <div className='flex items-center gap-4 py-2'>
                                                <button
                                                    onClick={() => {
                                                        navigate(-1);
                                                    }}
                                                    className='bg-[#181C1F] rounded px-3 py-2 text-white flex items-center gap-2'>
                                                    <Icons.BACK />
                                                    Back
                                                </button>
                                                <button
                                                    onClick={handleCheckOut}
                                                    className='bg-[#32C5D2] rounded px-3 py-2 text-white flex items-center gap-2'>
                                                    <Icons.CHECK2 />
                                                    Check-Out
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}

export default CheckOutDetails;
