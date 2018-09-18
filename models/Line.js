const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LineScheme = new Schema({
    productId: {type: mongoose.Schema.Types.ObjectId, ref: 'Product'},
    quantity: Number,
    price: Number
});

module.exports = mongoose.model('Line', LineScheme);