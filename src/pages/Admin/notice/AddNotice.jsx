import React, { useEffect, useRef, useState } from 'react'
import Nav from '../../../components/Admin/Nav';
import SideNav from '../../../components/Admin/SideNav'
import { FaRegCheckCircle } from "react-icons/fa";
import { LuFileX2, LuRefreshCcw } from "react-icons/lu";
import { CgPlayListAdd } from "react-icons/cg";
import useMyToaster from '../../../hooks/useMyToaster';
import { CheckPicker, SelectPicker } from 'rsuite';
import Cookies from 'js-cookie';
import { useNavigate, useParams } from 'react-router-dom';
import { Icons } from '../../../helper/icons';
import checkfile from '../../../helper/checkfile';
import { MdUploadFile } from 'react-icons/md';



const AddNotice = ({ mode }) => {
    const toast = useMyToaster();
    const { id } = useParams();
    const navigate = useNavigate();
    const [fileName, setFileName] = useState('');
    const [allHotels, setAllHotels] = useState([]);
    const [data, setData] = useState({
        title: '', date: "", status: '1', details: '',
        file: '', hotel: ''
    })
    const timeRef = useRef(null);




    // =========== [GET HOTELS] =========
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
        get()
    }, [])


    const searchTableDatabase = (txt) => {
        if (timeRef.current) clearTimeout(timeRef.current);

        timeRef.current = setTimeout(async () => {
            if (!txt) {
                get();
                return;
            }

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

        }, 1000)

    }


    useEffect(() => {
        if (mode) {
            const get = async () => {
                const url = process.env.REACT_APP_MASTER_API + "/notice/get";
                const cookie = Cookies.get("token");

                const req = await fetch(url, {
                    method: "POST",
                    headers: {
                        "Content-Type": 'application/json'
                    },
                    body: JSON.stringify({ token: cookie, id: id })
                })
                const res = await req.json();
                setData({
                    hotel: res.notice_hotel,
                    date: res.notice_date,
                    details: res.notice_details,
                    file: res.notice_file,
                    status: res.notice_status,
                    title: res.notice_title
                });
                setFileName(res.notice_file ? Date.now() : '');
            }

            get();
        }
    }, [mode])


    const saveData = async (e) => {
        if (data.hotel === "") {
            return toast(`hotel can't be blank`, 'error');
        }


        try {
            const url = process.env.REACT_APP_MASTER_API + `/notice/${mode ? 'update' : 'create'}`;
            const token = Cookies.get("token");

            const req = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(
                    !mode ? { ...data, token }
                        : { ...data, token, id: id }
                )
            })
            const res = await req.json();
            if (req.status !== 200 || res.err) {
                return toast(res.err, 'error');
            }

            if (!mode) {
                navigate('/admin/notice');
            };
            toast(!mode ? "Notice create success" : "Notice update success", 'success');


        } catch (error) {
            console.log(error);
            return toast("Something went wrong", "error")
        }

    }

    const handleFile = async (e) => {
        let validfile = await checkfile(e.target.files[0], ['pdf']);

        if (typeof (validfile) !== 'boolean') return toast(validfile, "error");

        setFileName(e.target.files[0].name)
        const reader = new FileReader();
        reader.readAsDataURL(e.target.files[0]);
        reader.onload = () => {
            setData({ ...data, file: reader.result });
        }
    }

    const clearData = () => {
        setData({
            title: '', date: "", status: '', details: '',
            file: '', hotel: ''
        });
        setFileName("");
    }


    return (
        <>
            <Nav title={mode ? "Update Notice" : "Add New Notice"} />
            <main id='main'>
                <SideNav />
                <div className='content__body'>
                    <div className='content__body__main bg-white'>
                        <div className='w-full flex justify-between  gap-5 flex-col lg:flex-row'>
                            <div className='w-full'>
                                <p>Select Hotel<span className='required__text'>*</span></p>
                                <CheckPicker
                                    block
                                    data={[
                                        ...allHotels.map((item) => ({
                                            label: item.hotel_name,
                                            value: item._id
                                        }))
                                    ]}
                                    style={{ width: '100%' }}
                                    onChange={(v) => setData({ ...data, hotel: v })}
                                    onClean={() => setData({ ...data, hotel: '' })}
                                    value={mode && data.hotel}
                                    placeholder="Select"
                                    searchable={true}
                                    cleanable={true}
                                    placement='bottomEnd'
                                    onSearch={(serachTxt) => searchTableDatabase(serachTxt)}

                                />
                            </div>
                            <div className='w-full'>
                                <p>Title<span className='required__text'>*</span></p>
                                <input type='text' onChange={(e) => setData({ ...data, title: e.target.value })} value={data.title} />
                            </div>
                        </div>
                        <div className='flex justify-between gap-5 flex-col lg:flex-row my-2'>
                            <div className='w-full'>
                                <div>
                                    <p>Choose File</p>
                                    <div className='file__uploader__div'>
                                        <span className='file__name'>{fileName}</span>
                                        <div className='flex gap-2'>
                                            <input type="file" id="siteLogo" className='hidden' onChange={handleFile} />
                                            <label htmlFor="siteLogo" className='file__upload' title='Upload'>
                                                <MdUploadFile />
                                            </label>
                                            {
                                                fileName && <LuFileX2 className='remove__upload ' title='Remove upload' onClick={() => {
                                                    setFileName("");
                                                    setData({ ...data, file: "" })
                                                }} />
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className='w-full flex flex-col gap-3'>
                                <div className='flex flex-col md:flex-row md:gap-2'>
                                    <div className='w-full'>
                                        <p>Date</p>
                                        <input type='date' onChange={(e) => setData({ ...data, date: e.target.value })} value={data.date} />
                                    </div>
                                    <div className='w-full'>
                                        <p>Status</p>
                                        <select onChange={(e) => setData({ ...data, status: e.target.value })}
                                            value={data.status}>
                                            <option value="">--Select--</option>
                                            <option value="0">Expired</option>
                                            <option value="1">New</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='w-full overflow-auto'>
                            <div>
                                <p>Details</p>
                                <textarea name="" id="" rows={4} onChange={(e) => setData({ ...data, details: e.target.value })}
                                    value={data.details}></textarea>
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
            </main>
        </>
    )
}

export default AddNotice;

