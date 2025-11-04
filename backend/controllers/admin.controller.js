import adminRepository from "../repositories/admin.repository.js";

export const adminGetBooks = async (req, res) => {
    console.log("[BACK 🐞] /admin/books query params:", req.query);

    try {
        // Деструктуризация всех ожидаемых параметров из req.query
        const { 
            author, 
            title, 
            categoryName, 
            isbestseller, 
            productId, 
            itemadded,
            limit,       
            offset,       
            sortField, 
            sortOrder 
        } = req.query;

        // Создаем объект filters, включая все параметры
        const filters = { 
            author, 
            title, 
            categoryName, 
            isbestseller, 
            productId,
            itemadded,
            limit, 
            offset, 
            sortField, 
            sortOrder 
        };

        // 🔑 Вызов функции репозитория, которая возвращает { books, totalCount }
        const { books, totalCount } = await adminRepository.findAllFiltSort(filters);

        console.log("[BACK 🐞] Books fetched:", books.length, "Total Count:", totalCount);

        // 🔑 КРИТИЧЕСКИ ВАЖНО: Отправляем объект с двумя полями: books и totalCount
        res.json({ books, totalCount });

    } catch (err) {
        console.error("[BACK 🐞] ERROR in adminGetBooks:", err);
        // Отправка более подробного сообщения об ошибке, если доступно
        res.status(500).json({ 
            message: "Internal server error while fetching books.",
            details: err.message // Полезно для отладки
        });
    }
};

// // Simplified example of what your controller might be doing

// import { findAllFiltSort } from '../repositories/book.repository';

// const adminGetBooks = async (req, res) => {
//     try {
//         // req.query contains all URL query parameters (e.g., limit, offset, author)
//         const filters = req.query; 

//         // The repository handles validation and execution
//         const { books, totalCount } = await findAllFiltSort(filters);

//         // Send the paginated data back to the client
//         res.status(200).json({
//             status: "success",
//             totalCount: totalCount,
//             results: books.length,
//             data: {
//                 books
//             }
//         });
//     } catch (error) {
//         console.error("Admin Get Books Error:", error);
//         res.status(500).json({
//             status: "error",
//             message: "Failed to retrieve book list.",
//             details: error.message
//         });
//     }
// };

// export default {
//     adminGetBooks
// };


// // ✅ ADD BOOK
// export const adminAddBook = async (req, res) => {
//   try {
//     const newBook = await productRepository.save(req.body);
//     if (!newBook) return res.status(400).json({ message: "Failed to save new book" });
//     res.status(201).json(newBook);
//   } catch (error) {
//     console.error("Error adding book:", error);
//     res.status(500).json({ message: "Server error while saving book" });
//   }
// };
// // ✅ UPDATE BOOK
// export const adminUpdateBook = async (req, res) => {
//   const { id } = req.params;
//   try {
//     const success = await productRepository.update(id, req.body);
//     if (!success) return res.status(404).json({ message: "Book not found" });
//     res.json({ message: "Book updated successfully" });
//   } catch (error) {
//     console.error("Error updating book:", error);
//     res.status(500).json({ message: "Server error while updating book" });
//   }
// };

// // ✅ DELETE BOOK
// export const adminDeleteBook = async (req, res) => {
//   const { id } = req.params;
//   try {
//     const success = await productRepository.remove(id);
//     if (!success) return res.status(404).json({ message: "Book not found" });
//     res.json({ message: "Book deleted successfully" });
//   } catch (error) {
//     console.error("Error deleting book:", error);
//     res.status(500).json({ message: "Server error while deleting book" });
//   }
// };

export default {
   adminGetBooks 
}