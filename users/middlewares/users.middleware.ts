import debug from "debug";
import { Request, Response, NextFunction } from "express";
import postsService from "../../posts/services/posts.service";

import usersService from "../services/users.service";

const log: debug.IDebugger = debug("app:users-middleware");

class UsersMiddleware {
  async validateSameEmailDoesntExist(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const user = await usersService.getByEmail(req.body.email);
    if (user) {
      res.status(400).send({ error: "User email already exists" });
    } else {
      next();
    }
  }

  async validateSameEmailBelongToSameUser(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    console.log("res", res.locals);
    if (res.locals.user._id === req.params.userId) {
      next();
    } else {
      res.status(400).send({ error: "Invalid email" });
    }
  }

  async validatePatchEmail(req: Request, res: Response, next: NextFunction) {
    if (req.body.email) {
      log("Validating email", req.body.email);

      this.validateSameEmailBelongToSameUser(req, res, next);
    } else {
      next();
    }
  }

  async validateUserExists(req: Request, res: Response, next: NextFunction) {
    const user = await usersService.getById(req.params.userId);

    if (user) {
      res.locals.user = user;
      next();
    } else {
      res.status(404).send({ error: `User ${req.params.userId} not found.` });
    }
  }

  async extractUserId(req: Request, res: Response, next: NextFunction) {
    req.body.id = req.params.userId;
    next();
  }
  deletePosts = async (req: Request, res: Response, next: NextFunction) => {
    const user = await usersService.getById(req.params.userId);

    if (user) {
      res.locals.user = user;
      await postsService.deleteAll(user);
      next();
    } else {
      res.status(404).send({ error: `User ${req.params.userId} not found.` });
    }
  };
}

export default new UsersMiddleware();
