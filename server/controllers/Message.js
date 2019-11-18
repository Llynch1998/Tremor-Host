  
const models = require('../models');

const Message = models.Message;

const saveMessage = (request, response) =>{
    const req = request;
    const res = response;

    const messageData = {message: req.body.message};
    const newMessage = new Message.MessageModel(messageData);
    messagePromise = newMessage.save();

    messagePromise.then(() =>{console.log('saved')});
    messagePromise.catch((err) =>{
        console.log(err);
        return res.status(400).json({error: 'An error occured'});
    })
    if(!message){
        return res.status(400).json({error: 'No message'});
    }
    return messagePromise;
}
