const http = require('http')
const express = require('express')
const axios = require('axios')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
mongoose.set('strictQuery', false)
app.use(cors())
app.use(express.json())
require('dotenv').config();
const orderController = require('./Controllers/OrderController')

app.post('/api/AAPL/order', orderController.createOrder);
app.get('/api/AAPL/stock', orderController.getStock);

const PORT = 8080

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB...', err))

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})



module.exports = app
