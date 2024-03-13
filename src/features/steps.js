require('dotenv').config();
const { Given, When, Then } = require('@cucumber/cucumber')
const url = process.env.E2E_API
const axios = require('axios')

Given('Fetch the current market last trade price for {string}', async function (symbol) {
  try {
    this.symbol = symbol
    stock = await axios.get(`${url + this.symbol}/stock`)
    this.currentPrice = stock.data.last[0]
  } catch (error) {
    throw new Error(error)
  }
})

When('Order {string} price x {float}, qty: {float}', async function (type, multiplier, quantity) {
  try {
    this.orderPrice = Math.round(this.currentPrice * multiplier * 100) / 100
    const payload = {
      userId: 'user1',
      price: this.orderPrice,
      type: type.toUpperCase(),
      quantity: quantity
    }
    this.order = await axios.post(`${url + this.symbol}/order`, payload)
  } catch (error) {
    this.order = error.response
  }
})

Then('The order is accepted', function () {
  if (this.order.status != 200) {
    throw new Error(this.order.data.error)
  }
})

Then('The order is rejected', function () {
  if (this.order.status === 200) {
    throw new Error(this.order.data.message)
  }
})

Then('No trade was made', async function () {
  try {
    this.trades = await axios.get(`${url + this.symbol}/trades`)
    if (this.trades.data[0] && this.trades.data[0].price === this.orderPrice) {
      throw new Error('Trade was made')
    }
  } catch (error) {
    throw new Error(error)
  }
})

Then('Trades were made', async function () {
  try {
    this.trades = await axios.get(`${url + this.symbol}/trades`)
    if (!(this.trades.data[0] && this.trades.data[1] &&
      this.trades.data[0].quantity === 50 && this.trades.data[1].quantity === 200)) {
      throw new Error('No trades were made')
    }
  } catch (error) {
    throw new Error(error)
  }
})