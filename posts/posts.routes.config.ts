import { Application } from "express";
import { body } from "express-validator";
import jwtMiddleware from "../auth/middleware/jwt.middleware";
import { CommonRoutesConfig } from "../common/common.routes.config";
import bodyValidationMiddleware from "../common/middlewares/body.validation.middleware";
import postsController from "./controllers/posts.controller";
import postsMiddleware from "./middlewares/posts.middleware";

export class PostsRoutes extends CommonRoutesConfig {
  constructor(app: Application) {
    super(app, "PostsRoutes");
  }

  configureRoutes() {
    this.app
      .route("/posts")
      .get(
        jwtMiddleware.validJwtNeeded,
        postsMiddleware.getUser,
        postsController.getAllPosts
      )
      .post(
        body("title").isString(),
        body("post").isString(),
        body("image").isString(),
        bodyValidationMiddleware.verifyBodyFieldErrors,
        jwtMiddleware.validJwtNeeded,
        postsMiddleware.getUser,
        postsMiddleware.verifyTitleDoesntExist,
        postsController.createPost
      );

    this.app.param("postId", postsMiddleware.extractPostId);

    this.app
      .route("/posts/:postId")
      .all(jwtMiddleware.validJwtNeeded)
      .get(postsMiddleware.getUser, postsController.getPost)
      .delete(postsController.deletePost);

    this.app
      .route("/posts/:postId")
      .patch(
        body("title").isString().optional(),
        body("post").isString().optional(),
        body("image").isString().optional(),
        bodyValidationMiddleware.verifyBodyFieldErrors,
        postsMiddleware.verifyTitleDoesntExist,
        postsController.patchPost
      );

    this.app
      .route("/posts/:postId")
      .put(
        body("title").isString(),
        body("post").isString(),
        body("image").isString(),
        bodyValidationMiddleware.verifyBodyFieldErrors,
        postsMiddleware.verifyTitleDoesntExist,
        postsController.putPost
      );

    return this.app;
  }
}
