import { Application } from "express";
import { body } from "express-validator";
import jwtMiddleware from "../auth/middleware/jwt.middleware";
import { CommonRoutesConfig } from "../common/common.routes.config";
import bodyValidationMiddleware from "../common/middlewares/body.validation.middleware";
import usersController from "./controllers/users.controller";
import usersMiddleware from "./middlewares/users.middleware";

export class UsersRoutes extends CommonRoutesConfig {
  constructor(app: Application) {
    super(app, "UsersRoutes");
  }

  configureRoutes() {
    this.app
      .route("/users")
      .get(usersController.getAllUsers, jwtMiddleware.validJwtNeeded)
      .post(
        body("email").isEmail(),
        body("password")
          .isLength({ min: 5 })
          .withMessage("5+ characters required."),
        body("fullName").isString(),
        bodyValidationMiddleware.verifyBodyFieldErrors,
        usersMiddleware.validateSameEmailDoesntExist,
        usersController.createUser
      );

    this.app.param("userId", usersMiddleware.extractUserId);

    this.app
      .route("/users/:userId")
      .all(usersMiddleware.validateUserExists, jwtMiddleware.validJwtNeeded)
      .get(usersController.getUser)
      .delete(usersMiddleware.deletePosts, usersController.deleteUser);

    this.app
      .route("/users/:userId")
      .patch(
        body("email").isEmail().optional(),
        body("password")
          .isLength({ min: 5 })
          .withMessage("5+ characters required.")
          .optional(),
        body("fullName").isString().optional(),
        body("avatar").isString().optional(),
        bodyValidationMiddleware.verifyBodyFieldErrors,
        usersController.patchUser
      );
    this.app
      .route("/users/:userId")
      .put(
        body("email").isEmail(),
        body("password")
          .isLength({ min: 5 })
          .withMessage("5+ characters required."),
        body("fullName").isString(),
        body("avatar").isString(),
        bodyValidationMiddleware.verifyBodyFieldErrors,
        usersMiddleware.validateSameEmailBelongToSameUser,
        usersController.putUser
      );

    return this.app;
  }
}
