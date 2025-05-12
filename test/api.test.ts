import { createApp } from "../src/app";
import { TEST_PORT } from "./consts";
import { request } from "./helpers";
import { RequestOptions, Response } from "./types";
import http from "http";

describe("CRUD API Tests", () => {
  let app: ReturnType<typeof createApp>;
  let server: http.Server;

  beforeAll(async () => {
    app = createApp(TEST_PORT);
    server = app.server;

    await new Promise<void>((resolve, reject) => {
      server.listen(TEST_PORT, () => {
        console.log(`Test server running on port ${TEST_PORT}`);
        resolve();
      });

      server.on("error", (err) => {
        console.error("Server start error:", err);
        reject(err);
      });
    });
  });

  afterAll(async () => {
    if (!server) return;

    await new Promise<void>((resolve, reject) => {
      server.close((err) => {
        if (err) {
          console.error("Error closing server:", err);
          reject(err);
        } else {
          resolve();
        }
      });
    });
  });

  const makeRequest = async (
    method: string,
    path: string,
    data: Record<string, unknown> | null = null,
  ): Promise<Response> => {
    const options: RequestOptions = {
      method,
      hostname: "localhost",
      port: TEST_PORT,
      path,
      headers: data ? { "Content-Type": "application/json" } : {},
    };

    return request(options, data);
  };

  let createdUserId: string;

  test("GET /api/users returns an empty array initially", async () => {
    const response = await makeRequest("GET", "/api/users");

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(0);
  });

  test("POST /api/users creates a new user", async () => {
    const userData = {
      username: "testuser",
      age: 25,
      hobbies: ["reading", "cycling"],
    };

    const response = await makeRequest("POST", "/api/users", userData);

    expect(response.statusCode).toBe(201);
    expect(response.body.id).toBeDefined();
    expect(response.body.username).toBe(userData.username);
    expect(response.body.age).toBe(userData.age);
    expect(response.body.hobbies).toEqual(userData.hobbies);

    createdUserId = response.body.id;
  });

  test("GET /api/users/{userId} returns the created user", async () => {
    const response = await makeRequest("GET", `/api/users/${createdUserId}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.id).toBe(createdUserId);
    expect(response.body.username).toBe("testuser");
  });

  test("PUT /api/users/{userId} updates the user", async () => {
    const updateData = {
      username: "updateduser",
      age: 30,
      hobbies: ["coding", "hiking"],
    };

    const response = await makeRequest(
      "PUT",
      `/api/users/${createdUserId}`,
      updateData,
    );

    expect(response.statusCode).toBe(200);
    expect(response.body.id).toBe(createdUserId);
    expect(response.body.username).toBe(updateData.username);
    expect(response.body.age).toBe(updateData.age);
    expect(response.body.hobbies).toEqual(updateData.hobbies);
  });

  test("DELETE /api/users/{userId} deletes the user", async () => {
    const response = await makeRequest("DELETE", `/api/users/${createdUserId}`);

    expect(response.statusCode).toBe(204);
  });

  test("GET /api/users/{userId} returns 404 for deleted user", async () => {
    const response = await makeRequest("GET", `/api/users/${createdUserId}`);

    expect(response.statusCode).toBe(404);
  });

  test("GET /api/users/{userId} returns 400 for invalid UUID", async () => {
    const response = await makeRequest("GET", "/api/users/invalid-uuid");

    expect(response.statusCode).toBe(400);
  });

  test("GET /non-existent-route returns 404", async () => {
    const response = await makeRequest("GET", "/api/non-existent");

    expect(response.statusCode).toBe(404);
  });

  test("POST /api/users returns 400 for invalid data", async () => {
    const invalidData = {
      username: "testuser",
    };

    const response = await makeRequest("POST", "/api/users", invalidData);

    expect(response.statusCode).toBe(400);
  });
});
