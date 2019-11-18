const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
//const _ = require('underscore');


//let messageModel = {};

//const convertId = mongoose.Types.ObjectId;

const MessageSchema = new mongoose.Schema({
    message: String,
    createdData:{
        type: Date,
        default: Date.now,
    }
});

//let chatLog = mongoose.model('Message', MessageSchema);



MessageSchema.statics.toAPI = (doc) =>({
    message: doc.message,
    
});

MessageModel = mongoose.model('Message', MessageSchema);

module.exports.MessageModel = MessageModel;
module.exports.MessageSchema = MessageSchema;