// repositories/bookRepository.js
import connection from "../config/db.js"; // your MySQL connection







// Update a book by productId
const update = async (productId, book) => {
    const UPDATE = `
    UPDATE books SET
      title = ?, author = ?, imgurl = ?, category_id = ?, stars = ?, reviews = ?, price = ?, isbestseller = ?, publisheddate = ?
    WHERE productId = ?
  `;
    try {
        const result = await connection.query(UPDATE, [
            book.title,
            book.author,
            book.imgurl || null,
            book.category_id || null,
            book.stars || null,
            book.reviews || null,
            book.price || null,
            book.isbestseller || 0,
            book.publisheddate || null,
            productId
        ]);

        return result[0].affectedRows > 0;
    } catch (error) {
        console.log(error);
        return false;
    }
};

// Delete a book by productId
const remove = async (productId) => {
    const DELETE = "DELETE FROM books WHERE productId = ?";
    try {
        const result = await connection.query(DELETE, [productId]);
        return result[0].affectedRows > 0;
    } catch (error) {
        console.log(error);
        return false;
    }
};

export default {
    findAll,
    findById,
    save,
    update,
    remove
};


import productRepo from '../repositories/product.repository.js';

// GET /api/products
export const getAllProducts = async (req, res) => {
  try {
    const products = await productRepo.findAll();
    if (!products) {
      return res.status(404).json({ message: "No products found" });
    }
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/products/:id
export const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await productRepo.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/products
export const createProduct = async (req, res) => {
  const productData = req.body;
  
  // Optional: validate fields (title, author, price, etc.)
  if (!productData.title || !productData.author) {
    return res.status(400).json({ message: "Title and author are required" });
  }

  try {
    const newProduct = await productRepo.save(productData);
    if (!newProduct) {
      return res.status(500).json({ message: "Failed to save product" });
    }
    res.status(201).json(newProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
