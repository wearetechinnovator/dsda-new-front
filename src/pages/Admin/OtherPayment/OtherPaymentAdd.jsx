import { useEffect, useRef, useState } from 'react'
import Nav from '../../../components/Admin/Nav';
import SideNav from '../../../components/Admin/SideNav'
import { LuFileX2 } from "react-icons/lu";
import useMyToaster from '../../../hooks/useMyToaster';
import Cookies from 'js-cookie';
import { useNavigate, useParams } from 'react-router-dom';
import { Icons } from '../../../helper/icons';
import { MdUploadFile } from 'react-icons/md';
import checkfile from '../../../helper/checkfile';
import { SelectPicker } from 'rsuite';


const OtherPaymentAdd = ({ mode }) => {
    const navigate = useNavigate();
    const toast = useMyToaster();
    const { id } = useParams();
    const [data, setData] = useState({
        hotel: '', purpose: '', amount: '', refId: '',
        paymentDate: '', status: ''
    })
    const [allHotels, setAllHotels] = useState([]);
    const timeRef = useRef(null);


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
            setAllHotels([...res.data])

        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        get();
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
                console.log(error)
            }

        }, 350)
    }



    useEffect(() => {
        if (mode) {
            const get = async () => {
                const url = process.env.REACT_APP_MASTER_API + "/admin/get-users";
                const cookie = Cookies.get("token");

                const req = await fetch(url, {
                    method: "POST",
                    headers: {
                        "Content-Type": 'application/json'
                    },
                    body: JSON.stringify({ token: cookie, userId: id })
                })
                const res = await req.json();
                setData({ ...res, profile: res.profile_picture })
            }

            get();
        }
    }, [mode])


    const saveData = async (e) => {
        const requiredKeys = [
            'hotel', 'purpose', 'amount', 'refId', 'paymentDate', 'status'
        ];
        if (!mode) requiredKeys.push('password');

        for (const key of requiredKeys) {
            if (!data[key] || data[key].trim() === "") {
                return toast(`${key.camelToWords()} can't be blank`, 'error');
            }
        }


        try {
            let url = mode ? process.env.REACT_APP_MASTER_API + "/admin/update-users" : process.env.REACT_APP_MASTER_API + "/admin/create-users";
            const token = Cookies.get("token");
            const req = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(
                    !mode ? { ...data, token } : { ...data, token, userId: id }
                )
            })
            const res = await req.json();
            if (req.status !== 200 || res.err) {
                return toast(res.err, 'error');
            }

            if (!mode) clearData();

            toast(!mode ? "User create success" : "User update success", 'success');

        } catch (error) {
            console.log(error);
            return toast("Something went wrong", "error")
        }

    }

    const clearData = () => {
        setData({
            hotel: '', purpose: '', amount: '', refId: '',
            paymentDate: '', status: ''
        })
    }
    return (
        <>
            <Nav title={mode ? "Update Extra Payment " : "Add New Extra Payment"} />
            <main id='main'>
                <SideNav />
                <div className='content__body'>
                    <div className='content__body__main bg-white'>
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
                                        onChange={(v) => setData({...data, hotel: v})}
                                        value={data.hotel}
                                        placeholder="Select"
                                        searchable={true}
                                        cleanable={true}
                                        placement='bottomEnd'
                                        onSearch={(serachTxt) => searchTableDatabase(serachTxt)}
                                        onClean={get}
                                    />
                                </div>
                                <div >
                                    <p>Purpose <span className='required__text'>*</span></p>
                                    <input type='text' onChange={(e) => setData({ ...data, purpose: e.target.value })} value={data.purpose} />
                                </div>
                                <div >
                                    <p>Amount<span className='required__text'>*</span></p>
                                    <input type='text' onChange={(e) => setData({ ...data, amount: e.target.value })} value={data.amount} />
                                </div>
                            </div>

                            <div className='w-full flex flex-col gap-3'>
                                <div >
                                    <p>Ref. ID <span className='required__text'>*</span></p>
                                    <input type='text' onChange={(e) => setData({ ...data, refId: e.target.value })} value={data.refId} />
                                </div>
                                <div >
                                    <p>Payment Date <span className='required__text'>*</span></p>
                                    <input type='date' onChange={(e) => setData({ ...data, paymentDate: e.target.value })} value={data.paymentDate} />
                                </div>
                                <div className='w-full'>
                                    <p className='ml-1'>Payment Status</p>
                                    <select onChange={(e) => setData({ ...data, status: e.target.value })} value={data.status}>
                                        <option value={""}>--select--</option>
                                        <option value="failed">Failed</option>
                                        <option value="success">Success</option>
                                        <option value="pending">Pending</option>
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