import { BuildingTypes } from '@repo/enums';
import { IInvoice, IInvoiceDetails } from '../invoices';
import { Types } from 'mongoose';
import { INote } from '../notes';

export interface IBuilding extends IDBBuilding {
  id: string;
}

export interface IDBBuilding {
  name: string;
  type: BuildingTypes;
  city: string;
  neighborhood: string;
  homeBookStartDate: string | Date;
  streetName: string;
  streetNumber: number;
  entrance: string;
  postalCode: number;
  taxGeneratePeriodInMonths: string;
  taxGenerateDay: number;
  invoiceDetails: IInvoiceDetails;
  invoices: IInvoice[];
  tourDates: ITourDate[];
  employeesWithAccess?: string[];
  commonParts: number;
  quadrature: number;
  parkingPlaces: number;
  basements: number;
  createdOn: string | Date;
  notes: [Types.ObjectId] | INote[];
  companyId: Types.ObjectId | string;
}

export interface ITourDate {
  employeeId: string;
  date: string | Date;
}

export interface IEmployeesWithAccess {
  id: string;
  name: string;
}

export interface IActiveMaintainer {
  type: string;
  name: string;
}

export interface ICreateBuilding {
  companyId: string;
  name: string;
  type: BuildingTypes | string;
  city: string;
  neighborhood: string;
  homeBookStartDate: string;
  streetName: string;
  streetNumber: number | string;
  entrance: string;
  postalCode: number | string;
  taxGeneratePeriodInMonths: string;
  taxGenerateDay: number | string;
  invoiceDetails: IInvoiceDetails;
  tourDates: ITourDate[];
  employeesWithAccess?: string[];
  commonParts: number;
  quadrature: number;
  parkingPlaces: number;
  basements: number;
  activeMaintainers: string[];
}
