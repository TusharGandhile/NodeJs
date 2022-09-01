const mongoose = require('mongoose');
const { buffer } = require('rxjs');

const imgSchema= mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    image:{
        data:buffer,
        contentType:String
    }
});

module.exports=mongoose.model('imgSchema', imgSchema);