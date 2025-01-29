import { MaintainerTypes } from '@repo/enums';
import { Types } from 'mongoose';

export interface IMaintainer extends IDBMaintainer {
  id: string;
}

export interface IDBMaintainer {
  name: string;
  email: string;
  phoneNumber: string;
  type: MaintainerTypes;
  companyId: Types.ObjectId | string;
  buildingIds: Types.ObjectId[] | string[];
}

export interface ICreateMaintainer {
  name: string;
  email: string;
  phoneNumber: string;
  type: MaintainerTypes | string;
  companyId: string;
}
