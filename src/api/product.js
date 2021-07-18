import request from '@/utils/request'

export function productListApi(data) {
  return request({
    url: '/product/search',
    method: 'post',
    data
  })
}

export function productQueryApi(data) {
  return request({
    url: '/product/query',
    method: 'post',
    data
  })
}
export function productSearchApi(data) {
  return request({
    url: '/product/search',
    method: 'post',
    data
  })
}
export function productCreateApi(data) {
  return request({
    url: '/product/create',
    method: 'post',
    data
  })
}

export function productUpdateApi(data) {
  return request({
    url: '/product/update',
    method: 'post',
    data
  })
}

export function protocolListApi(data) {
  return request({
    url: '/product/protocols',
    method: 'get',
    params: { }
  })
}

export function productDetailApi(code) {
  return request({
    url: '/product/detail',
    method: 'get',
    params: { code }
  })
}

export function productDelApi(id) {
  return request({
    url: '/product/del',
    method: 'get',
    params: { id }
  })
}
export function productPropsApi(code, type) {
  return request({
    url: '/product/prop/list',
    method: 'get',
    params: { code, type }
  })
}

export function propDelApi(id) {
  return request({
    url: '/product/prop/del',
    method: 'get',
    params: { id }
  })
}

export function propDetailApi(id) {
  return request({
    url: '/product/prop/detail',
    method: 'get',
    params: { id }
  })
}
export function propsCreateApi(data) {
  return request({
    url: '/product/prop/add',
    method: 'post',
    data
  })
}
export function propsEditApi(data) {
  return request({
    url: '/product/prop/edit',
    method: 'post',
    data
  })
}

export function propsReleaseApi(id) {
  return request({
    url: '/product/prop/release',
    method: 'get',
    params: { id }
  })
}
export function productTopicApi(productCode) {
  return request({
    url: '/product/topics',
    method: 'get',
    params: { productCode }
  })
}

export function productDataTypeApi() {
  return request({
    url: '/product/datatypes',
    method: 'get',
    params: { }
  })
}
export function productUnitsApi() {
  return request({
    url: '/product/units',
    method: 'get',
    params: { }
  })
}

export function propsTemplateApi(data) {
  return request({
    url: '/product/prop/template',
    method: 'post',
    data
  })
}
export function propDetailSepcApi(productCode, identifier, funcType) {
  return request({
    url: '/product/prop/detail/identifier',
    method: 'get',
    params: { productCode, identifier, funcType}
  })
}


