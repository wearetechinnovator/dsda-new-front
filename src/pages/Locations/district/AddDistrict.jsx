import React, { useEffect, useState } from 'react'
import Nav from '../../../components/Nav';
import SideNav from '../../../components/SideNav'
import { FaRegCheckCircle } from "react-icons/fa";
import { LuFileX2, LuRefreshCcw } from "react-icons/lu";
import { CgPlayListAdd } from "react-icons/cg";
import useMyToaster from '../../../hooks/useMyToaster';
import { SelectPicker } from 'rsuite';
import Cookies from 'js-cookie';
import { useNavigate, useParams } from 'react-router-dom';
import { RiDeleteBin6Line } from 'react-icons/ri';
import MySelect2 from '../../../components/MySelect2';
import { Icons } from '../../../helper/icons';
import { MdUploadFile } from 'react-icons/md';



const AddDistrict = ({ mode, save }) => {
    return (
        <>
            <Nav title={mode ? "Update District " : "Add New District"} />
            <main id='main'>
                <SideNav />
                <AddDisctrictComponent  mode={mode} save={save}/>
            </main>
        </>
    )
}

const AddDisctrictComponent = ({mode, save}) => {
    const toast = useMyToaster();
    const [form, setForm] = useState({
        name: '', status: 'active', details: ''
    })
    const { id } = useParams();
    const navigate = useNavigate();


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
                setForm({
                    title: data.title, type: data.type, salePrice: data.salePrice,
                    category: data.category?._id, details: data.details, hsn: data.category?.hsn, tax: data.category?.tax
                });
            }

            get();
        }
    }, [mode])


    const savebutton = async (e) => {
        if (form.name.trim() === "" || !form.name) {
            return toast("Name can't be blank", "error")
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

            toast(!mode ? "Block create success" : "Block update success", 'success');

            // for close sidebar in MySelect2
            if (save) {
                save(true)
                return
            } else {
                return navigate("/admin/item")
            }

        } catch (error) {
            console.log(error);
            return toast("Something went wrong", "error")
        }

    }

    const clearData = () => {
        setForm({
            name: '', status: 'active', details: ''
        })
    }
    return <div className='content__body'>
        <div className='content__body__main bg-white'>
            <div className='flex justify-between  gap-5 flex-col lg:flex-row'>
                <div className='w-full flex flex-col gap-3'>
                    <div>
                        <p>Name <span className='required__text'>*</span></p>
                        <input type='text' onChange={(e) => setForm({ ...form, name: e.target.value })} value={form.name} />
                    </div>
                </div>

                <div className='w-full flex flex-col gap-3'>
                    <div>
                        <p className='ml-1'>Status</p>
                        <select onChange={(e) => setForm({ ...form, status: e.target.value })} value={form.status}>
                            <option value={"active"}>Active</option>
                            <option value={"inactive"}>Inactive</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className='w-full overflow-auto mt-2'>
                <div>
                    <p>Details</p>
                    <textarea name="" id="" rows={4} onChange={(e) => setForm({ ...form, details: e.target.value })} value={form.details}></textarea>
                </div>
            </div>
            <div className='form__btn__grp'>
                <button className='save__btn' onClick={savebutton}>
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
}



export {
    AddDisctrictComponent
}

export default AddDistrict