import {configureStore} from '@reduxjs/toolkit';
import userDetailSlice from './userDetailSlice';
import mailSlice from './mailSlice';
import settingSlice from './settingSlice';
import hotelDetails from './hotelSlice';



const store = configureStore({
  reducer:{
    userDetail: userDetailSlice,
    mailModalSlice: mailSlice,
    settingSlice: settingSlice,
    hotelDetails: hotelDetails
  },
})


export default store;

