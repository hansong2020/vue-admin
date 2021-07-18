import request from '@/utils/request'

export function deviceSearchApi(data) {
  return request({
    url: '/device/search',
    method: 'post',
    data
  })
}
export function deviceSubApi(data) {
  return request({
    url: '/device/gw/sub/dev',
    method: 'post',
    data
  })
}
export function deviceGwMapApi(data) {
  return request({
    url: '/device/map',
    method: 'post',
    data
  })
}

export function deviceBatchChgApi(data) {
  return request({
    url: '/device/status/change',
    method: 'post',
    data
  })
}

export function deviceBatchAddApi(data) {
  return request({
    url: '/device/batchadd',
    method: 'post',
    data
  })
}

export function deviceRuntimeApi(productCode, type, deviceCode) {
  return request({
    url: '/device/runtime',
    method: 'get',
    params: { productCode, type, deviceCode }
  })
}

export function deviceRtListApi(data) {
  return request({
    url: '/device/runtime/item',
    method: 'post',
    data
  })
}

export function deviceSetListApi(data) {
  return request({
    url: '/device/set/item',
    method: 'post',
    data
  })
}

export function deviceInfoApi(deviceCode) {
  return request({
    url: '/device/info',
    method: 'get',
    params: { deviceCode }
  })
}

export function deviceCreateApi(data) {
  return request({
    url: '/device/create',
    method: 'post',
    data
  })
}

export function deviceUpdateApi(data) {
  return request({
    url: '/device/update',
    method: 'post',
    data
  })
}

export function deviceImportApi(data) {
  return request({
    url: '/device/import/file',
    method: 'post',
    data
  })
}

export function serviceInvokeApi(data) {
  return request({
    url: '/device/service/invoke',
    method: 'post',
    data
  })
}

export function serviceInvokeReplyApi(data) {
  return request({
    url: '/device/service/invokereply',
    method: 'post',
    data
  })
}
export function propertySetApi(data) {
  return request({
    url: '/device/property/set',
    method: 'post',
    data
  })
}

export function propertyGetApi(data) {
  return request({
    url: '/device/property/get',
    method: 'post',
    timeout: 20000,
    data
  })
}
