import React, { useEffect, useState } from 'react'
import Nav from '../../../../components/Admin/Nav';
import SideNav from '../../../../components/Admin/SideNav'
import { FaRegCheckCircle } from "react-icons/fa";
import { LuFileX2, LuRefreshCcw } from "react-icons/lu";
import { CgPlayListAdd } from "react-icons/cg";
import useMyToaster from '../../../../hooks/useMyToaster';
import { SelectPicker } from 'rsuite';
import Cookies from 'js-cookie';
import { useNavigate, useParams } from 'react-router-dom';
import { RiDeleteBin6Line } from 'react-icons/ri';
import MySelect2 from '../../../../components/Admin/MySelect2';
import { Icons } from '../../../../helper/icons';
import { MdUploadFile } from 'react-icons/md';



const AddZone = ({ mode, save }) => {

    return (
        <>
            <Nav title={mode ? "Update Zone " : "Add New Zone"} />
            <main id='main'>
                <SideNav />
                <ZoneComponent mode={mode} save={save} />
            </main>
        </>
    )
}

const ZoneComponent = ({ mode, save }) => {
    const toast = useMyToaster();
    const [data, setData] = useState({
        name: '', details: ''
    })
    const { id } = useParams();
    

    useEffect(() => {
        if (mode) {
            const get = async () => {
                const url = process.env.REACT_APP_MASTER_API + "/zone/get";
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
                setData({ ...res });
            }

            get();
        }
    }, [mode])


    const saveData = async (e) => {
        if (data.name.trim() === "" || !data.name) {
            return toast("Name can't be blank", "error")
        }

        try {
            const url = mode ? process.env.REACT_APP_MASTER_API + "/zone/update" : process.env.REACT_APP_MASTER_API + "/zone/create";
            const token = Cookies.get("token");
            const req = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(!mode ? { ...data, token } : { ...data, token, id: id }
                )
            })
            const res = await req.json();
            if (req.status !== 200 || res.err) {
                return toast(res.err, 'error');
            }

            if (!mode) clearData();

            toast(!mode ? "Zone create success" : "Zone update success", 'success');

            // for close sidebar in MySelect2
            if (save) {
                save(true)
                return
            } else {
                // return navigate("/admin/zone")
            }

        } catch (error) {
            console.log(error);
            return toast("Something went wrong", "error")
        }

    }

    const clearData = () => {
        setData({
            name: '', details: ''
        })
    }

    return <div className='content__body'>
        <div className='content__body__main bg-white'>
            <div className='flex justify-between  gap-5 flex-col lg:flex-row'>
                <div className='w-full flex flex-col gap-3'>
                    <div>
                        <p>Name <span className='required__text'>*</span></p>
                        <input type='text' onChange={(e) => setData({ ...data, name: e.target.value })} value={data.name} />
                    </div>
                </div>
            </div>

            <div className='w-full overflow-auto mt-2'>
                <div>
                    <p>Details</p>
                    <textarea name="" id="" rows={4} onChange={(e) => setData({ ...data, details: e.target.value })} value={data.details}></textarea>
                </div>
            </div>
            <div className='form__btn__grp'>
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
}

export {
    ZoneComponent
}
export default AddZone;
