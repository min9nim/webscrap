const webscrap = require('../com/webcrawler')
const { sendErr } = require('../com/com')

const post = {}
const get = {}
const put = {}
const del = {}

const cache = {}

post['/'] = async (req, res) => {
  const $l = global.$logger
  $l.verbose('req.body.url = ' + req.body.url)
  try {
    $l.log({ cache })
    if (cache[req.body.url]) {
      $l.log('[hit]', req.body.url)
      res.jsonp(cache[req.body.url])
      return
    }
    $l.log('[no-hit]', req.body.url)
    let result = await webscrap(req.body.url)
    cache[req.body.url] = result
    res.jsonp(result)
  } catch (e) {
    sendErr(res)(e)
    // res.jsonp({
    //     title: "Failed to get title of this URL"
    // });
  }
}

module.exports = { post, get, put, del }
