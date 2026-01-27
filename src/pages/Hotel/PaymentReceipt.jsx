import { useNavigate, useParams } from "react-router-dom";
import { Icons } from "../../helper/icons";
import { useEffect, useState } from "react";
import Logo from '../../assets/images/b_logo.png';
import useMyToaster from "../../hooks/useMyToaster";
import Cookies from 'js-cookie';
import numberToWords from "../../helper/NumberToWord";

const PaymentReceipt = () => {
    const token = Cookies.get("hotel-token");
    const toast = useMyToaster();
    const { type, id } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState({
        hotelName: '',
        receiptNo: '',
        periodOrPurposeTitle: '',
        periodOrPurpose: '',
        amount: '',
        amountInWords: '',
        transactionNo: '',
        date: ''
    })

    const months = [
        { label: 'January' },
        { label: 'February' },
        { label: 'March' },
        { label: 'April' },
        { label: 'May' },
        { label: 'June' },
        { label: 'July' },
        { label: 'August' },
        { label: 'September' },
        { label: 'October' },
        { label: 'November' },
        { label: 'December' }
    ];



    useEffect(() => {
        (async () => {
            try {
                const URL = process.env.REACT_APP_MASTER_API + "/pay-gateway/print-receipt";
                const req = await fetch(URL, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ type, id, token }),
                });
                const res = await req.json();

                if (req.status === 200) {
                    if (type === 'monthly') {
                        setData({
                            hotelName: res.data.amenities_hotel_id.hotel_name,
                            receiptNo: res.data.amenities_receipt_number,
                            periodOrPurposeTitle: 'PERIOD',
                            amount: res.data.amenities_amount,
                            transactionNo: res.data.amenities_payment_transaction_id,
                            date: res.data.amenities_payment_date,
                            periodOrPurpose: months[parseInt(res.data.amenities_month) - 1].label + ', ' + res.data.amenities_year,
                            amountInWords: numberToWords(res.data.amenities_amount)
                        })
                    }
                    else if (type === 'other') {
                        setData({
                            hotelName: res.data.other_payment_hotel_id.hotel_name,
                            receiptNo: res.data.other_payment_receipt_number,
                            periodOrPurposeTitle: 'PURPOSE',
                            amount: res.data.other_payment_amount,
                            transactionNo: res.data.other_payment_payment_transaction_id,
                            date: res.data.other_payment_payment_date,
                            periodOrPurpose: res.data.other_payment_purpose,
                            amountInWords: numberToWords(res.data.other_payment_amount)
                        })
                    }
                } else {
                    return toast(res.err || "Data not get", "error");
                }

            } catch (err) {
                return toast("Error fetching receipt data", "error");
            }
        })()
    }, [type, id])




    return (
        <main className="w-full min-h-full grid place-items-center">
            <div className="max-w-5xl mx-auto border border-blue-900 p-6 text-blue-900 font-serif mt-8 mb-24">
                <div>
                    <p className="text-right">
                        <strong>No.: </strong>
                        {data.receiptNo}
                    </p>
                </div>
                {/* Header */}
                <div className="text-center relative mt-[-30px]">
                    <img src={Logo} alt="Logo.png" className='mb-6 mx-auto' width={"60px"} />
                    <h1 className="text-2xl font-bold uppercase">
                        Digha Sankarpur Dev. Authority
                    </h1>
                    <div className="inline-block bg-blue-900 text-white px-4 py-1 mt-8 text-sm font-semibold rounded">
                        Realisation of Tourist Civic Amenity Charges
                    </div>
                </div>

                {/* Name */}
                <div className="flex items-center justify-between mt-6 w-full">
                    <p>
                        <span className="font-semibold">Name of the Tourist Estt:</span> {data.hotelName}
                    </p>
                </div>

                {/* Table */}
                <div className="mt-6 overflow-x-auto">
                    <table className="w-full border border-blue-900 text-sm">
                        <thead>
                            <tr className="border-b border-blue-900 text-center font-semibold">
                                <th className="border-r border-blue-900 p-2 font-bold w-[70%]">
                                    {data.periodOrPurposeTitle}
                                </th>
                                <th className="p-2 font-bold w-[30%]">AMOUNT (&#8377;)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b border-blue-900 h-10">
                                <td align="center" className="border-r border-blue-900">
                                    {data.periodOrPurpose}
                                </td>
                                <td align="center">
                                    {data.amount}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Total */}
                <div className="flex justify-end mt-4">
                    <div className="border border-blue-900 px-6 py-2 font-semibold ">
                        TOTAL - &#8377; {data.amount} /-
                    </div>
                </div>

                {/* Rupees */}
                <div className="mt-6">
                    <span className="font-semibold">Rupees</span>
                    <span className="border-b border-dotted border-blue-900 inline-block w-3/4 mx-2 capitalize">{data.amountInWords}</span>
                    <span>only.</span>
                </div>

                <div className="flex items-center justify-between w-full mt-6">
                    <p><strong>Transaction No:</strong> {data.transactionNo}</p>
                    <p><strong>Date:</strong> {data.date}</p>
                </div>
                {/* Signatures */}
                <div className="flex justify-between mt-8 text-sm">
                    <div>
                        <p className="border-t border-blue-900 pt-2">
                            This is a Computer Generated Document and does not require a Signature
                        </p>
                    </div>
                </div>
            </div>

            <footer id="footer"
                className=' text-xs mt-2 w-full fixed bottom-0 border-b border bg-[#F5F5F5] p-4 py-3 
                rounded-t text-white gap-3 flex items-center justify-start'
            >
                <button
                    onClick={() => { navigate(-1) }}
                    className='bg-[#32C5D2] hover:bg-[#43e0ee] px-3 py-2 rounded flex items-center gap-1'>
                    <Icons.BACK />
                    Back To Payment
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
            </footer>
        </main>
    )
}

export default PaymentReceipt;