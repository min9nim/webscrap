const {
  default: createLogger,
  simpleFormat,
  consoleTransport,
} = require('if-logger')
const moment = require('moment')

moment.locale('ko')

function customTransport(level, message, formatMessage) {
  /*
   * level: 'debug'
   * message: 'some text'
   * formatMessage: '[debug] some text'
   */
  //api.pushLog(level + ' : ' + message)
}

module.exports = createLogger({
  level: 'all',
  format: simpleFormat,
  tags: [() => moment().utc().add(9, 'hours').format('MM/DD HH:mm:ss')],
  transports: [consoleTransport, customTransport],
})
