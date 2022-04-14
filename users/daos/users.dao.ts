import debug from "debug";
import shortid from "shortid";
import mongooseService from "../../common/services/mongoose.service";
import { CreateUserDto } from "../dtos/create.user.dto";
import { PatchUserDto } from "../dtos/patch.user.dto";
import { PutUserDto } from "../dtos/put.user.dto";

const log: debug.IDebugger = debug("app:: users-dao");

class UsersDao {
  Schema = mongooseService.getMongoose().Schema;
  userSchema = new this.Schema(
    {
      _id: String,
      fullName: String,
      email: { type: String, unique: true },
      password: { type: String, select: false },
      avatar: String,
    },
    { id: false, timestamps: true }
  );

  User = mongooseService.getMongoose().model("User", this.userSchema);

  constructor() {
    log("Created a new USERS instance");
  }

  async getAllUsers(limit = 25, page = 0) {
    return this.User.find({})
      .limit(limit)
      .skip(limit * page)
      .exec();
  }

  async addUser(userFields: CreateUserDto) {
    const userId = shortid.generate();
    const user = new this.User({ _id: userId, ...userFields });

    await user.save();
    return userId;
  }

  async getUserById(userId: string) {
    return this.User.findOne({ _id: userId })
      .select("fullName email avatar")
      .exec();
  }

  async getUserByEmail(email: string) {
    return this.User.findOne({ email }).exec();
  }

  async getUserByEmailWithPassword(email: string) {
    return this.User.findOne({ email }).select("_id email + password").exec();
  }

  async updateUserById(userId: string, userFields: PatchUserDto | PutUserDto) {
    const existingUser = await this.User.findOneAndUpdate(
      { _id: userId },
      { $set: userFields },
      { new: true }
    ).exec();

    return existingUser;
  }

  async deleteUserById(userId: string) {
    return this.User.findOneAndDelete({ _id: userId }).exec();
  }
}

export default new UsersDao();
