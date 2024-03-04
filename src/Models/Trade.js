class Trade {
    constructor(time, price, quantity) {
    if (!time || !price || !quantity) {
        throw new Error('Missing required parameters');
        }
    if (!Number.isInteger(quantity)) {
        throw new Error('Quantity must be an integer.');
    }
    if (parseFloat(price.toFixed(2)) !== price) {
        throw new Error('Price must be up to two decimal places.');
        }
      this.time = time;
      this.price = price;
      this.quantity = quantity;
    }
  }
  
  module.exports = Trade;