const dbHandler = require("../../db-handler");
const userModel = require("../user.model");
const lorelineModel = require("../loreline.model");
const customEntityModel = require("../customEntity.model");
const entityInstanceModel = require("../entityInstance.model");
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
describe("create custom entity route tests", () => {
  it("simple custom entity creation", async () => {
    const loreline = new lorelineModel({
      name: "loreline",
      modified: new Date(0),
    });
    const tempLoreline = await loreline.save();
    const response = await request
      .post(`/api/lorelines/${tempLoreline._id}/entities`)
      .send({
        name: "customEntity1",
        color: "#000000",
      });
    expect(response.status).toBe(200);
  });

  it("multiple custom entity creation", async () => {
    const loreline = new lorelineModel({
      name: "loreline",
      modified: new Date(0),
    });
    const tempLoreline = await loreline.save();
    await request.post(`/api/lorelines/${tempLoreline._id}/entities`).send({
      name: "customEntity1",
      color: "#000000",
    });
    await request.post(`/api/lorelines/${tempLoreline._id}/entities`).send({
      name: "customEntity2",
      color: "#000000",
    });
    const response = await request
      .post(`/api/lorelines/${tempLoreline._id}/entities`)
      .send({
        name: "customEntity3",
        color: "#000000",
      });
    expect(response.status).toBe(200);
  });

  it("custom entity creation with invalid loreline id", async () => {
    const response = await request.post(`/api/lorelines/0/entities`).send({
      name: "customEntity1",
      color: "#000000",
    });
    expect(response.status).toBe(404);
  });

  it("custom entity creation with no name", async () => {
    const loreline = new lorelineModel({
      name: "loreline",
      modified: new Date(0),
    });
    const tempLoreline = await loreline.save();
    const response = await request
      .post(`/api/lorelines/${tempLoreline._id}/entities`)
      .send({
        name: "",
        color: "#000000",
      });
    expect(response.status).toBe(409);
  });

  it("custom entity creation with no color", async () => {
    const loreline = new lorelineModel({
      name: "loreline",
      modified: new Date(0),
    });
    const tempLoreline = await loreline.save();
    const response = await request
      .post(`/api/lorelines/${tempLoreline._id}/entities`)
      .send({
        name: "customEntity1",
        color: "",
      });
    expect(response.status).toBe(409);
  });
});
/////////////////////////////////////////////////////////////////////////////////////////////////////
describe("get directory route tests", () => {
  it("get with one ", async () => {
    const loreline = new lorelineModel({
      name: "loreline",
      modified: new Date(0),
    });
    const tempLoreline = await loreline.save();
    const response = await request
      .post(`/api/lorelines/${tempLoreline._id}/entities`)
      .send({
        name: "customEntity1",
        color: "#000000",
      });
    expect(response.status).toBe(200);
  });
});
