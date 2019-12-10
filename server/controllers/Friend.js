models = require('../models');

const Friend = models.Friend;

const friendPage = (req,res) =>{
    Friend.FriendModel.findByOwner(req.session.account._id, (err, docs) =>{
        if(err){
            console.log(err);
            return res.status(400).json({error: 'There seems to be an error!'});
        }
        return res.render('account', {csrf:req.csrfToken(), domos: docs});
    });
}

const addFriend = (req, res) =>{
    if(!req.body.name){
        return res.status(400).json({error: "Name isn't included!"});//just in case no name gets passed through
    }

    const friendData = {
        name: req.body.name,
        owner:req.session.account._id,
    };

    const newFriend = new Friend.FriendModel(friendData);
    const friendPromise = newFriend.save();

    friendPromise.then(() => res.json({redirect: '/chat'}));

    friendPromise.catch((err) =>{
        console.log(err);
        if(err.code === 11000){
            return res.status(400).json({error: "You're already friends"})
        }
        return res.status(400).json({error: 'An error occured'});
    });

    return friendPromise;
};

getFriends = (request, response) =>{
    const req = request;
    const res = response;

    return Friend.FriendModel.findByOwner(req.session.account._id, (err, docs) =>{
        if(err){
            console.log(err);
            return res.status(400).json({error: 'an error has occured'})
        }
        return res.json({friends: docs});
    });
};

module.exports.friendPage = friendPage;
module.exports.getFriends = getFriends;
module.exports.add = addFriend;