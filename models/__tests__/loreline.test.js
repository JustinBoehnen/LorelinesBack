const dbHandler = require("../../db-handler");
const lorelineModel = require("../loreline.model");

beforeAll(async () => {
  await dbHandler.connect();
});

afterEach(async () => {
  await dbHandler.clearDatabase();
});

afterAll(async () => {
  await dbHandler.closeDatabase();
});

describe("loreline model test", () => {
  it("has a module", () => {
    expect(lorelineModel).toBeDefined();
  });
});

describe("save loreline", () => {
  it("saves a loreline", async () => {
    const loreline = new lorelineModel({
      name: "loreline0",
      modified: new Date(0),
    });
    const savedloreline = await loreline.save();
    const expected = "loreline0";
    const actual = savedloreline.name;
    expect(actual).toEqual(expected);
  });
});

describe("get loreline", () => {
  it("gets a loreline", async () => {
    const loreline = new lorelineModel({
      name: "loreline1",
      modified: new Date(0),
    });
    await loreline.save();

    const foundloreline = await lorelineModel.findOne({
      name: "loreline1",
    });
    const expected = "loreline1";
    const actual = foundloreline.name;
    expect(actual).toEqual(expected);
  });
});

describe("update a loreline", () => {
  it("updates a loreline", async () => {
    const loreline = new lorelineModel({
      name: "loreline2",
      modified: new Date(0),
    });
    await loreline.save();

    loreline.name = "loreline2edit";
    const updatedloreline = await loreline.save();

    const expected = "loreline2edit";
    const actual = updatedloreline.name;
    expect(actual).toEqual(expected);
  });
});
