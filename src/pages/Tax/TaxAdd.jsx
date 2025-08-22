import React, { useEffect, useState } from 'react'
import Nav from '../../components/Nav';
import SideNav from '../../components/SideNav'
import { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { FaRegCheckCircle } from "react-icons/fa";
import { LuRefreshCcw } from "react-icons/lu";
import useMyToaster from '../../hooks/useMyToaster';
import { useNavigate, useParams } from 'react-router-dom';
import Cookies from 'js-cookie';

const TaxAdd = ({ mode }) => {
    const toast = useMyToaster();
    const editorRef = useRef(null);
    const [form, setForm] = useState({ title: '', details: '', gst: '0', cess: '0' });
    const { id } = useParams();
    const navigate = useNavigate();


    useEffect(() => {
        if (mode) {
            const get = async () => {
                const url = process.env.REACT_APP_API_URL + "/tax/get";
                const cookie = Cookies.get("token");

                const req = await fetch(url, {
                    method: "POST",
                    headers: {
                        "Content-Type": 'application/json'
                    },
                    body: JSON.stringify({ token: cookie, id: id })
                })
                const res = await req.json();
                setForm({ ...form, ...res.data });
            }

            get();
        }
    }, [mode])

    const savebutton = async (e) => {
        if (form.title === "") {
            return toast("Please enter title", "error")
        }else if (form.gst === "") {
            return toast("Please enter GST", "error")
        }

        try {
            const url = process.env.REACT_APP_API_URL + "/tax/add";
            const token = Cookies.get("token");
            const req = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(!mode ? { ...form, token } : { ...form, token, update: true, id: id })
            })
            const res = await req.json();
            if (req.status !== 200 || res.err) {
                return toast(res.err, 'error');
            }

            if (!mode) {
                setForm({ title: '', details: '', gst: '0', cess: '0' });
            }

            
            toast(!mode ? "Tax create success" : "Tax update success", 'success');
            navigate("/admin/tax");
            return 


        } catch (error) {
            return toast("Something went wrong", "error")
        }

    }

    const fromvalueclear = (e) => {
        setForm({
            title: '',
        })
    }

    return (
        <>
            <Nav title={mode ? "Upate Tax" : "Add Tax"} />
            <main id='main'>
                <SideNav />
                <div className='content__body'>
                    <div className='content__body__main bg-white '>
                        <div className='flex flex-col'>
                            <div className='w-full'>
                                <div className='p-2'>
                                    <p className='pb-1'>Title <span className='required__text'>*</span></p>
                                    <input type='text' onChange={(e) => setForm({ ...form, title: e.target.value })} value={form.title} />
                                </div>
                            </div>
                            <div className='w-full flex flex-col lg:flex-row'>
                                <div className='p-2 w-full'>
                                    <p className='pb-1'>{"GST (%)"} <span className='required__text'>*</span></p>
                                    <input type='text' onChange={(e) => setForm({ ...form, gst: e.target.value })} value={form.gst} />
                                </div>
                                <div className='p-2 w-full'>
                                    <p className='pb-1'>{"CESS (%)"}</p>
                                    <input type='text' onChange={(e) => setForm({ ...form, cess: e.target.value })} value={form.cess} />
                                </div>
                            </div>
                        </div>
                        <div className='flex justify-center pt-9 mb-6'>
                            <div className='flex rounded-sm bg-green-500 text-white'>
                                <FaRegCheckCircle className='mt-3 ml-2' />
                                <button className='p-2' onClick={savebutton}>{mode ? "Update" : "Save"}</button>
                            </div>
                            <div className='flex rounded-sm ml-4 bg-blue-500 text-white'>
                                <LuRefreshCcw className='mt-3 ml-2' />
                                <button className='p-2' onClick={fromvalueclear}>Reset</button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}

export default TaxAdd