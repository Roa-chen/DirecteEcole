import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from '.';

interface UserState {

}

const initialState: UserState = {

};

const UserSlice = createSlice({
  name: 'UserSlice',
  initialState,
  reducers: {

    addWeek: (state, action: PayloadAction<{ index?: number, id?: string }>) => {

    },
  }
});

export const { addWeek } = UserSlice.actions;

const userReducer = UserSlice.reducer

export default userReducer;