export class ProductAlreadyExistsError extends Error {
  constructor() {
    super("Product SKU already exists");
    this.name = "ProductAlreadyExistsError";
  }
}
