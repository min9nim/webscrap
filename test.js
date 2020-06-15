const fetch = require('node-fetch')

// const url = 'https://news.v.daum.net/v/20190910074818849'
const url = 'https://anyone.now.sh'

fetch('http://localhost:3030/webscrap', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    url,
  }),
})
  .then((res) => res.json())
  .then(console.log)
