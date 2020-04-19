var mongoose = require("mongoose");
var mongoDB = "mongodb://127.0.0.1/lorelines_test_database";
mongoose.connect(mongoDB);
const User = require("../user.model");

describe("User model test", () => {
  beforeAll(async () => {
    await User.remove({});
  });
});

afterEach(async () => {
  await User.remove({});
});

afterAll(async () => {
  await mongoose.connection.close();
});

it("has a module", () => {
  expect(User).toBeDefined();
});
