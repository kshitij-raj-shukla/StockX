const mongoose = require('mongoose');

const IndexDataSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    value: { type: Number, required: true },
    change: { type: Number, required: true },
    lastUpdated: { type: Date, default: Date.now },
});

module.exports = mongoose.model('IndexData', IndexDataSchema);