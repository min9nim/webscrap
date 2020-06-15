const { getHostname, getProtocol } = require('mingutils')

module.exports = (url) => {
  return function ($) {
    $l = global.$logger
    const protocol = getProtocol(url)
    const host = getHostname(url)
    $logger.debug('host', host)
    // 글제목
    let title = $("meta[property='og:title']").attr('content')
    if (!title) {
      title = $('head title').text()
      if (!title) {
        throw Error('This link has no title')
      }
    }

    // 글이미지
    $logger.debug('[scrap image]')
    let image =
      $("meta[property='og:image']").attr('content') || $('img').attr('src')
    $logger.debug('[scraped]', image)
    if (image) {
      $logger.debug('[image processing]')
      //이미지 세팅
      if (image && image.indexOf('http') === 0) {
        // http 로 시작하면 그냥 사용
      } else if (image && image[0] === '/') {
        // image 경로가 / 로 시작한다면
        //let urlObj = new URL(url);
        image = protocol + host + image
      } else if (image.startsWith('data:')) {
        // base64 문자열이라면 그대로 사용
      } else {
        image = '[error] unknown image'
      }
    }
    $logger.debug('[processed image]', image)
    // 파비콘
    let favicon = ''
    let faviconPath = $('link[rel="shortcut icon"]').attr('href')
    $logger.verbose('faviconPath', faviconPath)
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
          : protocol +
            host +
            (faviconPath.startsWith('/') ? '' : '/') +
            faviconPath
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
