import { Types } from 'mongoose';
import { IFile } from '../files';

export interface INote extends IDBNote {
  id: string;
}

export interface IDBNote {
  title: string;
  text: string;
  showInMobileApp: boolean;
  file?: IFile;
  createdOn: Date;
  editedOn?: Date;
  createdBy: string;
  buildingId: Types.ObjectId | string;
}

export interface ICreateNote {
  title: string;
  text: string;
  showInMobileApp: boolean | string;
  buildingId: string;
  editedOn?: Date;
  file?: File | IFile;
}
