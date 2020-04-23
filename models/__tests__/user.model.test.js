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
      name: "user0",
      email: "user0@email.com",
      password: "user0password",
      created: new Date(0),
    });
    const savedUser = await user.save();
    const expected = "user0";
    const actual = savedUser.name;
    expect(actual).toEqual(expected);
  });
});

describe("get user", () => {
  it("gets a user", async () => {
    const user = new userModel({
      name: "user1",
      email: "user1@email.com",
      password: "user1password",
      created: new Date(0),
    });
    await user.save();

    const foundUser = await userModel.findOne({ name: "user1" });
    const expected = "user1";
    const actual = foundUser.name;
    expect(actual).toEqual(expected);
  });
});

describe("update a user", () => {
  it("updates a user", async () => {
    const user = new userModel({
      name: "user2",
      email: "user2@email.com",
      password: "user2password",
      created: new Date(0),
    });
    await user.save();

    user.name = "user2edit";
    const updatedUser = await user.save();

    const expected = "user2edit";
    const actual = updatedUser.name;
    expect(actual).toEqual(expected);
  });
});
