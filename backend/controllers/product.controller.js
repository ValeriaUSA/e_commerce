import productRepository from "../repositories/product.repository.js";


// API GET All books
export const getAllProducts = async (req, res) => {
    try {
        const products = await productRepository.findAll();
        if (!products) {
            return res.status(400).json({ message: "No products found" });
        }
        res.json(products);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error from the server, error 500" })
    }
}

// API GET a book by Id (products/:id)

export const getProductById = async (req, res) => {
    const { id } = req.params;

    try {
        const product = await productRepository.findById(id);
        if (!product) {
            return res.status(400).json({ message: "This product is not found" })
        }
        res.json(product)
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error from the server, error 500" })
    }
}

// API GET all categories for MENU 

export const getAllCategories = async (req, res) => {

    try {

        const category = await productRepository.category();
        if (!category) {
            return res.status(400).json({ message: "Categories were not found" })
        }
        res.json(category)
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error from the server, error 500" })

    }
}

// POST API to add a new book

// export const addProduct = async (req, res) => {

//     const productDetails = req.body;

//     if (!productDetails.title || !productDetails.author) {
//         return res.status(400).json({ message: "The required field: title or author is missing" })
//     }


//     try {
//         const newProduct = await productRepository.save(productDetails)

//         if (!newProduct) {
//             return res.status(500).json({ message: "Failed to save this product" });

//         }
//         res.status(201).json(newProduct);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: "Error from the server, error 500" })
//     }

// }



// export const ProductController = {
//   getFilteredProducts: async (req, res) => {
//     try {
//       // Read filters from POST body
//       const { authors, categories, minPrice, maxPrice, page = 1, limit = 12 } = req.body;

//       // Ensure arrays for repository
//       const authorList = authors ? [].concat(authors) : [];
//       const categoryList = categories ? [].concat(categories) : [];

//       const offset = (page - 1) * limit;

//       // Debugging logs
//       console.log('=== For debugging ===');
//       console.log('Authors:', authorList);
//       console.log('Categories:', categoryList);
//       console.log('Min Price:', minPrice);
//       console.log('Max Price:', maxPrice);
//       console.log('Page:', page);
//       console.log('Limit:', limit);
//       console.log('Offset:', offset);

//       // Call repository function
//       const products = await productRepository.filterProducts({
//         authors: authorList,
//         categories: categoryList,
//         minPrice,
//         maxPrice,
//         limit,
//         offset,
//       });

//       // Return result
//       res.json(products);
//     } catch (err) {
//       console.error('Error in filterProducts:', err);
//       res.status(500).json({ message: 'Server error' });
//     }
//   }
// };


export const getFilterProducts = async (req, res) => {
    try {
        console.log("req.body received:", req.body);
        const { authors, categories, minPrice, maxPrice, limit = 12, offset = 0 } = req.body;

        // to be sure to have an array
        const authorList = authors ? [].concat(authors) : [];
        const categoryList = categories ? [].concat(categories) : [];



        // Debugging logs
        console.log("=== For debugging ===");
        console.log("Authors:", authorList);
        console.log("Categories:", categoryList);
        console.log("Min Price:", minPrice);
        console.log("Max Price:", maxPrice);
        console.log("Limit:", limit);
        console.log("Offset:", offset);

        const products = await productRepository.filterProducts({
            authors: authorList,
            categories: categoryList,
            minPrice,
            maxPrice,
            limit,
            offset,
        });

        res.json(products);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};


export default {
    getAllProducts,
    getProductById,
    // addProduct,
    getFilterProducts,
    getAllCategories,
};


