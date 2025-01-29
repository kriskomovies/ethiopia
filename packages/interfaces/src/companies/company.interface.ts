import { IUser } from '../users';

export interface ICompany {
  id: string;
  name: string;
  users: IUser[];
}

export interface IDBCompany {
  name: string;
  users: any[];
}
