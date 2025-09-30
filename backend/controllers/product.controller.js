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

// POST API to add a new book

export const addProduct = async (req, res) => {

    const productDetails = req.body;

    if (!productDetails.title || !productDetails.author) {
        return res.status(400).json[{ message: "The required fields: title and author" }]
    }

    try {
        const newProduct = await productRepository.save(productDetails)

        if (!newProduct) {
            return res.status(500).json({ message: "Failed to save this product" });

        }
        res.status(201).json(newProduct);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error from the server, error 500" })
    }

}

export default {
 getAllProducts,
 getProductById,
 addProduct

};