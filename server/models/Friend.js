const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
// const _ = require('underscore');
const _ = require('underscore');


let FriendModel = {};

const convertId = mongoose.Types.ObjectId;
const setName = (name) => _.escape(name).trim();

// const convertId = mongoose.Types.ObjectId;

const FriendSchema = new mongoose.Schema({
  name: String,
  createdData: {
    type: Date,
    default: Date.now,
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  }
});




FriendSchema.statics.toAPI = (doc) => ({
  name: doc.name,
});

FriendSchema.statics.findByOwner = (ownerId, callback) =>{
    const search = {
        owner: convertId(ownerId),
    };
    return FriendModel.find(search).select('name').exec(callback);
};

FriendSchema.statics.returnAll = (callback) => {
  this.FriendModel.find().select('name').exec(callback);
};

FriendModel = mongoose.model('Friend', FriendSchema);

module.exports.FriendModel = FriendModel;
module.exports.FriendSchema = FriendSchema;
