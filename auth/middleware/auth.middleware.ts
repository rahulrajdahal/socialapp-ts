import argon2 from "argon2";
import { Request, Response, NextFunction } from "express";
import usersService from "../../users/services/users.service";

class AuthMiddleware {
  async verifyUserPassword(req: Request, res: Response, next: NextFunction) {
    const user: any = await usersService.getByEmailWithPassword(req.body.email);

    if (user) {
      const passwordHash = user.password;
      if (await argon2.verify(passwordHash, req.body.password)) {
        req.body = { userId: user._id, email: user.email };
        return next();
      }
    }

    res.status(400).send({ errors: ["Invalid email and/or password."] });
  }
}

export default new AuthMiddleware();
