const dbHandler = require("../../db-handler");
const entityInstanceModel = require("../entityInstance.model");

beforeAll(async () => {
  await dbHandler.connect();
});

afterEach(async () => {
  await dbHandler.clearDatabase();
});

afterAll(async () => {
  await dbHandler.closeDatabase();
});

describe("entity instance model test", () => {
  it("has a module", () => {
    expect(entityInstanceModel).toBeDefined();
  });
});

describe("save entity instance", () => {
  it("saves a entity instance", async () => {
    const entityInstance = new entityInstanceModel({
      type: "TEXT_FIELD",
      name: "entityInstance0",
      ownerId: "000000000000000000000000",
    });
    const savedentityInstance = await entityInstance.save();
    const expected = "entityInstance0";
    const actual = savedentityInstance.name;
    expect(actual).toEqual(expected);
  });
});

describe("get entity instance", () => {
  it("gets a entity instance", async () => {
    const entityInstance = new entityInstanceModel({
      type: "TEXT_FIELD",
      name: "entityInstance1",
      ownerId: "000000000000000000000000",
    });
    await entityInstance.save();

    const foundentityInstance = await entityInstanceModel.findOne({
      name: "entityInstance1",
    });
    const expected = "entityInstance1";
    const actual = foundentityInstance.name;
    expect(actual).toEqual(expected);
  });
});

describe("update a entity instance", () => {
  it("updates a entity instance", async () => {
    const entityInstance = new entityInstanceModel({
      type: "TEXT_FIELD",
      name: "entityInstance2",
      ownerId: "000000000000000000000000",
    });
    await entityInstance.save();

    entityInstance.name = "entityInstance2edit";
    const updatedentityInstance = await entityInstance.save();

    const expected = "entityInstance2edit";
    const actual = updatedentityInstance.name;
    expect(actual).toEqual(expected);
  });
});
