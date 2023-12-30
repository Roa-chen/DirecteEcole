import { Action } from 'redux'
import { PayloadAction, ThunkAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from '.';
import { FetchingResponse, Grade, Period, UserInfo } from '../assets/constants';
import { fetchGrades_ } from '../services';
import { calculateAverage } from '../assets/utils';

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
  // selectedChild = 0;
}

const initialState: UserInfo = {
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
};

const UserSlice = createSlice({
  name: 'UserSlice',
  initialState,
  reducers: {
    setUserData: (state, action: PayloadAction<{ userInfo: UserInfo | undefined }>) => {
      const {userInfo} = action.payload;
      Object.assign(state, userInfo)
    },
    setSignificant: (state, action: PayloadAction<{ gradeId: string, significant: boolean }>) => {
      const {gradeId, significant} = action.payload;
      if (!(state.grades && state.periods)) return
      state.grades[gradeId].significant = significant;

      const period = state.periods[Number(state.grades[gradeId].codePeriod.slice(1))-1]
      const discipline = period.disciplines.find(discipline => discipline.codeDiscipline === state.grades?.[gradeId].codeDiscipline)
      const disciplinePeriodGradeIds = discipline?.gradeIds
      if (!discipline) return;
      discipline.averageCalculated = calculateAverage(state.grades, disciplinePeriodGradeIds??[])

      console.log(period.averageCalculated)

      period.averageCalculated = calculateAverage(state.grades, period.gradeIds);

      console.log(period.averageCalculated)

      //TODO update average


    },
  }
});

export const { setUserData, setSignificant } = UserSlice.actions;

const userReducer = UserSlice.reducer
export default userReducer;


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
