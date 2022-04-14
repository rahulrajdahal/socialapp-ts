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

let firstUserId;

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

  // it("should allow POST to /users", async () => {
  //   const res = await request.post("/users").send(firstUserBody);

  //   expect(res.status).to.equal(201);
  // });
});
