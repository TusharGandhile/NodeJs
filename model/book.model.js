const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    bookName: { 
        type: String,
        required: true
    },
    price: {
        type: Number,   
        required: true
    },
    description:{
        type: String,
        required: true  
    },
    author:{
        type: String,
        required: true
    },
    photo:{
        type: Array
        
    }
    
},
{timestamps: true});

module.exports =mongoose.model('book',bookSchema);
