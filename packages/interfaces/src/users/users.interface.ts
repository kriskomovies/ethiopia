import { Types } from 'mongoose';

export interface IUser extends IDBUser {
  id: string;
}

export interface IDBUser {
  companyId: Types.ObjectId | string;
  email: string;
  phoneNumber: string;
  password: string;
  createdOn: Date;
  name: string;
  userName: string;
  hasAcceptedTermsAndConditions: boolean;
  hasAcceptedPrivatePolicy: boolean;
  hasDeclaredThirdPartyDataAgreement: boolean;
}

export interface ICreateUser {
  email: string;
  phoneNumber: string;
  password: string;
  rePassword: string;
  companyId: string;
  name: string;
  userName: string;
  hasAcceptedTermsAndConditions: boolean;
  hasAcceptedPrivatePolicy: boolean;
  hasDeclaredThirdPartyDataAgreement: boolean;
}

export interface ILoginUser {
  emailOrPhoneNumber: string;
  password: string;
}

export interface IUserInfo {
  companyName: string;
  userName: string;
  role: string;
}
