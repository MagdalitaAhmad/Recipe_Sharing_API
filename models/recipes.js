const mongoose = require('mongoose');

const recipeSchema = mongoose.Schema({
    recipeName: {
        type: String,
        required: true
    },
    ingredients: [{
        type: String,
        required: true
    }],
    instructions: [{
        type: String,
        required: true
    }]
});


module.exports = mongoose.model('Recipe', recipeSchema);
