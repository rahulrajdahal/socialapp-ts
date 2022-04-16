import { expect } from "chai";
import mongoose from "mongoose";
import shortid from "shortid";
import supertest from "supertest";
import app from "../../app";

const firstUserBody = {
  fullName: `Rajesh Hamal-${shortid.generate()}`,
  email: `rajesh.hamal-${shortid.generate()}@hamal.com`,
  password: "Heyyy!1!",
};
let firstUserId: string;
export let accessToken: string;
let refreshToken: string;

const firstPostBody = {
  title: `Post Title-${shortid.generate()}`,
  post: " Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin odio elit, ultrices eget tellus nec, facilisis molestie leo. Suspendisse eu tincidunt ipsum. Sed facilisis consequat tincidunt. Nulla id dignissim lorem. Interdum et malesuada fames ac ante ipsum primis in faucibus. In quis congue nibh. Aliquam mattis dictum orci non rutrum. Nulla accumsan sem risus, a ultricies velit porttitor quis. Cras et posuere nisi. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Morbi nec velit vitae urna vehicula pretium. Vivamus ultrices, quam quis semper cursus, orci nulla elementum ex, nec tempor orci mauris non est. Vivamus laoreet semper turpis eu sagittis. Suspendisse vulputate accumsan nisl eu mattis. Praesent congue auctor justo eu malesuada. Quisque in neque elit. Donec id purus tristique, suscipit felis quis, sodales felis. Donec nisl eros, gravida non convallis vel, lacinia non sapien. Duis semper posuere ultrices. Mauris id metus id dolor mollis commodo. Aliquam volutpat tellus a urna luctus, ultrices viverra justo molestie. ",
  image: "Heyyy!1!",
};
let firstPostId: string;

describe("users auth endpoints", () => {
  let request: supertest.SuperAgentTest;

  before(() => {
    request = supertest.agent(app);
  });

  after((done) => {
    app.close(() => {
      mongoose.connection.close(done);
    });
  });

  it("should allow POST to /users", async () => {
    const res = await request.post("/users").send(firstUserBody);

    expect(res.status).to.equal(201);
    expect(res.body).not.to.be.empty;
    expect(res.body).to.be.an("object");
    expect(res.body._id).to.be.a("string");
    firstUserId = res.body._id;
  });

  it("should allow POST to /auth", async () => {
    const res = await request
      .post("/auth")
      .send({ email: firstUserBody.email, password: firstUserBody.password });

    expect(res.status).to.equal(201);
    expect(res.body).not.to.be.empty;
    expect(res.body).to.be.an("object");
    expect(res.body.accessToken).to.be.a("string");
    accessToken = res.body.accessToken;
    refreshToken = res.body.refreshToken;
  });

  it("should allow GET to /user/:userId with an accessToken", async () => {
    const res = await request
      .get(`/users/${firstUserId}`)
      .set({ Authorization: `Bearer ${accessToken}` })
      .send();
    expect(res.status).to.equal(200);
    expect(res.body).not.to.be.empty;
    expect(res.body).to.be.an("object");
    expect(res.body._id).to.be.a("string");
    expect(res.body._id).to.equal(firstUserId);
    expect(res.body.email).to.equal(firstUserBody.email);
  });

  it("should allow POST to /auth/refresh-token", async () => {
    const res = await request
      .post("/auth/refresh-token")
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({ refreshToken });
    expect(res.status).to.equal(201);
    expect(res.body).not.to.be.empty;
    expect(res.body).to.be.an("object");
    expect(res.body.accessToken).to.be.a("string");
    accessToken = res.body.accessToken;
    refreshToken = res.body.refreshToken;
  });

  it("should allow PATCH to /user/:userId with an accessToken", async () => {
    const res = await request
      .patch(`/users/${firstUserId}`)
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({ fullName: `Rajesh Dai ${shortid.generate()}` });
    expect(res.status).to.equal(204);
    expect(res.body).to.be.empty;
  });

  it("should allow PUT to /user/:userId with an accessToken", async () => {
    const res = await request
      .put(`/users/${firstUserId}`)
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        fullName: `Rajesh Dai ${shortid.generate()}`,
        email: firstUserBody.email,
        password: firstUserBody.password,
        avatar: "user-image",
      });
    expect(res.status).to.equal(204);
    expect(res.body).to.be.empty;
  });

  it("should allow POST to /posts with an accessToken", async () => {
    const res = await request
      .post("/posts")
      .set({ Authorization: `Bearer ${accessToken}` })
      .send(firstPostBody);

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
        title: `PUT post title ${shortid.generate()}`,
        post: "lorem impsum put",
        image: "putimage",
      });
    expect(res.status).to.equal(204);
    expect(res.body).to.be.empty;
  });

  it("should allow DELETE to /post/:postId with an accessToken", async () => {
    const res = await request
      .delete(`/posts/${firstPostId}`)
      .set({ Authorization: `Bearer ${accessToken}` })
      .send();
    expect(res.status).to.equal(200);
    expect(res.body).to.be.empty;
  });

  it("should allow DELETE to /user/:userId with an accessToken", async () => {
    const res = await request
      .delete(`/users/${firstUserId}`)
      .set({ Authorization: `Bearer ${accessToken}` })
      .send();
    expect(res.status).to.equal(200);
    expect(res.body).to.be.empty;
  });
});
