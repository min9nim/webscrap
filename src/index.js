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


// 서비스 포트
//console.log("process.env.PORT = " + process.env.PORT)
const PORT = process.env.PORT || 3030

// HTTP 서비스 시작
server.listen(PORT, function () {
  logger.info(`Server is running on port ${PORT}`)
})
