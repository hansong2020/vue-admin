import request from '@/utils/request'

export function firmwareSearchApi(data) {
  return request({
    url: '/firmware/search',
    method: 'post',
    data
  })
}

export function firmwareInfoApi(id) {
  return request({
    url: '/firmware/detail',
    method: 'get',
    params: { id }
  })
}

export function firmwareCreateApi(data) {
  return request({
    url: '/firmware/create',
    method: 'post',
    data
  })
}

export function firmwareUpdateApi(data) {
  return request({
    url: '/firmware/update',
    method: 'post',
    data
  })
}

export function firmwareDeleteApi(id) {
  return request({
    url: '/firmware/delete',
    method: 'get',
    params: { id }
  })
}


