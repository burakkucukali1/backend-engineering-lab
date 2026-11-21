import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { parse } from "yaml";

const currentDirectory = dirname(fileURLToPath(import.meta.url));

function loadYaml(relativePath: string) {
  const filePath = join(currentDirectory, relativePath);
  const fileContent = readFileSync(filePath, "utf8");

  return parse(fileContent);
}

const userSchemas = loadYaml("schemas/user.yaml");
const userPaths = loadYaml("paths/users.yaml");

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
