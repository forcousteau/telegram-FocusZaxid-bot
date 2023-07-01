import api from "./api";
import { FuelType, ICar } from "../types/cars";

export const fetchCars = async (): Promise<ICar[]> => {
  const { data } = await api.get("/cars");
  return data.cars;
};

export const createCar = async (
    name: string,
    fuelType: FuelType,
    fuelConsumption: number,
    isCompanyProperty: boolean,
    isActive: boolean,
): Promise<void> => {
  await api.post("/cars", {
    name,
    fuelType,
    fuelConsumption,
    isCompanyProperty,
    isActive,
  });
};

export const editCar = async (
  id: number,
  data: Partial<ICar>
): Promise<void> => {
  await api.put("/cars", { id, data });
};
