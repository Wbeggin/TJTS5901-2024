const { get } = require('mongoose');
const Order = require('../Models/Order');
const url = 'https://api.marketdata.app/v1/stocks/quotes/AAPL/'
let stock = {}
let last_fetch = 0
const axios = require('axios')
let lastTradedPrice = 0

exports.createOrder = async (request, response) => {
    try {
      const { userId, price, type, quantity } = request.body
      await getStock()
    // Validate request body
    if (!userId || !price || !type || !quantity) {
      return response.status(400).json({ error: 'Missing necessary arguments to create an Order.' });
    }
    if (parseFloat(price.toFixed(2)) !== price) {
      return response.status(400).json({ error: 'Price must be up to two decimal places.' });
      }
    if (type !== 'BID' && type !== 'OFFER') {
      return response.status(400).json({ error: 'Type must be either BID or OFFER.' });
    }
    if (!Number.isInteger(quantity)) {
      return response.status(400).json({ error: 'Quantity must be an integer.' });      
    }
      // Validate that price is within +- 10% of the last traded price
      await getStock()
      console.log(lastTradedPrice)
      const isValidPrice = await validatePrice(price)
      if (!isValidPrice) {
        return response.status(400).json({ error: 'Price must be within 10% of the last traded price.' })
      }
      const order = new Order({userId, price, type, quantity})
      const savedOrder = await order.save()
      response.status(200).json({ message: 'Order created successfully.', order: savedOrder});
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
      lastTradedPrice = stock.last[0]
      console.log("lastTradedPrice: ", lastTradedPrice)
    } catch (error) {
      console.error(error)
    }
  }

const validatePrice = async (price) => {
  if (price < lastTradedPrice * 0.9 || price > lastTradedPrice * 1.1) {
    return false
  }
  return true
}