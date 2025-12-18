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
import checkfile from '../../helper/checkfile';
import StatesDistrictObj from '../../helper/states-and-districts';
import CountryList from '../../helper/countries'




const GuestEntry = () => {
    const navigate = useNavigate();
    const toast = useMyToaster();
    const settingDetails = useSelector((store) => store.settingSlice)
    const location = useLocation()
    const [state, setState] = useState([]);
    const [country, setCountry] = useState([]);
    const { guestMobile, numberOfGuests, verificationBy } = location.state || {};
    const [checkInDetails, setCheckInDetails] = useState({
        mobileNumbe: '', NumberOfGuest: '', checkInDate: '', checkInTime: '',
        checkoutDate: '', checkoutTime: ''
    });
    const guestListSet = {
        guestName: '', gender: '', age: '', dob: '', nationality: '', address: '', idType: '',
        idNumber: '', idProof: '', mobileNumber: '', roomNumber: '', country: "", state: '', district: '',
        photo: '', allDistrict: [],
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
        // 1) Returning back via navigate(-1) → location.state has stored form
        if (location.state?.guestList && location.state?.guestList.length > 0) {
            setGuestList(location.state.guestList);
            setCheckInDetails(location.state.checkInDetails);
            return; // ❗ DO NOT run initialization
        }

        // 2) First time open → initialize guest list
        const arr = Array.from({ length: numberOfGuests }).map((_, i) => ({
            ...guestListSet,
            mobileNumber: i === 0 ? guestMobile : ""
        }));

        setGuestList(arr);

        setCheckInDetails(prev => ({
            ...prev,
            NumberOfGuest: numberOfGuests,
            mobileNumbe: guestMobile,
            verificationBy
        }));
    }, []);


    // Get State and Country from helper OBJECT;
    useEffect(() => {
        const allStates = StatesDistrictObj.states.reduce((acc, i) => {
            acc.push(i.state);
            return acc;
        }, []);

        const allCountry = CountryList.map((c, _) => {
            return { label: c.name, value: c.name }
        });


        setCountry([...allCountry]);
        setState([...allStates]);
    }, [])


    // Get District
    const getDistrict = async (index, state) => {
        if (state) {
            const selectedState = StatesDistrictObj.states.find((d, _) => d.state === state);

            const allGuestList = [...guestList];
            allGuestList[index].allDistrict = [...selectedState.districts];
            setGuestList(allGuestList);
        } else {
            const allGuestList = [...guestList];
            allGuestList[index].allDistrict = [];
            setGuestList(allGuestList);
        }
    }



    const handleSubmit = async () => {
        // Basic Check-In details validation
        const checkInKeys = {
            "mobileNumbe": "Mobile Number", "NumberOfGuest": "Number of Guest",
            "checkInDate": "Check in Date", "checkInTime": "Check in Time",
            "checkoutDate": " Check out Date", "checkoutTime": " Check out Time"
        }
        for (const [key, label] of Object.entries(checkInKeys)) {
            const value = checkInDetails[key];

            if (
                value === undefined ||
                value === null ||
                (typeof value === "string" && value.trim() === "")
            ) {
                return toast(`${label} is required`, "error");
            }
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
                if (guest.nationality === "india") {
                    if (!guest.state) errors.state = true;
                    if (!guest.district) errors.district = true;
                    if (!guest.address) errors.address = true;
                } else {
                    if (!guest.country) errors.country = true;
                    if (!guest.address) errors.address = true;
                }

                // if (!guest.idProof) errors.idProof = true;
                // if (!guest.mobileNumbe) errors.mobileNumbe = true;
                if (!guest.roomNumber) errors.roomNumber = true;
            }
            else {
                // Other guests: only name, gender, and age required
                if (!guest.guestName) errors.guestName = true;
                if (!guest.gender) errors.gender = true;
                if (!guest.age) errors.age = true;
                if (guest.nationality === "india") {
                    if (!guest.state) errors.state = true;
                    if (!guest.district) errors.district = true;
                    // if (!guest.address) errors.address = true;
                } else {
                    if (!guest.country) errors.country = true;
                    // if (!guest.address) errors.address = true;
                }
            }

            newGuestErrors[i] = errors;
        }

        setGuestErrors(newGuestErrors);

        // Check if any guest has missing fields
        const hasError = newGuestErrors.some(e => Object.keys(e).length > 0);
        if (hasError) {
            return toast("Please fill all required fields", "error");
        }

        // Goto Final submit.......
        const hotelId = Cookies.get('hotelId');
        const token = Cookies.get('hotel-token');

        navigate(location.pathname, {
            state: { checkInDetails, guestList },
            replace: true
        });

        navigate('/hotel/check-in/guest-entry/bill-details', {
            state: {
                ...checkInDetails, guestList, hotelId, token,
            }
        });

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
                                    min={minDate?.toISTString().split("T")[0]}
                                    max={today.toISTString().split("T")[0]}
                                    onChange={(e) => {
                                        const selectedDate = e.target.value;

                                        if (selectedDate < minDate?.toISTString().split("T")[0] || selectedDate > today.toISTString().split("T")[0]) {
                                            toast("Please select a valid date between 2 days ago and today.", "error");
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
                                    step="1"
                                    onChange={(e) => setCheckInDetails({
                                        ...checkInDetails, checkInTime: e.target.value
                                    })}
                                />
                            </div>

                            <div className='w-full'>
                                <p>Check Out Date<span className='required__text'>*</span></p>
                                <input
                                    type="date"
                                    placeholder="Enter Date"
                                    value={checkInDetails.checkoutDate}
                                    min={checkInDetails.checkInDate || minDate?.toISTString().split("T")[0]} // minimum date (e.g., 2 days before today)
                                    onChange={(e) => {
                                        const selectedDate = e.target.value;
                                        const min = minDate?.toISTString().split("T")[0];

                                        if (!checkInDetails.checkInDate) {
                                            toast("Please select a check-in date first.", "error");
                                            return;
                                        }

                                        // prevent manual typing of invalid (too early) dates
                                        if (selectedDate < checkInDetails.checkInDate) {
                                            toast(`Checkout date cannot be before check-in date (${checkInDetails.checkInDate}).`, "error");
                                            return;
                                        }

                                        setCheckInDetails({
                                            ...checkInDetails,
                                            checkoutDate: selectedDate,
                                        });
                                    }}
                                />
                            </div>
                            <div className='w-full'>
                                <p>Check Out Time<span className='required__text'>*</span></p>
                                <input type='time'
                                    placeholder='Enter Time'
                                    step="1"
                                    value={checkInDetails.checkoutTime}
                                    onChange={(e) => {
                                        const checkinDate = new Date(checkInDetails.checkInDate);
                                        const checkoutDate = new Date(checkInDetails.checkoutDate);

                                        // Set the new checkout time the user selected
                                        const [hours, minutes] = e.target.value.split(":");
                                        checkoutDate.setHours(hours, minutes, 0, 0);

                                        const checkinTime = new Date(checkinDate);
                                        const [h2, m2] = checkInDetails.checkInTime.split(":");
                                        checkinTime.setHours(h2, m2, 0, 0);

                                        // ❌ If checkout <= checkin → block
                                        if (checkoutDate.getTime() <= checkinTime.getTime()) {
                                            return toast("You can't checkout earlier or same time", "error");
                                        }

                                        // ✅ Otherwise, save
                                        setCheckInDetails({
                                            ...checkInDetails,
                                            checkoutTime: e.target.value
                                        });

                                    }}
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
                                        <td className='w-[7%]'>Guest Photo*</td>
                                        <td className='w-[7%]'>Gender*</td>
                                        <td className='w-[3%]'>DOB/Age*</td>
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
                                                    <input type="file" id={`photo-${index}`} className='hidden'
                                                        onChange={async (e) => {
                                                            const file = e.target.files[0];

                                                            const check = await checkfile(file, ["jpg", "png", 'jpeg'], 0.2);
                                                            if (check !== true) {
                                                                toast(check, "error");
                                                                return;
                                                            }
                                                            const fileBinary = await base64Data(file);

                                                            const updatedList = [...guestList];
                                                            updatedList[index].photo = fileBinary
                                                            setGuestList(updatedList);
                                                        }}
                                                    />
                                                    <GuestEntryDocUpload
                                                        forId={`photo-${index}`}
                                                        idProof={gl.photo}
                                                        onRemove={() => {
                                                            const updatedList = [...guestList];
                                                            updatedList[index].photo = ""
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

                                                            setGuestErrors((prev) => {
                                                                const newErrors = [...prev];
                                                                if (newErrors[index]) delete newErrors[index].gender;
                                                                return newErrors;
                                                            });
                                                        }}>
                                                        <option value="">--Select--</option>
                                                        <option value="Male">Male</option>
                                                        <option value="Female">Female</option>
                                                        <option value="Transgender">Transgender</option>
                                                        <option value="Others">Others</option>
                                                    </select>
                                                    {guestErrors[index]?.gender && (
                                                        <span className="required">*This fields is required</span>
                                                    )}
                                                </td>
                                                <td valign='top'>
                                                    <input type="date"
                                                        placeholder='DOB'
                                                        value={gl.dob}
                                                        max={today.toISOString().split("T")[0]}
                                                        onChange={(e) => {
                                                            const selectedDate = e.target.value;
                                                            const updatedList = [...guestList];
                                                            updatedList[index].dob = selectedDate;

                                                            // --- Calculate age ---
                                                            const today = new Date();
                                                            const birthDate = new Date(selectedDate);
                                                            let age = today.getFullYear() - birthDate.getFullYear();
                                                            const monthDiff = today.getMonth() - birthDate.getMonth();

                                                            if (
                                                                monthDiff < 0 ||
                                                                (monthDiff === 0 && today.getDate() < birthDate.getDate())
                                                            ) {
                                                                age--;
                                                            }

                                                            updatedList[index].age = age;
                                                            setGuestList(updatedList);
                                                        }}
                                                    />
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
                                                    <div className='flex flex-col'>
                                                        <select value={gl.nationality}
                                                            onChange={(e) => {
                                                                const updatedList = [...guestList];
                                                                updatedList[index].nationality = e.target.value;
                                                                setGuestList(updatedList);

                                                                setGuestErrors((prev) => {
                                                                    const newErrors = [...prev];
                                                                    if (newErrors[index]) delete newErrors[index].nationality;
                                                                    return newErrors;
                                                                });
                                                            }}>
                                                            <option value="">--Select--</option>
                                                            <option value="india">Indian</option>
                                                            <option value="foreign">Foreign</option>
                                                        </select>
                                                        {guestErrors[index]?.nationality && (
                                                            <span className="required">*This fields is required</span>
                                                        )}
                                                        {
                                                            gl.nationality === "india" && (
                                                                <>
                                                                    <SelectPicker
                                                                        block
                                                                        data={state?.map(s => ({
                                                                            label: s,
                                                                            value: s
                                                                        })) || []}
                                                                        style={{ width: '100%' }}
                                                                        value={gl.state}
                                                                        onChange={(v) => {
                                                                            const updatedList = [...guestList];
                                                                            updatedList[index].state = v;
                                                                            setGuestList(updatedList);
                                                                            getDistrict(index, v)

                                                                            setGuestErrors((prev) => {
                                                                                const newErrors = [...prev];
                                                                                if (newErrors[index]) delete newErrors[index].state;
                                                                                return newErrors;
                                                                            });
                                                                        }}
                                                                        placeholder="Select State"
                                                                        searchable
                                                                        cleanable
                                                                        placement="auto"
                                                                    />
                                                                    {guestErrors[index]?.state && (
                                                                        <span className="required">*This fields is required</span>
                                                                    )}
                                                                    <SelectPicker
                                                                        block
                                                                        data={guestList[index].allDistrict?.map(d => ({
                                                                            label: d,
                                                                            value: d
                                                                        })) || []}
                                                                        style={{ width: '100%' }}
                                                                        value={gl.district}
                                                                        onChange={(v) => {
                                                                            const updatedList = [...guestList];
                                                                            updatedList[index].district = v;
                                                                            setGuestList(updatedList);

                                                                            setGuestErrors((prev) => {
                                                                                const newErrors = [...prev];
                                                                                if (newErrors[index]) delete newErrors[index].district;
                                                                                return newErrors;
                                                                            });
                                                                        }}
                                                                        placeholder="Select District"
                                                                        searchable
                                                                        cleanable
                                                                        placement="auto"
                                                                    />
                                                                    {guestErrors[index]?.district && (
                                                                        <span className="required">*This fields is required</span>
                                                                    )}
                                                                </>
                                                            )
                                                        }
                                                        {
                                                            gl.nationality === "foreign" && <>
                                                                <SelectPicker
                                                                    block
                                                                    data={country || []}
                                                                    style={{ width: '100%' }}
                                                                    value={gl.country}
                                                                    onChange={(v) => {
                                                                        const updatedList = [...guestList];
                                                                        updatedList[index].country = v;
                                                                        setGuestList(updatedList);


                                                                        setGuestErrors((prev) => {
                                                                            const newErrors = [...prev];
                                                                            if (newErrors[index]) delete newErrors[index].country;
                                                                            return newErrors;
                                                                        });
                                                                    }}
                                                                    placeholder="Select Country"
                                                                    searchable
                                                                    cleanable
                                                                    placement="bottomEnd"
                                                                />
                                                                {guestErrors[index]?.country && (
                                                                    <span className="required">*This fields is required</span>
                                                                )}

                                                            </>
                                                        }
                                                        {
                                                            gl.nationality && <>
                                                                <input type="text"
                                                                    placeholder='Enter Address'
                                                                    value={gl.address}
                                                                    onChange={(e) => {
                                                                        const updatedList = [...guestList];
                                                                        updatedList[index].address = e.target.value;
                                                                        setGuestList(updatedList);

                                                                        // setGuestErrors((prev) => {
                                                                        //     const newErrors = [...prev];
                                                                        //     if (newErrors[index]) delete newErrors[index].address;
                                                                        //     return newErrors;
                                                                        // });
                                                                    }}
                                                                />
                                                                {/* {guestErrors[index]?.address && (
                                                                    <span className="required">*This fields is required</span>
                                                                )} */}
                                                            </>

                                                        }
                                                        {
                                                            index > 0 && (
                                                                <button
                                                                    className='text-[9px] bg-blue-400 p-1 text-white rounded mt-3'
                                                                    onClick={() => {
                                                                        const prevIndex = index - 1

                                                                        const updatedList = [...guestList];

                                                                        updatedList[index].nationality = updatedList[prevIndex].nationality;
                                                                        if (updatedList[index].nationality === "india") {

                                                                            updatedList[index].state = updatedList[prevIndex].state;

                                                                            if (updatedList[index].state) {
                                                                                getDistrict(index, updatedList[index].state)
                                                                                updatedList[index].district = updatedList[prevIndex].district;
                                                                            }


                                                                        } else {
                                                                            updatedList[index].country = updatedList[prevIndex].country;
                                                                        }

                                                                        updatedList[index].address = updatedList[prevIndex].address;

                                                                        setGuestList(updatedList);
                                                                    }}
                                                                >
                                                                    Same as above
                                                                </button>
                                                            )
                                                        }
                                                    </div>
                                                </td>
                                                <td valign='top'>
                                                    <div className='flex flex-col'>
                                                        <select value={gl.idType}
                                                            onChange={(e) => {
                                                                const updatedList = [...guestList];
                                                                updatedList[index].idType = e.target.value;
                                                                setGuestList(updatedList);

                                                                setGuestErrors((prev) => {
                                                                    const newErrors = [...prev];
                                                                    if (newErrors[index]) delete newErrors[index].idType;
                                                                    return newErrors;
                                                                });
                                                            }}>
                                                            <option value="">--Select--</option>
                                                            <option value="Aadhaar">Aadhaar</option>
                                                            <option value="Voter ID">Voter ID</option>
                                                            <option value="PAN">PAN</option>
                                                            <option value="Driving Licence">Driving Licence</option>
                                                            <option value="Passport">Passport</option>
                                                            <option value="Others">Others</option>
                                                        </select>
                                                        {guestErrors[index]?.idType && (
                                                            <span className="required">*This fields is required</span>
                                                        )}
                                                        <input type="text"
                                                            placeholder='Enter ID No.'
                                                            value={gl.idNumber}
                                                            onChange={(e) => {
                                                                const updatedList = [...guestList];
                                                                updatedList[index].idNumber = e.target.value;
                                                                setGuestList(updatedList);

                                                                setGuestErrors((prev) => {
                                                                    const newErrors = [...prev];
                                                                    if (newErrors[index]) delete newErrors[index].idNumber;
                                                                    return newErrors;
                                                                });
                                                            }}
                                                        />
                                                        {guestErrors[index]?.idNumber && (
                                                            <span className="required">*This fields is required</span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td valign='top'>
                                                    <input type="file" id={`idProof-${index}`} className='hidden'
                                                        onChange={async (e) => {
                                                            const file = e.target.files[0];
                                                            const check = await checkfile(file, ["jpg", "png", 'jpeg'], 0.2);
                                                            if (check !== true) return toast(check, "error");

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
                            <button className='reset__btn' onClick={() => window.location.reload()}>
                                <Icons.RESET />
                                Reset
                            </button>
                            <button className='save__btn' onClick={handleSubmit}>
                                <Icons.CHECK /> Submit
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}

export default GuestEntry;
