const mongoose = require('mongoose')

const TradeSchema = new mongoose.Schema({
  time: {
    type: Date,
    required: true,
  },
  price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    validate: {
      validator: function(v) {
        return Number.isInteger(v);
      },
      message: 'Quantity must be an integer.'
    }
  }
})

const Trade = mongoose.model('Trade', TradeSchema);

module.exports = Trade;