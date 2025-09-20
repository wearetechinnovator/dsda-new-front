import Nav from '../../components/Hotel/Nav';
import SideNav from '../../components/Hotel/HotelSideNav'
import { Icons } from '../../helper/icons';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import base64Data from '../../helper/getBase64';


const GuestEntry = () => {
    const location = useLocation()
    const [state, setState] = useState([]);
    const [country, setCountry] = useState([]);
    const { guestMobile, numberOfGuests, } = location.state || {};
    const [checkInDetails, setCheckInDetails] = useState({
        mobileNumbe: '', NumberOfGuest: '', checkInDate: new Date().toLocaleDateString(), checkInTime: ''
    });
    const guestListSet = {
        guestName: '', gender: '', age: "", nationality: '', address: '', idType: '',
        idNumber: '', idProof: '', mobileNumber: '', roomNumber: '', country: "", state: '', city: ''
    }
    const [guestList, setGuestList] = useState([]);




    // Set Table rows;
    useEffect(() => {
        Array.from({ length: numberOfGuests }).forEach(() => {
            setGuestList((prev) => [...prev, { ...guestListSet }]);
        });
        setCheckInDetails({ ...checkInDetails, NumberOfGuest: numberOfGuests, mobileNumbe: guestMobile })
    }, [location.state])


    useEffect(() => {
        const get = async (which) => {
            const req = await fetch(process.env.REACT_APP_MASTER_API + `/constant-type/get/${which}`)
            const res = await req.json();

            if (which === "country") {
                setCountry([...res]);

            } else if (which === "state") {
                setState([...res]);
            }
        }

        get("country");
        get("state");
    }, [])


    return (
        <>
            <Nav title={"Manage Guest Entry"} />
            <main id='main'>
                <SideNav />
                <div className='content__body'>
                    <div className='content__body__main '>
                        <div className='flex justify-between items-center border-b pb-1'>
                            <p className='text-md font-bold'>Guest Entry Details</p>
                            {/* <Icons.ADD /> */}
                        </div>

                        <div className='grid grid-cols-1 lg:grid-cols-2 gap-5 mt-8'>
                            <div>
                                <p>Mobile Number<span className='required__text'>*</span></p>
                                <input type='text'
                                    placeholder='Enter Mobile Number'
                                    value={checkInDetails.mobileNumbe}
                                    onChange={(e) => setCheckInDetails({
                                        ...checkInDetails, mobileNumbe: e.target.value
                                    })}
                                />
                            </div>
                            <div>
                                <p>Number of Guests<span className='required__text'>*</span></p>
                                <input type='text'
                                    placeholder='Enter Number of Guests'
                                    value={checkInDetails.NumberOfGuest}
                                    onChange={(e) => setCheckInDetails({
                                        ...checkInDetails, NumberOfGuest: e.target.value
                                    })}
                                />
                            </div>
                            <div>
                                <p>Check In Date<span className='required__text'>*</span></p>
                                <input type='date'
                                    placeholder='Enter Check In Date'
                                    value={checkInDetails.checkInDate}
                                    onChange={(e) => setCheckInDetails({
                                        ...checkInDetails, checkInDate: e.target.value
                                    })}
                                />
                            </div>
                            <div>
                                <p>Check In Time<span className='required__text'>*</span></p>
                                <input type='time'
                                    placeholder='Enter Check In Time'
                                    value={checkInDetails.checkInTime}
                                    onChange={(e) => setCheckInDetails({
                                        ...checkInDetails, checkInTime: e.target.value
                                    })}
                                />
                            </div>
                        </div>
                        {/* ============================== TABLE START HERE ====================== */}
                        <div className='overflow-x-auto list__table mt-5'>
                            <table className='min-w-full bg-white' id='table' >
                                <thead className='bg-gray-100 list__table__head'>
                                    <tr>
                                        <td className='min-w-[10px]'>SL No.</td>
                                        <td>Guest Name *</td>
                                        <td className='min-w-[15px]'>Gender *</td>
                                        <td className='min-w-[10px]'>Age *</td>
                                        <td className='min-w-[15px]'>Nationality *</td>
                                        <td className='min-w-[30px]'>ID Type *</td>
                                        <td className='min-w-[30px]'>ID Number *</td>
                                        <td className='min-w-[30px]'>Mobile Number*</td>
                                        <td className='min-w-[15px] max-w-[15px]'>Room Number*</td>
                                        <td align='center'>Action</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        guestList.map((gl, index) => {
                                            return <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td valign='top'>
                                                    <input type="text"
                                                        placeholder='Enter Guest Name'
                                                        value={gl.guestName}
                                                        onChange={(e) => {
                                                            const updatedList = [...guestList];
                                                            updatedList[index].guestName = e.target.value;
                                                            setGuestList(updatedList);
                                                        }}
                                                    />
                                                </td>
                                                <td valign='top'>
                                                    <select value={gl.gender}
                                                        onChange={(e) => {
                                                            const updatedList = [...guestList];
                                                            updatedList[index].gender = e.target.value;
                                                            setGuestList(updatedList);
                                                        }}>
                                                        <option value="">--Select--</option>
                                                        <option value="male">Male</option>
                                                        <option value="female">Female</option>
                                                        <option value="transgender">Transgender</option>
                                                        <option value="others">Others</option>
                                                    </select>
                                                </td>
                                                <td valign='top'>
                                                    <input type="text"
                                                        placeholder='Guest Age'
                                                        value={gl.age}
                                                        onChange={(e) => {
                                                            const updatedList = [...guestList];
                                                            updatedList[index].age = e.target.value;
                                                            setGuestList(updatedList);
                                                        }}
                                                    />
                                                </td>
                                                <td valign='top'>
                                                    <div className='flex flex-col gap-1'>
                                                        <select value={gl.nationality}
                                                            onChange={(e) => {
                                                                const updatedList = [...guestList];
                                                                updatedList[index].nationality = e.target.value;
                                                                setGuestList(updatedList);
                                                            }}>
                                                            <option value="">--Select--</option>
                                                            <option value="india">India</option>
                                                            <option value="foriegn">Foriegn</option>
                                                        </select>
                                                        {
                                                            gl.nationality === "india" && (
                                                                <>
                                                                    <select value={gl.state}
                                                                        onChange={(e) => {
                                                                            const updatedList = [...guestList];
                                                                            updatedList[index].state = e.target.value;
                                                                            setGuestList(updatedList);
                                                                        }}>
                                                                        <option value="">--Select State --</option>
                                                                        {
                                                                        state.map((s, _)=>{
                                                                            return <option value={s._id}>{s.state_name}</option>
                                                                        })
                                                                    }
                                                                    </select>
                                                                    <select value={gl.city}
                                                                        onChange={(e) => {
                                                                            const updatedList = [...guestList];
                                                                            updatedList[index].city = e.target.value;
                                                                            setGuestList(updatedList);
                                                                        }}>
                                                                        <option value="">--Select City --</option>
                                                                    </select>
                                                                </>
                                                            )
                                                        }
                                                        {
                                                            gl.nationality === "foriegn" && (
                                                                <select value={gl.country}
                                                                    onChange={(e) => {
                                                                        const updatedList = [...guestList];
                                                                        updatedList[index].country = e.target.value;
                                                                        setGuestList(updatedList);
                                                                    }}>
                                                                    <option value="">--Select Country --</option>
                                                                    {
                                                                        country.map((c, _)=>{
                                                                            return <option value={c._id}>{c.country_name}</option>
                                                                        })
                                                                    }
                                                                </select>
                                                            )
                                                        }
                                                        {
                                                            gl.nationality && <input type="text"
                                                                placeholder='Enter Address'
                                                                value={gl.address}
                                                                onChange={(e) => {
                                                                    const updatedList = [...guestList];
                                                                    updatedList[index].address = e.target.value;
                                                                    setGuestList(updatedList);
                                                                }}
                                                            />
                                                        }
                                                    </div>
                                                </td>
                                                <td valign='top'>
                                                    <div className='flex flex-col gap-2'>
                                                        <select value={gl.idType}
                                                            onChange={(e) => {
                                                                const updatedList = [...guestList];
                                                                updatedList[index].idType = e.target.value;
                                                                setGuestList(updatedList);
                                                            }}>
                                                            <option value="">Select ID Type</option>
                                                            <option value="Aadhaar">Aadhaar</option>
                                                            <option value="Voter ID">Voter ID</option>
                                                            <option value="PAN">PAN</option>
                                                            <option value="Driving Licence">Driving Licence</option>
                                                            <option value="Passport">Passport</option>
                                                            <option value="Others">Others</option>
                                                        </select>
                                                        <div>
                                                            <input type="file" id={`idProof-${index}`} className='hidden'
                                                                onChange={async (e) => {
                                                                    const file = e.target.files[0];
                                                                    const fileBinary = await base64Data(file);

                                                                    const updatedList = [...guestList];
                                                                    updatedList[index].idProof = fileBinary
                                                                    setGuestList(updatedList);
                                                                }}
                                                            />
                                                            <label htmlFor={`idProof-${index}`} className='upload__label'>
                                                                {gl.idProof ? "Uploaded ✔" : "Upload ID Proof"}
                                                            </label>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td valign='top'>
                                                    <input type="text"
                                                        placeholder='Enter Guest ID Number'
                                                        value={gl.idNumber}
                                                        onChange={(e) => {
                                                            const updatedList = [...guestList];
                                                            updatedList[index].idNumber = e.target.value;
                                                            setGuestList(updatedList);
                                                        }}
                                                    />
                                                </td>
                                                <td valign='top'>
                                                    <input type="text"
                                                        placeholder='Enter Guest Mobile Number'
                                                        value={gl.mobileNumbe}
                                                        onChange={(e) => {
                                                            const updatedList = [...guestList];
                                                            updatedList[index].mobileNumbe = e.target.value;
                                                            setGuestList(updatedList);
                                                        }}
                                                    />
                                                </td>
                                                <td valign='top'>
                                                    <input type="text"
                                                        placeholder='Room Number'
                                                        value={gl.roomNumber}
                                                        onChange={(e) => {
                                                            const updatedList = [...guestList];
                                                            updatedList[index].roomNumber = e.target.value;
                                                            setGuestList(updatedList);
                                                        }}
                                                    />
                                                </td>
                                                <td>
                                                    <button
                                                        className="bg-red-500 text-white p-1 rounded text-lg"
                                                        title="Delete"
                                                        onClick={() => {
                                                            const updatedList = guestList.filter((_, i) => i !== index);
                                                            setGuestList(updatedList);
                                                            setCheckInDetails(pv => {
                                                                return { ...pv, NumberOfGuest: pv.NumberOfGuest - 1 }
                                                            })
                                                        }}
                                                    >
                                                        <Icons.DELETE />
                                                    </button>
                                                </td>
                                            </tr>
                                        })
                                    }
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td colSpan={10}>
                                            <button
                                                className='bg-[#003E32] text-white p-1 rounded text-sm flex items-center justify-center gap-1 w-full mt-3'
                                                title='Add More'
                                                onClick={() => {
                                                    setGuestList([...guestList, guestListSet])
                                                    setCheckInDetails(pv => {
                                                        return { ...pv, NumberOfGuest: parseInt(pv.NumberOfGuest) + 1 }
                                                    })
                                                }}
                                            >
                                                <Icons.ADD /> Add More
                                            </button>
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                        {/* ============================== TABLE END HERE ====================== */}
                        <div className='form__btn__grp mt-5'>
                            <button className='save__btn'>
                                <Icons.CHECK /> Submit
                            </button>
                            <button className='reset__btn'>
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

export default GuestEntry;
