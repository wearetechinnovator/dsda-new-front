import Nav from '../../components/Hotel/Nav'
import SideNav from '../../components/Hotel/HotelSideNav';
import { Icons } from '../../helper/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';


const CheckOutDetails = () => {
    const settingDetails = useSelector((store) => store.settingSlice)
    const navigate = useNavigate();
    const location = useLocation();
    const { bookingId } = location.state;
    const [bookingDetails, setBookingDetails] = useState([])
    const [loading, setLoading] = useState(null);
    const [minDate, setMinDate] = useState(null);
    const today = new Date();
    const [selectedCheckout, setSelectedCheckout] = useState([]);


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
                body: JSON.stringify({ bookingId }),
            })
            const res = await req.json();
            if (req.status === 200) {
                setLoading(false)
                setBookingDetails([...res]);
            }
        })();
    }, [bookingId])


    // Checkout
    const handleCheckOut = async () => {
        
    }

    return (
        <>
            <Nav title={"Manage Guest Entry"} />
            <main id='main'>
                <SideNav />
                <div className='content__body'>
                    <div className="content__body__main">
                        <div className='w-full bg-[#32C5D2] p-2 rounded text-white flex justify-between items-center'>
                            <p className='font-bold'>Check Out Entry</p>
                            <Icons.INFO_DETAILS className='text-xl' />
                        </div>
                        <div className='mt-4 w-full flex justify-between items-center gap-4'>
                            <div className='w-full'>
                                <p>Check Out Date<span className='required__text'>*</span></p>
                                <input
                                    type="date"
                                    placeholder="Enter Date"
                                    // value={checkInDetails.checkInDate}
                                    min={minDate?.toISOString().split("T")[0]} // 2 days before today
                                    max={today.toISOString().split("T")[0]}   // today
                                    onChange={(e) => {
                                        const selectedDate = e.target.value;

                                        // extra safeguard: prevent manual typing of invalid date
                                        if (selectedDate < minDate?.toISOString().split("T")[0] || selectedDate > today.toISOString().split("T")[0]) {
                                            alert("Please select a valid date between 2 days ago and today.");
                                            return;
                                        }

                                        // setCheckInDetails({
                                        //     ...checkInDetails,
                                        //     checkInDate: selectedDate,
                                        // });
                                    }}
                                />
                            </div>
                            <div className='w-full'>
                                <p>Check Out Time<span className='required__text'>*</span></p>
                                <input type='time'
                                    placeholder='Enter Time'
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
                                                <button className='bg-[#32C5D2] rounded px-3 py-2 text-white flex items-center gap-2'>
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
