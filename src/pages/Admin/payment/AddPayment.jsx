import { useEffect, useState } from 'react'
import Nav from '../../../components/Admin/Nav';
import SideNav from '../../../components/Admin/SideNav'
import useMyToaster from '../../../hooks/useMyToaster';
import Cookies from 'js-cookie';
import { useNavigate, useParams } from 'react-router-dom';
import useApi from '../../../hooks/useApi';
import MySelect2 from '../../../components/Admin/MySelect2';
import { Icons } from '../../../helper/icons';



const AddPayment = ({ mode }) => {
    const toast = useMyToaster();
    const { id } = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState({
        hotel: '', year: '', month: '', amount: '', date: '', mode: '', transactionId: '', details: ""
    })



    useEffect(() => {
        if (mode) {
            const get = async () => {
                const url = process.env.REACT_APP_API_URL + "/item/get";
                const cookie = Cookies.get("token");

                const req = await fetch(url, {
                    method: "POST",
                    headers: {
                        "Content-Type": 'application/json'
                    },
                    body: JSON.stringify({ token: cookie, id: id })
                })
                const res = await req.json();
                const data = res.data;

            }

            get();
        }
    }, [mode])


    const saveData = async (e) => {
        const requiredKeys = [
            'hotel', 'year', 'month', 'amount', 'date',
        ];

        for (const key of requiredKeys) {
            if (!form[key] || form[key].trim() === "") {
                return toast(`${key.camelToWords()} can't be blank`, 'error');
            }
        }


        try {
            const url = process.env.REACT_APP_API_URL + "";
            const token = Cookies.get("token");
            const req = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(
                    !mode ? { ...form, token }
                        : { ...form, token, update: true, id: id }
                )
            })
            const res = await req.json();
            if (req.status !== 200 || res.err) {
                return toast(res.err, 'error');
            }

            if (!mode) clearData();

            toast(!mode ? "Item create success" : "Item update success", 'success');


        } catch (error) {
            console.log(error);
            return toast("Something went wrong", "error")
        }

    }

    const clearData = () => {
        setForm({
            hotel: '', year: '', month: '', amount: '', date: '', mode: '', transactionId: '', details: ""
        });
    }


    return (
        <>
            <Nav title={mode ? "Update Amenities" : "Add New Amenities"} />
            <main id='main'>
                <SideNav />
                <div className='content__body'>
                    <div className='content__body__main bg-white'>
                        <div className='flex justify-between  gap-5 flex-col lg:flex-row'>
                            <div className='w-full flex flex-col gap-3'>
                                <div>
                                    <p className='ml-1'>Select Hotel<span className='required__text'>*</span></p>
                                    <MySelect2
                                        model={"hotel"}
                                        onType={(v) => {
                                            setForm({ ...form, hotel: v })
                                        }}
                                        value={form.hotel}
                                    />
                                </div>
                                <div>
                                    <p className='ml-1'>Select Year<span className='required__text'>*</span></p>
                                    <select onChange={(e) => setForm({ ...form, year: e.target.value })}
                                        value={form.year}>
                                        <option value="">--Select--</option>
                                        <option value="2024">2024</option>
                                        <option value="2025">2025</option>
                                        <option value="2026">2026</option>
                                    </select>
                                </div>
                                <div>
                                    <p className='ml-1'>Select Month<span className='required__text'>*</span></p>
                                    <select onChange={(e) => setForm({ ...form, month: e.target.value })}
                                        value={form.month}>
                                        <option value="">--Select--</option>
                                        <option value="january">January</option>
                                        <option value="february">February</option>
                                        <option value="march">March</option>
                                        <option value="april">April</option>
                                        <option value="may">May</option>
                                        <option value="june">June</option>
                                        <option value="july">July</option>
                                        <option value="august">August</option>
                                        <option value="september">September</option>
                                        <option value="october">October</option>
                                        <option value="november">November</option>
                                        <option value="december">December</option>
                                    </select>
                                </div>
                                <div>
                                    <p>Amount<span className='required__text'>*</span></p>
                                    <input type='text'
                                        onChange={(e) => setForm({ ...form, amount: e.target.value })}
                                        value={form.amount} />
                                </div>
                            </div>

                            <div className='w-full pt-1 flex flex-col gap-3'>
                                <div>
                                    <p>Payment Date<span className='required__text'>*</span></p>
                                    <input type='date'
                                        onChange={(e) => setForm({ ...form, date: e.target.value })}
                                        value={form.date}
                                    />
                                </div>
                                <div>
                                    <p>Restaurant Available?</p>
                                    <select onChange={(e) => setForm({ ...form, mode: e.target.value })}
                                        value={form.mode}>
                                        <option value="offline">Offline</option>
                                        <option value="online">Online</option>
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

                        <div className='w-full overflow-auto mt-2'>
                            <div>
                                <p>Details</p>
                                <textarea name="" id="" rows={4} onChange={(e) => setForm({ ...form, details: e.target.value })}
                                    value={form.details}></textarea>
                            </div>
                        </div>

                        <div className='form__btn__grp pb-4'>
                            <button className='save__btn' onClick={saveData}>
                                <Icons.CHECK />
                                {mode ? "Update" : "Save"}
                            </button>
                            <button className='reset__btn' onClick={clearData}>
                                <Icons.RESET />
                                Reset
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}

export default AddPayment;