export class CategoryAlreadyExistsError extends Error {
  constructor() {
    super("Category slug already exists");
    this.name = "CategoryAlreadyExistsError";
  }
}
