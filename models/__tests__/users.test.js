const dbHandler = require("../../db-handler");
const userModel = require("../user.model");
const lorelineModel = require("../loreline.model");
const supertest = require("supertest");
const app = require("../../app");
const request = supertest(app);

beforeAll(async () => {
  await dbHandler.connect();
});

afterEach(async () => {
  await dbHandler.clearDatabase();
});

afterAll(async () => {
  await dbHandler.closeDatabase();
});
/////////////////////////////////////////////////////////////////////////////////////////////////////
describe("create user route tests", () => {
  it("simple user post", async () => {
    const response = await request.post("/api/users/").send({
      name: "testUser1",
      email: "testUser1@email.com",
      password: "testPassword1",
    });
    expect(response.status).toBe(200);
  });

  it("bad email user post", async () => {
    const response = await request.post("/api/users/").send({
      name: "testUser2",
      email: "testUser2email.com",
      password: "testPassword2",
    });
    expect(response.status).toBe(409);
  });

  it("empty username user post", async () => {
    const response = await request.post("/api/users/").send({
      name: "",
      email: "testUser3@email.com",
      password: "testPassword3",
    });
    expect(response.status).toBe(409);
  });

  it("empty email user post", async () => {
    const response = await request.post("/api/users/").send({
      name: "testUser4",
      email: "",
      password: "testPassword4",
    });
    expect(response.status).toBe(409);
  });

  it("empty password user post", async () => {
    const response = await request.post("/api/users/").send({
      name: "testUser5",
      email: "testUser5@email.com",
      password: "",
    });
    expect(response.status).toBe(409);
  });

  it("duplicate user post", async () => {
    request.post("/api/users/").send({
      name: "testUser6",
      email: "testUser6@email.com",
      password: "testPassword6",
    });
    const response = await request.post("/api/users/").send({
      name: "testUser6",
      email: "testUser6@email.com",
      password: "testPassword6",
    });
    expect(response.status).toBe(200);
  });
});
////////////////////////////////////////////////////////////////////////////////////////////////////
describe("create loreline route tests", () => {
  it("simple loreline add", async () => {
    const user = new userModel({
      name: "user",
      email: "user@email.com",
      password: "userpassword",
      created: new Date(0),
    });
    const tempUser = await user.save();
    const response = await request
      .post(`/api/users/${tempUser._id}/lorelines`)
      .send({
        name: "testLoreline1",
      });
    expect(response.status).toBe(200);
  });

  it("empty loreline name", async () => {
    const user = new userModel({
      name: "user",
      email: "user@email.com",
      password: "userpassword",
      created: new Date(0),
    });
    const tempUser = await user.save();
    const response = await request
      .post(`/api/users/${tempUser._id}/lorelines`)
      .send({
        name: "",
      });
    expect(response.status).toBe(409);
  });

  it("duplicate loreline", async () => {
    const user = new userModel({
      name: "user",
      email: "user@email.com",
      password: "userpassword",
      created: new Date(0),
    });
    const tempUser = await user.save();
    await request.post(`/api/users/${tempUser._id}/lorelines`).send({
      name: "testLoreline3",
    });
    const response = await request
      .post(`/api/users/${tempUser._id}/lorelines`)
      .send({
        name: "testLoreline3",
      });
    expect(response.status).toBe(200);
  });

  it("add loreline to non-existant user", async () => {
    const response = await request.post(`/api/users/0/lorelines`).send({
      name: "testLoreline4",
    });
    expect(response.status).toBe(404);
  });

  it("loreline with invalid image", async () => {
    const user = new userModel({
      name: "user",
      email: "user@email.com",
      password: "userpassword",
      created: new Date(0),
    });
    const tempUser = await user.save();
    const response = await request
      .post(`/api/users/${tempUser._id}/lorelines`)
      .send({
        name: "testLoreline5",
        image: "invalidtext",
      });
    expect(response.status).toBe(409);
  });
});
////////////////////////////////////////////////////////////////////////////////////////////////////
describe("delete loreline route tests", () => {
  it("simple delete loreline", async () => {
    const user = new userModel({
      name: "user",
      email: "user@email.com",
      password: "userpassword",
      created: new Date(0),
    });
    const tempUser = await user.save();
    const loreline = new lorelineModel({
      name: "loreline",
      modified: new Date(0),
    });
    const tempLoreline = await loreline.save();
    const response = await request.delete(
      `/api/users/${tempUser._id}/lorelines/${tempLoreline._id}`
    );
    expect(response.status).toBe(200);
  });

  it("delete loreline that doesn't exist", async () => {
    const user = new userModel({
      name: "user",
      email: "user@email.com",
      password: "userpassword",
      created: new Date(0),
    });
    const tempUser = await user.save();
    const response = await request.delete(
      `/api/users/${tempUser._id}/lorelines/0`
    );
    expect(response.status).toBe(404);
  });

  it("delete loreline from user that doesn't exist", async () => {
    const loreline = new lorelineModel({
      name: "loreline",
      modified: new Date(0),
    });
    const tempLoreline = await loreline.save();
    const response = await request.delete(
      `/api/users/0/lorelines/${tempLoreline._id}`
    );
    expect(response.status).toBe(404);
  });
  it("delete non-existant loreline from non-existant user", async () => {
    const response = await request.delete(`/api/users/0/lorelines/0`);
    expect(response.status).toBe(404);
  });
});
////////////////////////////////////////////////////////////////////////////////////////////////////
describe("get lorelines route tests", () => {
  it("get with one loreline", async () => {
    const user = new userModel({
      name: "user",
      email: "user@email.com",
      password: "userpassword",
      created: new Date(0),
    });
    const tempUser = await user.save();
    await request.post(`/api/users/${tempUser._id}/lorelines`).send({
      name: "testLoreline1",
    });
    const response = await request.get(`/api/users/${tempUser._id}/lorelines`);
    expect(response.status).toBe(200);
  });

  it("get with multiple lorelines", async () => {
    const user = new userModel({
      name: "user",
      email: "user@email.com",
      password: "userpassword",
      created: new Date(0),
    });
    const tempUser = await user.save();
    await request.post(`/api/users/${tempUser._id}/lorelines`).send({
      name: "testLoreline1",
    });
    await request.post(`/api/users/${tempUser._id}/lorelines`).send({
      name: "testLoreline2",
    });
    await request.post(`/api/users/${tempUser._id}/lorelines`).send({
      name: "testLoreline3",
    });
    const response = await request.get(`/api/users/${tempUser._id}/lorelines`);
    expect(response.status).toBe(200);
  });

  it("get with no lorelines", async () => {
    const user = new userModel({
      name: "user",
      email: "user@email.com",
      password: "userpassword",
      created: new Date(0),
    });
    const tempUser = await user.save();
    const response = await request.get(`/api/users/${tempUser._id}/lorelines`);
    expect(response.status).toBe(200);
  });

  it("get with invalid user", async () => {
    const response = await request.get(`/api/users/0/lorelines`);
    expect(response.status).toBe(404);
  });
});
////////////////////////////////////////////////////////////////////////////////////////////////////
describe("get specific loreline route tests", () => {
  it("get a loreline with only one loreline", async () => {
    const user = new userModel({
      name: "user",
      email: "user@email.com",
      password: "userpassword",
      created: new Date(0),
    });
    const tempUser = await user.save();
    const loreline = new lorelineModel({
      name: "loreline",
      modified: new Date(0),
    });
    const tempLoreline = await loreline.save();
    response = await request.get(
      `/api/users/${tempUser._id}/lorelines/${tempLoreline._id}`
    );
    expect(response.status).toBe(200);
  });

  it("get a loreline with multiple lorelines", async () => {
    const user = new userModel({
      name: "user",
      email: "user@email.com",
      password: "userpassword",
      created: new Date(0),
    });
    const tempUser = await user.save();
    const loreline = new lorelineModel({
      name: "loreline",
      modified: new Date(0),
    });
    const tempLoreline = await loreline.save();
    await request.post(`/api/users/${tempUser._id}/lorelines`).send({
      name: "testLoreline1",
    });
    await request.post(`/api/users/${tempUser._id}/lorelines`).send({
      name: "testLoreline2",
    });
    await request.post(`/api/users/${tempUser._id}/lorelines`).send({
      name: "testLoreline3",
    });
    response = await request.get(
      `/api/users/${tempUser._id}/lorelines/${tempLoreline._id}`
    );
    expect(response.status).toBe(200);
  });

  it("get a loreline that doesn't exist", async () => {
    const user = new userModel({
      name: "user",
      email: "user@email.com",
      password: "userpassword",
      created: new Date(0),
    });
    const tempUser = await user.save();
    response = await request.get(`/api/users/${tempUser._id}/lorelines/0`);
    expect(response.status).toBe(404);
  });

  it("get a loreline from a user that doesn't exist", async () => {
    const loreline = new lorelineModel({
      name: "loreline",
      modified: new Date(0),
    });
    const tempLoreline = await loreline.save();
    response = await request.get(`/api/users/0/lorelines/${tempLoreline._id}`);
    expect(response.status).toBe(200);
  });
});
