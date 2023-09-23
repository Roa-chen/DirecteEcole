export const USERNAME_KEY = 'username'
export const PASSWORD_KEY = 'password'

export type UserInfo = any;
export type ConnectionResponse = {
  success: boolean,
  username: string,
  password: string,
  message: string,
}

export type Grade = {
  id: string,
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
  codeValue: string,
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
  gradeIds: string[],
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
  gradeIds: string[],
}
