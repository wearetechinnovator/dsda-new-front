import {configureStore} from '@reduxjs/toolkit';
import userDetailSlice from './userDetailSlice';
import partyModalSlice from './partyModalSlice';
import itemModalSlice from './itemModalSlice';
import mailSlice from './mailSlice';



const store = configureStore({
  reducer:{
    userDetail: userDetailSlice,
    partyModalSlice: partyModalSlice,
    itemModalSlice: itemModalSlice,
    mailModalSlice: mailSlice,
  },
})


export default store;

