import connection from "../config/db.config.js";

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


// Admin page all books with filtering and sorting options
// Admin page all books with filtering and sorting options
// const findAllFiltSort = async (filters = {}) => {
//     // 1. Destructure filters and apply defaults
//     const { 
//         limit = 10, 
//         offset = 0, 
//         sortField = "itemadded", 
//         sortOrder = "DESC",
//         productId,
//         author,
//         title,
//         categoryName,
//         isbestseller,
//         itemadded,
//     } = filters;

//     // 2. Security Check: Validation of sorting fields
//     // This is CRITICAL for security since column names cannot be parameterized.
//     // Only fields in this allowed list can be used for sorting.
//     const allowedSortFields = ["itemadded", "title", "author", "price", "categoryName", "quantity", "productId", "isbestseller"];
//     const allowedSortOrder = ["ASC", "DESC"];
    
//     // Apply validation to prevent SQL injection in ORDER BY clause
//     const finalSortField = allowedSortFields.includes(sortField) ? sortField : "itemadded";
//     const finalSortOrder = allowedSortOrder.includes(sortOrder.toUpperCase()) ? sortOrder.toUpperCase() : "DESC";
    
//     // 3. Build WHERE Clause and Parameter Array
//     let WHERE_CLAUSE_CONDITIONS = [];
//     const whereParams = [];

//     // Add filters using parameterized queries (?)
//     if (productId) {
//         WHERE_CLAUSE_CONDITIONS.push("p.productId = ?"); 
//         whereParams.push(productId); 
//     }
    
//     // Using LIKE for partial matches on text fields
//     if (author) {
//         WHERE_CLAUSE_CONDITIONS.push("p.author LIKE ?");
//         whereParams.push(`%${author}%`);
//     }

//     if (title) {
//         WHERE_CLAUSE_CONDITIONS.push("p.title LIKE ?");
//         whereParams.push(`%${title}%`);
//     }

//     if (categoryName) {
//         WHERE_CLAUSE_CONDITIONS.push("c.categoryName LIKE ?");
//         whereParams.push(`%${categoryName}%`);
//     }

//     // Bug Fix: Strictly check for 'true' or 'false' for boolean conversion
//     if (isbestseller === "true" || isbestseller === "false") {
//         WHERE_CLAUSE_CONDITIONS.push("p.isbestseller = ?");
//         whereParams.push(isbestseller === "true" ? 1 : 0);
//     }

//     // if (itemadded) {
//     //     // Assuming itemadded filter expects exact date match
//     //     WHERE_CLAUSE_CONDITIONS.push("DATE(p.itemadded) = ?");
//     //     whereParams.push(itemadded);
//     // }

//     //  if (itemadded) {
//     //     // This query finds all timestamps where the date is on or after the start 
//     //     // of the requested day, AND strictly before the start of the next day.
//     //     // This avoids mismatches caused by the time component (HH:MM:SS) in the DB.
//     //     // Example: '2025-09-29 22:00:00' is >= '2025-09-29 00:00:00' and < '2025-09-30 00:00:00'.
//     //     WHERE_CLAUSE_CONDITIONS.push("p.itemadded >= ? AND p.itemadded < DATE_ADD(?, INTERVAL 1 DAY)");
        
//     //     // The date string (e.g., '2025-09-29') is pushed for both placeholders.
//     //     whereParams.push(itemadded); 
//     //     whereParams.push(itemadded); 
//     // }

//     if (itemadded) {
//         // DATE_FORMAT is highly reliable. It forces MySQL to extract the date 
//         // portion of the column (regardless of its type, assuming it's date/time-like) 
//         // into a 'YYYY-MM-DD' string format for a direct string comparison with the parameter.
//         WHERE_CLAUSE_CONDITIONS.push("DATE_FORMAT(p.itemadded, '%Y-%m-%d') = ?");
//         whereParams.push(itemadded); 
//     }
//     // Construct the final WHERE clause, only adding 'WHERE' if conditions exist
//     const WHERE_CLAUSE = WHERE_CLAUSE_CONDITIONS.length > 0
//         ? `WHERE ${WHERE_CLAUSE_CONDITIONS.join(' AND ')}`
//         : '';
        
//     // 4. Query to determine total quantity of rows (Total Count)
//     const COUNT_SQL = `
//         SELECT COUNT(p.productId) AS totalCount
//         FROM products p
//         LEFT JOIN categories c ON p.category_id=c.category_id
//         ${WHERE_CLAUSE}
//     `;

//     let totalCount = 0;
//     try {
//         const [countResult] = await connection.query(COUNT_SQL, whereParams);
//         totalCount = countResult[0]?.totalCount || 0;
//     } catch (error) {
//         console.error("SQL COUNT Error:", error);
//         // Best practice: Re-throw the error so the caller knows the DB query failed
//         throw new Error("Failed to retrieve total book count.");
//     }

//     // 5. Query to get books data (only run if count > 0)
//     let books = [];
//     if (totalCount > 0) {
//         const SELECT_SQL = `
//             SELECT p.*, c.categoryName
//             FROM products p
//             LEFT JOIN categories c ON p.category_id=c.category_id
//             ${WHERE_CLAUSE}
//             ORDER BY ${finalSortField} ${finalSortOrder} 
//             LIMIT ? OFFSET ?
//         `;

//         // Parameters for SELECT query: first WHERE-params, then LIMIT and OFFSET
//         const selectParams = [...whereParams, Number(limit), Number(offset)];

//         try {
//             // connection.query returns [rows, fields]
//             const [rows] = await connection.query(SELECT_SQL, selectParams);
//             books = rows;
//         } catch (error) {
//             console.error("SQL SELECT Error:", error);
//             // Best practice: Re-throw the error so the caller knows the DB query failed
//             throw new Error("Failed to retrieve book data.");
//         }
//     }

//     // 6. Return object with data and total count
//     return { books, totalCount };
// }



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
export default {
    findAllFiltSort,

}