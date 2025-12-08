import Cookies from 'js-cookie';
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import useMyToaster from '../../hooks/useMyToaster';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';


const ProtectRoute = () => {
  const { pathname } = useLocation()
  const toast = useMyToaster();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const userData = useSelector(state => state.userDetail);

  const nonAdminRoutes = [
    "/admin/profile",
    "/admin/dashboard",
    "/admin/report/hotel-list",
    "/admin/report/bed-availablity",
    "/admin/report/tourist-data/footfall",
    "/admin/report/tourist-data/footfall-hotel",
    "/admin/report/tourist-data/footfall-hotel/today",
    "/admin/report/tourist-data/tourist-details",
  ];

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

    // =======================[ROLE BASED ACCESSED]=======================
    // ===================================================================
    let role = userData.role;
    if (role && role !== "Administrator") {
      if (!nonAdminRoutes.some(route => pathname.includes(route))) {
        return navigate("/notfound");
      }


      const sideBar = document.getElementById("sideBar");

      if (sideBar) {
        // 1️⃣ Hide individual <li> items if their <a> href isn't in allowed routes
        const anchors = sideBar.querySelectorAll("a[href]");
        anchors.forEach(anchor => {
          const href = anchor.getAttribute("href");
          if (!nonAdminRoutes.includes(href)) {
            const li = anchor.closest("li");
            if (li) li.style.display = "none";
          }
        });

        // 2️⃣ Recursive function to hide parent <li> if all its children are hidden
        const hideEmptyParents = (element) => {
          const listItems = element.querySelectorAll(":scope > li");

          listItems.forEach(li => {
            const childLis = li.querySelectorAll(":scope > ul > li");
            if (childLis.length > 0) {
              // Recurse deeper first
              hideEmptyParents(li.querySelector("ul"));

              // After recursion, check if all children are hidden
              const allHidden = Array.from(childLis).every(
                child => child.style.display === "none"
              );

              if (allHidden) {
                li.style.display = "none";
              }
            }
          });
        };

        // 3️⃣ Start recursion from the root sidebar
        const rootUl = sideBar.querySelector("ul");
        if (rootUl) hideEmptyParents(rootUl);
      }
    }



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

