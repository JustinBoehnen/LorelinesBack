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
  it("get with one custom entity", async () => {
    const loreline = new lorelineModel({
      name: "loreline",
      modified: new Date(0),
    });
    const tempLoreline = await loreline.save();
    await request.post(`/api/lorelines/${tempLoreline._id}/entities`).send({
      name: "customEntity1",
      color: "#000000",
    });
    const response = await request.get(
      `/api/lorelines/${tempLoreline._id}/directory`
    );
    expect(response.status).toBe(200);
  });

  it("get with multiple custom entities", async () => {
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
    await request.post(`/api/lorelines/${tempLoreline._id}/entities`).send({
      name: "customEntity3",
      color: "#000000",
    });
    const response = await request.get(
      `/api/lorelines/${tempLoreline._id}/directory`
    );
    expect(response.status).toBe(200);
  });

  it("get with no custom entities", async () => {
    const loreline = new lorelineModel({
      name: "loreline",
      modified: new Date(0),
    });
    const tempLoreline = await loreline.save();
    const response = await request.get(
      `/api/lorelines/${tempLoreline._id}/directory`
    );
    expect(response.status).toBe(200);
  });

  it("get with invalid user", async () => {
    const response = await request.get(`/api/lorelines/0/directory`);
    expect(response.status).toBe(404);
  });
});
/////////////////////////////////////////////////////////////////////////////////////////////////////
describe("get specific custom entity route tests", () => {
  it("get with one custom entity", async () => {
    const loreline = new lorelineModel({
      name: "loreline",
      modified: new Date(0),
    });
    const tempLoreline = await loreline.save();
    const customEnt1 = new customEntityModel({
      name: "customEntity1",
      color: "#000000",
    });
    const tempCustomEnt1 = await customEnt1.save();
    const response = await request.get(
      `/api/lorelines/${tempLoreline._id}/entities/${tempCustomEnt1._id}`
    );
    expect(response.status).toBe(200);
  });

  it("get with multiple custom entities", async () => {
    const loreline = new lorelineModel({
      name: "loreline",
      modified: new Date(0),
    });
    const tempLoreline = await loreline.save();
    const customEnt1 = new customEntityModel({
      name: "customEntity1",
      color: "#000000",
    });
    const tempCustomEnt1 = await customEnt1.save();
    await request.post(`/api/lorelines/${tempLoreline._id}/entities`).send({
      name: "customEntity2",
      color: "#000000",
    });
    await request.post(`/api/lorelines/${tempLoreline._id}/entities`).send({
      name: "customEntity3",
      color: "#000000",
    });
    const response = await request.get(
      `/api/lorelines/${tempLoreline._id}/entities/${tempCustomEnt1._id}`
    );
    expect(response.status).toBe(200);
  });

  it("get with invalid custom entity id", async () => {
    const loreline = new lorelineModel({
      name: "loreline",
      modified: new Date(0),
    });
    const tempLoreline = await loreline.save();
    const response = await request.get(
      `/api/lorelines/${tempLoreline._id}/entities/0`
    );
    expect(response.status).toBe(404);
  });

  it("get from invalid user", async () => {
    const customEnt1 = new customEntityModel({
      name: "customEntity1",
      color: "#000000",
    });
    const tempCustomEnt1 = await customEnt1.save();
    const response = await request.get(
      `/api/lorelines/0/entities/${tempCustomEnt1._id}`
    );
    expect(response.status).toBe(200);
  });
});
/////////////////////////////////////////////////////////////////////////////////////////////////////
describe("delete specific custom entity route tests", () => {
  it("delete with one custom entity", async () => {
    const loreline = new lorelineModel({
      name: "loreline",
      modified: new Date(0),
    });
    const tempLoreline = await loreline.save();
    const customEnt1 = new customEntityModel({
      name: "customEntity1",
      color: "#000000",
    });
    const tempCustomEnt1 = await customEnt1.save();
    const response = await request.delete(
      `/api/lorelines/${tempLoreline._id}/entities/${tempCustomEnt1._id}`
    );
    expect(response.status).toBe(200);
  });

  it("delete with multiple custom entities", async () => {
    const loreline = new lorelineModel({
      name: "loreline",
      modified: new Date(0),
    });
    const tempLoreline = await loreline.save();
    const customEnt1 = new customEntityModel({
      name: "customEntity1",
      color: "#000000",
    });
    const tempCustomEnt1 = await customEnt1.save();
    await request.post(`/api/lorelines/${tempLoreline._id}/entities`).send({
      name: "customEntity2",
      color: "#000000",
    });
    await request.post(`/api/lorelines/${tempLoreline._id}/entities`).send({
      name: "customEntity3",
      color: "#000000",
    });
    const response = await request.delete(
      `/api/lorelines/${tempLoreline._id}/entities/${tempCustomEnt1._id}`
    );
    expect(response.status).toBe(200);
  });

  it("delete with invalid custom entity id", async () => {
    const loreline = new lorelineModel({
      name: "loreline",
      modified: new Date(0),
    });
    const tempLoreline = await loreline.save();
    const response = await request.delete(
      `/api/lorelines/${tempLoreline._id}/entities/0`
    );
    expect(response.status).toBe(404);
  });

  it("delete from invalid user", async () => {
    const customEnt1 = new customEntityModel({
      name: "customEntity1",
      color: "#000000",
    });
    const tempCustomEnt1 = await customEnt1.save();
    const response = await request.delete(
      `/api/lorelines/0/entities/${tempCustomEnt1._id}`
    );
    expect(response.status).toBe(404);
  });
});
/////////////////////////////////////////////////////////////////////////////////////////////////////
describe("create instance route tests", () => {
  it("simple instance creation", async () => {
    const loreline = new lorelineModel({
      name: "loreline",
      modified: new Date(0),
    });
    const tempLoreline = await loreline.save();
    const customEntity = new customEntityModel({
      name: "customEntity1",
      color: "#000000",
    });
    const tempCustomEntity = await customEntity.save();
    const response = await request
      .post(
        `/api/lorelines/${tempLoreline._id}/entities/${tempCustomEntity._id}/instances`
      )
      .send({
        name: "entityInstance",
        type: "TEXT_FIELD",
      });
    expect(response.status).toBe(200);
  });

  it("multiple instance creation", async () => {
    const loreline = new lorelineModel({
      name: "loreline",
      modified: new Date(0),
    });
    const tempLoreline = await loreline.save();
    const customEntity = new customEntityModel({
      name: "customEntity1",
      color: "#000000",
    });
    const tempCustomEntity = await customEntity.save();
    await request
      .post(
        `/api/lorelines/${tempLoreline._id}/entities/${tempCustomEntity._id}/instances`
      )
      .send({
        name: "entityInstanc1",
        type: "TEXT_FIELD",
      });
    await request
      .post(
        `/api/lorelines/${tempLoreline._id}/entities/${tempCustomEntity._id}/instances`
      )
      .send({
        name: "entityInstance2",
        type: "TEXT_FIELD",
      });
    const response = await request
      .post(
        `/api/lorelines/${tempLoreline._id}/entities/${tempCustomEntity._id}/instances`
      )
      .send({
        name: "entityInstance3",
        type: "TEXT_FIELD",
      });
    expect(response.status).toBe(200);
  });

  it("instance creation with invalid loreline", async () => {
    const customEntity = new customEntityModel({
      name: "customEntity1",
      color: "#000000",
    });
    const tempCustomEntity = await customEntity.save();
    const response = await request
      .post(`/api/lorelines/0/entities/${tempCustomEntity._id}/instances`)
      .send({
        name: "entityInstance",
        type: "TEXT_FIELD",
      });
    expect(response.status).toBe(200);
  });

  it("instance creation with invalid custom entity", async () => {
    const loreline = new lorelineModel({
      name: "loreline",
      modified: new Date(0),
    });
    const tempLoreline = await loreline.save();
    const response = await request
      .post(`/api/lorelines/${tempLoreline._id}/entities/0/instances`)
      .send({
        name: "entityInstance",
        type: "TEXT_FIELD",
      });
    expect(response.status).toBe(404);
  });

  it("instance creation invalid custom entity and loreline", async () => {
    const response = await request
      .post(`/api/lorelines/0/entities/0/instances`)
      .send({
        name: "entityInstance",
        type: "TEXT_FIELD",
      });
    expect(response.status).toBe(404);
  });

  it("instance creation without name", async () => {
    const loreline = new lorelineModel({
      name: "loreline",
      modified: new Date(0),
    });
    const tempLoreline = await loreline.save();
    const customEntity = new customEntityModel({
      name: "customEntity1",
      color: "#000000",
    });
    const tempCustomEntity = await customEntity.save();
    const response = await request
      .post(
        `/api/lorelines/${tempLoreline._id}/entities/${tempCustomEntity._id}/instances`
      )
      .send({
        type: "TEXT_FIELD",
      });
    expect(response.status).toBe(409);
  });

  it("instance creation without type", async () => {
    const loreline = new lorelineModel({
      name: "loreline",
      modified: new Date(0),
    });
    const tempLoreline = await loreline.save();
    const customEntity = new customEntityModel({
      name: "customEntity1",
      color: "#000000",
    });
    const tempCustomEntity = await customEntity.save();
    const response = await request
      .post(
        `/api/lorelines/${tempLoreline._id}/entities/${tempCustomEntity._id}/instances`
      )
      .send({
        name: "entityInstance",
      });
    expect(response.status).toBe(409);
  });
});
/////////////////////////////////////////////////////////////////////////////////////////////////////
describe("get specific instance route tests", () => {
  it("simple get instance", async () => {
    const loreline = new lorelineModel({
      name: "loreline",
      modified: new Date(0),
    });
    const tempLoreline = await loreline.save();
    const customEntity = new customEntityModel({
      name: "customEntity1",
      color: "#000000",
    });
    const tempCustomEntity = await customEntity.save();
    const entityInstance = new entityInstanceModel({
      name: "entityInstance",
      type: "TEXT_FIELD",
    });
    const tempEntityInstance = await entityInstance.save();
    const response = await request.get(
      `/api/lorelines/${tempLoreline._id}/entities/${tempCustomEntity._id}/instances/${tempEntityInstance._id}`
    );
    expect(response.status).toBe(200);
  });
});
