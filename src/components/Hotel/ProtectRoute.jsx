import Cookies from 'js-cookie';
import { Outlet, useNavigate } from 'react-router-dom';
import useMyToaster from '../../hooks/useMyToaster';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';


const ProtectHotelRoute = () => {
  const toast = useMyToaster();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const userData = useSelector(state => state.userDetail);

  useEffect(() => {
    const token = Cookies.get("hotel-token");
    if (!token) {
      toast("You need to login first", "error");
      return navigate("/hotel");
    }

    const checkToken = async () => {
      try {
        const url = process.env.REACT_APP_MASTER_API + "/admin/check-token";
        const req = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ token })
        });

        const res = await req.json();
        if (req.status !== 200 || res.err) {
          toast(res.err || "Invalid session", "error");
          return navigate("/hotel");
        }

        setLoading(false);
      } catch (error) {
        console.log(error);
        toast("Something went wrong", "error");
        return navigate("/hotel");
      }
    };

    checkToken();
  }, [navigate, toast, userData]);

  if (loading) {
    return <p>Loading...</p>;
  }

  return <Outlet />; 
};


const UnProtectHotelRoute = ({ children }) => {
  const token = Cookies.get("hotel-token");
  const navigate = useNavigate();


  useEffect(() => {
    const checkToken = async () => {
      try {
        const url = process.env.REACT_APP_MASTER_API + "/admin/check-token";
        const req = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ token })
        });

        const res = await req.json();
        if (req.status === 200 || !res.err) {
          navigate("/hotel/dashboard");
        }

      } catch (error) {
        console.log("[*Error]", error)
        // navigate("/admin");
      }
    }

    checkToken();

  }, [token])

  return (
    <>
      {children}
    </>
  )
}

export { ProtectHotelRoute, UnProtectHotelRoute };

