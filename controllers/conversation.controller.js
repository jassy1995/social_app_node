const Conversation = require("../models/conversation.model");
const winston = require("../loggers")

exports.createConversation = async (req, res, next) => {
    const conversationExist = await Conversation.findOne({
        members: { $all: [req.body.senderId, req.body.receiverId] }
    });

   console.log(conversationExist)
    winston.info(conversationExist.members);
    winston.info(conversationExist);
    if (!conversationExist.members) {
        const conversation = new Conversation({
            members: [req.body.senderId, req.body.receiverId,]
        })
        const savedConversation = await conversation.save()
        if (savedConversation) {
            return res.send(savedConversation)
        } else {
            return res.send('unable to create conversation')
        }
    }else{
        return res.send('conversation already created')
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


