import { describe, it, expect } from "vitest";
import request from "supertest";

import app from "../../src/app.js";

describe("Authentication HTTP Integration", () => {
  const testEmail = `auth-test-${Date.now()}@example.com`;
  const testPassword = "StrongTestPassword123!";

  let accessToken: string;

  it("should register a user", async () => {
    const response = await request(app).post("/auth/register").send({
      email: testEmail,
      password: testPassword,
      firstName: "Auth",
      lastName: "Test",
    });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.email).toBe(testEmail);
    expect(response.body.data).not.toHaveProperty("passwordHash");
  });

  it("should login and return an access token", async () => {
    const response = await request(app).post("/auth/login").send({
      email: testEmail,
      password: testPassword,
    });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.accessToken).toBeTypeOf("string");

    accessToken = response.body.data.accessToken;
  });

  it("should return the authenticated user from /auth/me", async () => {
    const response = await request(app)
      .get("/auth/me")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body.data.email).toBe(testEmail);
  });

  it("should reject /auth/me without a token", async () => {
    const response = await request(app).get("/auth/me");

    expect(response.status).toBe(401);
  });

  it("should reject login with an incorrect password", async () => {
    const response = await request(app).post("/auth/login").send({
      email: testEmail,
      password: "WrongPassword123!",
    });

    expect(response.status).toBe(401);
  });
});
