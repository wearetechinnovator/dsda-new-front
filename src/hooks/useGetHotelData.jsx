import { useDispatch } from "react-redux";
import Cookies from 'js-cookie';
import { addHotelDetails } from "../store/hotelSlice";


// Run when navbar load;
const useGetHotelData = () => {
  const dispatch = useDispatch();

  const getHotelData = async () => {
    const url = process.env.REACT_APP_MASTER_API + "/hotel/get";
    const token = Cookies.get("hotel-token");
    const hotelId = Cookies.get("hotelId");

    const req = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({
        hotelToken: token, id: hotelId
      })
    })
    const res = await req.json();
    dispatch(addHotelDetails(res))
  }

  return { getHotelData };
}

export default useGetHotelData;
