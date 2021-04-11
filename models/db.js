const mongoose = require('mongoose');

const TodoSchema = mongoose.Schema({
    itemName: {
        type: String
    },
    itemCategory: {
        type: String
    },
    date: {
        type: String
    }
}, {collection: 'todo-items'}
);

const model = mongoose.model('TodoModel', TodoSchema);

module.exports = model;

