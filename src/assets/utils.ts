import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "../reducers"
import { Grade, UserInfo } from "./constants"

export const roundGrade = (value: number) => {
  return Math.round(value*100)/100
}

export const formatStringNumber = (string: string) => {
  if (!string) return Number(string)
  if (typeof string === "number") return string
  return Number(string.replaceAll(',', '.'))
}

export const calculateAverage = (grades: { [id: string]: Grade; }, gradeIds: string[]) => {

  let total = 0;
  let coef = 0;
  let disciplines: {
    [name: string]: {
      total: number,
      coef: number,
    }
  } = {}

  for (let i = 0; i < gradeIds.length; i++) {
    const grade = grades[gradeIds[i]];

    if (grade.significant && !isNaN(Number(grade.value))) {

      if (disciplines[grade.codeDiscipline]) {
        disciplines[grade.codeDiscipline] = {
          total: disciplines[grade.codeDiscipline]?.total + ((grade.value / grade.denominator) * 20) * grade.coef,
          coef: disciplines[grade.codeDiscipline]?.coef + grade.coef,
        }

      } else {
        disciplines[grade.codeDiscipline] = {
          total: ((grade.value / grade.denominator) * 20) * grade.coef,
          coef: grade.coef,
        }
      }
    }
  }

  for (let key of Object.keys(disciplines)) {
    total += (disciplines[key].total / disciplines[key].coef)
    coef += 1
  }

  return roundGrade(total / coef);
}

export const getCurrentPeriod = (user: UserInfo) => {
  if (!(user.numberOfPeriod && user.periods)) return -1

  for (let i=0; i<user.periods.length; i++) {
    if(user.periods[i].isEnded === false) {
      return i;
    }
  }

  return -1;

  // const now = Date.now();
  // for (let i = 0; i < (user.numberOfPeriod); i++) {
  //   const period = user.periods[i];
  //   if (period.beginDate <= now && now <= period.endDate) return i;
  // }
  // return -1;
}

export const sort = (a: Grade, b: Grade, sortingType: number) => {
  let result;

  switch (sortingType) {
    case 0:
      return Date.parse(a.displayDate) - Date.parse(b.displayDate)
    case 1:
      return (a.value / a.denominator) - (b.value / b.denominator)
    case 2:
      return a.coef - b.coef
    default:
      return 1;
  }

  return result;
}

type DispatchFunc = () => AppDispatch
export const useAppDispatch: DispatchFunc = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector