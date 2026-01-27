import { useEffect, useRef, useState } from 'react'
import Nav from '../../../components/Admin/Nav';
import SideNav from '../../../components/Admin/SideNav'
import useMyToaster from '../../../hooks/useMyToaster';
import Cookies from 'js-cookie';
import { useNavigate, useParams } from 'react-router-dom';
import { Icons } from '../../../helper/icons';
import { SelectPicker } from 'rsuite';


const OtherPaymentAdd = ({ mode }) => {
    const navigate = useNavigate();
    const toast = useMyToaster();
    const { id } = useParams();
    const [data, setData] = useState({
        hotel: '', purpose: '', amount: '', transactionId: '',
        paymentDate: '', status: 'ni', receiptNo: ''
    })
    const [allHotels, setAllHotels] = useState([]);
    const timeRef = useRef(null);
    const [isEditMode, setIsEditMode] = useState(true);


    const get = async () => {
        try {
            const data = {
                token: Cookies.get("token")
            }
            const url = process.env.REACT_APP_MASTER_API + `/hotel/get`;
            const req = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": 'application/json'
                },
                body: JSON.stringify(data)
            });
            const res = await req.json();
            setAllHotels([...allHotels, ...res.data])

        } catch (error) {
            return toast("Hotels not get", 'error');
        }
    }

    useEffect(() => {
        if (!mode) {
            get();
        }
    }, [])

    const searchTableDatabase = (txt) => {
        if (txt === "") return;
        if (timeRef.current) clearTimeout(timeRef.current);

        timeRef.current = setTimeout(async () => {
            try {
                const data = {
                    token: Cookies.get("token"),
                    search: txt
                }
                const url = process.env.REACT_APP_MASTER_API + `/hotel/get`;
                const req = await fetch(url, {
                    method: "POST",
                    headers: {
                        "Content-Type": 'application/json'
                    },
                    body: JSON.stringify(data)
                });
                const res = await req.json();
                setAllHotels([...res])
            } catch (error) {

            }

        }, 350)
    }



    useEffect(() => {
        if (mode) {
            (async () => {
                const url = process.env.REACT_APP_MASTER_API + "/other-payments/get-payment";
                const cookie = Cookies.get("token");

                const req = await fetch(url, {
                    method: "POST",
                    headers: {
                        "Content-Type": 'application/json'
                    },
                    body: JSON.stringify({ token: cookie, id: id })
                })
                const res = await req.json();

                setAllHotels(prev => {
                    if (prev.findIndex(item => item._id === res.other_payment_hotel_id._id) === -1) {
                        return [...prev, res.other_payment_hotel_id]
                    }
                    return prev;
                })


                setData({
                    hotel: res.other_payment_hotel_id._id,
                    amount: res.other_payment_amount,
                    purpose: res.other_payment_purpose,
                    paymentDate: res.other_payment_payment_date,
                    transactionId: res.other_payment_payment_transaction_id,
                    receiptNo: res.other_payment_receipt_number,
                    status: res.other_payment_payment_status
                })
                if (res.other_payment_payment_status === "1") {
                    setIsEditMode(false);
                }
            })()
        }
    }, [mode])


    const saveData = async (e) => {
        const requiredKeys = [
            'hotel', 'purpose', 'amount', 'status'
        ];

        for (const key of requiredKeys) {
            if (!data[key] || String(data[key]).trim() === "") {
                return toast(`${key.camelToWords()} can't be blank`, 'error');
            }
        }


        try {
            let url = mode ? process.env.REACT_APP_MASTER_API + "/other-payments/update-payment" : process.env.REACT_APP_MASTER_API + "/other-payments/add-payment";
            const token = Cookies.get("token");
            const req = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(
                    !mode ? { ...data, token } : { ...data, token, id: id }
                )
            })
            const res = await req.json();
            if (req.status !== 200 || res.err) {
                return toast(res.err, 'error');
            }

            if (!mode) clearData();

            toast(!mode ? "Payment added success" : "Payment update success", 'success');
            navigate('/admin/other-payment')

        } catch (error) {
            return toast("Something went wrong", "error")
        }

    }

    const clearData = () => {
        setData({
            hotel: '', purpose: '', amount: '', transactionId: '',
            paymentDate: '', status: '', receiptNo: ''
        })
    }
    return (
        <>
            <Nav title={mode ? "Update Extra Payment " : "Add New Extra Payment"} />
            <main id='main'>
                <SideNav />
                <div className='content__body'>
                    {/* <div className='content__body__main'>
                        <div className='w-full flex gap-1 items-center border-b pb-1'>
                            <Icons.SEARCH />
                            <p className='font-semibold text-md'>Search Payment</p>
                        </div>
                        <div className='w-full flex flex-col md:flex-row justify-between gap-4 items-center mt-4'>
                            <div className='w-full mt-3'>
                                <p>Purpose </p>
                                <input type="text"
                                    value={filterData.purpose}
                                    onChange={(e) => setFilterData({ ...filterData, purpose: e.target.value })}
                                />
                            </div>
                            <div className='w-full mt-3'>
                                <p>Amount </p>
                                <input type="text"
                                    value={filterData.amount}
                                    onChange={(e) => setFilterData({ ...filterData, amount: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className='flex justify-start gap-2 mt-2'>
                            <div className='search__sug__badge' onClick={(e) => setFilterData({ ...filterData, purpose: "mismatch"})}>
                                mismatch
                            </div>
                            <div className='search__sug__badge' onClick={(e) => setFilterData({ ...filterData, purpose: "fine"})}>
                                fine
                            </div>
                        </div>


                        <div className='form__btn__grp'>
                            <button className='reset__btn' onClick={resetFilter}>
                                <Icons.RESET />
                                Reset
                            </button>
                            <button className='save__btn' onClick={handleFilter}>
                                <Icons.SEARCH /> Search
                            </button>
                        </div>
                    </div> */}

                    <div className='content__body__main bg-white mt-4'>
                        <div className='flex justify-between  gap-5 flex-col lg:flex-row'>
                            <div className='w-full flex flex-col gap-3'>
                                <div>
                                    <p>Select Hotel <span className='required__text'>*</span></p>
                                    <SelectPicker
                                        block
                                        data={[
                                            ...allHotels.map((item) => ({
                                                label: item.hotel_name,
                                                value: item._id
                                            }))
                                        ]}
                                        style={{ width: '100%' }}
                                        onChange={(v) => setData({ ...data, hotel: v })}
                                        value={data.hotel}
                                        placeholder="Select"
                                        searchable={true}
                                        cleanable={true}
                                        placement='bottomEnd'
                                        onSearch={(serachTxt) => searchTableDatabase(serachTxt)}
                                        onClean={get}
                                        disabled={!isEditMode}
                                    />
                                </div>
                                <div >
                                    <p>Purpose <span className='required__text'>*</span></p>
                                    <input type='text'
                                        disabled={!isEditMode}
                                        onChange={(e) => setData({ ...data, purpose: e.target.value })}
                                        value={data.purpose}
                                    />
                                    {isEditMode && <div className='flex justify-start gap-2 mt-2'>
                                        <div className='search__sug__badge' onClick={(e) => setData({ ...data, purpose: "Mismatch" })}>
                                            Mismatch
                                        </div>
                                        <div className='search__sug__badge' onClick={(e) => setData({ ...data, purpose: "Fine" })}>
                                            Fine
                                        </div>
                                    </div>}
                                </div>
                                <div >
                                    <p>Amount<span className='required__text'>*</span></p>
                                    <input type='text'
                                        disabled={!isEditMode}
                                        onChange={(e) => setData({ ...data, amount: e.target.value })}
                                        value={data.amount} />
                                </div>
                            </div>

                            <div className='w-full flex flex-col gap-3'>
                                <div >
                                    <p>Payment Date</p>
                                    <input type='date'
                                        disabled={!isEditMode}
                                        onChange={(e) => setData({ ...data, paymentDate: e.target.value })}
                                        value={data.paymentDate}
                                    />
                                </div>
                                <div >
                                    <p>Transaction. ID</p>
                                    <input type='text' onChange={(e) => setData({ ...data, transactionId: e.target.value })} value={data.transactionId} />
                                </div>
                                <div>
                                    <p>Receipt No.</p>
                                    <input type='text'
                                        onChange={(e) => setData({ ...data, receiptNo: e.target.value })}
                                        value={data.receiptNo}
                                    />
                                </div>
                                <div className='w-full'>
                                    <p className='ml-1'>Payment Status</p>
                                    <select disabled={!isEditMode}
                                        onChange={(e) => setData({ ...data, status: e.target.value })}
                                        value={data.status}
                                    >
                                        <option value={""}>--select--</option>
                                        <option value="ni">No initiated</option>
                                        <option value="0">Failed</option>
                                        <option value="1">Success</option>
                                        <option value="2">Pending</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className='form__btn__grp'>
                            <button className='reset__btn' onClick={clearData}>
                                <Icons.RESET />
                                Reset
                            </button>
                            <button className='save__btn' onClick={saveData}>
                                <Icons.CHECK />
                                {mode ? "Update" : "Save"}
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}

export default OtherPaymentAdd;