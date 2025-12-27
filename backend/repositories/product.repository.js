import connection from '../config/db.config.js'
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


// // Add a NEW book to the catalogue
// const save = async (product) => {
//   const INSERT = `
//     INSERT INTO products (
//       productId, title, author, imgurl, category_id, stars, reviews, price, isbestseller, publisheddate, itemadded, quantity
//     ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//   `;

//   const productId = uuidv4(); // Generate unique 36-char ID
//   // Note: We need to use a single date object for consistency in the binding array
//   const now = new Date(); 
//   // Default quantity to 0 if not provided
//   const quantity = product.quantity != null ? product.quantity : 0;

//   // Convert incoming publisheddate to MySQL DATE format (YYYY-MM-DD)
//   const publisheddate = product.publisheddate
//     ? new Date(product.publisheddate).toISOString().slice(0, 10)
//     : null;

//   try {
//     // The INSERT query has 12 placeholders, ensure 12 values are passed.
//     await connection.query(INSERT, [
//       productId,
//       product.title,
//       product.author,
//       product.imgurl || null,
//       product.category_id || null,
//       product.stars || null,
//       product.reviews || null,
//       product.price || null,
//       product.isbestseller || 0,
//       publisheddate,
//       now, // itemadded is TIMESTAMP
//       quantity
//     ]);

//     return {
//       ...product,
//       productId,
//       itemadded: now,
//       publisheddate,
//       quantity
//     };
//   } catch (error) {
//     console.error('Error saving product:', error);
//     return null;
//   }
// };

// READ / FIND ALL:
// *NO filtering
// const findAll = async () => {
//   const SELECT = `SELECT * FROM products`
//   try {
//     const resultat = await connection.query(SELECT)
//     return resultat[0] // array of books
//   } catch (error) {
//     console.log(error);
//     return null
//   }
// }

const findAll = async () => {
  const SELECT = `SELECT *, quantity AS stock FROM products`;
  try {
    const [rows] = await connection.query(SELECT);
    return rows.map(row => ({
      productId: row.productId,
      title: row.title,
      author: row.author,
      imgurl: row.imgurl,
      price: row.price,
      stock: row.quantity,  // unified stock field
      category_id: row.category_id,
      stars: row.stars,
      reviews: row.reviews,
      isbestseller: row.isbestseller,
      publisheddate: row.publisheddate,
      itemadded: row.itemadded,
    }));
  } catch (error) {
    console.error(error);
    return [];
  }
};



// ** Get a book by productId
const findById = async (productId) => {
  const SELECT = `SELECT * FROM products WHERE productId=?`;

  try {
    const result = await connection.query(SELECT, [productId])
    return result[0][0] || null //finds 1 book or null
  }
  catch (error) {
    console.log(error);
    return null
  }
}


const filterProducts = async ({ authors, categories, minPrice, maxPrice, limit, offset }) => {
  const params = [];

  // ИСПОЛЬЗУЙТЕ LEFT JOIN, чтобы включать товары без категории
  let SELECT = `
    SELECT p.*, c.categoryName AS category_name
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.category_id
    WHERE 1=1
  `;

  // Filter authors
  // if (authors.length > 0) {
  //   SELECT += ` AND p.author IN (${authors.map(() => '?').join(',')})`;
  //   params.push(...authors);
  // }

   // Filter authors using LIKE
  if (authors.length > 0) {
    const authorConditions = authors.map(() => `p.author LIKE ?`).join(' OR ');
    SELECT += ` AND (${authorConditions})`;
    params.push(...authors.map(a => `%${a}%`));
  }

  // Filter categories by mapping names to IDs first
  if (categories.length > 0) {
    // Map category names to IDs
    const [catRows] = await connection.query(
      `SELECT category_id FROM categories WHERE categoryName IN (?)`,
      [categories]
    );
    const categoryIds = catRows.map(row => row.category_id);

    if (categoryIds.length > 0) {
      SELECT += ` AND p.category_id IN (${categoryIds.map(() => '?').join(',')})`;
      params.push(...categoryIds);
    } else {
      // No matching categories → return empty
      return [];
    }
  }

  // Filter price
  if (minPrice !== undefined && minPrice !== null) {
    SELECT += " AND p.price >= ?";
    params.push(minPrice);
  }
  if (maxPrice !== undefined && maxPrice !== null) {
    SELECT += " AND p.price <= ?";
    params.push(maxPrice);
  }

  // Pagination
  SELECT += " LIMIT ? OFFSET ?";
  params.push(Number(limit), Number(offset));

  // Debugging
  console.log("SQL:", SELECT);
  console.log("Params:", params);

  const [result] = await connection.query(SELECT, params);
  return result;
};


// const category = async () => {
//   let SELECT = `SELECT * FROM categories `

//   const [result] = await connection.query(SELECT)
//   return result;
// }

export const category = async () => {
    const SELECT = `SELECT category_id, categoryName FROM categories ORDER BY categoryName ASC`;
    const [rows] = await connection.query(SELECT);
    return rows;
}

export default {
  findAll,
  findById,
  // save,
  filterProducts,
  category,
}
