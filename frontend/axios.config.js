import axios from "axios";


const api = axios.create({
    baseURL: 'http://localhost:3000'
})

// api.interceptors.request.use((req) => {
//     if(req.url.includes('personnes')) {
//         const username = localStorage.getItem('username')
//         const password = localStorage.getItem('password')
//         const token = btoa(`${username}:${password}`)
//         req.headers['Authorization'] = `Basic ${token}`
//     }
//     return req
// })


export default api