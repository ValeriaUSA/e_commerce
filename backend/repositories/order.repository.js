import connection from "../config/db.config.js"
import cartRepository from "./cart.repository.js";


export const createOrderFromCart = async (email) => {
  const userId = await cartRepository.findUserIdByEmail(email);
  if (!userId) throw new Error("User not found");

  // Get active cart content
  const cart = await cartRepository.CartContentByUserEmail(email);
  if (!cart || cart.books.length === 0) {
    throw new Error("Your cart is empty.");
  }

  const cartId = cart.cartId;

  try {
    await connection.beginTransaction();

    // 1️⃣ Insert new order linked to cartId
    const orderInsertSQL = `
      INSERT INTO orders (cartId, status)
      VALUES (?, 'Pending')
    `;
    const [orderResult] = await connection.query(orderInsertSQL, [cartId]);
    const orderId = orderResult.insertId;

    // 2️⃣ Insert order items and update product stock
    for (const item of cart.books) {
      const { productId, quantity, price, title } = item;

      // Check stock
      const [productRows] = await connection.query(
        "SELECT quantity FROM products WHERE productId = ?",
        [productId]
      );
      const available = productRows[0].quantity;
      if (quantity > available) {
        throw new Error(`Not enough stock for "${title}". Available: ${available}`);
      }

      // Insert into order_items
      const insertItemSQL = `
        INSERT INTO order_items (orderId, productId, quantity, price)
        VALUES (?, ?, ?, ?)
      `;
      await connection.query(insertItemSQL, [orderId, productId, quantity, price]);

      // Decrease stock in products table
      await connection.query(
        `UPDATE products SET quantity = quantity - ? WHERE productId = ?`,
        [quantity, productId]
      );
    }

    // 3️⃣ Mark cart as Completed
    await connection.query(
      `UPDATE carts SET status='Completed', updatedAt=CURRENT_TIMESTAMP WHERE cartId=?`,
      [cartId]
    );

    // 4️⃣ Commit transaction
    await connection.commit();

    // 5️⃣ Create a new active cart for next session
    const newCartId = await cartRepository.createCart(userId);

    return { orderId, newCartId };

  } catch (err) {
    await connection.rollback();
    console.error("[OrderRepository] Transaction failed:", err);
    throw err;
  }
};

export default {
  createOrderFromCart
};