const Crawler = require('crawler')
const { bodyScrap } = require('./bodyScrap')

const c = new Crawler({
  maxConnections: 10,
  forceUTF8: true,
})

function queue(url) {
  const $l = global.$logger
  $l.verbose('original url: ' + url)
  const uri = encodeURI(url)
  $l.verbose('encodeURI(url): ' + uri)
  return new Promise(function (resolve, reject) {
    c.queue({
      uri,
      //userAgent: "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36",
      userAgent: 'Nodejs request-promise',
      /**
       * 아래와 같이 userAgent 를 설정하면 매일경제쪽 긁어올 때 title 을 가져오지 못함
       */
      //userAgent: "Nodejs webcrawler",
      callback: (err, res, done) => resolve({ err, res, done }),
    })
  })
}

const webscrap = (url) =>
  queue(url).then(({ err, res, done }) => {
    // console.log("res.url = " + res.url)
    // console.log({res})
    //console.log("res.statusCode = " + res.statusCode)
    //console.log("res.statusCode = " + res.body);
    //console.log(JSON.stringify(res, null, 2))

    if (err) {
      //console.log(error);
      throw err
    } else {
      return Object.assign(bodyScrap(url)(res.$), { url })
    }
  })

module.exports = webscrap
