import { describe, it, expect } from "vitest";
import request from "supertest";

import app from "../../src/app.js";

describe("Catalog HTTP Integration", () => {
  describe("GET /categories", () => {
    it("should return categories", async () => {
      const response = await request(app).get("/categories");

      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
    });
  });

  describe("GET /products", () => {
    it("should return products", async () => {
      const response = await request(app).get("/products");

      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
    });
  });

  describe("POST /categories", () => {
    it("should reject unauthenticated requests", async () => {
      const response = await request(app)
        .post("/categories")
        .send({
          name: "HTTP Test Category",
          slug: `http-test-${Date.now()}`,
        });

      expect(response.status).toBe(401);
    });
  });

  describe("POST /products", () => {
    it("should reject unauthenticated requests", async () => {
      const response = await request(app)
        .post("/products")
        .send({
          name: "HTTP Test Product",
          sku: `HTTP-${Date.now()}`,
          price: 100,
          categoryId: 1,
        });

      expect(response.status).toBe(401);
    });
  });
});
