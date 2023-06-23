export interface IAdmin {
  id: number;
  username: string;
  password: string;
  roleId: number;
}

export interface IAdminsRole {
  id: number;
  name: string;
}
