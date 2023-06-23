export interface IObject {
  id: number;
  city: string;
  address: string;
  regionId: number;
  regionName: string;
  isActive: boolean;
  contractorId: number | null;
  contractorName: string | null;
}
