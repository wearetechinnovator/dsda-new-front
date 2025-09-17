import Cookies from 'js-cookie';
import { Outlet, useNavigate } from 'react-router-dom';
import useMyToaster from '../../hooks/useMyToaster';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';


const ProtectRoute = () => {
  const toast = useMyToaster();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const userData = useSelector(state => state.userDetail);

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      toast("You need to login first", "error");
      return navigate("/admin");
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
          return navigate("/admin");
        }

        setLoading(false);
      } catch (error) {
        console.log(error);
        toast("Something went wrong", "error");
        return navigate("/admin");
      }
    };

    checkToken();
  }, [navigate, toast, userData]);

  if (loading) {
    return <p>Loading...</p>;
  }

  return <Outlet />; 
};

export default ProtectRoute;




const UnProtectRoute = ({ children }) => {
  const token = Cookies.get("token");
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
          navigate("/admin/dashboard");
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

export { ProtectRoute, UnProtectRoute };

