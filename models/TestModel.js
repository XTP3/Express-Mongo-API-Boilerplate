const mongoose = require('mongoose');

const testSchema = new mongoose.Schema({
    uniqueID: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: false,
        default: 'Test'
    }
});

module.exports = mongoose.model('TestModel', testSchema);