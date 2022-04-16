import { firstUserId } from "./../users/user.test";
import { expect } from "chai";
import mongoose from "mongoose";
import shortid from "shortid";
import supertest from "supertest";
import app from "../../app";
import { accessToken } from "../users/user.test";

const firstPostBody = {
  user: firstUserId,
  title: `Post Title-${shortid.generate()}`,
  description:
    " Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin odio elit, ultrices eget tellus nec, facilisis molestie leo. Suspendisse eu tincidunt ipsum. Sed facilisis consequat tincidunt. Nulla id dignissim lorem. Interdum et malesuada fames ac ante ipsum primis in faucibus. In quis congue nibh. Aliquam mattis dictum orci non rutrum. Nulla accumsan sem risus, a ultricies velit porttitor quis. Cras et posuere nisi. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Morbi nec velit vitae urna vehicula pretium. Vivamus ultrices, quam quis semper cursus, orci nulla elementum ex, nec tempor orci mauris non est. Vivamus laoreet semper turpis eu sagittis. Suspendisse vulputate accumsan nisl eu mattis. Praesent congue auctor justo eu malesuada. Quisque in neque elit. Donec id purus tristique, suscipit felis quis, sodales felis. Donec nisl eros, gravida non convallis vel, lacinia non sapien. Duis semper posuere ultrices. Mauris id metus id dolor mollis commodo. Aliquam volutpat tellus a urna luctus, ultrices viverra justo molestie. ",
  image: "Heyyy!1!",
};

let firstPostId: string;

describe("posts endpoints", () => {
  let request: supertest.SuperAgentTest;

  before(() => {
    request = supertest.agent(app);
  });

  after((done) => {
    app.close(() => {
      mongoose.connection.close(done);
    });
  });

  it("should allow POST to /posts", async () => {
    const res = await request.post("/posts").send(firstPostBody);

    expect(res.status).to.equal(201);
    expect(res.body).not.to.be.empty;
    expect(res.body).to.be.an("object");
    expect(res.body._id).to.be.a("string");
    firstPostId = res.body._id;
  });

  it("should allow GET to /post/:postId with an accessToken", async () => {
    const res = await request
      .get(`/posts/${firstPostId}`)
      .set({ Authorization: `Bearer ${accessToken}` })
      .send();
    expect(res.status).to.equal(200);
    expect(res.body).not.to.be.empty;
    expect(res.body).to.be.an("object");
    expect(res.body._id).to.be.a("string");
    expect(res.body._id).to.equal(firstPostId);
    expect(res.body.title).to.equal(firstPostBody.title);
  });

  it("should allow PATCH to /post/:postId with an accessToken", async () => {
    const res = await request
      .patch(`/posts/${firstPostId}`)
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({ title: `Patch Post Title` });
    expect(res.status).to.equal(204);
    expect(res.body).to.be.empty;
  });

  it("should allow PUT to /post/:postId with an accessToken", async () => {
    const res = await request
      .put(`/posts/${firstPostId}`)
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        title: "PUT post title",
        description: "lorem impsum put",
        image: "putimage",
      });
    expect(res.status).to.equal(204);
    expect(res.body).to.be.empty;
  });

  it("should allow DELETE to /post/:postId with an accessToken", async () => {
    const res = await request
      .delete(`/post/${firstPostId}`)
      .set({ Authorization: `Bearer ${accessToken}` })
      .send();
    expect(res.status).to.equal(200);
    expect(res.body).to.be.empty;
  });
});
