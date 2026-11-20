import { readFileSync } from "node:fs";
import path from "node:path";

import { parse } from "yaml";

const docsDirectory = path.join(process.cwd(), "docs/openapi");

const userSchemas = parse(
  readFileSync(path.join(docsDirectory, "schemas/user.yaml"), "utf8"),
);

const userPaths = parse(
  readFileSync(path.join(docsDirectory, "paths/users.yaml"), "utf8"),
);

const swaggerSpec = {
  openapi: "3.0.0",

  info: {
    title: "Backend Engineering Lab API",
    version: "1.0.0",
    description: "E-commerce backend API documentation",
  },

  servers: [
    {
      url: "http://localhost:3000",
      description: "Local development server",
    },
  ],

  tags: [
    {
      name: "Users",
      description: "User management endpoints",
    },
  ],

  paths: userPaths,

  components: {
    schemas: userSchemas,
  },
};

export default swaggerSpec;
