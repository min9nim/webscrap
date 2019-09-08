//const fetch = require('isomorphic-unfetch');
const rp = require('request-promise');
const cheerio = require("cheerio");
const { Iconv } = require("iconv");
const jschardet = require('jschardet');
const { _bodyScrap } = require("./com");


function anyToUtf8(str) {
  let { encoding } = jschardet.detect(str)
  // encoding = encoding.toLowerCase() === "euc-kr" ? "euc-kr" : "utf-8";    // 18/11/19 원본글 인코딩 탐지 결과 보정 작업
  // console.log("encoding = " + encoding);
  // console.log("encoding(before) = " + encoding);
  if(encoding.toLowerCase() === "iso-8859-2"){
    /**
     * 18.11.22 유튜브 인코딩 보정
     */
    encoding = "UTF-8"
  }
  // console.log("encoding(after) = " + encoding);

  const iconv = new Iconv(encoding, 'utf-8//translit//ignore');
  const buf = new Buffer(str, 'binary');
  return iconv.convert(buf).toString();
}

const webscrap = url => rp({
  url,
  encoding: null,
  resolveWithFullResponse: true,
  headers: {
    //'User-Agent': "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36"
    'User-Agent': "Nodejs request-promise"
  },
})
  .catch(function (err) {
    //console.log("err.statusCode = " + err.statusCode)
    throw Error("request-promise 오류 발생")
  })
  .then(res => res.body)
  .then(anyToUtf8)
  .then(cheerio.load)
  .then(_bodyScrap(url))
  .then(res => Object.assign(res, { url }))

module.exports = webscrap;