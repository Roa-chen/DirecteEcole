import { Action } from 'redux'
import { PayloadAction, ThunkAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from '.';
import { FetchingResponse, Grade, Period, UserInfo } from '../assets/constants';
import { fetchGrades_ } from '../services';

interface UserState {
  connected: boolean;
  username: string | undefined;
  password: string | undefined;
  token: string | undefined;
  id: string | undefined;
  schoolName: string | undefined;
  firstName: string | undefined;
  lastName: string | undefined;
  typeAccount: string | undefined;
  childs: {
    id: number;
    firstName: string | undefined;
    lastName: string | undefined;
  }[];
  numberOfPeriod: number | undefined;
  periods: Period[];
  grades: { [id: string]: Grade };
  subscriptions: (() => void)[];
  // selectedChild = 0;
}

const initialState: UserState = {
  connected: false,
  username: undefined,
  password: undefined,
  token: undefined,
  id: undefined,
  schoolName: undefined,
  firstName: undefined,
  lastName: undefined,
  typeAccount: undefined,
  childs: [],
  numberOfPeriod: undefined,
  periods: [],
  grades: {},
  subscriptions: [],
};

const UserSlice = createSlice({
  name: 'UserSlice',
  initialState,
  reducers: {

    setUserData: (state, action: PayloadAction<{ userInfo: UserInfo | undefined }>) => {
      const {userInfo} = action.payload;
      Object.assign(state, userInfo)
    },
  }
});

// export const logIn = 
//   (username: string, password: string): ThunkAction<Promise<FetchingResponse>, RootState, unknown, Action> =>
//   async dispatch => {
//     const response = await logIn_(username, password)
//     if (response.success && response.data) {
//       dispatch(
//         setUserData({userInfo: response.data})
//       )
//     }

//     return response

//   }

// export const fetchGrades =
//   (): ThunkAction<Promise<FetchingResponse>, RootState, unknown, Action> =>
//   async (dispatch, getState) => {
//     const {token, id} = getState().user
//     const response = await fetchGrades_(token??'', id??'');
//     if (response.success && response.data) {
//       dispatch(
//         setUserData({userInfo: response.data})
//       )
//     }

//     return response;
//   }

export const { setUserData } = UserSlice.actions;

const userReducer = UserSlice.reducer
export default userReducer;