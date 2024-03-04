const Order = require('../Models/Order');

describe('Order', () => {
  it('should correctly instantiate with provided arguments', () => {
    const order = new Order('user1', 150, 'BID', 10);
    expect(order.userId).toBe('user1');
    expect(order.price).toBe(150);
    expect(order.type).toBe('BID');
    expect(order.quantity).toBe(10);
  });

  it('should throw an error when instantiated without necessary arguments', () => {
    expect(() => new Order()).toThrow();
    expect(() => new Order('user1')).toThrow();
    expect(() => new Order('user1', 150)).toThrow();
  });

  it('should throw an error when price has more than two decimal places', () => {
    expect(() => new Order('user1', 150.123, 'BID', 10)).toThrow('Price must be up to two decimal places.');
  });

});