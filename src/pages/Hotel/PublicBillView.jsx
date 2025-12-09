import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import useMyToaster from '../../hooks/useMyToaster';




const PublicBillView = () => {
    const toast = useMyToaster()
    const { state } = useLocation();
    const { id } = useParams();
    const navigate = useNavigate();
    const [billData, setBillData] = useState({});



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
                console.log(res);

            } catch (err) {
                return toast("Something went wrong");
            }
        })()
    }, [id])


    return (
        <main className="w-full min-h-full grid place-items-center">
            <div className="w-full bill__print my-3 flex items-center justify-center flex-col pb-16">
                <img src="/print_logo.jpg" alt="" />
                <table>
                    <tbody>
                        <tr>
                            <td>ID:</td>
                            <td>{state?.id}</td>
                        </tr>
                        <tr>
                            <td>Hotel Name:</td>
                            <td>{state?.hotelName}</td>
                        </tr>
                        <tr>
                            <td>Payee:</td>
                            <td>{state?.headGuest}</td>
                        </tr>
                        <tr>
                            <td>Check-in:</td>
                            <td>{state?.checkIn}</td>
                        </tr>
                        <tr>
                            <td>Check-out:</td>
                            <td>{state?.checkOut || "Not yet checked out"}</td>
                        </tr>
                        <tr>
                            <td>Guests:</td>
                            <td>{state?.guests}</td>
                        </tr>
                        <tr>
                            <td>Amount:</td>
                            <td>{state?.totalAmount}</td>
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