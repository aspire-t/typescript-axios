import { AxiosInstance } from './types/index'
import Axios from './core/Axios'
import { extend } from './helpers/util'

// 自己的理解，这个地方，就是为了姜axios和axios.request 暴露出去
function createInstance(): AxiosInstance {
  const context = new Axios()
  const instance = Axios.prototype.request.bind(context)
  extend(instance, context)
  return instance as AxiosInstance
}

const axios = createInstance()
export default axios
