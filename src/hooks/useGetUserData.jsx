import { add } from "../store/userDetailSlice";
import { useDispatch } from "react-redux";
import Cookies from 'js-cookie';
import { addSetting } from "../store/settingSlice";



// Run when navbar load;
const useGetUserData = () => {
  const dispatch = useDispatch();

  const getProfile = async () => {
    const url = process.env.REACT_APP_MASTER_API + "/admin/get-users";
    const cookie = Cookies.get("token");
    const userId = Cookies.get("userId");

    const req = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({ token: cookie, userId: userId })
    })
    const res = await req.json();
    dispatch(add(res))
  }


  const getSetting = async () => {
    const url = process.env.REACT_APP_MASTER_API + "/site-setting/get";
    const cookie = Cookies.get("token");

    const req = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({ token: cookie })
    })
    const res = await req.json();
    dispatch(addSetting(res))
  }

  return { getProfile, getSetting };

}

export default useGetUserData;
