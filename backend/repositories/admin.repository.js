import connection from "../config/db.config.js";
import { v4 as uuidv4 } from 'uuid'; //to creat product Ids

// Таблица products:
// 1 productId (varchar(36)) 
// 2 title (varchar(250))
// 3 author (varchar(100))
// 4 imgurl (varchar(100))
// 5 category_id (int(11))
// 6 stars (decimal(2,1)) 
// 7 reviews (int(11)) 
// 8 price (decimal(15,2)) 
// 9 isbestseller (tinyint(1)) 
// 10 publisheddate (date) 
// 11 itemadded (date)
// 12 quantity (int(11))

// Таблица categories
// 1 categoryName (varchar)
// 2 category_id (PRI, int)


//--- API GET all books with filtering/sorting/pagination

const findAllFiltSort = async (filters = {}) => {
    // 1. Destructure filters and apply defaults
    const {
        limit = 10,
        offset = 0,
        sortField = "itemadded",
        sortOrder = "DESC",
        productId,
        author,
        title,
        categoryName,
        isbestseller,
        itemadded,
    } = filters;

    // 2. Security Check: Validation of sorting fields
    const allowedSortFields = ["itemadded", "title", "author", "price", "categoryName", "quantity", "productId", "isbestseller"];
    const allowedSortOrder = ["ASC", "DESC"];

    // Apply validation to prevent SQL injection in ORDER BY clause
    const finalSortField = allowedSortFields.includes(sortField) ? sortField : "itemadded";
    const finalSortOrder = allowedSortOrder.includes(sortOrder.toUpperCase()) ? sortOrder.toUpperCase() : "DESC";

    // 3. Build WHERE Clause and Parameter Array
    let WHERE_CLAUSE_CONDITIONS = [];
    const whereParams = [];

    // Add filters using parameterized queries (?)
    if (productId) {
        WHERE_CLAUSE_CONDITIONS.push("p.productId = ?");
        whereParams.push(productId);
    }

    // Using LIKE for partial matches on text fields
    if (author) {
        WHERE_CLAUSE_CONDITIONS.push("p.author LIKE ?");
        whereParams.push(`%${author}%`);
    }

    if (title) {
        WHERE_CLAUSE_CONDITIONS.push("p.title LIKE ?");
        whereParams.push(`%${title}%`);
    }

    if (categoryName) {
        WHERE_CLAUSE_CONDITIONS.push("c.categoryName LIKE ?");
        whereParams.push(`%${categoryName}%`);
    }

    // Strictly check for 'true' or 'false' for boolean conversion
    if (isbestseller === "true" || isbestseller === "false") {
        WHERE_CLAUSE_CONDITIONS.push("p.isbestseller = ?");
        whereParams.push(isbestseller === "true" ? 1 : 0);
    }

    // ----------------------------------------------------------------
    // ROBUST DATE FILTERING LOGIC: Forced UTC Date Extraction
    // ----------------------------------------------------------------
    if (itemadded) {
        // This is the most reliable approach:
        // 1. CONVERT_TZ converts the stored time (from the server's timezone) 
        //    to UTC ('+00:00'), countering any implicit shifts.
        // 2. DATE() extracts the 'YYYY-MM-DD' part from the newly converted UTC time.
        // This ensures a 10 PM (22:00) UTC timestamp on the 29th always results in the date '2025-09-29'.
        WHERE_CLAUSE_CONDITIONS.push("DATE(CONVERT_TZ(p.itemadded, @@session.time_zone, '+00:00')) = ?");
        whereParams.push(itemadded);
    }
    // ----------------------------------------------------------------

    // Construct the final WHERE clause, only adding 'WHERE' if conditions exist
    const WHERE_CLAUSE = WHERE_CLAUSE_CONDITIONS.length > 0
        ? `WHERE ${WHERE_CLAUSE_CONDITIONS.join(' AND ')}`
        : '';

    // 4. Query to determine total quantity of rows (Total Count)
    const COUNT_SQL = `
        SELECT COUNT(p.productId) AS totalCount
        FROM products p
        LEFT JOIN categories c ON p.category_id=c.category_id
        ${WHERE_CLAUSE}
    `;

    let totalCount = 0;
    try {
        // --- DEBUG LOGS FOR COUNT QUERY ---
        console.log("SQL DEBUG [COUNT SQL]:", COUNT_SQL.trim());
        console.log("SQL DEBUG [COUNT PARAMS]:", whereParams);
        // ---
        const [countResult] = await connection.query(COUNT_SQL, whereParams);
        totalCount = countResult[0]?.totalCount || 0;
    } catch (error) {
        console.error("SQL COUNT Error:", error);
        throw new Error("Failed to retrieve total book count.");
    }

    // 5. Query to get books data (only run if count > 0)
    let books = [];
    if (totalCount > 0) {
        const SELECT_SQL = `
            SELECT p.*, c.categoryName
            FROM products p
            LEFT JOIN categories c ON p.category_id=c.category_id
            ${WHERE_CLAUSE}
            ORDER BY ${finalSortField} ${finalSortOrder} 
            LIMIT ? OFFSET ?
        `;

        // Parameters for SELECT query: first WHERE-params, then LIMIT and OFFSET
        const selectParams = [...whereParams, Number(limit), Number(offset)];

        try {
            // --- DEBUG LOGS FOR SELECT QUERY ---
            console.log("SQL DEBUG [SELECT SQL]:", SELECT_SQL.trim());
            console.log("SQL DEBUG [SELECT PARAMS]:", selectParams);
            // ---
            const [rows] = await connection.query(SELECT_SQL, selectParams);
            books = rows;
        } catch (error) {
            console.error("SQL SELECT Error:", error);
            throw new Error("Failed to retrieve book data.");
        }
    }

    // 6. Return object with data and total count
    return { books, totalCount };
}

// ---API 2: DELETE by book ID (or list o id)

const deleteById = async (productId) => {
    const DELETE = `
    DELETE FROM products WHERE productId=?
    `;
    try {
        const [result] = await connection.query(DELETE, [productId]);
        return result.affectedRows > 0;
    } catch (error) {
        console.error("SQL DELETE 1 Error", error);
        throw error;

    }
}

const deleteMany = async (productIds = []) => {
    if (!Array.isArray(productIds) || productIds.length === 0) return 0;
    const placeholders = productIds.map(_ => "?").join(",");

    const DELETEAll = `
    DELETE FROM products WHERE productId IN (${placeholders})
    `;

    try {
        const [result] = await connection.query(DELETEAll, [productIds]);
        return result.affectedRows

    } catch (error) {
        console.error("SQL DELETE MANY Error: ", error);
        throw error;
    }
}


// ---API 3: ADD a NEW book to catalogue

const save = async (product) => {
    const INSERT = `
    INSERT INTO products (
      productId, title, author, imgurl, category_id, stars, reviews, price, isbestseller, publisheddate, itemadded, quantity
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

    const productId = uuidv4(); // Generate unique 36-char ID
    // Note: We need to use a single date object for consistency in the binding array
    const now = new Date();
    // Default quantity to 0 if not provided
    const quantity = product.quantity != null ? product.quantity : 0;

    // Convert incoming publisheddate to MySQL DATE format (YYYY-MM-DD)
    const publisheddate = product.publisheddate
        ? new Date(product.publisheddate).toISOString().slice(0, 10)
        : null;

    try {
        // The INSERT query has 12 placeholders, ensure 12 values are passed.
        await connection.query(INSERT, [
            productId,
            product.title,
            product.author,
            product.imgurl || null,
            product.category_id || null,
            product.stars || null,
            product.reviews || null,
            product.price || null,
            product.isbestseller || 0,
            publisheddate,
            now, // itemadded is TIMESTAMP
            quantity
        ]);

        return {
            ...product,
            productId,
            itemadded: now,
            publisheddate,
            quantity
        };
    } catch (error) {
        console.error('Error saving product:', error);
        return null;
    }
};


// ---Api 4: UPDATE existing book

const updateBook = async (productId, data) => {
    const UPDATE = `
    UPDATE products SET
    title = ?,
    author = ?,
    imgurl = ?,
    category_id = ?,
    stars = ?,
    reviews = ?,
    price = ?,
    isbestseller = ?,
    publisheddate = ?,
    quantity = ?
    WHERE productId = ?
    `;

const params = [
    data.title,
    data.author,
    data.imgurl,
    data.category_id,
    data.stars,
    data.reviews,
    data.price,
    data.isbestseller ? 1 : 0,
    data.publisheddate,
    data.quantity,
    productId
    ];

const [result] = await connection.query(UPDATE, params);
return result.affectedRows
}

export default {
    findAllFiltSort,
    deleteById,
    deleteMany,
    save,
    updateBook
}