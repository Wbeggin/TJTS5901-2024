const http = require('http')
const express = require('express')
const axios = require('axios')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
app.use(cors())
app.use(express.json())
const orderController = require('./src/Controllers/OrderController')


app.post('/api/AAPL/offer', orderController.createOffer);
app.post('/api/AAPL/bid', orderController.createBid);
app.get('/api/AAPL/stock', orderController.getStock);

const PORT = 8080
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
