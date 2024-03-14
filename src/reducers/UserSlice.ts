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
      const { userInfo } = action.payload;
      Object.assign(state, userInfo)
    },
    setSignificant: (state, action: PayloadAction<{ gradeId: string, significant: boolean }>) => {
      const { gradeId, significant } = action.payload;
      if (!(state.grades && state.periods)) return
      const grade = state.grades[gradeId] ?? state.unofficialGrades?.[gradeId]
      grade.significant = significant;

      console.log(grade)

      const period = state.periods[Number(grade.codePeriod.slice(1)) - 1]
      const discipline = period.disciplines.find(discipline => discipline.codeDiscipline === grade.codeDiscipline)
      const disciplinePeriodGradeIds = discipline?.gradeIds
      if (!discipline) return;

      discipline.averageCalculated = calculateAverage({ ...state.grades, ...state.unofficialGrades }, [...disciplinePeriodGradeIds ?? [], ...(state.calculateWithUnofficialGrades ? discipline.unofficialGradeIds ?? [] : [])])
      period.averageCalculated = calculateAverage({ ...state.grades, ...state.unofficialGrades }, [...period.gradeIds, ...(state.calculateWithUnofficialGrades ? period.unofficialGradeIds ?? [] : [])]);
    },
    clearUser: (state) => {
      Object.assign(state, {})
    },
    createGrade: (state, action: PayloadAction<{ value: number, denominator: number, coef: number, codeDiscipline: string, periodIndex: number }>) => {
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

      const disciplineGrades = [...discipline.gradeIds, ...(state.calculateWithUnofficialGrades ? discipline.unofficialGradeIds : [])];
      const periodGrades = [...period.gradeIds, ...(state.calculateWithUnofficialGrades ? period.unofficialGradeIds : [])]

      discipline.averageCalculated = calculateAverage({ ...state.grades, ...state.unofficialGrades }, disciplineGrades)
      period.averageCalculated = calculateAverage({ ...state.grades, ...state.unofficialGrades }, periodGrades);
    },
    deleteGrade: (state, action: PayloadAction<{ gradeId: string, codeDiscipline: string, periodIndex: number }>) => {
      const { gradeId, codeDiscipline, periodIndex } = action.payload;

      const period = state.periods?.[periodIndex]
      const discipline = period?.disciplines.find(discipline => discipline.codeDiscipline === codeDiscipline)
      const nameDiscipline = discipline?.nameDiscipline;
      if (!(nameDiscipline && state.unofficialGrades && period && state.grades)) return

      delete state.unofficialGrades[gradeId];
      period.unofficialGradeIds.splice(period.unofficialGradeIds.indexOf(gradeId.toString()), 1);
      discipline.unofficialGradeIds.splice(discipline.unofficialGradeIds.indexOf(gradeId.toString()), 1);

      const disciplineGrades = [...discipline.gradeIds, ...(state.calculateWithUnofficialGrades ? discipline.unofficialGradeIds : [])];
      const periodGrades = [...period.gradeIds, ...(state.calculateWithUnofficialGrades ? period.unofficialGradeIds : [])]

      discipline.averageCalculated = calculateAverage({ ...state.grades, ...state.unofficialGrades }, disciplineGrades)
      period.averageCalculated = calculateAverage({ ...state.grades, ...state.unofficialGrades }, periodGrades);
    },
    modifyGrade: (state, action: PayloadAction<{ gradeId: string, value: number, denominator: number, coef: number, codeDiscipline: string, periodIndex: number }>) => {
      const { gradeId, value, denominator, coef, periodIndex, codeDiscipline } = action.payload;

      const period = state.periods?.[periodIndex]
      const discipline = period?.disciplines.find(discipline => discipline.codeDiscipline === codeDiscipline)
      const nameDiscipline = discipline?.nameDiscipline;
      if (!(nameDiscipline && state.unofficialGrades && period && state.grades)) return

      const grade = state.grades[gradeId] ?? state.unofficialGrades[gradeId];

      if (value !== grade.value) {
        grade.modifiedValue = value;
      }
      if (coef !== grade.coef) {
        grade.modifiedCoef = coef;
      }
      if (denominator !== grade.denominator) {
        grade.modifiedDenominator = denominator;
      }



      const disciplineGrades = [...discipline.gradeIds, ...(state.calculateWithUnofficialGrades ? discipline.unofficialGradeIds : [])];
      const periodGrades = [...period.gradeIds, ...(state.calculateWithUnofficialGrades ? period.unofficialGradeIds : [])]

      discipline.averageCalculated = calculateAverage({ ...state.grades, ...state.unofficialGrades }, disciplineGrades)
      period.averageCalculated = calculateAverage({ ...state.grades, ...state.unofficialGrades }, periodGrades);
    },
    unModifyGrade: (state, action: PayloadAction<{ gradeId: string, codeDiscipline: string, periodIndex: number }>) => {
      const { gradeId, periodIndex, codeDiscipline } = action.payload;

      const period = state.periods?.[periodIndex]
      const discipline = period?.disciplines.find(discipline => discipline.codeDiscipline === codeDiscipline)
      const nameDiscipline = discipline?.nameDiscipline;
      if (!(nameDiscipline && state.unofficialGrades && period && state.grades)) return

      const grade = state.grades[gradeId] ?? state.unofficialGrades[gradeId];

      grade.modifiedValue = undefined;
      grade.modifiedCoef = undefined;
      grade.modifiedDenominator = undefined;

      const disciplineGrades = [...discipline.gradeIds, ...(state.calculateWithUnofficialGrades ? discipline.unofficialGradeIds : [])];
      const periodGrades = [...period.gradeIds, ...(state.calculateWithUnofficialGrades ? period.unofficialGradeIds : [])]

      discipline.averageCalculated = calculateAverage({ ...state.grades, ...state.unofficialGrades }, disciplineGrades)
      period.averageCalculated = calculateAverage({ ...state.grades, ...state.unofficialGrades }, periodGrades);
    },
  }
});

export const { setUserData, setSignificant, clearUser, createGrade, deleteGrade, modifyGrade, unModifyGrade } = UserSlice.actions;

const userReducer = UserSlice.reducer
export default userReducer;
