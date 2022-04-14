import { Request, Response } from "express";
import argon2 from "argon2";
import debug from "debug";
import usersService from "../services/users.service";

const log: debug.IDebugger = debug("app::users-controller");

class UsersController {
  async getAllUsers(req: Request, res: Response) {
    const users = await usersService.getAll(100, 0);
    res.status(200).send(users);
  }

  async createUser(req: Request, res: Response) {
    req.body.password = await argon2.hash(req.body.password);
    const userId = await usersService.create(req.body);
    res.status(201).send({ _id: userId });
  }

  async getUser(req: Request, res: Response) {
    const user = await usersService.getById(req.body.id);
    res.status(200).send(user);
  }

  async patchUser(req: Request, res: Response) {
    if (req.body.password) {
      req.body.password = await argon2.hash(req.body.password);
    }
    log(await usersService.patchById(req.body.id, req.body));
    res.status(204).send();
  }

  async putUser(req: Request, res: Response) {
    req.body.password = await argon2.hash(req.body.password);
    log(await usersService.putById(req.body.id, req.body));
    res.status(204).send();
  }

  async deleteUser(req: Request, res: Response) {
    await usersService.deleteById(req.body.id);
    res.status(200).send();
  }
}

export default new UsersController();
