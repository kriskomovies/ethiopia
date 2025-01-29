import { IInvoice, IInvoiceDetails } from '../invoices';
import { Types } from 'mongoose';
import { ApartmentTypes, LivingPersonType } from '@repo/enums';

export interface IApartment extends IDBApartment {
  id: string;
}

export interface IDBApartment {
  buildingId: Types.ObjectId | string;
  type: ApartmentTypes;
  number: number;
  floor: number;
  petsCount: number;
  commonPartsArea: number;
  quadrature: number;
  builtUpArea: number;
  ownerNames: string;
  ownerPhoneNumber: string;
  ownerEmailAddress: string;
  livingPeople: ILivingPerson[];
  invoiceDetails: IInvoiceDetails;
  invoice?: IInvoice;
}

export interface ILivingPerson {
  type: LivingPersonType | string;
  names: string;
  phoneNumber: string;
  emailAddress?: string;
  hasAccessToMobileApp: boolean;
  showInHomeBook: boolean;
}

export interface ICreateApartment {
  type: string;
  buildingId: string;
  number: number;
  floor: number;
  petsCount: number;
  commonPartsArea: number;
  quadrature: number;
  builtUpArea: number;
  ownerNames: string;
  ownerPhoneNumber: string;
  ownerEmailAddress: string;
  livingPeople: ILivingPerson[];
  invoice?: IInvoice;
  invoiceDetails: IInvoiceDetails;
}
