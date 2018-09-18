const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductScheme = new Schema({
  name: String,
  price: Number,
  lineIds: [{type: mongoose.Schema.Types.ObjectId, ref: 'Line'}],
  shopId: {type: mongoose.Schema.Types.ObjectId, ref: 'Shop'},
  metadata: [String]
});

module.exports = mongoose.model('Product', ProductScheme);