const dbHandler = require("../../db-handler");
const customEntityModel = require("../customEntity.model");

beforeAll(async () => {
  await dbHandler.connect();
});

afterEach(async () => {
  await dbHandler.clearDatabase();
});

afterAll(async () => {
  await dbHandler.closeDatabase();
});

describe("custom entity model test", () => {
  it("has a module", () => {
    expect(customEntityModel).toBeDefined();
  });
});

describe("save custom entity", () => {
  it("saves a custom entity", async () => {
    const customEntity = new customEntityModel({
      name: "customEntity0",
      color: "#000000",
      content: [
        {
          type: "TEXT_FIELD",
          name: "fieldType",
        },
      ],
      ownerId: "000000000000000000000000",
    });
    const savedCustomEntity = await customEntity.save();
    const expected = "customEntity0";
    const actual = savedCustomEntity.name;
    expect(actual).toEqual(expected);
  });
});

describe("get custom entity", () => {
  it("gets a custom entity", async () => {
    const customEntity = new customEntityModel({
      name: "customEntity1",
      color: "#000000",
      content: [
        {
          type: "TEXT_FIELD",
          name: "fieldType",
        },
      ],
      ownerId: "000000000000000000000000",
    });
    await customEntity.save();

    const foundCustomEntity = await customEntityModel.findOne({
      name: "customEntity1",
    });
    const expected = "customEntity1";
    const actual = foundCustomEntity.name;
    expect(actual).toEqual(expected);
  });
});

describe("update a custom entity", () => {
  it("updates a custom entity", async () => {
    const customEntity = new customEntityModel({
      name: "customEntity1",
      color: "#000000",
      content: [
        {
          type: "TEXT_FIELD",
          name: "fieldType",
        },
      ],
      ownerId: "000000000000000000000000",
    });
    await customEntity.save();

    customEntity.name = "testCustomEntity2edit";
    const updatedCustomEntity = await customEntity.save();

    const expected = "testCustomEntity2edit";
    const actual = updatedCustomEntity.name;
    expect(actual).toEqual(expected);
  });
});
