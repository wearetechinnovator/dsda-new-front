import React, { useEffect, useState } from 'react'
import Nav from '../../../components/Admin/Nav';
import SideNav from '../../../components/Admin/SideNav'
import useMyToaster from '../../../hooks/useMyToaster';
import Cookies from 'js-cookie';
import {useParams } from 'react-router-dom';
import { Icons } from '../../../helper/icons';



const AddHotelCategory = ({ mode, save }) => {
    return (
        <>
            <Nav title={mode ? "Update Hotel Category" : "Add New Hotel Category"} />
            <main id='main'>
                <SideNav />
                <HotelCategoryComponent mode={mode} save={save} />
            </main>
        </>
    )
}

const HotelCategoryComponent = ({ mode, save }) => {
    const toast = useMyToaster();
    const [data, setData] = useState({
        name: ''
    })
    const { id } = useParams();
    

    useEffect(() => {
        if (mode) {
            const get = async () => {
                const url = process.env.REACT_APP_MASTER_API + "/hotel-category/get";
                const cookie = Cookies.get("token");

                const req = await fetch(url, {
                    method: "POST",
                    headers: {
                        "Content-Type": 'application/json'
                    },
                    body: JSON.stringify({ token: cookie, id: id })
                })
                const res = await req.json();
                console.log(res);
                setData({ name: res.hotel_category_name });
            }

            get();
        }
    }, [mode])


    const saveData = async (e) => {
        if (data.name.trim() === "" || !data.name) {
            return toast("Name can't be blank", "error")
        }

        try {
            const url = mode ? process.env.REACT_APP_MASTER_API + "/hotel-category/update" : process.env.REACT_APP_MASTER_API + "/hotel-category/create";
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

            toast(!mode ? "Hotel Category create success" : "Hotel Category update success", 'success');

            // for close sidebar in MySelect2
            if (save) {
                save(true)
                return
            } else {
                // return navigate("/admin/hotel-category")
            }

        } catch (error) {
            console.log(error);
            return toast("Something went wrong", "error")
        }

    }

    const clearData = () => {
        setData({
            name: ''
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
    HotelCategoryComponent
}
export default AddHotelCategory;
