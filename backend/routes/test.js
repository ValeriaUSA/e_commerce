import connection from '../config/db.config.js';
import { v4 as uuidv4 } from 'uuid';

// ==========================
// CREATE / SAVE
// ==========================
const save = async (product) => {
  const INSERT = `
    INSERT INTO products (
      productId, title, author, imgurl, category_id, stars, reviews,
      price, isbestseller, publisheddate, itemadded, quantity
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const productId = uuidv4();
  const now = new Date();
  const quantity = product.quantity ?? 0;
  const publisheddate = product.publisheddate
    ? new Date(product.publisheddate).toISOString().slice(0, 10)
    : null;

  try {
    await connection.query(INSERT, [
      productId,
      product.title,
      product.author,
      product.imgurl || null,
      product.category_id || null,
      product.stars || null,
      product.reviews || null,
      product.price || null,
      product.isbestseller ? 1 : 0,
      publisheddate,
      now,
      quantity
    ]);

    return { ...product, productId, itemadded: now, publisheddate, quantity };
  } catch (error) {
    console.error('Error saving product:', error);
    return null;
  }
};

// ==========================
// READ / FIND ALL (with filters, pagination, sorting)
// ==========================
const findAll = async (filters = {}, limit = 10, offset = 0, sortField = "itemadded", sortOrder = "DESC") => {
  let SQL = `
    SELECT p.*, c.categoryName 
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.category_id
    WHERE 1=1
  `;
  const params = [];

  if (filters.author) {
    SQL += " AND p.author LIKE ?";
    params.push(`%${filters.author}%`);
  }

  if (filters.title) {
    SQL += " AND p.title LIKE ?";
    params.push(`%${filters.title}%`);
  }

  if (filters.categoryName) {
    SQL += " AND c.categoryName LIKE ?";
    params.push(`%${filters.categoryName}%`);
  }

  if (filters.isbestseller) {
    SQL += " AND p.isbestseller = ?";
    params.push(filters.isbestseller === "true" ? 1 : 0);
  }

  // Filter by date or date range
  if (filters.itemadded) {
    SQL += " AND DATE(p.itemadded) = ?";
    params.push(filters.itemadded);
  } else if (filters.startDate && filters.endDate) {
    SQL += " AND DATE(p.itemadded) BETWEEN ? AND ?";
    params.push(filters.startDate, filters.endDate);
  }

  SQL += ` ORDER BY ${sortField} ${sortOrder} LIMIT ? OFFSET ?`;
  params.push(Number(limit), Number(offset));

  const [rows] = await connection.query(SQL, params);
  return rows;
};

// ==========================
// UPDATE
// ==========================
const update = async (productId, data) => {
  const UPDATE = `
    UPDATE products
    SET title=?, author=?, price=?, category_id=?, isbestseller=?, imgurl=?, quantity=?, publisheddate=?
    WHERE productId=?
  `;
  const publisheddate = data.publisheddate
    ? new Date(data.publisheddate).toISOString().slice(0, 10)
    : null;

  try {
    const [result] = await connection.query(UPDATE, [
      data.title,
      data.author,
      data.price,
      data.category_id,
      data.isbestseller ? 1 : 0,
      data.imgurl,
      data.quantity,
      publisheddate,
      productId
    ]);
    return result.affectedRows > 0;
  } catch (error) {
    console.error("Error updating product:", error);
    return false;
  }
};

// ==========================
// DELETE
// ==========================
const remove = async (productId) => {
  try {
    const [result] = await connection.query(
      `DELETE FROM products WHERE productId = ?`,
      [productId]
    );
    return result.affectedRows > 0;
  } catch (error) {
    console.error("Error deleting product:", error);
    return false;
  }
};

// ==========================
// CATEGORIES
// ==========================
const category = async () => {
  const [rows] = await connection.query(`SELECT * FROM categories`);
  return rows;
};

export default {
  findAll,
  findById,
  save,
  update,
  remove,
  category,
};

import productRepository from "../repositories/product.repository.js";

// ✅ GET ALL BOOKS (with filters)
export const adminGetBooks = async (req, res) => {
  try {
    const { author, title, categoryName, isbestseller, itemadded, startDate, endDate, limit = 10, offset = 0, sortField, sortOrder } = req.query;

    const filters = { author, title, categoryName, isbestseller, itemadded, startDate, endDate };
    const products = await productRepository.findAll(filters, limit, offset, sortField, sortOrder);

    res.json(products);
  } catch (error) {
    console.error("Error fetching admin books:", error);
    res.status(500).json({ message: "Server error while loading admin books" });
  }
};

// ✅ ADD BOOK
export const adminAddBook = async (req, res) => {
  try {
    const newBook = await productRepository.save(req.body);
    if (!newBook) return res.status(400).json({ message: "Failed to save new book" });
    res.status(201).json(newBook);
  } catch (error) {
    console.error("Error adding book:", error);
    res.status(500).json({ message: "Server error while saving book" });
  }
};

// ✅ UPDATE BOOK
export const adminUpdateBook = async (req, res) => {
  const { id } = req.params;
  try {
    const success = await productRepository.update(id, req.body);
    if (!success) return res.status(404).json({ message: "Book not found" });
    res.json({ message: "Book updated successfully" });
  } catch (error) {
    console.error("Error updating book:", error);
    res.status(500).json({ message: "Server error while updating book" });
  }
};

// ✅ DELETE BOOK
export const adminDeleteBook = async (req, res) => {
  const { id } = req.params;
  try {
    const success = await productRepository.remove(id);
    if (!success) return res.status(404).json({ message: "Book not found" });
    res.json({ message: "Book deleted successfully" });
  } catch (error) {
    console.error("Error deleting book:", error);
    res.status(500).json({ message: "Server error while deleting book" });
  }
};

import express from "express";
import {
  adminGetBooks,
  adminAddBook,
  adminUpdateBook,
  adminDeleteBook,
} from "../controllers/product.controller.js";

const router = express.Router();

// /admin/books
router.get("/books", adminGetBooks);
router.post("/books", adminAddBook);
router.put("/books/:id", adminUpdateBook);
router.delete("/books/:id", adminDeleteBook);

export default router;
import adminRoutes from "./routes/admin.routes.js";

app.use("/admin", adminRoutes);
axios.get("/admin/books", { params: { ...filters, limit, offset, sortField, sortOrder } });
axios.post("/admin/books", formData);
axios.put(`/admin/books/${editBook.productId}`, formData);
axios.delete(`/admin/books/${id}`);