import connection from "../config/db.config.js"
import cartRepository from "./cart.repository.js";
import userRepository from "./user.repository.js";



export const createOrderFromCart = async (email) => {
  try {
    // 1️⃣ Get user info
    const user = await userRepository.findByEmail(email);;
    if (!user) throw new Error("User not found");
    const userId = user.customerId;

    // 2️⃣ Get active cart
    const cart = await cartRepository.CartContentByUserEmail(email);
    if (!cart || cart.books.length === 0) throw new Error("Cart is empty");

    const cartId = cart.cartId;

    // 3️⃣ Calculate total
    const totalPrice = cart.books.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // 4️⃣ Start transaction
    await connection.beginTransaction();

    // 5️⃣ Insert order with proper customerId, status, totalPrice
    const orderInsertSQL = `
      INSERT INTO orders (cartId, customerId, status, totalPrice, createdAt)
      VALUES (?, ?, 'Pending', ?, CURRENT_TIMESTAMP)
    `;
    const [orderResult] = await connection.query(orderInsertSQL, [
      cartId,
      userId,
      totalPrice
    ]);
    const orderId = orderResult.insertId;

    // 6️⃣ Insert order items & update stock
    for (const item of cart.books) {
      const { productId, quantity, price } = item;

      // check stock
      const [productRows] = await connection.query(
        "SELECT quantity FROM products WHERE productId = ?",
        [productId]
      );
      const available = productRows[0].quantity;
      if (quantity > available)
        throw new Error(
          `Not enough stock for "${item.title}". Available: ${available}`
        );

      // insert order item
      await connection.query(
        `INSERT INTO order_items (orderId, productId, quantity, price)
         VALUES (?, ?, ?, ?)`,
        [orderId, productId, quantity, price]
      );

      // update product stock
      await connection.query(
        "UPDATE products SET quantity = quantity - ? WHERE productId = ?",
        [quantity, productId]
      );
    }

    // 7️⃣ Mark cart as completed
    await connection.query(
      "UPDATE carts SET status='Completed', updatedAt=CURRENT_TIMESTAMP WHERE cartId=?",
      [cartId]
    );

    // 8️⃣ Commit transaction
    await connection.commit();

    // 9️⃣ Create new empty cart for user
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