export interface IEmployee {
  id: number;
  fullName: string;
  birthDate: Date;
  phoneNumber: string;
  identificationCode: string;
  positionId?: number;
  positionName: string;
  positionCategoryName: string;
  price: number;
  clothingSizeName: ClothingSize;
  photoName?: string;
  isFired?: boolean;
}

export enum ClothingSize {
  S = 'S',
  M = 'M',
  L = 'L',
  XL = 'XL',
  XXL = 'XXL'
}
