const Conversation = require("../models/conversation.model");

exports.createConversation = async (req, res, next) => {
    const conversation = new Conversation({
        members: [req.body.senderId, req.body.receiverId,]
    })
    const savedConversation = await conversation.save()
    if (savedConversation) {
        return res.send(savedConversation)
    } else {
        return res.send('unable to create conversation')
    }

};

exports.userConversation = async (req, res, next) => {
    const conversation = await Conversation.find({
        members: { $in: [req.params.userId] }
    })
    if (conversation) {
        return res.send(conversation)
    } else {
        return res.send('no conversation found')
    }

};

exports.getConversationByIds = async (req, res, next) => {
    const conversation = await Conversation.findOne({
        members: { $all: [req.params.firstUserId, req.params.secondUserId] }
    })
    if (conversation) {
        return res.send(conversation)
    } else {
        return res.send('no conversation found')
    }

};


