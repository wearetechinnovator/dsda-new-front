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

        {/* Print part */}
        <Route path="/admin/bill/details/:bill/:id" element={<Invoice />} />

        <Route path="/admin" element={<ProtectRoute />}>
          <Route path="site" element={<Setting />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="site-setting" element={<Setting />} />
        </Route>

        {/* Admin */}
        <Route path="/admin/user" element={<ProtectRoute />}>
          <Route index element={< UserList />} />
          <Route path="profile" element={<Profile />} />
          <Route path="add" element={<UserAdd />} />
          <Route path="edit/:id" element={< UserAdd mode="edit" />} />
          <Route path="details/:id" element={<ItemDetails />} />
        </Route>

        <Route path="/admin/hotel" element={<ProtectRoute />}>
          <Route index element={<Hotelmaster />} />
          <Route path="add" element={<AddHotel />} />
          <Route path="edit/:id" element={<AddHotel mode="edit" />} />
        </Route>

        {/* District */}
        <Route path="/admin/district" element={<ProtectRoute />}>
          <Route index element={< District />} />
          <Route path="add" element={<AddDistrict />} />
          <Route path="edit/:id" element={< AddDistrict mode="edit" />} />
        </Route>

        {/* Block */}
        <Route path="/admin/block" element={<ProtectRoute />}>
          <Route index element={< Block />} />
          <Route path="add" element={<AddBlock />} />
          <Route path="edit/:id" element={< AddBlock mode="edit" />} />
        </Route>

        {/* Police Station */}
        <Route path="/admin/police-station" element={<ProtectRoute />}>
          <Route index element={<PoliceStation />} />
          <Route path="add" element={<AddPoliceStation />} />
          <Route path="edit/:id" element={<AddPoliceStation mode="edit" />} />
        </Route>

        {/* Zone */}
        <Route path="/admin/zone" element={<ProtectRoute />}>
          <Route index element={<Zone />} />
          <Route path="add" element={<AddZone />} />
          <Route path="edit/:id" element={<AddZone mode="edit" />} />
        </Route>

        {/* Sector */}
        <Route path="/admin/sector" element={<ProtectRoute />}>
          <Route index element={<Sector />} />
          <Route path="add" element={<AddSector />} />
          <Route path="edit/:id" element={<AddSector mode="edit" />} />
        </Route>

        {/* Amenities */}
        <Route path="/admin/amenities" element={<ProtectRoute />}>
          <Route index element={<Payment />} />
          <Route path="add" element={<AddPayment />} />
          <Route path="edit/:id" element={<AddPayment mode="edit" />} />
        </Route>

        {/* Notice */}
        <Route path="/admin/notice" element={<ProtectRoute />}>
          <Route index element={<Notice />} />
          <Route path="add" element={<AddNotice />} />
          <Route path="edit/:id" element={<AddNotice mode="edit" />} />
        </Route>


        <Route path="*" element={< NotFound />} />
      </Routes>
    </Suspense>

  )
}

export default App;
