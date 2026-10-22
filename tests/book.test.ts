import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../src/app";
// import { jwt } from "zod";
import jwt from "jsonwebtoken"

describe("BOOK API authentication", () => {
    it("should reject requests without a token", async () => {
        const response = await request(app).get("/api/book/all");
        expect(response.status).toBe(401);
    }),
        it("should reject request invalid token", async () => {
            const response = await request(app).get("/api/book/all").set("Authorization", "Bearer invalid-token");
            expect(response.status).toBe(401);
        }),
        it("should reject request invalid permission", async () => {
            const secret = process.env.JWT_SECRET;
            if (!secret) {
                throw new Error("JWT_SECRET is not configured for tests")
            }
            const token = jwt.sign(
                { userId: "ad2ad9a5-8094-4aa3-86e8-729d93addbd8", role: "USER" },
                secret,
                { expiresIn: "15m" }
            );
            const response = await request(app).delete("/api/book/946d73a2-eb33-4eca-8322-adaa72d072bf").set("Authorization", `Bearer ${token}`);
            expect(response.status).toBe(403);
        }),
        it("should not reject request", async () => {
            const secret = process.env.JWT_SECRET;
            if (!secret) {
                throw new Error("JWT_SECRET is not configured for tests");
            }
            const token = jwt.sign(
                { userId: "ad2ad9a5-8094-4aa3-86e8-729d93addbd8", role: "ADMIN" },
                secret,
                { expiresIn: "15m" }
            );
            const response = await request(app).delete("/api/book/946d73a2-eb33-4eca-8322-adaa72d072bf").set("Authorization", `Bearer ${token}`);
            expect(response.status).not.toBe(403);
            expect(response.status).not.toBe(401);
        }),
        it("Should reject book creation without a token", async () => {
            const response = await request(app).post("/api/book/create").send({
                title: "Clean Code",
                author: "R Martin",
                description: "Good book",
            });
            expect (response.status).toBe(401);
        }),
         it("Should reject book creation without ADMIN Permission", async () => {
            const secret = process.env.JWT_SECRET;
            if (!secret) {
               throw new Error("JWT_SECRET is not configured for tests");
            }
            const token = jwt.sign(
                {
                    userId: "test-user-id",
                    role: "USER",
                },
                secret,
                { expiresIn: "15m" }
            );

            const response = await request(app).post("/api/book/create")
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: "Clean Code",
                author: "R Martin",
                description: "Good book",
            });
            expect (response.status).toBe(403);
        }),

it("should reject book creation when title is empty", async () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not configured for tests");
  }

  const token = jwt.sign(
    { userId: "test-admin-id", role: "ADMIN" },
    secret,
    { expiresIn: "15m" }
  );

  const response = await request(app)
    .post("/api/book/create")
    .set("Authorization", `Bearer ${token}`)
    .send({
      title: "",
      author: "R Martin",
      description: "Good book",
    });

  expect(response.status).toBe(400);
});

it("should reject book creation when title exceeds 10 characters", async () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not configured for tests");
  }

  const token = jwt.sign(
    { userId: "test-admin-id", role: "ADMIN" },
    secret,
    { expiresIn: "15m" }
  );

  const response = await request(app)
    .post("/api/book/create")
    .set("Authorization", `Bearer ${token}`)
    .send({
      title: "This title is too long",
      author: "R Martin",
      description: "Good book",
    });

  expect(response.status).toBe(400);
});

it("should return 200 when an authenticated user requests all books", async () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not configured for tests");
  }

  const token = jwt.sign(
    { userId: "test-user-id", role: "USER" },
    secret,
    { expiresIn: "15m" }
  );

  const response = await request(app)
    .get("/api/book/all")
    .set("Authorization", `Bearer ${token}`);

  expect(response.status).toBe(200);
});


})