import { useLocation, useNavigate } from "react-router-dom"
import { Icons } from "../../helper/icons"

const BookingBillPrint = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    

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

            <div id="footer" className='mt-2 w-full fixed bottom-0 bg-[#F5F5F5] p-4 rounded-t text-white gap-4 flex items-center justify-center'>
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
                        navigate("/hotel/check-in")
                    }}
                    className='bg-[#32C5D2] hover:bg-[#43e0ee] px-3 py-2 rounded flex items-center gap-1'>
                    <Icons.BACK />
                    Back To Checkin
                </button>
            </div>
        </main>
    )
}

export default BookingBillPrint