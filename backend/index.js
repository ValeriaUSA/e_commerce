import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import connection from './config/db.config.js';
import login from './routes/user.route.js'
import register from './routes/user.route.js'
import productRouts from './routes/product.rout.js'
import cartRouts from './routes/cart.rout.js'
import adminRouts from './routes/admin.rout.js'
import orderRoutes from './routes/order.rout.js'


const app = express()
app.use(helmet());
app.use(express.json())

app.use(cors({
    origin: 'http://localhost:5173', // React app URL
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
    allowedHeaders: ['Content-Type', 'Accept', 'Authorization']
}))


app.use((req, res, next) => {
    console.log("[BACK] incoming request:", req.method, req.url);
    next();
});


// app.use("/", login);  
app.use("/", register);  
app.use("/", login);  


app.use ("/products", productRouts)
app.use("/admin", adminRouts)

//cart related routes
app.use ("/cart", cartRouts)

//checkout to order
app.use("/orders", orderRoutes);
const PORT = process.env.PORT || 5555

app.listen(PORT, () => {
    console.log(`Adresse serveur : http://localhost:${PORT}`);
})