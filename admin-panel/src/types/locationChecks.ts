export interface ILocationCheck {
  id: number;
  status: LocationCheckStatus;
  createdAt: Date;
}

export enum LocationCheckStatus {
  ACTIVE,
  WAITING,
  FINISHED
}
