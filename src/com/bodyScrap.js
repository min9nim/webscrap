const { getHostname, getProtocol } = require('mingutils')

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

module.exports = _bodyScrap
