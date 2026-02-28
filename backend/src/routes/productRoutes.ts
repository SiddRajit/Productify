import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getMyProducts,
  getProduct,
  getProducts,
  updateProduct,
} from "../controllers/productController";
import { requireAuth } from "@clerk/express";

const router = Router();

router.get("/", getProducts);
router.get("/my", requireAuth(), getMyProducts);
router.get("/:id", getProduct);
router.post("/", requireAuth(), createProduct);
router.put("/:id", requireAuth(), updateProduct);
router.delete("/:id", requireAuth(), deleteProduct);

export default router;
