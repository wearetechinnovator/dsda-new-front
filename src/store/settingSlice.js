import { createSlice } from "@reduxjs/toolkit";

const settingSlice = createSlice({
    name: 'Setting',
    initialState: {},
    reducers: {
        addSetting: (state, action)=>{
            Object.assign(state, action.payload);
        }
    }
})


export const {addSetting} = settingSlice.actions;
export default settingSlice.reducer;