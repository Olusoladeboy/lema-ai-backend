import { connection } from "../connection";

import {
  selectCountOfUsersTemplate,
  selectUsersTemplate,
} from "./query-templates";
import { User } from "./types";

export const getUsersCount = (): Promise<number> =>
  new Promise((resolve, reject) => {
    connection.get<{ count: number }>(
      selectCountOfUsersTemplate,
      (error, results) => {
        if (error) {
          reject(error);
          return;
        }
        if (!results) {
          reject(new Error("Failed to get user count"));
          return;
        }
        resolve(results.count);
      }
    );
  });

const formatAddress = (user: User): string => {
  if (!user.street || !user.city || !user.state || !user.zipcode) {
    return "";
  }
  return `${user.street}, ${user.state}, ${user.city}, ${user.zipcode}`;
};

export const getUsers = (
  pageNumber: number,
  pageSize: number
): Promise<User[]> =>
  new Promise((resolve, reject) => {
    connection.all<User>(
      selectUsersTemplate,
      [pageNumber * pageSize, pageSize],
      (error, results) => {
        if (error) {
          reject(error);
          return;
        }
        // Format address for each user
        const usersWithAddress = results.map((user) => ({
          ...user,
          address: formatAddress(user),
        }));
        resolve(usersWithAddress);
      }
    );
  });
