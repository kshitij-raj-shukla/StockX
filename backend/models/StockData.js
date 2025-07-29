const mongoose = require('mongoose');

const stockDataSchema = new mongoose.Schema({
    ticker: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    change: { type: Number, required: true },
    volume: { type: Number },
    high: { type: Number },
    low: { type: Number },
    lastUpdated: { type: Date, default: Date.now },
});

module.exports = mongoose.model('StockData', stockDataSchema);