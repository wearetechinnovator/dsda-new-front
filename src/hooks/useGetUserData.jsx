import { add } from "../store/userDetailSlice";
import { useDispatch } from "react-redux";
import Cookies from 'js-cookie';
import { useNavigate } from "react-router-dom";
import useMyToaster from './useMyToaster'


// run instend when login success;
const useGetUserData = () => {
  const dispatch = useDispatch();
  const nagivate = useNavigate();
  const toast = useMyToaster();

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

  return {getProfile};

}

export default useGetUserData;
