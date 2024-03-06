const Order = require('../Models/Order');
const url = 'https://api.marketdata.app/v1/stocks/quotes/AAPL/'
let stock = {}
let last_fetch = 0
const axios = require('axios')


exports.createOffer = async (request, response) => {
    try {
      const { userId, price, type, quantity, lastTradedPrice } = request.body
      const order = new Order(userId, price, type, quantity, lastTradedPrice)
      response.status(200).json({ message: 'Offer created successfully.' });
    } catch (error) {
      response.status(400).json({ error: error.message })
    }
  }
  
exports.createBid = async (request, response) => {
try {
    const { userId, price, type, quantity, lastTradedPrice } = request.body
    const order = new Order(userId, price, type, quantity, lastTradedPrice)
    response.status(200).json({ message: 'Bid created successfully.' });
} catch (error) {
    response.status(400).json({ error: error.message })
}
}

exports.getStock = async (request, response) => {
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
}

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