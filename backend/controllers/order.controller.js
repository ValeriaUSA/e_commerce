import * as OrderRepository from "../repositories/order.repository.js";


export const checkout = async (req, res) => {
  try {
    const email = req.user.email; // from JWT middleware

    const { orderId, newCartId } = await OrderRepository.createOrderFromCart(email);

    res.status(200).json({
      message: "Order successfully created!",
      orderId,
      newCartId
    });

  } catch (err) {
    console.error("[Checkout] Failed:", err);
    res.status(400).json({ error: err.message });
  }
};

export default {
  checkout
};