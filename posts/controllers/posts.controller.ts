import debug from "debug";
import { Response, Request } from "express";
import postService from "../services/posts.service";

const log: debug.IDebugger = debug("app::posts-service");

class PostsController {
  getAllPosts = async (req: Request, res: Response) => {
    const posts = await postService.getAll(100, 0, req.body.user);
    res.status(200).send(posts);
  };

  createPost = async (req: Request, res: Response) => {
    const postId = await postService.create(req.body, req.body.user);
    res.status(201).send({ _id: postId });
  };

  getPost = async (req: Request, res: Response) => {
    const post = await postService.getById(req.body.id, req.body.user);
    res.status(200).send({ post });
  };

  patchPost = async (req: Request, res: Response) => {
    log(await postService.patchById(req.body.id, req.body));
    res.status(204).send();
  };

  putPost = async (req: Request, res: Response) => {
    log(await postService.putById(req.body.id, req.body));
    res.status(204).send();
  };

  deletePost = async (req: Request, res: Response) => {
    await postService.deleteById(req.body.id);
    res.status(200).send();
  };
}
export default new PostsController();
