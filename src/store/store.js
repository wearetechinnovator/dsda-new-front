import {configureStore} from '@reduxjs/toolkit';
import userDetailSlice from './userDetailSlice';
import mailSlice from './mailSlice';
import settingSlice from './settingSlice';



const store = configureStore({
  reducer:{
    userDetail: userDetailSlice,
    mailModalSlice: mailSlice,
    settingSlice: settingSlice
  },
})


export default store;

