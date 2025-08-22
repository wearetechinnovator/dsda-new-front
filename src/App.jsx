import React, { Suspense, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { ProtectRoute, UnProtectRoute } from "./components/ProtectRoute";
import ProtectCP from "./components/ProtectCP";
import Hotelmaster from "./pages/HotelMaster/Hotelmaster";
import AddHotel from "./pages/HotelMaster/AddHotel";
const Login = React.lazy(() => import("./pages/Auth/Login"));
const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const AddQutation = React.lazy(() => import("./pages/quotation/AddQuotation"));
const Quotation = React.lazy(() => import("./pages/quotation/Quotation"));
const Profile = React.lazy(() => import("./pages/Auth/Profile"));
const Signup = React.lazy(() => import("./pages/Auth/Signup"));
const Setting = React.lazy(() => import("./pages/Setting"));
const UserAdd = React.lazy(() => import("./pages/AdminUser/UserAdd"));
const UserList = React.lazy(() => import("./pages/AdminUser/UserList"));
const Forgot = React.lazy(() => import("./pages/Auth/Forgot"));
const Otp = React.lazy(() => import("./pages/Auth/Otp"));
const ChangePassword = React.lazy(() => import("./pages/Auth/ChangePassword"));
const NotFound = React.lazy(() => import("./pages/NotFound"));
const Invoice = React.lazy(() => import("./pages/details/Invoice"));
const ItemDetails = React.lazy(() => import("./pages/AdminUser/Details"));



const App = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        navigate(-1);
      }
    };
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [navigate]);


  return (

    <Suspense fallback={<div className="grid place-items-center w-full min-h-[100vh]">
      <div className="flex flex-row gap-2">
        <div className="w-4 h-4 rounded-full bg-blue-700 animate-bounce"></div>
        <div className="w-4 h-4 rounded-full bg-blue-700 animate-bounce [animation-delay:-.3s]"></div>
        <div className="w-4 h-4 rounded-full bg-blue-700 animate-bounce [animation-delay:-.5s]"></div>
      </div>
    </div>}>
      <Routes>
        <Route path="/admin" element={<UnProtectRoute login={true}><Login /></UnProtectRoute>} />
        <Route path="/" element={<UnProtectRoute login={true}><Login /></UnProtectRoute>} />
        <Route path="/admin/signup" element={<UnProtectRoute login={true}><Signup /></UnProtectRoute>} />
        <Route path="/admin/forget" element={<UnProtectRoute login={true}>< Forgot /></UnProtectRoute>} />
        <Route path="/admin/otp" element={<UnProtectRoute login={true}>< Otp /></UnProtectRoute>} />
        <Route path="/admin/change-password" element={<ProtectCP>< ChangePassword /></ProtectCP>} />
        <Route path="/admin/site" element={<Setting />} />
        <Route path="admin/dashboard" element={<Dashboard />} />

        {/* Print part */}
        <Route path="/admin/bill/details/:bill/:id" element={<Invoice />} />

        {/* Quotatin route */}
        <Route path="/admin/quotation-estimate" element={<Quotation />} />
        <Route path="/admin/quotation-estimate/add/:id?" element={<AddQutation />} />
        <Route path="/admin/quotation-estimate/edit/:id" element={<AddQutation mode={"edit"} />} />


        <Route path="/admin/profile" element={<Profile />} />

        <Route path="/admin/admin/add" element={<UserAdd />} />
        <Route path="/admin/admin/edit/:id" element={< UserAdd mode="edit" />} />
        <Route path="/admin/admin" element={< UserList />} />
        <Route path="/admin/admin/details/:id" element={<ItemDetails />} />

        <Route path="/admin/hotel/add" element={<AddHotel />} />
        <Route path="/admin/hotel/edit/:id" element={< AddHotel mode="edit" />} />
        <Route path="/admin/hotel" element={< Hotelmaster />} />


        <Route path="*" element={< NotFound />} />
      </Routes>
    </Suspense>

  )
}

export default App;
