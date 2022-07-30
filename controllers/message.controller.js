const Message = require("../models/message.model");



exports.createMessage = async (req, res, next) => {
    const message = new Message(req.body)
    const savedMessage = await message.save()
    if (savedMessage) {
        return res.send(savedMessage)
    } else {
        return res.send('unable to create message')
    }

};

exports.getMessage = async (req, res, next) => {
    const messages = await Message.find({
        conversationId: req.params.conversationId,
    })
    if (messages) {
        return res.send(messages)
    } else {
        return res.send('no message found')
    }

};
