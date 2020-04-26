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
