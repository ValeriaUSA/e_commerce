import express from 'express'
import 'dotenv/config'
import login from './routes/user.route.js'
import register from './routes/user.route.js'
import productRouts from './routes/product.rout.js'
import cors from 'cors'


// 
const app = express()
app.use(express.json())

app.use(cors({
    origin: 'http://localhost:5174', // React app URL
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
    allowedHeaders: ['Content-Type', 'Accept', 'Authorization']
}))

// app.use("/", login);  
app.use("/", register);  

//product related routes
app.use ("/products", productRouts)

const PORT = process.env.PORT || 5555

app.listen(PORT, () => {
    console.log(`Adresse serveur : http://localhost:${PORT}`);
})