import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from './types'
import { rejects } from 'assert'

export default function xhr(config: AxiosRequestConfig): AxiosPromise {
  const { data = null, url, method = 'get', headers, responseType } = config
  const request = new XMLHttpRequest()

  return new Promise((resolve, rejects) => {
    if (responseType) {
      request.responseType = responseType
    }

    request.open(method.toUpperCase(), url, true)
    request.onreadystatechange = function handleLoad() {
      // 4表示正确接受到了
      if (request.readyState !== 4) {
        return
      }

      const responseHeaders = request.getAllResponseHeaders()
      const responseData = responseType !== 'text' ? request.response : request.responseText
      const response: AxiosResponse = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config,
        request
      }
      resolve(response)
    }
    Object.keys(headers).forEach(name => {
      // 如果data是null，那这个headers是没有意义的
      if (data === null && name.toLowerCase() === 'content-type') {
        delete headers[name]
      } else {
        request.setRequestHeader(name, headers[name])
      }
    })

    request.send(data)
  })
}
