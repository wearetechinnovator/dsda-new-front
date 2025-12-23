import { useEffect, useState } from 'react'
import Nav from '../../../components/Admin/Nav';
import SideNav from '../../../components/Admin/SideNav'
import useMyToaster from '../../../hooks/useMyToaster';
import Cookies from 'js-cookie';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Icons } from '../../../helper/icons';



const EditPayment = () => {
    const toast = useMyToaster();
    const location = useLocation();
    const paymentData = location.state || {};
    const { id } = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState({
        hotel: '', year: '', month: '', amount: '', date: '', mode: '',
        transactionId: '', details: "", status: '', receiptNo: '',
    });



    // Get Amenities Data
    useEffect(() => {
        (async () => {
            try {
                const url = process.env.REACT_APP_MASTER_API + `/amenities/get-amenities`;
                const req = await fetch(url, {
                    method: "POST",
                    headers: {
                        "Content-Type": 'application/json'
                    },
                    body: JSON.stringify({ id, token: Cookies.get("token") })
                });
                const res = await req.json();
                setForm({
                    hotel: res?.amenities_hotel_id?.hotel_name,
                    year: res?.amenities_year,
                    month: res?.amenities_month,
                    amount: res?.amenities_amount,
                    date: res?.amenities_payment_date,
                    mode: res?.amenities_payment_mode ? res?.amenities_payment_mode : '0',
                    transactionId: res?.amenities_payment_transaction_id,
                    details: res?.amenities_details,
                    status: res?.amenities_payment_status,
                    receiptNo: res?.amenities_receipt_number,
                })

            } catch (error) {
                return toast('Payment data not fetch', 'error')
            }
        })()
    }, [])



    const saveData = async (e) => {
        try {
            const url = process.env.REACT_APP_MASTER_API + "/amenities/update-amenities";
            const token = Cookies.get("token");
            const req = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ ...form, token, id: id })
            })
            const res = await req.json();
            if (req.status !== 200 || res.err) {
                return toast(res.err, 'error');
            }

            return toast("Amenities update success", 'success');

        } catch (error) {
           
            return toast("Something went wrong", "error")
        }

    }


    return (
        <>
            <Nav title={"Update Amenities"} />
            <main id='main'>
                <SideNav />
                <div className='content__body'>
                    <div className='content__body__main bg-white'>
                        <div className='flex justify-between  gap-5 flex-col lg:flex-row'>
                            <div className='w-full flex flex-col gap-3'>
                                <div>
                                    <p className='ml-1'>Hotel Name</p>
                                    <input type="text" value={form.hotel} disabled />
                                </div>
                                <div>
                                    <p className='ml-1'>Payment Year</p>
                                    <input type="text" value={form.year} disabled />
                                </div>
                                <div>
                                    <p className='ml-1'>Payment Month</p>
                                    <input type="text" value={form.month} disabled />
                                </div>
                                <div>
                                    <p>Amount</p>
                                    <input type="text" value={form.amount} disabled />
                                </div>
                                <div>
                                    <p>Receipt No.</p>
                                    <input type='text'
                                        onChange={(e) => setForm({ ...form, receiptNo: e.target.value })}
                                        value={form.receiptNo}
                                    />
                                </div>
                            </div>

                            <div className='w-full flex flex-col gap-3'>
                                <div>
                                    <p>Payment Date</p>
                                    <input type="date" value={form.date} />
                                </div>
                                <div>
                                    <p>Payment Mode</p>
                                    <select onChange={(e) => setForm({ ...form, mode: e.target.value })}
                                        value={form.mode}>
                                        <option value="0">Offline</option>
                                        <option value="1">Online</option>
                                    </select>
                                </div>
                                <div>
                                    <p>Payment Status</p>
                                    <select onChange={(e) => setForm({ ...form, status: e.target.value })}
                                        value={form.status}>
                                        <option value="ni">Not initiated</option>
                                        <option value="0">Failed</option>
                                        <option value="1">Success</option>
                                        <option value="2">Processing</option>
                                    </select>
                                </div>
                                <div>
                                    <p>Transaction ID</p>
                                    <input type='text'
                                        onChange={(e) => setForm({ ...form, transactionId: e.target.value })}
                                        value={form.transactionId}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className='form__btn__grp pb-4'>
                            <button className='reset__btn' onClick={saveData}>
                                <Icons.RESET />
                                Reset
                            </button>
                            <button className='save__btn' onClick={saveData}>
                                <Icons.CHECK />
                                Update
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}

export default EditPayment;