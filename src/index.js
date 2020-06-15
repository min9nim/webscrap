const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const webscrap = require('./router/webscrap')
const logger = require('./logger')

global.$logger = logger

// 익스프레스 앱생성
const server = express()

var corsOptions = {
  origin: function (origin, callback) {
    callback(null, true)
  },
}

server.use(cors(corsOptions))

// 미들웨어 등록
server.use(morgan('combined')) // 서버 access 로그
server.use(bodyParser.json())

// RESTful API 라우터 등록
server.post('/webscrap', webscrap)

// 예외처리
/**
 * 18.11.09
 * 위에서 예외가 발생해도 아래 오류처리 함수는 호출이 안된다??
 */
server.use('/', function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send({ status: 'Fail', message: err.message })
})

// 서비스 포트
//console.log("process.env.PORT = " + process.env.PORT)
const PORT = process.env.PORT || 3030

// HTTP 서비스 시작
server.listen(PORT, function () {
  logger.info(`Server is running on port ${PORT}`)
})
