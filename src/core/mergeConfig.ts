import { AxiosRequestConfig } from '../types'
import { isPlainObject, deepMerge } from './../helpers/util'
import e from 'express'

const strategies = Object.create(null)
// 默认合并策略
function defaultStrategy(val1: any, val2: any): any {
  return typeof val2 !== 'undefined' ? val2 : val1
}

function fromVal2Strategy(val1: any, val2: any): any {
  if (typeof val2 !== 'undefined') {
    return val2
  }
}

function deepMergeStrategy(val1: any, val2: any): any {
  if (isPlainObject(val2)) {
    return deepMerge(val1, val2)
  } else if (typeof val2 !== 'undefined') {
    // val2 不是obj，且val2存在
    return val2
  } else if (isPlainObject(val1)) {
    return deepMerge(val1)
  } else if (typeof val1 !== 'undefined') {
    // val1 不是obj，且val1存在
    return val1
  }
}

const strategyKeysFromVal2 = ['url', 'params', 'data']

strategyKeysFromVal2.forEach(key => {
  strategies[key] = fromVal2Strategy
})

const strategyKeysDeepMerge = ['headers']

strategyKeysDeepMerge.forEach(key => {
  strategies[key] = deepMergeStrategy
})

export default function mergeConfig(
  config1: AxiosRequestConfig,
  config2?: AxiosRequestConfig
): AxiosRequestConfig {
  if (!config2) {
    return (config2 = {})
  }

  const config = Object.create(null)

  for (const key in config2) {
    mergeField(key)
  }

  for (const key in config1) {
    if (!config2[key]) {
      mergeField(key)
    }
  }
  // 这是策略模式的一种应用
  function mergeField(key: any): void {
    const strategy = strategies[key] || defaultStrategy
    config[key] = strategy(config1[key], config2![key])
  }

  return config
}
