import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import useMyToaster from '../../hooks/useMyToaster';




const PublicBillView = () => {
    const toast = useMyToaster()
    const { id } = useParams();
    const [billData, setBillData] = useState({});
    const [hotelData, setHotelData] = useState({});



    useEffect(() => {
        (async () => {
            try {
                const url = process.env.REACT_APP_BOOKING_API + `/check-in/public/get-booking`;
                const req = await fetch(url, {
                    method: "POST",
                    headers: {
                        "Content-Type": 'application/json'
                    },
                    body: JSON.stringify({ id })
                });
                const res = await req.json();
                setBillData(res);

            } catch (err) {
                return toast("Something went wrong");
            }
        })()
    }, [id])


    // Get HotelData after Bill Data get;
    useEffect(() => {
        (async () => {
            if(!billData?.booking_hotel_id) return;

            try {
                const url = process.env.REACT_APP_MASTER_API + "/hotel/get-hotel-details"
                const req = await fetch(url, {
                    method: "POST",
                    headers: {
                        "Content-Type": 'application/json'
                    },
                    body: JSON.stringify({ hotelId: billData?.booking_hotel_id })
                })
                const hotelData = await req.json();
                setHotelData(hotelData);

            } catch (err) {
                return toast("Something went wrong");
            }
        })()
    }, [billData])


    return (
        <main className="w-full min-h-full grid place-items-center">
            <div className="w-full bill__print my-3 flex items-center justify-center flex-col pb-16">
                <img src="/print_logo.jpg" alt="" />
                <table>
                    <tbody>
                        <tr>
                            <td>Hotel Name:</td>
                            <td>{hotelData?.hotel_name}</td>
                        </tr>
                        <tr>
                            <td>Payee:</td>
                            <td>{billData?.booking_head_guest_name}</td>
                        </tr>
                        <tr>
                            <td>Check-in:</td>
                            <td>{billData?.booking_checkin_date_time}</td>
                        </tr>
                        <tr>
                            <td>Check-out:</td>
                            <td>{billData?.booking_checkout_date_time}</td>
                        </tr>
                        <tr>
                            <td>Guests:</td>
                            <td>{billData?.booking_number_of_guest}</td>
                        </tr>
                        <tr>
                            <td>Amount:</td>
                            <td>{billData?.booking_bill_amount}</td>
                        </tr>
                    </tbody>
                </table>
                <p className="text-lg italic py-2 text-center">
                    This is a Computer Generated Document and does not require a Signature
                </p>
            </div>
        </main>
    )
}

export default PublicBillView