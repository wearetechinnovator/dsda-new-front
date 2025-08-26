import React, { Suspense, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { ProtectRoute, UnProtectRoute } from "./components/ProtectRoute";
import ProtectCP from "./components/ProtectCP";

import Hotelmaster from "./pages/HotelMaster/Hotelmaster";
import AddHotel from "./pages/HotelMaster/AddHotel";
import AddDistrict from "./pages/Locations/district/AddDistrict";
import District from "./pages/Locations/district/District";
import AddBlock from "./pages/Locations/block/AddBlock";
import Block from "./pages/Locations/block/Block";
import AddPoliceStation from "./pages/Locations/policeStation/AddPoliceStation";
import PoliceStation from "./pages/Locations/policeStation/PoliceStation";
import AddZone from "./pages/Locations/zone/AddZone";
import Zone from "./pages/Locations/zone/Zone";
import AddSector from "./pages/Locations/sector/AddSector";
import Sector from "./pages/Locations/sector/Sector";
import AddPayment from "./pages/payment/AddPayment";
import Payment from "./pages/payment/Payment";
import AddNotice from "./pages/notice/AddNotice";
import Notice from "./pages/notice/Notice";

const Login = React.lazy(() => import("./pages/Auth/Login"));
const Dashboard = React.lazy(() => import("./pages/Dashboard"));
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


        <Route path="/admin/profile" element={<Profile />} />

        <Route path="/admin/admin/add" element={<UserAdd />} />
        <Route path="/admin/admin/edit/:id" element={< UserAdd mode="edit" />} />
        <Route path="/admin/admin" element={< UserList />} />
        <Route path="/admin/admin/details/:id" element={<ItemDetails />} />

        <Route path="/admin/hotel/add" element={<AddHotel />} />
        <Route path="/admin/hotel/edit/:id" element={< AddHotel mode="edit" />} />
        <Route path="/admin/hotel" element={< Hotelmaster />} />

        <Route path="/admin/district/add" element={<AddDistrict />} />
        <Route path="/admin/district/edit/:id" element={< AddDistrict mode="edit" />} />
        <Route path="/admin/district" element={< District />} />

        <Route path="/admin/block/add" element={<AddBlock />} />
        <Route path="/admin/block/edit/:id" element={< AddBlock mode="edit" />} />
        <Route path="/admin/block" element={< Block />} />

        <Route path="/admin/police-station/add" element={<AddPoliceStation />} />
        <Route path="/admin/police-station/edit/:id" element={< AddPoliceStation mode="edit" />} />
        <Route path="/admin/police-station" element={< PoliceStation />} />

        <Route path="/admin/zone/add" element={<AddZone />} />
        <Route path="/admin/zone/edit/:id" element={< AddZone mode="edit" />} />
        <Route path="/admin/zone" element={< Zone />} />

        <Route path="/admin/sector/add" element={<AddSector />} />
        <Route path="/admin/sector/edit/:id" element={< AddSector mode="edit" />} />
        <Route path="/admin/sector" element={< Sector />} />


        <Route path="/admin/amenities/add" element={<AddPayment />} />
        <Route path="/admin/amenities/edit/:id" element={< AddPayment mode="edit" />} />
        <Route path="/admin/amenities" element={< Payment />} />

        <Route path="/admin/notice/add" element={<AddNotice />} />
        <Route path="/admin/notice/edit/:id" element={< AddNotice mode="edit" />} />
        <Route path="/admin/notice" element={< Notice />} />


        <Route path="*" element={< NotFound />} />
      </Routes>
    </Suspense>

  )
}

export default App;
