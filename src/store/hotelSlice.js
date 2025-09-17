import { createSlice } from "@reduxjs/toolkit";

const hotelSlice = createSlice({
    name: "hotelSlice",
    initialState:{},
    reducers:{
        addHotelDetails:(state, action)=>{
            Object.assign(state, action.payload)
        }
    }
})


export const { addHotelDetails } = hotelSlice.actions;
export default hotelSlice.reducer;
