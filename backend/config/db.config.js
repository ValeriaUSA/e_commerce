// import * as mysql from 'mysql2/promise'


// const connection = await mysql.createConnection({
//     host: process.env.DB_HOST,
//     port: process.env.DB_PORT,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME
// })

// connection
//     .connect()
//     .then(() => console.log(`Connexion établie avec MySQL`))
//     .catch(err => console.log(err));


// export default connection
import * as mysql from 'mysql2/promise';

const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),  // must be a number
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,  // empty password is fine
    database: process.env.DB_NAME
});

console.log('Connexion établie avec MySQL');

export default connection;
