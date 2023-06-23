import { getUsers } from '../telegram/helpers/functions';

export const getAllUsersCount = async () => {
  let users = await getUsers();
  return users.length;
};
