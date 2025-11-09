import axios from 'axios'

const API = axios.create({
    baseURL: 'https://fittrackbackend-h5oz.onrender.com/', // <-- updated
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
})

export default API
