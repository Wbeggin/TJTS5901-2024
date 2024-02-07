const http = require('http')
const express = require('express')
const axios = require('axios')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
app.use(cors())
app.use(express.json())

const url = 'https://api.marketdata.app/v1/stocks/quotes/AAPL/'
let stock = {}
let last_fetch = 0

const getStock = async () => {
  const now = Date.now()
  if (now - last_fetch < 1000 * 60 * 60) {
    console.log("Using cached data")
    return
  }

  try {
    const response = await axios.get(url)
    stock = response.data
    last_fetch = now  
  } catch (error) {
    console.error(error)
  }
}

app.get('/api/', (request, response) => {
    response.json({ message: 'Hello World' })
  })

  app.get('/api/AAPL', async (request, response) => {
    try {
      await getStock()
      if (!(Object.keys(stock).length === 0)) {
        response.json(stock)
      } else {
        response.status(404).send('Stock not found')
      }
    } catch (error) {
      response.status(500).send('Error fetching stock')
    }
  })

const PORT = 8080
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
