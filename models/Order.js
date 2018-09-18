const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderScheme = new Schema({
    lineId: {type: mongoose.Schema.Types.ObjectId, ref: 'Line'},    
    total: Number
});

module.exports = mongoose.model('Order', OrderScheme);