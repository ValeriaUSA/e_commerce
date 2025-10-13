import connection from '../config/db.config.js'

// 
// customerId (UNI, int)
// email (PRI, varchar)
// familyname (varchar, NULL, nullable)
// gender (enum, NULL, nullable)
// name (varchar)
// password (varchar)
// role (enum)

const findAll = async () => {
    const SELECT = "SELECT * FROM users"
    try {
        const resultat = await connection.query(SELECT)
        return resultat[0]

    } catch (error) {
        console.log(error);
        return null
    }
}


// Find user by EMAIL for login and Local storage

const findByEmail = async (email) => {

    const SELECT = `SELECT * from users WHERE email= ?`

    try {

        const user = await connection.query(SELECT, [email]);
        //debugging 
        console.log(user[0][0]);
        return user[0][0] // the row
    } catch (error) {
        console.log(error);
        return null
    }
}


const save = async (user) => {

    // Default role to "user" if not provided
    const role = user.role || "user";
    const INSERT = `INSERT INTO users (name, familyname, email, password, role, gender)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

    try {

        const result = await connection.query(INSERT, [
            user.name,
            user.familyname || null,
            user.email, //**primary key */
            user.password,
            user.role,
            user.gender || null
        ]);
        user.customerId = result[0].insertId; // auto-increment ID

        return user
    } catch (error) {
        console.log(error);

        return null
    }

}
// const deleteById = async (id) => {
//     const DELETE = "DELETE FROM users WHERE id=?"
//     try {
//         await connection.query(DELETE, id);
//     } catch (error) {
//         console.log(error);
//     }
// }
// const update = async (user) => {
//     const UPDATE = "UPDATE users SET nom=?, prenom=?,email=?, password=?, role=? WHERE id=?"
//     try {
//         const resultat = await connection.query(UPDATE, [user.nom, user.prenom, user.email, user.password, user.role, user.id])
//         if (resultat[0].affectedRows > 0) {
//             return user
//         }
//     } catch (error) {
//         console.log(error);
//     }
//     return null
// }
// const findById = async (id) => {
//     const SELECT = "SELECT * FROM users WHERE id=?"
//     try {
//         const resultat = await connection.query(SELECT, id);
//         return resultat[0][0]
//     } catch (error) {
//         console.log(error);
//         return null
//     }
// }

// const findByEmail = async (email) => {
//     try {
//         const resultat = await connection.query(
//             "SELECT * FROM users WHERE email = ?",
//             [email]
//         );
//         return resultat[0][0]; // return first matching user or undefined
//     } catch (error) {
//         console.log(error);
//         return null;
//     }
// };


export default {
    save,
    findByEmail

};