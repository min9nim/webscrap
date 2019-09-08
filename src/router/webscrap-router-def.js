const webscrap = require("../com/webcrawler");
const {sendErr} = require("../com/com")

const post = {};
const get = {};
const put = {};
const del = {};


post['/'] = async (req, res) => {
  console.log("req.body.url = " + req.body.url);
  try {
    let result = await webscrap(req.body.url);
    res.jsonp(result);
  } catch (e) {
    sendErr(res)(e)
    // res.jsonp({
    //     title: "Failed to get title of this URL"
    // });
  }
}


module.exports = { post, get, put, del }