const { Given, When, Then } = require('@cucumber/cucumber')
const url = 'http://localhost:8080/api/'
const axios = require('axios')

Given('Fetch the current market last trade price for {string}', async function (symbol) {
    try {
        this.symbol = symbol
        stock = await axios.get(`${url + this.symbol}/stock`)
        this.currentPrice = stock.data.last[0]
      } catch (error) {
        throw new Error(error)
      }
});

When('Attempt to place a {string} order at Price M1 multiplied by {float}', async function (type, multiplier) {
  try { 
      const payload = {
          userId: 1,
          price: Math.round(this.currentPrice * multiplier * 100) / 100,
          type: type.toUpperCase(),
          quantity: 1000
      }
        this.order = await axios.post(`${url + this.symbol}/order`, payload)
      } catch (error) {
        this.order = error.response
      }
});

When('Attempt to place a {string} order at Price M2 by a quantity of {float}', async function (type, quantity) {
    try {
        const payload = {
            userId: 1,
            price: Math.round(this.currentPrice * 100) / 100,
            type: type.toUpperCase(),
            quantity: quantity
        }
        this.order = await axios.post(`${url + this.symbol}/order`, payload)
      } catch (error) {
        this.order = error.response
      }
});

Then('The order is accepted', function () {
    if (this.order.status != 200) {
      throw new Error(this.order.data.error)
    }
});

Then('The order is rejected', function () {
    if (this.order.status === 200) {
      throw new Error(this.order.data.message)
    }
});