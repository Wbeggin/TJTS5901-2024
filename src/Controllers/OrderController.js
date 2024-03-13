const { get } = require('mongoose');
const Order = require('../Models/Order');
const Trade = require('../Models/Trade');
const url = 'https://api.marketdata.app/v1/stocks/quotes/AAPL/'
let stock = {}
let last_fetch = 0
const axios = require('axios')
let lastTradedPrice = 0
let trades = 0

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
      return response.status(400).json({ error: 'Quantity must be an positive integer.' });      
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

      // Start the order matching process
      trades = 0
      await matchOrder(order)
      const tradesString = trades === 1 ? 'executed 1 trade' : `executed ${trades} trades`
      if (trades > 0) {
        return response.status(200).json({ message: 'Order created successfully.', order: savedOrder, trades: tradesString })
      }
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

exports.getTrades = async (request, response) => {
    try {
      const trades = await Trade.find({}).sort({ time: -1 })
      response.json(trades)
    } catch (error) {
      response.status(500).send({ error: error.message })
    }
}

const matchOrder = async (order) => {
    const { type, price, quantity } = order
    console.log(type, price, quantity)
    let matchingOrder
    if (type === 'BID') {
      matchingOrder = await Order.findOne({ type: 'OFFER', price: { $lte: price } }).sort({ price: 1 })
      console.log(matchingOrder)
    } else if (type === 'OFFER') {
      matchingOrder = await Order.findOne({ type: 'BID', price: { $gte: price } }).sort({ price: -1 })
      console.log(matchingOrder)
    }
    if (matchingOrder) {
      // Create a new trade
      const trade = new Trade({
        time: new Date(),
        price: Math.max(price, matchingOrder.price),
        quantity: Math.min(quantity, matchingOrder.quantity),
      })
      console.log(trade.price, trade.quantity, trade.time)
      await trade.save()
      trades++
      // Update the quantity of the matching order
      order.quantity -= trade.quantity;
      matchingOrder.quantity -= trade.quantity;
      await order.save()
      await matchingOrder.save()
      // Remove the orders if their quantity is zero
    if (order.quantity === 0) await Order.findByIdAndRemove(order.id)
    if (matchingOrder && matchingOrder.quantity === 0) await Order.findByIdAndRemove(matchingOrder.id)
    // Continue matching if there is still quantity left in the order
    if (order.quantity > 0) await matchOrder(order)
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