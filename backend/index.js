import express from 'express'
import 'dotenv/config'
import login from './routes/user.route.js'
import register from './routes/user.route.js'


// 
const app = express()
app.use(express.json())

// app.use("/", login);  
app.use("/", register);  

const PORT = process.env.PORT || 5555

app.listen(PORT, () => {
    console.log(`Adresse serveur : http://localhost:${PORT}`);
})