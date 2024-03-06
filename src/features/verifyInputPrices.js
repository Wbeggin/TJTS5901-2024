const { Given, When, Then } = require('@cucumber/cucumber');
const url = 'http://localhost:8080/api/'
const axios = require('axios');

Given('Fetch the current market last trade price for {string}', async function (symbol) {
    try {
        this.symbol = symbol;
        stock = await axios.get(`${url + this.symbol}/stock`);
        this.currentPrice = stock.data.ask[0];
      } catch (error) {
        throw new Error(error);
      }
});

When('Attempt to place a Bid order at Price M1 multiplied by {float}', async function (multiplier) {
    const payload = {
        userId: 1,
        price: Math.round(this.currentPrice * multiplier * 100) / 100,
        type: "BID",
        quantity: 1000,
        lastTradedPrice: this.currentPrice
    };
    try {
        this.order = await axios.post(`${url + this.symbol}/bid`, payload);
      } catch (error) {
        this.order = error.response;
      }
});

Then('The order is accepted', function () {
    if (this.order.status != 200) {
      throw new Error(this.order.data.error);
    }
});

When('Attempt to place an Offer order at Price M1 multiplied by {float}', async function (multiplier) {
    const payload = {
        userId: 1,
        price: Math.round(this.currentPrice * multiplier * 100) / 100,
        type: "OFFER",
        quantity: 1000,
        lastTradedPrice: this.currentPrice
    };
    try {
        this.order = await axios.post(`${url + this.symbol}/offer`, payload);
      } catch (error) {
        this.order = error.response;
      }
  });

  Then('The order is rejected', function () {
    if (this.order.status === 200) {
      throw new Error(this.order.data.error);
    }
});