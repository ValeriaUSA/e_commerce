import connection from "../config/db.config.js"


// 1. Create a cart for a user
const createCart = async (userId) => {

    // Safety check: ensure userId is not null or undefined before proceeding
    if (!userId) {
        console.error('Error creating active cart: userId is missing or invalid.');
        return null;
    }


    const INSERT = `
INSERT INTO carts (customerId, status, createdAt, updatedAt) 
VALUES (?, 'Active', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
`;

    try {
        // Log the ID being used right before the query
        console.log(`[Repo] Attempting to create cart for customerId: ${userId}`);

        const result = await connection.query(INSERT, [userId])
        //Check for a success insertion and return  the generated cartId
        if (result && result[0].insertId) {
            console.log(`[Repo] Successfully created cart with ID: ${result[0].insertId}`);
            return result[0].insertId
        }
        return null;

    } catch (error) {
        console.error('Error creating active cart:', error);
        throw error; // Re-throw to be caught by controller
    }
}


// 2. Find LAST ACTIVE cart by userID and its contents:
const findCartByUserId = async (userId) => {

    const SELECT = `
SELECT 
c.cartId,
pc.productId,
pc.qnty
FROM carts c
LEFT JOIN product_carts pc ON c.cartId=pc.cartId 
WHERE
c.customerId = ? AND c.status = 'Active'
ORDER BY
c.updatedAt DESC, pc.productId ASC
LIMIT 50;
`;
    try {
        // Use destructuring to correctly get the rows array.
        const [rows] = await connection.query(SELECT, [userId]);

        if (rows.length === 0) {
            return null // Case: user has no active cart
        }

        // If the cart exists
        const activeCartId = rows[0].cartId;

        // Map the rows to extract products, filtering out the row where pc.productId is NULL.
        const cartContent = rows
            .filter(row => row.productId !== null)
            .map(row => ({
                productId: row.productId,
                qnty: row.qnty
            }));

        return {
            cartId: activeCartId,
            books: cartContent,
        }

    } catch (error) {
        console.error('Error finding active cart for this user:', error);
        throw error;
    }
};

// 3. Find an active cart or create a new one
const findOrCreatCart = async (userId) => {

    // First, check if the user already has an active cart
    let activeCartContent = await findCartByUserId(userId)

    if (activeCartContent === null) {// has no active cart, so create it
        const newCartId = await createCart(userId);
        if (!newCartId) {
            throw new Error("Failure to create a new active cart");
        }

        // Second, return the structure for a new, empty cart

        activeCartContent = {
            cartId: newCartId,
            books: [],
        }
    }
    return activeCartContent
}

const findUserIdByEmail = async (email) => {
    const SELECT = `SELECT customerId FROM users WHERE email = ?`;
    const [rows] = await connection.query(SELECT, [email]);

    if (rows.length === 0) return null;
    return rows[0].customerId;
};


// 4. Add a book to the cart (OR) update qnty if it was already in the cart

const addProductToCart = async (email, productId, qnty) => {
    const userId = await findUserIdByEmail(email);
    if (!userId) throw new Error("User with this email is not found");

    //First, find cart Id or creat active cart for a user

    const activeCart = await findOrCreatCart(userId);
    const cartId = activeCart.cartId;

    const INSERT = `
INSERT INTO product_carts (cartId, productId, qnty)
VALUES (?, ?, ?) 
ON DUPLICATE KEY UPDATE
qnty=qnty+VALUES(qnty) 
`;

    try {

        const [result] = await connection.query(INSERT, [cartId, productId, qnty])
        if (result.affectedRows === 0) {
            throw new Error("Cart product update failed");
        }
        // Now, refetch the updated cart to return to controller
        return await findCartByUserId(userId)
    } catch (error) {
        console.error(`Error adding product ${productId} to the cart ${cartId}`, error);
        throw error;
    }
}


// 5. Remove a book from a cart

const removeProductFromCart = async (email, productId) => {
    const userId = await findUserIdByEmail(email);
    if (!userId) throw new Error("User with this email is not found");
    // First, find the user's cart
    const activeCart = await findCartByUserId(userId);

    if (!activeCart) {
        throw new Error("This user does not have any active cart");
    }

    const cartId = activeCart.cartId;

    const DELETE = `
    DELETE FROM product_carts
    WHERE cartId = ? AND productId = ?
  `;

    try {
        const [result] = await connection.query(DELETE, [cartId, productId]);

        if (result.affectedRows === 0) {
            console.warn(`No product ${productId} found in cart ${cartId}`);
        }

        return await findCartByUserId(userId); // return the updated cart
    } catch (error) {
        console.error(`Error removing ${productId} from cart ${cartId}`, error);
        throw error;
    }
};

const updateProductQuantity = async (email, productId, quantity) => {

    // 1️⃣ Resolve email → userId FIRST
    const userId = await findUserIdByEmail(email);
    if (!userId) {
        throw new Error("User not found");
    }

    // 2️⃣ Now it's safe to use userId
    const activeCart = await findCartByUserId(userId);
    if (!activeCart) {
        throw new Error("This user does not have any active cart");
    }

    const cartId = activeCart.cartId;

    // 3️⃣ Check product stock
    const [productRows] = await connection.query(
        "SELECT quantity FROM products WHERE productId = ?",
        [productId]
    );

    if (productRows.length === 0) {
        throw new Error("This product is not found in products");
    }

    const availableQnty = productRows[0].quantity;

    if (quantity > availableQnty) {
        throw new Error(`Not enough books in stock! Available: ${availableQnty}`);
    }

    if (quantity <= 0) {
        // Remove product if quantity <= 0
        return await removeProductFromCart(email, productId);
    }

    const UPDATE = `
        UPDATE product_carts
        SET qnty = ?
        WHERE cartId = ? AND productId = ?
    `;

    await connection.query(UPDATE, [quantity, cartId, productId]);

    return await findCartByUserId(userId);
};



const CartContentByUserId = async (userId) => {
    const SELECT = `
SELECT 
  c.cartId,
  pc.productId,
  pc.qnty,
  p.title,
  p.price,
  p.imgurl,
  p.author,
  p.category_id,
  p.stars,
  p.reviews,
  p.isbestseller,
  p.publisheddate,
  p.itemadded,
  p.quantity AS stock
FROM carts c
LEFT JOIN product_carts pc ON c.cartId = pc.cartId
LEFT JOIN products p ON pc.productId = p.productId
WHERE c.customerId = ? AND c.status = 'Active'
ORDER BY c.updatedAt DESC, pc.productId ASC
LIMIT 50;
`;

    try {
        const [rows] = await connection.query(SELECT, [userId]);

        if (rows.length === 0) return null;

        const activeCartId = rows[0].cartId;

        const cartContent = rows
            .filter(row => row.productId !== null)
            .map(row => ({
                productId: row.productId,
                quantity: row.qnty,
                title: row.title,
                price: row.price,
                imgurl: row.imgurl,
                author: row.author,
                category_id: row.category_id,
                stars: row.stars,
                reviews: row.reviews,
                isbestseller: row.isbestseller,
                publisheddate: row.publisheddate,
                itemadded: row.itemadded,
                stock: row.stock,
            }));
  

        return {
            cartId: activeCartId,
            books: cartContent,
        };
    } catch (error) {
        console.error('Error finding active cart for this user:', error);
        throw error;
    }
};



// 6. CLEAR UP the cart

const clearUserCart = async (email) => {
    const userId = await findUserIdByEmail(email);
    if (!userId) throw new Error("User not found");

    if (!userId) throw new Error("Missing userId to continue to clear up cart");

    try {

        const activeCart = await findCartByUserId(userId)
        if (!activeCart) {
            console.warn(`No active cart for user ${userId}`);
            return null
        }

        const cartId = activeCart.cartId

        const DELETE = `
        DELETE FROM product_carts WHERE cartId= ?
        `
        await connection.query(DELETE, [cartId])
        return true

    } catch (error) {
        console.error("[Repo] Error clearing user cart : ", error);
        throw error
    }
};


// export const CartContentByUserEmail = async (email) => {
//     const SELECT = `
//     SELECT 
//         c.cartId, 
//         pc.productId, 
//         pc.qnty, 
//         p.title, 
//         p.price, 
//         p.imgurl
//     FROM carts c
//     LEFT JOIN product_carts pc ON c.cartId = pc.cartId
//     LEFT JOIN users u ON c.customerId = u.customerId
//     LEFT JOIN products p ON pc.productId = p.productId
//     WHERE u.email = ? AND c.status = 'Active'
//     `;
//     const [rows] = await connection.query(SELECT, [email]);

//     if (rows.length === 0) return null;

//     const activeCartId = rows[0].cartId;
//     const cartContent = rows
//         .filter(row => row.productId !== null)
//         .map(row => ({
//             productId: row.productId,
//             quantity: row.qnty,
//             title: row.title,
//             price: row.price,
//             imgurl: row.imgurl,
//         }));

//     return { cartId: activeCartId, books: cartContent };
// };


export const CartContentByUserEmail = async (email) => {
  const SELECT = `
    SELECT 
        c.cartId, 
        pc.productId, 
        pc.qnty, 
        p.title, 
        p.price, 
        p.imgurl,
        p.quantity AS stock
    FROM carts c
    LEFT JOIN product_carts pc ON c.cartId = pc.cartId
    LEFT JOIN users u ON c.customerId = u.customerId
    LEFT JOIN products p ON pc.productId = p.productId
    WHERE u.email = ? AND c.status = 'Active'
  `;

  const [rows] = await connection.query(SELECT, [email]);

  if (rows.length === 0) return null;

  const activeCartId = rows[0].cartId;
  const cartContent = rows
      .filter(row => row.productId !== null)
      .map(row => ({
          productId: row.productId,
          quantity: row.qnty,
          title: row.title,
          price: row.price,
          imgurl: row.imgurl,
          stock: row.stock, // ✅ include stock here
      }));

  return { cartId: activeCartId, books: cartContent };
};

const mergeGuestCartIntoUserCart = async (email, guestItems) => {
  const userId = await findUserIdByEmail(email);
  if (!userId) throw new Error("User not found");

  const activeCart = await findOrCreatCart(userId);
  const cartId = activeCart.cartId;
  const stockIssues = [];

  try {
    await connection.beginTransaction();

    for (const item of guestItems) {
      const { productId, quantity: visitorQuantity } = item;

      // 1️⃣ Check stock
      const [productRows] = await connection.query(
        "SELECT quantity FROM products WHERE productId = ?",
        [productId]
      );
      const product = productRows[0];
      if (!product) continue;

      const available = product.quantity;

      // 2️⃣ Get current quantity in user cart
      const [existingRows] = await connection.query(
        "SELECT qnty FROM product_carts WHERE cartId = ? AND productId = ?",
        [cartId, productId]
      );
      const userQuantity = existingRows[0] ? existingRows[0].qnty : 0;

      // 3️⃣ Determine final quantity after merge
      let finalQuantity = userQuantity + visitorQuantity;
      if (finalQuantity > available) {
        stockIssues.push({
          productId,
          title: product.title,
          requested: finalQuantity,
          available
        });
        finalQuantity = available; // cap to stock
      }

      if (userQuantity === 0) {
        // Item does not exist in user cart yet
        await connection.query(
          `INSERT INTO product_carts (cartId, productId, qnty)
           VALUES (?, ?, ?)`,
          [cartId, productId, finalQuantity]
        );
      } else {
        // Item already in cart, update quantity
        await connection.query(
          `UPDATE product_carts
           SET qnty = ?
           WHERE cartId = ? AND productId = ?`,
          [finalQuantity, cartId, productId]
        );
      }
    }

    await connection.commit();

    const updatedCart = await CartContentByUserId(userId);
    return { cart: updatedCart, stockIssues };
  } catch (err) {
    await connection.rollback();
    console.error("[mergeGuestCartIntoUserCart] Transaction error:", err);
    throw err;
  }
};

export default {
    createCart,
    findCartByUserId,
    findOrCreatCart,
    addProductToCart,
    removeProductFromCart,
    updateProductQuantity,
    CartContentByUserId,
    CartContentByUserEmail,
    clearUserCart,
    mergeGuestCartIntoUserCart
}
