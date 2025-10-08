import Nav from '../../components/Hotel/Nav';
import SideNav from '../../components/Hotel/HotelSideNav'
import { Icons } from '../../helper/icons';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import base64Data from '../../helper/getBase64';
import useMyToaster from '../../hooks/useMyToaster';
import Cookies from 'js-cookie';
import { SelectPicker, TimePicker } from 'rsuite';
import { useSelector } from 'react-redux';
import GuestEntryDocUpload from '../../components/Hotel/GuestEntryDocUpload';


const GuestEntry = () => {
    const navigate = useNavigate();
    const toast = useMyToaster();
    const settingDetails = useSelector((store) => store.settingSlice)
    const location = useLocation()
    const [state, setState] = useState([]);
    const [country, setCountry] = useState([]);
    const { guestMobile, numberOfGuests, verificationBy } = location.state || {};
    const [checkInDetails, setCheckInDetails] = useState({
        mobileNumbe: '', NumberOfGuest: '', checkInDate: '', checkInTime: ''
    });
    const guestListSet = {
        guestName: '', gender: '', age: "", nationality: '', address: '', idType: '',
        idNumber: '', idProof: '', mobileNumber: '', roomNumber: '', country: "", state: '', city: ''
    }
    const [guestList, setGuestList] = useState([]);
    const [minDate, setMinDate] = useState(null);
    const today = new Date();
    const [guestErrors, setGuestErrors] = useState([]);



    // Get Checkin Checkout date from setting;
    useEffect(() => {
        if (settingDetails?.day_for_checkin_checkout) {
            const min = new Date(
                Date.now() - settingDetails.day_for_checkin_checkout * 24 * 60 * 60 * 1000
            );
            setMinDate(min);
        }
    }, [settingDetails]);


    // Set Table rows;
    useEffect(() => {
        Array.from({ length: numberOfGuests }).forEach((v, i) => {
            setGuestList((prev) => [...prev, { ...guestListSet, mobileNumber: i === 0 ? guestMobile : '', }]);
        });
        setCheckInDetails({
            ...checkInDetails,
            NumberOfGuest: numberOfGuests,
            mobileNumbe: guestMobile,
            verificationBy
        })
    }, [location.state])


    // Get Country and State
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


    const handleSubmit = async () => {
        // Basic Check-In details validation
        if ([checkInDetails.mobileNumbe, checkInDetails.NumberOfGuest, checkInDetails.checkInDate, checkInDetails.checkInTime].some(field => field === '')) {
            return toast("All check-in fields are required", "error");
        }

        let newGuestErrors = [];
        for (let i = 0; i < guestList.length; i++) {
            const guest = guestList[i];
            const errors = {};

            if (i === 0) {
                // Head guest: all fields required
                if (!guest.guestName) errors.guestName = true;
                if (!guest.gender) errors.gender = true;
                if (!guest.age) errors.age = true;
                if (!guest.nationality) errors.nationality = true;
                if (!guest.address) errors.address = true;
                if (!guest.idType) errors.idType = true;
                if (!guest.idNumber) errors.idNumber = true;
                // if (!guest.idProof) errors.idProof = true;
                // if (!guest.mobileNumbe) errors.mobileNumbe = true;
                if (!guest.roomNumber) errors.roomNumber = true;
            } else {
                // Other guests: only name, gender, and age required
                if (!guest.guestName) errors.guestName = true;
                if (!guest.gender) errors.gender = true;
                if (!guest.age) errors.age = true;
            }

            newGuestErrors[i] = errors;
        }

        setGuestErrors(newGuestErrors);

        // Check if any guest has missing fields
        const hasError = newGuestErrors.some(e => Object.keys(e).length > 0);
        // if (hasError) {
        //     return toast("Please fill all required fields", "error");
        // }


        // Goto Final submit.......
        const hotelId = Cookies.get('hotelId');
        const token = Cookies.get('hotel-token');
        navigate('/hotel/check-in/guest-entry/bill-details', {
            state: { ...checkInDetails, guestList, hotelId, token }
        });


    }

    const clearData = () => {

    }

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
                                />
                            </div>
                            <div>
                                <p>Number of Guests<span className='required__text'>*</span></p>
                                <input type='text'
                                    placeholder='Enter Number of Guests'
                                    value={checkInDetails.NumberOfGuest}
                                />
                            </div>
                            <div>
                                <p>Check In Date<span className='required__text'>*</span></p>
                                <input
                                    type="date"
                                    placeholder="Enter Check In Date"
                                    value={checkInDetails.checkInDate}
                                    min={minDate?.toISOString().split("T")[0]} // 2 days before today
                                    max={today.toISOString().split("T")[0]}   // today
                                    onChange={(e) => {
                                        const selectedDate = e.target.value;

                                        // extra safeguard: prevent manual typing of invalid date
                                        if (selectedDate < minDate?.toISOString().split("T")[0] || selectedDate > today.toISOString().split("T")[0]) {
                                            alert("Please select a valid date between 2 days ago and today.");
                                            return;
                                        }

                                        setCheckInDetails({
                                            ...checkInDetails,
                                            checkInDate: selectedDate,
                                        });
                                    }}
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
                        <div className='overflow-x-auto list__table mt-5 list__table__checkin'>
                            <table className='min-w-full bg-white' id='table' >
                                <thead className='bg-gray-100 list__table__head'>
                                    <tr>
                                        <td align='center' className='w-[2%]'>#</td>
                                        <td className='w-[16%]'>Guest Name*</td>
                                        <td className='w-[7%]'>Gender*</td>
                                        <td className='w-[5%]'>Age*</td>
                                        <td className='w-[6%]'>Nationality*</td>
                                        <td className='w-[8%]'>ID Type/No.*</td>
                                        <td className='w-[7%]'>ID Proof*</td>
                                        <td className='w-[8%]'>Mobile No.*</td>
                                        <td className='w-[6%]'>Room No.*</td>
                                        <td align='center' width={"1%"}></td>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        guestList.map((gl, index) => {
                                            return <tr align='center' key={index}>
                                                <td>{index + 1}</td>
                                                <td valign='top'>
                                                    <input type="text"
                                                        placeholder={index === 0 ? "Enter Head Guest Name" : 'Enter Guest Name'}
                                                        value={gl.guestName}
                                                        onChange={(e) => {
                                                            const updatedList = [...guestList];
                                                            updatedList[index].guestName = e.target.value;
                                                            setGuestList(updatedList);

                                                            setGuestErrors((prev) => {
                                                                const newErrors = [...prev];
                                                                if (newErrors[index]) delete newErrors[index].guestName;
                                                                return newErrors;
                                                            });
                                                        }}
                                                    />
                                                    {guestErrors[index]?.guestName && (
                                                        <span className="required">*This fields is required</span>
                                                    )}
                                                </td>
                                                <td valign='top'>
                                                    <select value={gl.gender}
                                                        onChange={(e) => {
                                                            const updatedList = [...guestList];
                                                            updatedList[index].gender = e.target.value;
                                                            setGuestList(updatedList);

                                                            setGuestErrors((prev) => {
                                                                const newErrors = [...prev];
                                                                if (newErrors[index]) delete newErrors[index].gender;
                                                                return newErrors;
                                                            });
                                                        }}>
                                                        <option value="">--Select--</option>
                                                        <option value="male">Male</option>
                                                        <option value="female">Female</option>
                                                        <option value="transgender">Transgender</option>
                                                        <option value="others">Others</option>
                                                    </select>
                                                    {guestErrors[index]?.gender && (
                                                        <span className="required">*This fields is required</span>
                                                    )}
                                                </td>
                                                <td valign='top'>
                                                    <input type="number"
                                                        placeholder='Age'
                                                        value={gl.age}
                                                        onChange={(e) => {
                                                            const updatedList = [...guestList];
                                                            updatedList[index].age = e.target.value;
                                                            setGuestList(updatedList);

                                                            setGuestErrors((prev) => {
                                                                const newErrors = [...prev];
                                                                if (newErrors[index]) delete newErrors[index].age;
                                                                return newErrors;
                                                            });
                                                        }}
                                                    />
                                                    {guestErrors[index]?.age && (
                                                        <span className="required">*This fields is required</span>
                                                    )}
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
                                                                    <SelectPicker
                                                                        block
                                                                        data={state?.map(s => ({
                                                                            label: s.state_name,
                                                                            value: s.state_name
                                                                        })) || []}
                                                                        style={{ width: '100%' }}
                                                                        value={gl.state}
                                                                        onChange={(v) => {
                                                                            const updatedList = [...guestList];
                                                                            updatedList[index].state = v;
                                                                            setGuestList(updatedList);

                                                                        }}
                                                                        placeholder="Select State"
                                                                        searchable
                                                                        cleanable
                                                                        placement="auto"
                                                                    />
                                                                    <input type="text"
                                                                        placeholder='Enter City'
                                                                        value={gl.city}
                                                                        onChange={(e) => {
                                                                            const updatedList = [...guestList];
                                                                            updatedList[index].city = e.target.value;
                                                                            setGuestList(updatedList);
                                                                        }}
                                                                    />
                                                                </>
                                                            )
                                                        }
                                                        {
                                                            gl.nationality === "foriegn" && (
                                                                <SelectPicker
                                                                    block
                                                                    data={country?.map(t => ({
                                                                        label: t.country_name,
                                                                        value: t._id
                                                                    })) || []}
                                                                    style={{ width: '100%' }}
                                                                    value={gl.country}
                                                                    onChange={(v) => {
                                                                        const updatedList = [...guestList];
                                                                        updatedList[index].country = v;
                                                                        setGuestList(updatedList);
                                                                    }}
                                                                    placeholder="Select Country"
                                                                    searchable
                                                                    cleanable
                                                                    placement="auto"
                                                                />
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
                                                    {guestErrors[index]?.nationality && (
                                                        <span className="required">*This fields is required</span>
                                                    )}
                                                </td>
                                                <td valign='top'>
                                                    <div className='flex flex-col gap-2'>
                                                        <select value={gl.idType}
                                                            onChange={(e) => {
                                                                const updatedList = [...guestList];
                                                                updatedList[index].idType = e.target.value;
                                                                setGuestList(updatedList);
                                                            }}>
                                                            <option value="">--Select--</option>
                                                            <option value="Aadhaar">Aadhaar</option>
                                                            <option value="Voter ID">Voter ID</option>
                                                            <option value="PAN">PAN</option>
                                                            <option value="Driving Licence">Driving Licence</option>
                                                            <option value="Passport">Passport</option>
                                                            <option value="Others">Others</option>
                                                        </select>
                                                        <input type="text"
                                                            placeholder='Enter ID No.'
                                                            value={gl.idNumber}
                                                            onChange={(e) => {
                                                                const updatedList = [...guestList];
                                                                updatedList[index].idNumber = e.target.value;
                                                                setGuestList(updatedList);
                                                            }}
                                                        />
                                                    </div>
                                                    {guestErrors[index]?.idType && (
                                                        <span className="required">*This fields is required</span>
                                                    )}
                                                </td>
                                                <td valign='top'>
                                                    <input type="file" id={`idProof-${index}`} className='hidden'
                                                        onChange={async (e) => {
                                                            const file = e.target.files[0];
                                                            const fileBinary = await base64Data(file);

                                                            const updatedList = [...guestList];
                                                            updatedList[index].idProof = fileBinary
                                                            setGuestList(updatedList);
                                                        }}
                                                    />
                                                    <GuestEntryDocUpload
                                                        forId={`idProof-${index}`}
                                                        idProof={gl.idProof}
                                                        onRemove={() => {
                                                            const updatedList = [...guestList];
                                                            updatedList[index].idProof = ""
                                                            setGuestList(updatedList);
                                                        }}
                                                    />
                                                </td>
                                                <td valign='top'>
                                                    <input type="text"
                                                        placeholder='Enter Guest Mobile Number'
                                                        value={index === 0 ? checkInDetails.mobileNumbe : gl.mobileNumber}
                                                        onChange={index === 0 ? null : (e) => {
                                                            const updatedList = [...guestList];
                                                            updatedList[index].mobileNumber = e.target.value;
                                                            setGuestList(updatedList);
                                                        }}
                                                    />
                                                </td>
                                                <td valign='top'>
                                                    <input type="text"
                                                        placeholder='Enter No.'
                                                        value={gl.roomNumber}
                                                        onChange={(e) => {
                                                            const updatedList = [...guestList];
                                                            updatedList[index].roomNumber = e.target.value;
                                                            setGuestList(updatedList);

                                                            setGuestErrors((prev) => {
                                                                const newErrors = [...prev];
                                                                if (newErrors[index]) delete newErrors[index].roomNumber;
                                                                return newErrors;
                                                            });
                                                        }}
                                                    />
                                                    {guestErrors[index]?.roomNumber && (
                                                        <span className="required">*This fields is required</span>
                                                    )}
                                                </td>
                                                <td align='center'>
                                                    {index !== 0 && <button
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
                                                    </button>}
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
                            <button className='save__btn' onClick={handleSubmit}>
                                <Icons.CHECK /> Submit
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

export default GuestEntry;
