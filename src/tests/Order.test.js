const { test, describe, expect } = require('@jest/globals');
const { createBid, createOffer} = require('../Controllers/OrderController');
const Order = require('../Models/Order');
const OrderController = require('../Controllers/OrderController');

const supertest = require('supertest')
const app = require('../index');
const api = supertest(app)

describe('POST /api/AAPL/order', () => {
  test('should create a new offer and return 200 status', async () => {
    const newOffer = {
      userId: 'user1',
      price: 170.00,
      type: 'OFFER',
      quantity: 1
    }
    await api.post('/api/AAPL/order').send(newOffer).expect(200).expect('Content-Type', /application\/json/)
  })


  test('should throw an error when price has more than two decimal places', async () => {
    const newOffer = {
      userId: 'user1',
      price: 170.123,
      type: 'BID',
      quantity: 1
    }
    await api.post('/api/AAPL/order').send(newOffer).expect(400).expect('Content-Type', /application\/json/)
  })

  test('should throw an error when not all properties are provided', async () => {
    const newOffer = {
      userId: 'user1',
      price: 170.00,
      type: 'OFFER'
    }
    await api.post('/api/AAPL/order').send(newOffer).expect(400).expect('Content-Type', /application\/json/)
  })

})

describe('Order', () => {
  test('should correctly instantiate with provided arguments for creating a bid', () => {
    const order = new Order({userId: 'user1', price: 150, type: 'BID', quantity: 10});
    expect(order.userId).toBe('user1');
    expect(order.price).toBe(150.00);
    expect(order.type).toBe('BID');
    expect(order.quantity).toBe(10);
  });
  
  test('should correctly instantiate with provided arguments for creating an offer', () => {
    const order = new Order({userId: 'user2', price: 200, type: 'OFFER', quantity: 5})
    expect(order.userId).toBe('user2')
    expect(order.price).toBe(200.00)
    expect(order.type).toBe('OFFER')
    expect(order.quantity).toBe(5)
  });

});
