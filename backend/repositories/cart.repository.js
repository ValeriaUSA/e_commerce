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

// 4. Add a book to the cart (OR) update qnty if it was already in the cart

const addProductToCart = async (userId, productId, qnty) => {

    //First, find Id or creat active cart for a user

    const activeCart = await findOrCreatCart(userId);
    const cartId= activeCart.cartId;

    const INSERT = `
INSERT INTO product_carts (cartId, productId, qnty)
VALUES (?, ?, ?) 
ON DUPLICATE KEY UPDATE
qnty=qnty+VALUE(qnty) 
`;

try {

    const [result] = await connection.query(INSERT,[cartId, productId, qnty])
if (result.affectedRows===0) {
    throw new Error("Cart product update failed");
}
// Now, refetch the updated cart to return to controller
return await findCartByUserId(userId)
} catch (error) {
    console.error(`Error adding product ${productId} to the cart ${cartId}`, error);
    throw error;    
}
}

export default {
    createCart,
    findCartByUserId,
    findOrCreatCart,
    addProductToCart,

}
