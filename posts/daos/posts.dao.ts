import debug from "debug";
import shortid from "shortid";
import mongooseService from "../../common/services/mongoose.service";
import { CreatePostDto } from "../dtos/create.post.dto";
import { PatchPostDto } from "../dtos/patch.post.dto";
import { PutPostDto } from "../dtos/put.post.dto";

const log: debug.IDebugger = debug("app::PostsDao");

class PostsDao {
  Schema = mongooseService.getMongoose().Schema;
  postSchema = new this.Schema(
    {
      _id: String,
      title: { type: String, unique: true },
      post: String,
      user: {
        type: this.Schema.Types.String,
        ref: "User",
        required: true,
      },
      image: String,
    },
    { id: false, timestamps: true }
  );

  Post = mongooseService.getMongoose().model("Post", this.postSchema);

  constructor() {
    log("Created a new USERS instance");
  }

  async getAllPosts(limit = 25, page = 0, user: any) {
    return await this.Post.find({})
      .populate("user")
      .limit(limit)
      .skip(limit * page)
      .exec();
  }

  async addPost(postFields: CreatePostDto, user: any) {
    const postId = shortid.generate();

    const post = new this.Post({ _id: postId, user: user._id, ...postFields });

    await post.save();
    return postId;
  }

  async getPostById(postId: string, user: any) {
    return this.Post.findOne({ _id: postId, user: user._id })
      .populate("user")
      .exec();
  }

  async getPostByTitle(title: string) {
    return this.Post.findOne({ title }).exec();
  }

  async updatePostById(
    postId: string,
    postFields: PatchPostDto | PutPostDto
  ) {
    const existingPost = await this.Post.findOneAndUpdate(
      { _id: postId },
      { $set: postFields },
      { new: true }
    ).exec();

    return existingPost;
  }

  async deletePostById(postId: string) {
    return this.Post.findOneAndDelete({ _id: postId }).exec();
  }
}

export default new PostsDao();
