const { createBid, createOffer} = require('../Controllers/OrderController');
const Order = require('../Models/Order');

describe('Order', () => {
  it('should correctly instantiate with provided arguments for creating a bid', () => {
    const order = new Order('user1', 150, 'BID', 10, 140);
    expect(order.userId).toBe('user1');
    expect(order.price).toBe(150.00);
    expect(order.type).toBe('BID');
    expect(order.quantity).toBe(10);
    expect(order.lastTradedPrice).toBe(140);
  });

  it('should correctly instantiate with provided arguments for creating an offer', () => {
    const order = new Order('user2', 200, 'OFFER', 5, 210);
    expect(order.userId).toBe('user2');
    expect(order.price).toBe(200.00);
    expect(order.type).toBe('OFFER');
    expect(order.quantity).toBe(5);
    expect(order.lastTradedPrice).toBe(210);
  });

  it('should throw an error when instantiated without necessary arguments', () => {
    expect(() => new Order()).toThrow();
    expect(() => new Order('user1')).toThrow();
    expect(() => new Order('user1', 150)).toThrow();
  });

  it('should throw an error when price has more than two decimal places', () => {
    expect(() => new Order('user1', 150.123, 'BID', 10, 150)).toThrow('Price must be up to two decimal places.');
  });

  it('createBid should create an order with a price of 150.12', () => {
    const order = new Order('user1', 150.12, 'BID', 10, 150)
    createBid({ body: order }, {
      status: (code) => {
        expect(code).toBe(200)
        return {
          json: (data) => {
            expect(data.message).toBe('Bid created successfully.')
          }
        }
      }
    })
  })

  it('createOffer should create an order with a price of 200.00', () => {
    const order = new Order('user2', 200.00, 'OFFER', 5, 200)
    createOffer({ body: order }, {
      status: (code) => {
        expect(code).toBe(200)
        return {
          json: (data) => {
            expect(data.message).toBe('Offer created successfully.')
          }
        }
      }
    })
  })

});

