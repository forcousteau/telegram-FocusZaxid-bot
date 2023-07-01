export interface ICar {
    id: number;
    name: string;
    fuelType: FuelType;
    fuelConsumption: number;
    isCompanyProperty: boolean;
    isActive: boolean;
  }
  
 export enum FuelType {
    PETROL = 'petrol',
    DIESEL = 'diesel',
    GAS = 'gas'
  }
  