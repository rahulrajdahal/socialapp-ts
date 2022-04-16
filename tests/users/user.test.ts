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

export let firstUserId: string;
export let accessToken: string;
let refreshToken: string;

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

  it("should allow DELETE to /user/:userId with an accessToken", async () => {
    const res = await request
      .delete(`/users/${firstUserId}`)
      .set({ Authorization: `Bearer ${accessToken}` })
      .send();
    expect(res.status).to.equal(200);
    expect(res.body).to.be.empty;
  });
});
