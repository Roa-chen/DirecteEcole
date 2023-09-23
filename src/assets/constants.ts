export const USERNAME_KEY = 'username'
export const PASSWORD_KEY = 'password'

export type UserInfo = any;
export type ConnectionResponse = {
  sucess: boolean,
  username: string,
  password: string,
}

export type Grade = {
  id: number,
  name: string,
  codePeriod: string,
  codeDiscipline: string,
  nameDiscipline: string,
  typeTest: string,
  comment: string,
  coef: number,
  value: number,
  denominator: number,
  significant: boolean,
  date: string,
  isPositive: boolean,
  averageClass: number,
  minClass: number,
  maxClass: number,
}

export type Discipline = {
  codeDiscipline: string,
  nameDiscipline: string,
  coef: number,
  averageOfficial: number,
  averageCalculated: number,
  averageClass: number,
  minAverageClass: number,
  maxAverageClass: number,
}

export type Period = {
  codePeriod: string,
  namePeriod: string,
  beginDate: string,
  endDate: string,
  averageOfficial: number,
  averageCalculated: number,
  averageClass: number,
  minAverageClass: number,
  maxAverageClass: number,
  disciplines: Discipline[],
  grades: Grade[],
}
