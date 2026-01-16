import { useLocation, useNavigate } from "react-router-dom";
import { Icons } from "../../helper/icons";
import { useEffect, useState } from "react";



const BookingBillPrint = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const [copy, setCopy] = useState(false);


    useEffect(() => {
        let timer;
        if (copy) {
            timer = setTimeout(() => {
                setCopy(false);
            }, 1000);
        }

        return () => clearTimeout(timer);
    }, [copy]);

   


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


            <footer id="footer"
                className=' text-xs mt-2 w-full fixed bottom-0 border-b border bg-[#F5F5F5] p-4 py-3 
                rounded-t text-white gap-3 flex items-center justify-start'
            >
                <button
                    onClick={() => {
                        navigate("/hotel/check-in")
                    }}
                    className='bg-[#32C5D2] hover:bg-[#43e0ee] px-3 py-2 rounded flex items-center gap-1'>
                    <Icons.BACK />
                    Back To Checkin
                </button>
                <button
                    onClick={() => {
                        document.querySelector("#footer").style.display = "none";
                        window.print();
                        document.querySelector("#footer").style.display = "flex";
                    }}
                    className='bg-[#2F353B] hover:bg-[#464d53] px-3 py-2 rounded flex items-center gap-1'>
                    <Icons.PRINTER className='font-bold' />
                    Print
                </button>
                <button
                    onClick={() => {
                        setCopy(!copy);
                        navigator.clipboard.writeText(
                            window.location.origin + "/public/bill/" + state?.id
                        )
                    }}
                    className='bg-[#2F353B] hover:bg-[#464d53] px-3 py-2 rounded flex items-center gap-1'>
                    {copy ? <Icons.CHECK2 /> : <Icons.COPY className='font-bold' />}
                    {copy ? "Copied..." : "Copy link"}
                </button>
                <button
                    onClick={() => {
                        const url = window.location.origin + "/public/bill/" + state?.id;
                        const message = `You are successfully checked in ${state?.hotelName} from ${state?.checkIn} to ${state?.checkOut || "Not yet checked out"} and amount of Rs. ${state?.totalAmount} received for ${state?.guests} Person -Digha Sankarpur Dev Authority. Here is your bill: ${url}`;
                        window.open(`https://wa.me/?text=${encodeURIComponent(message)}&phone=${state?.mobileNumber}`, '_blank');
                    }}
                    className='bg-green-500  px-3 py-2 rounded flex items-center gap-1'>
                    <Icons.WHATSAPP className="text-lg"/>
                    Send WhatsApp
                </button>
            </footer>
        </main>
    )
}

export default BookingBillPrint