import { useEffect, useRef, useState } from "react";
import "../../assets/css/login.css"
import Nav from '../../components/Admin/Nav';
import SideNav from '../../components/Admin/SideNav';
import { Tooltip } from 'react-tooltip';
import { SelectPicker } from "rsuite";
import Cookies from 'js-cookie';
import useMyToaster from '../../hooks/useMyToaster';


const ManageHotel = () => {
    const toast = useMyToaster();
    const [selectedHotel, setSelectedHotel] = useState(null);
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
                 
            }

        }, 350)
    }


    const loginHotel = async () => {
        if (!selectedHotel) {
            return toast("Please select a hotel", "error");
        }

        const getHotel = allHotels.filter((item) => item._id === selectedHotel)[0];
        const token = Cookies.get("token");

        try {
            const url = process.env.REACT_APP_MASTER_API + "/hotel/login";
            const req = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ username: getHotel.hotel_username, token })
            });
            const res = await req.json();

            if (req.status !== 200 || res.err) {
                return toast(res.err, "error")
            }

            Cookies.set("hotel-token", res.token);
            Cookies.set("hotelId", res.hotel._id);
            window.open("/hotel/dashboard", "_blank");
        } catch (error) {
             
            return toast("Something went wrong", "error")
        }

    }


    return (
        <>
            <Nav title={"Manage Hotel"} />
            <main id='main'>
                <SideNav />
                <Tooltip id='itemTooltip' />
                <div className='content__body grid place-items-center'>
                    <div className='content__body__main min-w-[450px]'>
                        <p className="text-lg font-bold pb-3">Select Hotel</p>
                        <SelectPicker
                            block
                            data={[
                                ...allHotels.map((item) => ({
                                    label: item.hotel_name,
                                    value: item._id
                                }))
                            ]}
                            style={{ width: '100%' }}
                            onChange={(v) => setSelectedHotel(v)}
                            value={selectedHotel}
                            placeholder="Select"
                            searchable={true}
                            cleanable={true}
                            placement='bottomEnd'
                            onSearch={(serachTxt) => searchTableDatabase(serachTxt)}
                            onClean={get}
                        />
                        <button
                            onClick={loginHotel}
                            className='my-2 w-full bg-[#045F9C] text-white p-2 rounded hover:bg-blue-700 
                            transition-all duration-300'
                        >
                            Login
                        </button>
                    </div>
                </div>
            </main>
        </>
    )
}

export default ManageHotel;