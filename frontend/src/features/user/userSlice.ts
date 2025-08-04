import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  id: null,
  name: 'guest',
};

const userSlice = createSlice({
  name: 'user',
  initialState: initialState,
  reducers: {
   addUserInfo: (state, action)  => {
      state.id = action.payload.id;
      state.name = action.payload.name;
   } 
  },
});

export const { addUserInfo } = userSlice.actions;
export default userSlice.reducer;
