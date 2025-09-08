import React, { useEffect, useRef, useState } from 'react';
import { IoAddCircleSharp, IoClose } from "react-icons/io5";
import useMyToaster from '../hooks/useMyToaster';
import Cookies from 'js-cookie';
import { IoIosSearch } from "react-icons/io";
import { useDispatch, useSelector } from 'react-redux';
import { FaArrowRight } from "react-icons/fa6";
import { Drawer } from 'rsuite';
import { AddDisctrictComponent } from '../pages/Locations/district/AddDistrict';
import { ZoneComponent } from '../pages/Locations/zone/AddZone';
import { PoliceStationComponent } from '../pages/Locations/policeStation/AddPoliceStation';
import { SectorComponent } from '../pages/Locations/sector/AddSector';
import { BlockComponent } from '../pages/Locations/block/AddBlock';



const MySelect2 = ({ model, onType, value }) => {
  const dispatch = useDispatch();
  const toast = useMyToaster();
  const [selectedValue, setSelectedValue] = useState('');
  const [selectedData, setSelectedData] = useState()
  const [showDropDown, setShowDropDown] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [searchList, setSearchList] = useState([]);
  const [drawer, setDrawer] = useState(false);
  const debounceTime = useRef(null);
  const [loading, setLoading] = useState(false);
  const [keyCount, setKeyCount] = useState(0);
  const pageTitle = {
    zone: "Add Zone",
    district: 'Add District',
    'police-station': 'Add Police Station',
    sector: 'Add Sector',
    block: 'Add Block'
  }
  const pageComponent = {
    zone: <ZoneComponent/>,
    district: <AddDisctrictComponent/>,
    'police-station': <PoliceStationComponent/>,
    sector: <SectorComponent/>,
    block: <BlockComponent/>
  }


  useEffect(() => {
    if (selectedData) {
      setSelectedValue(selectedData.title || selectedData.name);
      onType(selectedData._id);
    }

  }, [selectedData])


  // if alredy value define
  useEffect(() => {
    if (value) {
      const get = async () => {
        try {
          const url = process.env.REACT_APP_MASTER_API + `/${model}/get`;
          const req = await fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": 'application/json'
            },
            body: JSON.stringify({ token: Cookies.get("token"), id: value })
          })
          const res = await req.json();

          setSelectedData(res.data || res)

        } catch (error) {
          return toast("Something went wrong", 'error')
        }

      }

      get()
    }

  }, [value])




  // Search data
  const searchData = (v) => {
    if (debounceTime.current) {
      clearTimeout(debounceTime.current);
    }
    setLoading(true)
    debounceTime.current = setTimeout(async () => {

      try {
        const url = process.env.REACT_APP_MASTER_API + `/${model}/get`;
        const req = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": 'application/json'
          },
          body: JSON.stringify({ token: Cookies.get("token"), search: v })
        })
        const res = await req.json();
        setLoading(false);

        if (req.status === 200) {
          res.length > 0 ? setSearchList([...res]) : setSearchList(["No result found"]);
        }
        else {
          setSearchList([])
        }

      } catch (er) {
        console.log('Someting went wrong', er);
      }

    }, 200);
  };


  const closeDrawer = (save) => {
    if (save) {
      setDrawer(false);
    }
  }



  const keyUp = (e) => {
    if (e.key === "Enter") {
      if (searchList.length > 0) {
        setSelectedData(searchList[keyCount]);
        setShowDropDown(false);
      }
    }

    if (e.key === "Escape") {
      setShowDropDown(false);
      setKeyCount(0);
    }

    if (e.key === "ArrowDown") {
      if (keyCount <= searchList.length - 1) {
        setKeyCount((prev) => {
          setSelectedData(searchList[keyCount]);
          console.log(keyCount)
          return prev + 1 ? prev + 1 : 0;
        });
      }
    }


    if (e.key === "ArrowUp") {
      if (keyCount > 0) {
        setKeyCount((prev) => prev - 1);
        setSelectedData(searchList[keyCount]);
      }
    }

  }


  return (
    <>
      <div className='relative'>
        <Drawer
          onClose={() => setDrawer(false)}
          open={drawer}
          size={"sm"}
        >
          <Drawer.Header>
            <Drawer.Actions>
              <p className='text-lg font-bold'>{pageTitle[model]}</p>
            </Drawer.Actions>
          </Drawer.Header>
          <Drawer.Body>
            {pageComponent[model]}
          </Drawer.Body>
        </Drawer>

        <input type="text"
          className='w-full border rounded-[3px]'
          value={selectedValue || searchText}
          onFocus={() => setShowDropDown(true)}
          onBlur={() => {
            setShowDropDown(false);
            setKeyCount(0);
          }}
          onChange={(e) => {
            setSearchText(e.target.value);
            searchData(e.target.value)
            setKeyCount(0);
          }}
          placeholder='Search...'
          onKeyDown={keyUp}
        />
        {selectedValue ? <IoClose
          className='absolute right-2 top-[5px] text-[16px] cursor-pointer'
          onClick={() => {
            setKeyCount(0);
            setSelectedValue("")
            setSelectedData()
            setSearchText('')
            setSearchList([]);
            onType('');
          }}
        /> : <IoIosSearch className='absolute right-2 top-[5px] text-[16px] cursor-pointer' />}

        {/* List dropdown */}
        {showDropDown && <div
          className='w-full max-h-[250px] overflow-y-auto bg-white absolute z-[9999999] rounded mt-1'
          style={{ boxShadow: "0px 0px 5px lightgray" }}>
          <ul>
            {loading && <li className='p-2 text-center'>Searching...</li>}
            {
              searchList.map((d, i) => {
                return <li
                  key={i}
                  onMouseDown={() => setSelectedData(d)}
                  className={`${model === "item" ? 'p-3' : 'p-1 px-2'}  cursor-pointer`}
                >
                  {(d.title || d.name) || d}
                </li>
              })
            }
          </ul>
          <button
            onMouseDown={() => {
                setDrawer(true)
            }}
            className='select__add__button z-50'>
            <IoAddCircleSharp />
            Add New
            <FaArrowRight className='text-[15px]' />
          </button>
        </div>}
      </div>

    </>
  )
}



export default MySelect2;
