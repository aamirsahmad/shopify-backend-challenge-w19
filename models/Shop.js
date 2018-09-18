const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ShopScheme = new Schema({
    name: String,
    products: [{type: mongoose.Schema.Types.ObjectId, ref: 'Product'}],
    orders: [{type: mongoose.Schema.Types.ObjectId, ref: 'Product'}]
});

module.exports = mongoose.model('Shop', ShopScheme);