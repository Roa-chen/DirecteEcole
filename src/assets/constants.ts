import { Dimensions } from 'react-native';

export const USERNAME_KEY = 'username'
export const PASSWORD_KEY = 'password'

export const windowWidth = Dimensions.get('window').width;
export const windowHeight = Dimensions.get('window').height;

export type UserInfo = {
  connected?: boolean,
  id?: string | undefined,
  token?: string | undefined,
  username?: string | undefined,
  password?: string | undefined,
  schoolName?: string | undefined,
  firstName?: string | undefined,
  lastName?: string | undefined,
  typeAccount?: string | undefined,
  childs?: {
    id: number;
    firstName: string | undefined;
    lastName: string | undefined;
  }[],
  numberOfPeriod?: number | undefined,
  periods?: Period[],
  grades?: { [id: string]: Grade },
  settings?: {
    showGeneralAverage?: boolean,
    showClassAverage?: boolean,
    showMinAverage?: boolean,
    showMaxAverage?: boolean,
  }
  
};

export type FetchingResponse = {
  success: boolean,
  message?: string,
  data?: UserInfo,
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
  displayDate: string,
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
  beginDate: number,
  endDate: number,
  averageOfficial: number,
  averageCalculated: number,
  averageClass: number,
  minAverageClass: number,
  maxAverageClass: number,
  disciplines: Discipline[],
  gradeIds: string[],
  isEnded: boolean,
}
