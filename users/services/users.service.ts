import debug from "debug";

import { CRUD } from "../../common/interfaces/crud.interface";
import usersDao from "../daos/users.dao";
import { CreateUserDto } from "../dtos/create.user.dto";

const log: debug.IDebugger = debug("app::users-service");

class UsersService implements CRUD {
  async getAll(limit: number, page: number) {
    return usersDao.getAllUsers(limit, page);
  }
  async create(resource: CreateUserDto) {
    return usersDao.addUser(resource);
  }
  async getById(id: string) {
    return usersDao.getUserById(id);
  }
  async getByEmail(email: string) {
    return usersDao.getUserByEmail(email);
  }
  async getByEmailWithPassword(email: string) {
    return usersDao.getUserByEmailWithPassword(email);
  }
  async patchById(id: string, resource: any) {
    return usersDao.updateUserById(id, resource);
  }
  async putById(id: string, resource: any) {
    return usersDao.updateUserById(id, resource);
  }
  async deleteById(id: string) {
    return usersDao.deleteUserById(id);
  }
}

export default new UsersService();
