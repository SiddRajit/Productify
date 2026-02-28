import { Request, Response } from "express";
import * as queries from "../db/queries";
import { getAuth } from "@clerk/express";

// Get all products (public)
export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await queries.getProducts();

    res.status(200).json({
      success: true,
      message: "Fetched products successfully",
      data: products,
    });
  } catch (error) {
    console.error("Error getting products", error);
    res.status(500).json({
      success: false,
      message: "Failed to get products",
    });
  }
};

// Get single product by ID (public)
export const getProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await queries.getProduct(id as string);

    if (!product)
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });

    res.status(200).json({
      success: true,
      message: "Fetched product successfully",
      data: product,
    });
  } catch (error) {
    console.error("Error getting product: ", error);
    res.status(500).json({
      success: false,
      message: "Failed to get a product",
    });
  }
};

// Get products by current user (protected)
export const getMyProducts = async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);
    if (!userId)
      return res.status(401).json({
        success: false,
        message: "User unauthorized",
      });

    const products = await queries.getProductsByUserId(userId);
    res.status(200).json({
      success: true,
      message: "User products fetched successfully",
      data: products,
    });
  } catch (error) {
    console.error("Error getting user products: ", error);
    res.status(500).json({
      success: false,
      message: "Failed to get user products",
    });
  }
};

// Create product (protected)
export const createProduct = async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);
    if (!userId)
      return res
        .status(401)
        .json({ success: false, message: "User unauthorized" });

    const { title, description, imageUrl } = req.body;

    if (!title || !description || !imageUrl) {
      res.status(400).json({
        success: false,
        message: "Title, description, and imageUrl are required",
      });
      return;
    }

    const product = await queries.createProduct({
      title,
      description,
      imageUrl,
      userId,
    });

    res.status(201).json({
      success: true,
      message: "Created product successfully",
      data: product,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    res
      .status(500)
      .json({ message: "Failed to create product", success: false });
  }
};

// Update product (protected - owner only)
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);
    if (!userId)
      return res
        .status(401)
        .json({ success: false, message: "User unauthorized" });

    const { id } = req.params;
    const { title, description, imageUrl } = req.body;

    // Check if product exists and belongs to user
    const existingProduct = await queries.getProduct(id as string);
    if (!existingProduct) {
      res.status(404).json({
        success: false,
        message: "Product not found",
      });
      return;
    }

    if (existingProduct.userId !== userId) {
      res.status(403).json({
        success: false,
        message: "You can only update your own products",
      });
      return;
    }

    const product = await queries.updateProduct(id as string, {
      title,
      description,
      imageUrl,
    });

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to update product" });
  }
};

// Delete product (protected - owner only)
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);
    if (!userId)
      return res.status(401).json({
        success: false,
        message: "User unauthorized",
      });

    const { id } = req.params;

    // Check if product exists and belongs to user
    const existingProduct = await queries.getProduct(id as string);
    if (!existingProduct) {
      res.status(404).json({
        success: false,
        message: "Product not found",
      });
      return;
    }

    if (existingProduct.userId !== userId) {
      res.status(403).json({
        success: false,
        message: "You can only delete your own products",
      });
      return;
    }

    const product = await queries.deleteProduct(id as string);
    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
      data: product,
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete product",
    });
  }
};
