const { getHostname, getProtocol } = require('mingutils')

function sendErr(res) {
  return (err) => {
    res.status(200).send({
      status: 'Fail',
      message: err.toString(),
    })
  }
}

function _bodyScrap(url) {
  return function ($) {
    $l = global.$logger
    const protocol = getProtocol(url)
    const host = getHostname(url)
    // 글제목
    let title = $("meta[property='og:title']").attr('content')
    if (!title) {
      title = $('head title').text()
      if (!title) {
        throw Error('This link has no title')
      }
    }

    // 글이미지
    let image = $("meta[property='og:image']").attr('content')
    if (!image) {
      image = $('img').attr('src')
      //이미지 세팅
      if (image && image.indexOf('http') === 0) {
        // http 로 시작하면 그냥 사용
      } else if (image && image[0] === '/') {
        // image 경로가 / 로 시작한다면
        //let urlObj = new URL(url);
        image = protocol + host + image
      } else {
        image = ''
      }
    }

    // 파비콘
    let favicon = ''
    let faviconPath = $('link[rel="shortcut icon"]').attr('href')
    if (!faviconPath) {
      faviconPath = $('link[rel="mask-icon"]').attr('href')
    }
    if (!faviconPath) {
      faviconPath = $('link[rel="icon"]').attr('href')
    }
    if (faviconPath) {
      if (faviconPath.startsWith('http')) {
        favicon = faviconPath
      } else {
        favicon = faviconPath.startsWith('//')
          ? protocol + faviconPath.slice(2)
          : protocol + host + '/' + faviconPath
      }
    }

    // 글요약본
    let desc = $("meta[property='og:description']").attr('content')
    if (!desc) {
      desc = ''
    }

    $l.verbose({
      title,
      image,
      desc,
      favicon,
    })

    return {
      title,
      image,
      desc,
      favicon,
    }
  }
}
//_bodyScrap = $ => _bodyScrap($, getProtocol, getHostname);

const timelog = (function () {
  let time = []
  let o = {
    start: function () {
      time = [Date.now()]
      console.log(
        '[timelog] start: ' + new Date(time[0]).toString().substr(0, 24),
      )
    },
    check: function () {
      time.push(Date.now())
      let diff = time[time.length - 1] - time[time.length - 2]
      console.log('[timelog] + ' + diff + 'ms')
    },
  }
  return o
})()

const myRedis = (function () {
  let cache = {}

  let o = {
    get: function (key) {
      return cache[key]
    },
    set: function (key, val) {
      return (cache[key] = val)
    },
    clear: function () {
      console.log('@@ redis cache 초기화')
      cache = {}
    },
  }
  return o
})()

function redisWrapper(fn) {
  return async function (cond, idx, cnt) {
    timelog.start()
    let key = JSON.stringify({ cond, idx, cnt })
    let cache = myRedis.get(key)
    if (cache) {
      timelog.check()
      console.log('return cache [key] = ' + key)
      return cache
    } else {
      let res = await fn(cond, idx, cnt)
      myRedis.set(key, res)
      timelog.check()
      console.log('cache added [key] = ' + key)
      return res
    }
  }
}

/**
 * myRedis 초기화 작업
 */
// function clearRedis(req, res, next) {
//     console.log("@@ CUD 처리시 redis 초기화")
//     myRedis.clear();
//     next();
// }

// function clearRedisWhenCUD(router) {
//     router.post("/*", clearRedis);
//     router.put("/*", clearRedis);
//     router.delete("/*", clearRedis);
// }

function clearRedisWhenCUD(req, res, next) {
  if (req.method !== 'GET') {
    myRedis.clear()
  }
  next()
}

function isExpired(exp) {
  let month = 1000 * 60 * 60 * 24 * 30
  return Date.now() > exp + month // 만료시간을 임의로 한달 연장
}

module.exports = {
  getHostname,
  getProtocol,
  _bodyScrap,
  sendErr,
  timelog,
  myRedis,
  redisWrapper,
  clearRedisWhenCUD,
  isExpired,
}
