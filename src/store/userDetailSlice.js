import { createSlice } from '@reduxjs/toolkit'


const userDetailSlice = createSlice({
  name: "userDetails",
  initialState: {},
  reducers: {
    add: (state, action) => {
      Object.assign(state, action.payload)
    }
  }
})


export const { add } = userDetailSlice.actions;
export default userDetailSlice.reducer;
