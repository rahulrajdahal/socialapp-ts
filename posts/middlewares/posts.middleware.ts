import { NextFunction, Request, Response } from "express";
import jwtMiddleware from "../../auth/middleware/jwt.middleware";
import usersService from "../../users/services/users.service";
import postsService from "../services/posts.service";

class PostsMiddleware {
  validatePostExists = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const post = await postsService.getById(req.params.postId, res.locals.user);

    if (post) {
      res.locals.post = post;
      next();
    } else {
      res.status(404).send({ error: `Post ${req.params.postId} not found.` });
    }
  };

  extractPostId = async (req: Request, res: Response, next: NextFunction) => {
    req.body.id = req.params.postId;
    next();
  };

  verifyTitleDoesntExist = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const post = await postsService.getByTitle(req.body.title);
    if (post) {
      res.status(400).send({ error: "Post title already exists" });
    } else {
      next();
    }
  };

  getUser = async (req: Request, res: Response, next: NextFunction) => {
    const userId = res.locals.jwt.userId;
    const user = await usersService.getById(userId);
    if (user) {
      req.body.user = user;
      next();
    } else {
      res.status(401).send({ error: "Please authenticate." });
    }
  };
}

export default new PostsMiddleware();
