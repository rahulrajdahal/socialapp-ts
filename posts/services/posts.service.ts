import debug from "debug";
import { ObjectId } from "mongoose";
import { CRUD } from "../../common/interfaces/crud.interface";
import postsDao from "../daos/posts.dao";

const log: debug.IDebugger = debug("app::posts-service");

class PostService implements CRUD {
  async getAll(limit: number, page: number, user: any) {
    return postsDao.getAllPosts(limit, page, user);
  }
  async create(resource: any, user: any) {
    return postsDao.addPost(resource, user);
  }
  async getById(id: string, user: any) {
    return postsDao.getPostById(id, user);
  }
  async getByTitle(id: string) {
    return postsDao.getPostByTitle(id);
  }
  async patchById(id: string, resource: any) {
    return postsDao.updatePostById(id, resource);
  }
  async putById(id: string, resource: any) {
    return postsDao.updatePostById(id, resource);
  }
  async deleteById(id: string) {
    return postsDao.deletePostById(id);
  }
  async deleteAll(user: string) {
    return postsDao.deleteAllPosts(user);
  }
}

export default new PostService();
