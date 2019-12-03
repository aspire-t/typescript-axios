/**
 * 这是一个辅助函数，用来判断参数类型
 */
const toString = Object.prototype.toString

// 判断是否是日期类型 类型谓词：val is Date是一种类型保护
export function isDate(val: any): val is Date {
  return toString.call(val) === '[object Date]'
}

// 判断是否是object类型
export function isObject(val: any): val is Object {
  return val !== null && typeof val === 'object'
}
