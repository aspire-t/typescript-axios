import { isDate, isPlainObject, isURLSearchParams } from './util'

interface URLOrigin {
  protocol: string
  host: string
}

function encode(val: string): string {
  return (
    encodeURIComponent(val) // encodeURIComponent() 函数可把字符串作为 URI 组件进行编码。
      // 对一些特殊字符的处理，有些字符，我们不希望转译，其会继续保留在url字符串中
      .replace(/%40/g, '@')
      .replace(/%3A/gi, ':')
      .replace(/%24/g, '$')
      .replace(/%2C/gi, ',')
      .replace(/%20/g, '+')
      .replace(/%5B/gi, '[')
      .replace(/%5D/gi, ']')
  )
}

export function buildURL(
  url: string,
  params?: any,
  paramsSerializer?: (params: any) => string
): string {
  if (!params) {
    return url
  }
  let serializedParams

  if (paramsSerializer) {
    serializedParams = paramsSerializer(params)
  } else if (isURLSearchParams(params)) {
    serializedParams = params.toString()
  } else {
    const parts: string[] = []

    Object.keys(params).forEach(key => {
      const val = params[key]
      if (val == null) {
        return // foreach中的return不会跳出循环，它会执行下一次循环。Tips:foreach没法跳出，一定会执行完整个循环
      }

      let values = []
      // 对数组的处理，如果不是数组，将其变成一个数组
      if (Array.isArray(val)) {
        values = val
        key += '[]'
      } else {
        values = [val]
      }
      // 所有的参数都转换成了数组，进行统一处理
      values.forEach(val => {
        if (isDate(val)) {
          // 日期类型的判断
          val = val.toISOString()
        } else if (isPlainObject(val)) {
          // Object类型的判断
          val = JSON.stringify(val)
        }
        parts.push(`${encode(key)}=${encode(val)}`)
      })
    })

    // 将键值对拼成＆连接的方式
    serializedParams = parts.join('&')
  }

  if (serializedParams) {
    // 去掉hash标识
    const markIndex = url.indexOf('#')
    if (markIndex !== -1) {
      url = url.slice(0, markIndex)
    }
    // 判断url传过来的时候是否带有?没有问号加?有问号用&拼接
    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams
  }
  return url
}

// 判断一个url地址是不是绝对路径
export function isAbsoluteURL(url: string): boolean {
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url)
}

export function combineURL(baseURL: string, relativeURL?: string): string {
  return relativeURL ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '') : baseURL
}

const urlParsingNode = document.createElement('a')
const currentOrigin = resolveURL(window.location.href)

function resolveURL(url: string): URLOrigin {
  // 利用a标签这个对象，解析出protocol, host
  // 这样就可以判断出 当前请求的url和当前页面的url是否是一样的，判断是否是同源请求
  urlParsingNode.setAttribute('href', url)
  const { protocol, host } = urlParsingNode

  return {
    protocol,
    host
  }
}

export function isURLSameOrigin(requestURL: string): boolean {
  const parsedOrigin = resolveURL(requestURL)
  // 这个就是满足同源策略
  return parsedOrigin.protocol === currentOrigin.host
}
