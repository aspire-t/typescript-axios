/**
 * 这是一个辅助函数，用来判断参数类型
 */
const toString = Object.prototype.toString

// 判断是否是日期类型 类型谓词：val is Date是一种类型保护
export function isDate(val: any): val is Date {
  return toString.call(val) === '[object Date]'
}

// // 判断是否是object类型
// export function isObject(val: any): val is Object {
//   return val !== null && typeof val === 'object'
// }

// 判断是不是一个object类型
export function isPlainObject(val: any): val is Object {
  return toString.call(val) === '[object Object]'
}

export function isFormData(val: any): val is FormData {
  return typeof val !== 'undefined' && val instanceof FormData
}

export function isURLSearchParams(val: any): val is URLSearchParams {
  return typeof val !== 'undefined' && val instanceof URLSearchParams
}

export function extend<T, U>(to: T, from: U): T & U {
  for (const key in from) {
    // to[key] = from[key]
    ;(to as T & U)[key] = from[key] as any
  }
  return to as T & U
}

// 递归合并objs里的值
export function deepMerge(...objs: any[]): any {
  const result = Object.create(null)

  objs.forEach(obj => {
    if (obj) {
      Object.keys(obj).forEach(key => {
        const val = obj[key]
        if (isPlainObject(val)) {
          if (isPlainObject(result[key])) {
            result[key] = deepMerge(result[key], val)
          } else {
            result[key] = deepMerge(val)
          }
        } else {
          result[key] = val
        }
      })
    }
  })

  return result
}
