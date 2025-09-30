import connection from '../config/db.config.js'
import { v4 as uuidv4 } from 'uuid'; //to creat product Ids

// 1	productId Primaire	varchar(36)		
// 2	title	varchar(250)			
// 3	author	varchar(100)				
// 4	imgurl	varchar(100)			
// 5	category_id Index	int(11)	
// 6	stars	decimal(2,1)	
// 7	reviews	int(11)		
// 8	price	decimal(15,2)					
// 9	isbestseller	tinyint(1)						
// 10	publisheddate	date				
// 11	itemadded date


// Add a NEW book to the catalogue



const save = async (product) => {

    const INSERT =  `INSERT INTO products (
productId, title, author, imgurl, category_id, stars, reviews, price, isbestseller, publisheddate, itemadded)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const productId = uuidv4(); //creat  unique 36-char id
  const now = new Date(); // timestamp

try {
    const result = await connection.query(INSERT, [

        productId,
        product.title,
        product.author,
        product.imgurl ||null,
        product.category_id ||null,
        product.stars||null,
        product.reviews ||null,
        product.price ||null,
        product.isbestseller ||0,
        product.publisheddate ||null,
        now
    ])

    return {... product, productId:productId, itemadded:now}

}
catch(error){
    console.log(error);
    return null
    

}

}

//  **Get ALL books
const findAll = async () => {
    const SELECT = `SELECT * FROM products`
    try {
        const resultat = await connection.query(SELECT)
        return resultat[0] // array of books

    } catch (error) {
        console.log(error);
        return null
    }
}

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

export default {
    findAll,
    findById,
    save
};

