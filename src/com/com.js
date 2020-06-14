function sendErr(res) {
  return (err) => {
    res.status(200).send({
      status: 'Fail',
      message: err.toString(),
    })
  }
}

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
  _bodyScrap,
  sendErr,
  timelog,
  myRedis,
  redisWrapper,
  clearRedisWhenCUD,
  isExpired,
}
