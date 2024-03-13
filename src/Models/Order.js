const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ['BID', 'OFFER'],
    message: 'Type must be either BID or OFFER.'
  },
  quantity: {
    type: Number,
    required: true,
    //min: [1, 'Quantity must be a positive integer.'], had to remove because caused error when removing quantity from order
    validate: {
      validator: Number.isInteger,
      message: 'Quantity must be an integer.'
    }
  }
})

  orderSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })

module.exports = mongoose.model('Order', orderSchema);