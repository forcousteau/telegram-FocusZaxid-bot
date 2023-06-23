export interface IInteractiveTable {
  columnsBeforeWorkingHours: string[];
  columnsAfterWorkingHours: string[];
  days: number;
  additionalPayments: IAdditionalPayment[];
  employees: IInteractiveTableEmployee[];
}

export interface IInteractiveTableEmployee {
  id: number;
  objectId: number;
  recordsBeforeWorkingHours: string[];
  recordsAfterWorkingHours: string[];
  recordsWorkingHours: IWorkingHoursRecord[];
  recordsAdditionalPayments: string[];
  _fullName: string;
}

export interface IAdditionalPayment {
  type: string;
  value: AdditionalPaymentType;
}

export interface IWorkingHoursRecord {
  value: number;
  wasChanged: boolean;
}

export enum AdditionalPaymentType {
  PREPAYMENT_1 = 1,
  PREPAYMENT_2 = 2,
  VACATION_PAYMENT = 3,
  AWARD = 4,
  PENALTY = 5
}
