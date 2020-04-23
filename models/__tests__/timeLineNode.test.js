const dbHandler = require("../../db-handler");
const timeLineNodeModel = require("../timeLineNode.model");

beforeAll(async () => {
  await dbHandler.connect();
});

afterEach(async () => {
  await dbHandler.clearDatabase();
});

afterAll(async () => {
  await dbHandler.closeDatabase();
});

describe("timeline node model test", () => {
  it("has a module", () => {
    expect(timeLineNodeModel).toBeDefined();
  });
});

describe("save timeline node", () => {
  it("saves a timeline node", async () => {
    const timeLineNode = new timeLineNodeModel({
      type: 0,
    });
    const savedtimeLineNode = await timeLineNode.save();
    const expected = 0;
    const actual = savedtimeLineNode.type;
    expect(actual).toEqual(expected);
  });
});

describe("get timeline node", () => {
  it("gets a timeline node", async () => {
    const timeLineNode = new timeLineNodeModel({
      type: 0,
    });
    await timeLineNode.save();

    const foundtimeLineNode = await timeLineNodeModel.findOne({
      type: 0,
    });
    const expected = 0;
    const actual = foundtimeLineNode.type;
    expect(actual).toEqual(expected);
  });
});

describe("update a timeline node", () => {
  it("updates a timeline node", async () => {
    const timeLineNode = new timeLineNodeModel({
      type: 0,
    });
    await timeLineNode.save();

    timeLineNode.type = 1;
    const updatedTimeLineNode = await timeLineNode.save();

    const expected = 1;
    const actual = updatedTimeLineNode.type;
    expect(actual).toEqual(expected);
  });
});
