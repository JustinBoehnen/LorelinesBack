const dbHandler = require("../../db-handler");
const userModel = require("../user.model");

beforeAll(async () => {
  await dbHandler.connect();
});

afterEach(async () => {
  await dbHandler.clearDatabase();
});

afterAll(async () => {
  await dbHandler.closeDatabase();
});

describe("user model test", () => {
  it("has a module", () => {
    expect(userModel).toBeDefined();
  });
});

describe("save user", () => {
  it("saves a user", async () => {
    const user = new userModel({
      name: "testUser1",
      email: "testUser1@email.com",
      password: "testUser1password",
      created: new Date(0),
    });
    const savedUser = await user.save();
    const expected = "testUser1";
    const actual = savedUser.name;
    expect(actual).toEqual(expected);
  });
});

describe("get user", () => {
  it("gets a user", async () => {
    const user = new userModel({
      name: "testUser0",
      email: "testUser0@email.com",
      password: "testUser0password",
      created: new Date(0),
    });
    await user.save();

    const foundUser = await userModel.findOne({ name: "testUser0" });
    const expected = "testUser0";
    const actual = foundUser.name;
    expect(actual).toEqual(expected);
  });
});

describe("update a user", () => {
  it("updates a user", async () => {
    const user = new userModel({
      name: "testUser2",
      email: "testUser2@email.com",
      password: "testUser2password",
      created: new Date(0),
    });
    await user.save();

    user.name = "testUser2edit";
    const updatedUser = await user.save();

    const expected = "testUser2edit";
    const actual = updatedUser.name;
    expect(actual).toEqual(expected);
  });
});
