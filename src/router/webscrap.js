const webscrap = require('../com/webcrawler')
const { sendErr } = require('../com/com')

const cache ={}

module.exports = async (req, res) => {
  const $l = global.$logger
  $l.verbose('req.body.url = ' + req.body.url)
  try {
    if (req.body.url.indexOf('http') !== 0) {
      throw Error('invaid url')
    }
    $l.log({ cache })
    if (cache[req.body.url]) {
      $l.log('[hit]', req.body.url)
      res.jsonp(cache[req.body.url])
      return
    }
    $l.log('[no-hit]', req.body.url)
    const result = await webscrap(req.body.url)
    cache[req.body.url] = result
    res.jsonp(result)
  } catch (e) {
    sendErr(res)(e)
    // res.jsonp({
    //     title: "Failed to get title of this URL"
    // });
  }
}
