const dbHandler = require("../../db-handler");
const userModel = require("../user.model");
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

describe("user route tests", () => {
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

  it("long username user post", async () => {
    const response = await request.post("/api/users/").send({
      name: "testUser6",
      email: "testUser6@email.com",
      password: "testPassword6",
    });

    expect(response.status).toBe(200);
  });
});
