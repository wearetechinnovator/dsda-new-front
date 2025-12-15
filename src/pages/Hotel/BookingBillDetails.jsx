import Nav from '../../components/Hotel/Nav'
import SideNav from '../../components/Hotel/HotelSideNav';
import { Icons } from '../../helper/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import useMyToaster from '../../hooks/useMyToaster';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import Loading from '../../components/Admin/Loading';


const BookingBillDetails = () => {
    const toast = useMyToaster();
    const navigate = useNavigate();
    const location = useLocation();
    const finalData = location.state || {};
    const settingDetails = useSelector((store) => store.settingSlice);
    const hotelDetails = useSelector((store) => store.hotelDetails);
    const [totalFees, setTotalFees] = useState(null);
    const [loading, setLoading] = useState(false);




    useEffect(() => {
        let totalFee = 0;
        finalData.guestList.forEach((gl, _) => {
            if (parseInt(gl.age) > settingDetails.age_for_charges) {
                totalFee += parseInt(settingDetails.charges_per_tourist);
            }
        })
        setTotalFees(totalFee);
    }, [settingDetails, finalData]);

    const handleFinalSubmit = async () => {
        try {
            setLoading(true)
            const Url = process.env.REACT_APP_BOOKING_API + "/check-in/add-booking";
            const req = await fetch(Url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({...finalData, hotelName: hotelDetails?.hotel_name}),
            })

            const res = await req.json();
            setLoading(false);

            if (req.status === 200) {
                toast("Guest entry successfully", "success");
                navigate("/hotel/check-in/guest-entry/bill-details/print", {
                    state: {
                        id: res._id,
                        hotelName: hotelDetails?.hotel_name,
                        headGuest: `${finalData.guestList[0].guestName} (${finalData.guestList[0].age} Years | ${finalData.guestList[0].gender})`,
                        checkIn: `${finalData.checkInDate}, ${finalData.checkInTime}`,
                        checkOut: `${finalData.checkoutDate}, ${finalData.checkoutTime}`,
                        guests: finalData.guestList.length,
                        totalAmount: totalFees,
                    }
                })
            } else {
                setLoading(false);
                toast(res.err, "error");
            }
        } catch (error) {
            setLoading(false);
             
            toast("Something went wrong", "error");
        }
    }

    return (
        <>
            <Nav title={"Manage Guest Entry"} />
            <main id='main'>
                <SideNav />
                <div className='content__body'>
                    <div className='w-full flex flex-col gap-4'>
                        <div className="content__body__main">
                            <div className='w-full bg-[#32C5D2] p-2 rounded-t text-white flex justify-between items-center'>
                                <p className='font-bold'>Guest Information</p>
                                <Icons.INFO_DETAILS className='text-xl' />
                            </div>
                            <div className='flex flex-col border border-gray-300'>
                                <div className='flex items-center justify-between bg-gray-50 border-b border-gray-300'>
                                    <div className='border-r border-gray-300 w-full p-2'>Title</div>
                                    <div className='w-full p-2'>Information</div>
                                </div>
                                <div className='booking__details__table__row'>
                                    <div className='booking__details__table__title'>Name</div>
                                    <div className='w-full p-2'>
                                        {finalData.guestList[0].guestName} ({finalData.guestList[0].age} Years | {finalData.guestList[0].gender})
                                    </div>
                                </div>
                                <div className='booking__details__table__row'>
                                    <div className='booking__details__table__title'>Identity Type</div>
                                    <div className='w-full p-2'>{finalData.guestList[0].idType}</div>
                                </div>
                                <div className='booking__details__table__row'>
                                    <div className='booking__details__table__title'>Identity Number</div>
                                    <div className='w-full p-2'>{finalData.guestList[0].idNumber}</div>
                                </div>
                                <div className='booking__details__table__row'>
                                    <div className='booking__details__table__title'>Phone Number</div>
                                    <div className='w-full p-2'>{finalData.guestList[0].mobileNumber}</div>
                                </div>
                                <div className='booking__details__table__row'>
                                    <div className='booking__details__table__title'>Number Of Guest</div>
                                    <div className='w-full p-2'>{finalData.guestList.length}</div>
                                </div>
                                <div className='booking__details__table__row'>
                                    <div className='booking__details__table__title'>Check In Date-Time</div>
                                    <div className='w-full p-2'>{finalData.checkInDate}, {finalData.checkInTime}</div>
                                </div>
                                <div className='booking__details__table__row'>
                                    <div className='booking__details__table__title'>Check Out Date-Time</div>
                                    <div className='w-full p-2'>{finalData.checkoutDate}, {finalData.checkoutTime}</div>
                                </div>
                            </div>
                        </div>
                        <div className="content__body__main">
                            <div className='w-full bg-[#E7505A] p-2 rounded-t text-white flex justify-between items-center'>
                                <p className='font-bold'>DSDA Fees Payment Information</p>
                                <Icons.RUPES className='text-xl' />
                            </div>
                            <div className='flex flex-col border border-gray-300'>
                                <div className='booking__details__table__row'>
                                    <div className='booking__details__table__title'>Fees per Guest</div>
                                    <div className='w-full p-2'>₹ {settingDetails?.charges_per_tourist}</div>
                                </div>
                                <div className='booking__details__table__row'>
                                    <div className='booking__details__table__title'>Fees Payble</div>
                                    <div className='w-full p-2'>₹ {totalFees}</div>
                                </div>
                            </div>
                            <div className='mt-2 w-full bg-[#F5F5F5] p-4 rounded-t text-white flex gap-4 items-center'>
                                <button
                                    onClick={() => {
                                        navigate(-1);
                                    }}
                                    className='bg-[#2F353B] hover:bg-[#464d53] px-3 py-2 rounded flex items-center gap-1'>
                                    <Icons.BACK className='font-bold' />
                                    Edit Guest List
                                </button>
                                <button
                                    disabled={loading ? true : false}
                                    onClick={loading ? null : handleFinalSubmit}
                                    className='bg-[#32C5D2] hover:bg-[#43e0ee] px-3 py-2 rounded flex items-center gap-1'>
                                    {loading ? <Loading /> : <Icons.CHECK2 />}
                                    Final Submit
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}

export default BookingBillDetails;