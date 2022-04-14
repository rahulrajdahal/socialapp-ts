import { Request, Response } from "express";
import debug from "debug";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import usersDao from "../../users/daos/users.dao";

const log: debug.IDebugger = debug("app: auth-controller");

// @ts-expect-error
const jwtSecret: string = process.env.JWT_SECRET;
const tokenExpirationInSeconds = 36000;

class AuthController {
  async createJWT(req: Request, res: Response) {
    try {
      const refreshId = req.body.userId + jwtSecret;
      const salt = crypto.createSecretKey(crypto.randomBytes(16));
      const hash = crypto
        .createHmac("sha512", salt)
        .update(refreshId)
        .digest("base64");
      req.body.refreshKey = salt.export();
      const token = jwt.sign(req.body, jwtSecret, {
        expiresIn: tokenExpirationInSeconds,
      });

      const user = usersDao.getUserByEmail(req.body.email);
      console.log(user);

      return res.status(201).send({ accessToken: token, resfreshToken: hash });
    } catch (e) {
      log("create JWT error: ", e);
      return res.status(500).send();
    }
  }
}

export default new AuthController();
