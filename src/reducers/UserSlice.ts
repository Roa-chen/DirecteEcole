import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { Grade, Period, UserInfo } from '../assets/constants';
import { calculateAverage } from '../assets/utils';

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
  unofficialGrades: {},
  calculateWithUnofficialGrades: true,
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

      discipline.averageCalculated = calculateAverage({...state.grades, ...state.unofficialGrades}, [...disciplinePeriodGradeIds??[], ...(state.calculateWithUnofficialGrades ? discipline.unofficialGradeIds??[] : [])])
      period.averageCalculated = calculateAverage({...state.grades, ...state.unofficialGrades}, period.gradeIds);
    },
    clearUser: (state) => {
      Object.assign(state, {})
    },
    createGrade: (state, action: PayloadAction<{value: number, denominator: number, coef: number, codeDiscipline: string, periodIndex: number }>) => {
      const { value, denominator, coef, codeDiscipline, periodIndex } = action.payload;

      
      const period = state.periods?.[periodIndex]
      const discipline = period?.disciplines.find(discipline => discipline.codeDiscipline === codeDiscipline)
      const nameDiscipline = discipline?.nameDiscipline;
      if (!(nameDiscipline && state.unofficialGrades && period && state.grades)) return
      
      let id = 1;
      while (Object.keys(state.unofficialGrades).includes(id.toString())) {
        id += 1;
      }

      period?.unofficialGradeIds?.push(id.toString());
      discipline.unofficialGradeIds?.push(id.toString());
      

      state.unofficialGrades[id] = {
        isOfficial: false,
        id: id.toString(),
        value,
        codeValue: value.toString(),
        coef,
        denominator,
        nameDiscipline,
        codePeriod: "A00" + (periodIndex + 1),
        averageClass: NaN,
        minClass: NaN,
        maxClass: NaN,
        comment: "",
        isPositive: false,
        date: "",
        displayDate: "",
        codeDiscipline,
        isNew: false,
        name: "",
        significant: true,
        typeTest: "",
      }

      const disciplineGrades = [...discipline.gradeIds, ...( state.calculateWithUnofficialGrades ? discipline.unofficialGradeIds : [])];
      const periodGrades = [...period.gradeIds, ...(state.calculateWithUnofficialGrades ? period.unofficialGradeIds : [])]

      discipline.averageCalculated = calculateAverage({...state.grades, ...state.unofficialGrades}, disciplineGrades)
      period.averageCalculated = calculateAverage({...state.grades, ...state.unofficialGrades}, periodGrades);
    },
  }
});

export const { setUserData, setSignificant, clearUser, createGrade } = UserSlice.actions;

const userReducer = UserSlice.reducer
export default userReducer;
