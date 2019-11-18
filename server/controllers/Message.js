  
const models = require('../models');

const Message = models.Message;

const saveMessage = (request, response) =>{
    const req = request;
    const res = response;

    const messageData = {message: req.body.message};
    const newMessage = new Message.MessageModel(messageData);
    const messagePromise = newMessage.save();

    messagePromise.then(() =>{console.log('saved')});
    messagePromise.catch((err) =>{
        console.log(err);
        return res.status(400).json({error: 'An error occured'});
    })
    if(!req.body.message){
        return res.status(400).json({error: 'No message'});
    }
    return messagePromise;
}


const loadMessages = (request, response) =>{
    const req = request;
    const res = response;

    return Message.MessageModel.returnAll(req.sessions.account._id, (err,docs)=>{
        if(err){
            console.log(err);
            return res.status(400).json({error: 'An error ocurred'});

        }
        return res.json({messages:docs});
    })
}

module.exports.saveMessage = saveMessage;
module.exports.loadMessages = loadMessages;