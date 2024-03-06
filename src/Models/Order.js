class Order {
    constructor(userId, price, type, quantity, lastTradedPrice) {
        if (!userId || !price || !type || !quantity || !lastTradedPrice) {
            throw new Error('Missing necessary arguments to create an Order.');
            }
        if (parseFloat(price.toFixed(2)) !== price) {
            throw new Error('Price must be up to two decimal places.');
            }
        if (type !== 'BID' && type !== 'OFFER') {
            throw new Error('Type must be either BID    or OFFER.');
        }
        if (!Number.isInteger(quantity)) {
            throw new Error('Quantity must be an integer.');
        }
        if (price < lastTradedPrice * 0.9 || price > lastTradedPrice * 1.1) {
            throw new Error('Price must be within 10% of the last traded price.');
        }
        this.quantity = quantity;
        this.userId = userId;
        this.price = price;
        this.type = type; // "BID" or "OFFER"
        this.lastTradedPrice = lastTradedPrice;
    }
  }

module.exports = Order;