const Trade = require('../Models/Trade');

describe('Trade', () => {
    test('should correctly initialize a trade', () => {
    const trade = new Trade(new Date(), 150.00, 10);
    expect(trade.time).toBeInstanceOf(Date);
    expect(trade.price).toBe(150.00);
    expect(trade.quantity).toBe(10);
    });

    test('should throw an error when initialized without necessary arguments', () => {
        expect(() => new Trade()).toThrow();
        expect(() => new Trade(new Date())).toThrow();
    });
});