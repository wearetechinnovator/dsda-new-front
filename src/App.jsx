
import React, { Suspense, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { ProtectRoute, UnProtectRoute } from "./components/Admin/ProtectRoute";
import { ProtectHotelRoute, UnProtectHotelRoute } from "./components/Hotel/ProtectRoute";
import ProtectCP from "./components/Admin/ProtectCP";

// Admin Dashboard;
const Hotelmaster = React.lazy(() => import("./pages/Admin/HotelMaster/Hotelmaster"));
const AddHotel = React.lazy(() => import("./pages/Admin/HotelMaster/AddHotel"));
const AddDistrict = React.lazy(() => import("./pages/Admin/Locations/district/AddDistrict"));
const District = React.lazy(() => import("./pages/Admin/Locations/district/District"));
const AddBlock = React.lazy(() => import("./pages/Admin/Locations/block/AddBlock"));
const Block = React.lazy(() => import("./pages/Admin/Locations/block/Block"));
const AddPoliceStation = React.lazy(() => import("./pages/Admin/Locations/policeStation/AddPoliceStation"));
const PoliceStation = React.lazy(() => import("./pages/Admin/Locations/policeStation/PoliceStation"));
const AddZone = React.lazy(() => import("./pages/Admin/Locations/zone/AddZone"));
const Zone = React.lazy(() => import("./pages/Admin/Locations/zone/Zone"));
const AddSector = React.lazy(() => import("./pages/Admin/Locations/sector/AddSector"));
const Sector = React.lazy(() => import("./pages/Admin/Locations/sector/Sector"));
const AddPayment = React.lazy(() => import("./pages/Admin/payment/AddPayment"));
const Notice = React.lazy(() => import("./pages/Admin/notice/Notice"));
const AddNotice = React.lazy(() => import("./pages/Admin/notice/AddNotice"));
const Payment = React.lazy(() => import("./pages/Admin/payment/Payment"));
const Login = React.lazy(() => import("./pages/Admin/Auth/Login"));
const Dashboard = React.lazy(() => import("./pages/Admin/Dashboard"));
const Profile = React.lazy(() => import("./pages/Admin/Auth/Profile"));
const Signup = React.lazy(() => import("./pages/Admin/Auth/Signup"));
const Setting = React.lazy(() => import("./pages/Admin/Setting"));
const UserAdd = React.lazy(() => import("./pages/Admin/AdminUser/UserAdd"));
const UserList = React.lazy(() => import("./pages/Admin/AdminUser/UserList"));
const Forgot = React.lazy(() => import("./pages/Admin/Auth/Forgot"));
const Otp = React.lazy(() => import("./pages/Admin/Auth/Otp"));
const ChangePassword = React.lazy(() => import("./pages/Admin/Auth/ChangePassword"));
const NotFound = React.lazy(() => import("./pages/Admin/NotFound"));
// const Invoice = React.lazy(() => import("./pages/Admin/details/Invoice"));
const ItemDetails = React.lazy(() => import("./pages/Admin/AdminUser/Details"));
const ManageHotel = React.lazy(() => import("./pages/Admin/ManageHotel"));
const HotelList = React.lazy(() => import("./pages/Admin/Report/HotelList"));
const BedAvailablity = React.lazy(() => import("./pages/Admin/Report/BedAvailablity"));


// Hotel Dashboard
const HotelDashboard = React.lazy(() => import("./pages/Hotel/Dashboard"));
const HotelLogin = React.lazy(() => import("./pages/Hotel/Auth/Login"));
const HotelForgot = React.lazy(() => import("./pages/Hotel/Auth/Forgot"));
const HotelOtp = React.lazy(() => import("./pages/Hotel/Auth/Otp"));
const HotelChangePassword = React.lazy(() => import("./pages/Hotel/Auth/ChangePassword"));
const ChangeProfilePassword = React.lazy(() => import("./pages/Hotel/Auth/ChangeProfilePassword"));
const HotelProfile = React.lazy(() => import("./pages/Hotel/Auth/Profile"));
const CheckIn = React.lazy(() => import("./pages/Hotel/CheckIn"));
const CheckInOTP = React.lazy(() => import("./pages/Hotel/CheckInOTP"));
const CheckOut = React.lazy(() => import("./pages/Hotel/CheckOut"));
const TouristData = React.lazy(() => import("./pages/Hotel/TouristData"));
const GuestEntry = React.lazy(() => import("./pages/Hotel/GuestEntry"));
const Amenities = React.lazy(() => import("./pages/Hotel/Amenities"));
const Payments = React.lazy(() => import("./pages/Hotel/Payments"));
const OtherPayments = React.lazy(() => import("./pages/Hotel/OtherPayments"));
const Statistics = React.lazy(() => import('./pages/Hotel/Statistics'));
const FinalCheckOut = React.lazy(() => import('./pages/Hotel/FinalCheckOut'));
const BookingBillDetails = React.lazy(()=>import('./pages/Hotel/BookingBillDetails'));
const BookingBillPrint = React.lazy(()=>import("./pages/Hotel/BookingBillPrint"));
const CheckOutDetails = React.lazy(()=>import('./pages/Hotel/CheckOutDetails'));


const App = () => {
  const navigate = useNavigate();
  // const location = useLocation();

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

        {/* ======================================== Admin Routes ==================================== */}
        {/* ========================================================================================== */}
        <Route path="/admin" element={<UnProtectRoute login={true}><Login /></UnProtectRoute>} />
        <Route path="/admin/signup" element={<UnProtectRoute login={true}><Signup /></UnProtectRoute>} />
        <Route path="/admin/forgot-password" element={<UnProtectRoute login={true}><Forgot /></UnProtectRoute>} />
        <Route path="/admin/otp" element={<UnProtectRoute login={true}><Otp /></UnProtectRoute>} />
        <Route path="/admin/change-password" element={<ProtectCP><ChangePassword /></ProtectCP>} />
        <Route path="/admin" element={<ProtectRoute />}>
          <Route path="site" element={<Setting />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="site-setting" element={<Setting />} />
          <Route path="manage-hotel" element={<ManageHotel />} />

          {/* Admin */}
          <Route path="user" element={< UserList />} />
          <Route path="user/profile" element={<Profile />} />
          <Route path="user/add" element={<UserAdd />} />
          <Route path="user/edit/:id" element={< UserAdd mode="edit" />} />
          <Route path="user/details/:id" element={<ItemDetails />} />

          {/* Hotel Routes */}
          <Route path="hotel" element={<Hotelmaster />} />
          <Route path="hotel/add" element={<AddHotel />} />
          <Route path="hotel/edit/:id" element={<AddHotel mode="edit" />} />

          {/* District */}
          <Route path="district" element={< District />} />
          <Route path="district/add" element={<AddDistrict />} />
          <Route path="district/edit/:id" element={< AddDistrict mode="edit" />} />

          {/* Block */}
          <Route path="block" element={< Block />} />
          <Route path="block/add" element={<AddBlock />} />
          <Route path="block/edit/:id" element={< AddBlock mode="edit" />} />

          {/* Police Station */}
          <Route path="police-station" element={<PoliceStation />} />
          <Route path="police-station/add" element={<AddPoliceStation />} />
          <Route path="police-station/edit/:id" element={<AddPoliceStation mode="edit" />} />

          {/* Zone */}
          <Route path="zone" element={<Zone />} />
          <Route path="zone/add" element={<AddZone />} />
          <Route path="zone/edit/:id" element={<AddZone mode="edit" />} />

          {/* Sector */}
          <Route path="sector" element={<Sector />} />
          <Route path="sector/add" element={<AddSector />} />
          <Route path="sector/edit/:id" element={<AddSector mode="edit" />} />

          {/* Amenities */}
          <Route path="amenities" element={<Payment />} />
          <Route path="amenities/add" element={<AddPayment />} />
          <Route path="amenities/edit/:id" element={<AddPayment mode="edit" />} />

          {/* Notice */}
          <Route path="notice" element={<Notice />} />
          <Route path="notice/add" element={<AddNotice />} />
          <Route path="notice/edit/:id" element={<AddNotice mode="edit" />} />

          {/* Report */}
          <Route path="report/hotel-list" element={<HotelList />} />
          <Route path="report/bed-availablity" element={<BedAvailablity />} />
        </Route>


        {/* ======================================== Hotel Routes ==================================== */}
        {/* ========================================================================================== */}
        <Route path="/" element={<UnProtectHotelRoute login={true}><HotelLogin /></UnProtectHotelRoute>} />
        <Route path="/hotel" element={<UnProtectHotelRoute login={true}><HotelLogin /></UnProtectHotelRoute>} />
        <Route path="/hotel/forgot" element={<UnProtectHotelRoute login={true}><HotelForgot /></UnProtectHotelRoute>} />
        <Route path="/hotel/otp" element={<UnProtectHotelRoute login={true}><HotelOtp /></UnProtectHotelRoute>} />
        <Route path="/hotel/change-password" element={<ProtectCP><HotelChangePassword /></ProtectCP>} />
        <Route path="/hotel" element={<ProtectHotelRoute />}>
          <Route path="dashboard" element={<HotelDashboard />} />
          <Route path="statistics" element={<Statistics />} />
          <Route path="profile" element={<HotelProfile />} />
          <Route path="profile/change-password" element={<ChangeProfilePassword />} />
          <Route path="check-in" element={<CheckIn />} />
          <Route path="check-in-otp" element={<CheckInOTP />} />
          <Route path="check-in/guest-entry" element={<GuestEntry />} />
          <Route path="check-in/guest-entry/bill-details" element={<BookingBillDetails />} />
          <Route path="check-in/guest-entry/bill-details/print" element={<BookingBillPrint />} />
          <Route path="check-out" element={<CheckOut />} />
          <Route path="check-out/details" element={<CheckOutDetails />} />
          <Route path="final-check-out" element={<FinalCheckOut />} />
          <Route path="tourist-data" element={<TouristData />} />
          <Route path="amenities" element={<Amenities />} />
          <Route path="payments" element={<Payments />} />
          <Route path="other-payments" element={<OtherPayments />} />
        </Route>


        <Route path="*" element={< NotFound />} />
      </Routes>
    </Suspense>

  )
}

export default App;
