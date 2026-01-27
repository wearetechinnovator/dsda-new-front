import { useEffect, useRef, useState } from "react";
import "../../assets/css/login.css"
import Nav from '../../components/Hotel/Nav';
import SideNav from '../../components/Hotel/HotelSideNav';
import Cookies from 'js-cookie';
import useMyToaster from '../../hooks/useMyToaster';
import paProcessImg from '../../assets/images/pay-process.gif'
import { useNavigate } from "react-router-dom";

const AllPayment = () => {
    const navigate = useNavigate();
    const toast = useMyToaster()
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref");
    const type = params.get("type");
    const [isLoading, setIsLoading] = useState(true);
    const [status, setStatus] = useState(null);
    const token = Cookies.get("hotel-token");


    useEffect(() => {
        (async () => {
            try {
                const url = process.env.REACT_APP_MASTER_API + `/pay-gateway/check-status`;
                const req = await fetch(url, {
                    method: "POST",
                    headers: {
                        "Content-Type": 'application/json'
                    },
                    body: JSON.stringify({ refNo: ref, type, token })
                });
                const res = await req.json();

                setIsLoading(false);
                if (req.status !== 200) {
                    setStatus(res.status)
                    return toast(res.err, 'error');
                }

                setStatus(res.status)


            } catch (error) {
                setIsLoading(false);
                setStatus("Invalid");
                return toast("Something went wrong", "error")
            }
        })()
    }, [])


    return (
        <>
            <Nav title={"Payment Status"} />
            <main id='main'>
                <SideNav />
                <div className='content__body grid place-items-center'>
                    <div className='min-w-[450px]' >
                        {
                            isLoading && (
                                <div className="flex flex-col items-center justify-center">
                                    <img
                                        src={paProcessImg}
                                        className="h-[300px] w-[300px] rounded-lg shadow-md"
                                    />
                                    <p className="text-lg">Processing...</p>
                                </div>
                            )
                        }

                        {
                            status === "Success" && (
                                <div className=" z-50 items-center justify-center mx-auto">
                                    <div className="w-full max-w-sm rounded-xl bg-white p-6 text-center shadow-xl animate-scale">

                                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                                            <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" stroke-width="2"
                                                viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round"
                                                    d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>

                                        <h2 className="text-xl font-semibold">Success</h2>
                                        <p className="mt-4 text-gray-600">You paid successfully.</p>
                                        <button
                                            onClick={() => {
                                                if (type === "monthly") {
                                                    navigate('/hotel/payments/paid')
                                                }
                                                else if (type === "others") {
                                                    navigate('/hotel/other-payments')
                                                }
                                            }}
                                            className="mt-4 px-2 py-1 bg-blue-500 text-white rounded">
                                            Back to Payment
                                        </button>
                                    </div>
                                </div>

                            )
                        }

                        {
                            status === "Failed" && (
                                <div className="z-50 items-center justify-center mx-auto">
                                    <div className="w-full max-w-sm rounded-xl bg-white p-6 text-center shadow-xl animate-scale">
                                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                                            <svg
                                                className="h-8 w-8 text-red-600"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M6 18L18 6M6 6l12 12"
                                                />
                                            </svg>
                                        </div>

                                        <h2 className="text-xl font-semibold text-red-600">Failed</h2>
                                        <p className="mt-4 text-gray-600">
                                            Payment failed. Please try again.
                                        </p>
                                        <button
                                            onClick={() => {
                                                if (type === "monthly") {
                                                    navigate('/hotel/payments/due')
                                                }
                                                else if (type === "others") {
                                                    navigate('/hotel/other-payments')
                                                }
                                            }}
                                            className="mt-4 px-2 py-1 bg-blue-500 text-white rounded">
                                            Back to Payment
                                        </button>
                                    </div>
                                </div>


                            )
                        }
                        
                        {
                            status === "Processing" && (
                                <div className="z-50 items-center justify-center mx-auto">
                                    <div className="w-full max-w-sm rounded-xl bg-white p-6 text-center shadow-xl animate-scale">

                                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100">
                                            <svg
                                                className="h-8 w-8 text-yellow-600"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M12 9v4m0 4h.01"
                                                />
                                            </svg>
                                        </div>

                                        <h2 className="text-xl font-semibold text-yellow-600">
                                            Payment Under Process
                                        </h2>

                                        <p className="mt-4 text-gray-600">
                                            Your payment is currently being processed.
                                            Please check after some time.
                                        </p>

                                    </div>
                                </div>
                            )
                        }


                        {
                            status === "Invalid" && (
                                <div className="z-50 items-center justify-center mx-auto">
                                    <div className="w-full max-w-sm rounded-xl bg-white p-6 text-center shadow-xl animate-scale">
                                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                                            <svg
                                                className="h-8 w-8 text-red-600"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M6 18L18 6M6 6l12 12"
                                                />
                                            </svg>
                                        </div>

                                        <h2 className="text-xl font-semibold text-red-600">Error</h2>
                                        <p className="mt-4 text-gray-600">
                                            Unable to check payment status. Please try again later.
                                        </p>
                                    </div>
                                </div>


                            )
                        }
                    </div>
                </div>
            </main>
        </>
    )
}

export default AllPayment;